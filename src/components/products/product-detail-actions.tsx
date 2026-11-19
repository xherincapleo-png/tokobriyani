"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product, SpicyLevel } from "@/types/database";
import { SPICY_LEVELS } from "@/lib/validations/schemas";
import { useCart } from "@/hooks/use-cart";
import { formatIDR } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [spicyLevel, setSpicyLevel] = React.useState<SpicyLevel>("Medium");
  const [notes, setNotes] = React.useState("");

  const isDrink = product.category?.slug === "drinks";
  const isOutOfStock =
    !product.is_available || (product.stock !== null && product.stock <= 0);
  const maxQty = product.stock !== null ? Math.min(50, product.stock) : 50;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem(product, {
      quantity,
      spicyLevel: isDrink ? undefined : spicyLevel,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Spicy Level Selector (for non-drink dishes) */}
      {!isDrink && (
        <div className="space-y-2.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium text-[#272923]">
            <Flame className="h-4 w-4 text-[#C96A35]" />
            Spice Level (Optional)
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SPICY_LEVELS.map((level) => {
              const selected = spicyLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpicyLevel(level)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    selected
                      ? "border-[#173F35] bg-[#173F35] text-[#FCFAF6]"
                      : "border-[#E8E3D8] bg-[#F7F1E5]/60 text-[#272923] hover:border-[#173F35]/40"
                  )}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Kitchen Notes */}
      <div className="space-y-2">
        <Label htmlFor="dish-notes">Additional Notes (Optional)</Label>
        <Textarea
          id="dish-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={200}
          placeholder="e.g., Less onion, extra mint raita on the side..."
          className="min-h-[76px]"
        />
      </div>

      {/* Quantity & CTA */}
      <div className="flex flex-col gap-4 border-t border-[#E8E3D8] pt-6 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between rounded-md border border-[#E8E3D8] bg-[#F7F1E5] p-1 sm:w-36">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded text-[#173F35] transition-colors hover:bg-[#FCFAF6] disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold text-[#272923]">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= maxQty || isOutOfStock}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded text-[#173F35] transition-colors hover:bg-[#FCFAF6] disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="flex-1"
        >
          <ShoppingBag className="h-4 w-4" />
          {isOutOfStock
            ? "Currently Unavailable"
            : `Add to Cart — ${formatIDR(product.price * quantity)}`}
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-[#7A7A70]">
        <span>Freshly prepared upon order confirmation.</span>
        <Link
          href="/cart"
          className="font-medium text-[#173F35] underline underline-offset-4 hover:text-[#285747]"
        >
          View Cart →
        </Link>
      </div>
    </div>
  );
}
