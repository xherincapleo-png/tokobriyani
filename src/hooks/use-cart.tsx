"use client";

import * as React from "react";
import { toast } from "sonner";
import type { CartItem, Product, SpicyLevel } from "@/types/database";

const CART_STORAGE_KEY = "toko-briyani-cart-v1";
const MAX_ITEM_QTY = 50;

interface AddToCartOptions {
  quantity?: number;
  spicyLevel?: SpicyLevel;
  notes?: string;
}

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, options?: AddToCartOptions) => boolean;
  updateQuantity: (key: string, quantity: number) => void;
  incrementItem: (key: string) => void;
  decrementItem: (key: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function makeCartKey(
  productId: string,
  spicyLevel?: SpicyLevel,
  notes?: string
): string {
  const normalizedNote = (notes ?? "").trim().toLowerCase();
  return `${productId}::${spicyLevel ?? "default"}::${normalizedNote}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const sanitized: CartItem[] = parsed.filter(
            (it) =>
              it &&
              typeof it.productId === "string" &&
              typeof it.quantity === "number" &&
              it.quantity >= 1 &&
              it.quantity <= MAX_ITEM_QTY &&
              typeof it.price === "number" &&
              it.price >= 0
          );
          setItems(sanitized);
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist to localStorage & synchronize across browser tabs
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota issues
    }
  }, [items, isHydrated]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      try {
        const next = event.newValue ? JSON.parse(event.newValue) : [];
        if (Array.isArray(next)) {
          setItems(next);
        }
      } catch {
        // Ignore parse error
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = React.useCallback(
    (product: Product, options: AddToCartOptions = {}): boolean => {
      if (!product.is_available || (product.stock !== null && product.stock <= 0)) {
        toast.error(`"${product.name}" is currently unavailable.`);
        return false;
      }

      const qtyToAdd = Math.max(
        1,
        Math.min(MAX_ITEM_QTY, Math.floor(options.quantity ?? 1))
      );
      const trimmedNotes = options.notes?.trim() || undefined;
      const key = makeCartKey(product.id, options.spicyLevel, trimmedNotes);

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.key === key);
        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const maxAllowed =
            product.stock !== null
              ? Math.min(MAX_ITEM_QTY, product.stock)
              : MAX_ITEM_QTY;
          const nextQty = Math.min(maxAllowed, existing.quantity + qtyToAdd);
          const updated = [...prev];
          updated[existingIndex] = {
            ...existing,
            price: product.price,
            quantity: nextQty,
          };
          return updated;
        }

        const newItem: CartItem = {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
          categoryName: product.category?.name ?? "Menu",
          quantity: qtyToAdd,
          spicyLevel: options.spicyLevel,
          notes: trimmedNotes,
        };
        return [...prev, newItem];
      });

      toast.success(`Added ${qtyToAdd} × ${product.name} to cart.`);
      return true;
    },
    []
  );

  const updateQuantity = React.useCallback((key: string, quantity: number) => {
    const safeQty = Math.floor(quantity);
    if (!Number.isFinite(safeQty)) return;
    if (safeQty <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    const clamped = Math.min(MAX_ITEM_QTY, safeQty);
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: clamped } : item))
    );
  }, []);

  const incrementItem = React.useCallback((key: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.min(MAX_ITEM_QTY, item.quantity + 1) }
          : item
      )
    );
  }, []);

  const decrementItem = React.useCallback((key: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = React.useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
    toast.info("Item removed from cart.");
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      isHydrated,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [
      items,
      isHydrated,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
