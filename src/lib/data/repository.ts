import crypto from "crypto";
import type {
  Category,
  DashboardAnalytics,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product,
  StoreSettings,
} from "@/types/database";
import type {
  CategoryFormValues,
  CreateOrderPayload,
  ProductFormValues,
  StoreSettingsFormValues,
} from "@/lib/validations/schemas";
import { ORDER_STATUSES } from "@/lib/validations/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import { getDemoStore } from "./demo-store";

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `TB-${yyyy}${mm}${dd}-${suffix}`;
}

function getDbClient(preferService = false) {
  if (!isSupabaseConfigured()) return null;
  if (preferService) {
    return createSupabaseServiceClient() ?? createSupabaseServerClient();
  }
  return createSupabaseServerClient();
}

// ============================================================================
// STORE SETTINGS
// ============================================================================
export async function getStoreSettings(): Promise<StoreSettings> {
  const db = getDbClient(false);
  if (db) {
    const { data, error } = await db
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        store_name: data.store_name ?? "Toko Briyani",
        logo_url: data.logo_url ?? null,
        whatsapp_number: data.whatsapp_number ?? null,
        address: data.address ?? null,
        opening_hours: Array.isArray(data.opening_hours) ? data.opening_hours : [],
        delivery_fee: Number(data.delivery_fee ?? 0),
        minimum_order: Number(data.minimum_order ?? 0),
        store_description: data.store_description ?? "",
        instagram_url: data.instagram_url ?? null,
        social_links: (data.social_links as StoreSettings["social_links"]) ?? {},
        updated_at: data.updated_at ?? new Date().toISOString(),
      };
    }
  }

  return getDemoStore().settings;
}

export async function updateStoreSettings(
  input: StoreSettingsFormValues
): Promise<StoreSettings> {
  const db = getDbClient(true);
  if (db) {
    const existing = await getStoreSettings();
    const payload = {
      singleton_key: true,
      store_name: input.store_name,
      logo_url: input.logo_url || null,
      whatsapp_number: input.whatsapp_number || null,
      address: input.address || null,
      opening_hours: input.opening_hours,
      delivery_fee: input.delivery_fee,
      minimum_order: input.minimum_order,
      store_description: input.store_description,
      instagram_url: input.instagram_url || null,
      social_links: input.social_links ?? {},
    };

    const { data, error } =
      existing.id && existing.id !== "store-settings-singleton"
        ? await db
            .from("store_settings")
            .update(payload)
            .eq("id", existing.id)
            .select("*")
            .single()
        : await db
            .from("store_settings")
            .upsert(payload, { onConflict: "singleton_key" })
            .select("*")
            .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update store settings");
    }

    return {
      ...data,
      delivery_fee: Number(data.delivery_fee ?? 0),
      minimum_order: Number(data.minimum_order ?? 0),
    };
  }

  const store = getDemoStore();
  store.settings = {
    ...store.settings,
    store_name: input.store_name,
    logo_url: input.logo_url || null,
    whatsapp_number: input.whatsapp_number || null,
    address: input.address || null,
    opening_hours: input.opening_hours,
    delivery_fee: input.delivery_fee,
    minimum_order: input.minimum_order,
    store_description: input.store_description,
    instagram_url: input.instagram_url || null,
    social_links: input.social_links ?? {},
    updated_at: new Date().toISOString(),
  };
  return store.settings;
}

// ============================================================================
// CATEGORIES
// ============================================================================
export async function getCategories(includeInactive = false): Promise<Category[]> {
  const db = getDbClient(includeInactive);
  if (db) {
    let query = db
      .from("categories")
      .select("*, products(count)")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((row) => {
        const countArr = row.products as Array<{ count: number }> | undefined;
        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          image_url: row.image_url,
          is_active: row.is_active,
          sort_order: row.sort_order,
          created_at: row.created_at,
          product_count: countArr?.[0]?.count ?? 0,
        };
      });
    }
  }

  const store = getDemoStore();
  return store.categories
    .filter((c) => (includeInactive ? true : c.is_active))
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .map((c) => ({
      ...c,
      product_count: store.products.filter((p) => p.category_id === c.id).length,
    }));
}

export async function createCategory(input: CategoryFormValues): Promise<Category> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("categories")
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url || null,
        is_active: input.is_active,
        sort_order: input.sort_order,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create category");
    }
    return { ...data, product_count: 0 };
  }

  const store = getDemoStore();
  if (store.categories.some((c) => c.slug === input.slug)) {
    throw new Error("A category with this slug already exists.");
  }
  const created: Category = {
    id: `cat-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.image_url || null,
    is_active: input.is_active,
    sort_order: input.sort_order,
    created_at: new Date().toISOString(),
    product_count: 0,
  };
  store.categories.push(created);
  return created;
}

export async function updateCategory(
  id: string,
  input: CategoryFormValues
): Promise<Category> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("categories")
      .update({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url || null,
        is_active: input.is_active,
        sort_order: input.sort_order,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update category");
    }
    return data;
  }

  const store = getDemoStore();
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Category not found.");
  if (store.categories.some((c) => c.slug === input.slug && c.id !== id)) {
    throw new Error("Another category already uses this slug.");
  }

  store.categories[idx] = {
    ...store.categories[idx],
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.image_url || null,
    is_active: input.is_active,
    sort_order: input.sort_order,
  };
  return store.categories[idx];
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getDbClient(true);
  if (db) {
    const { count, error: countError } = await db
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      throw new Error(countError.message);
    }

    if ((count ?? 0) > 0) {
      throw new Error(
        `Cannot delete this category because ${count} product(s) are still assigned to it. Reassign those products to another category first.`
      );
    }

    const { error } = await db.from("categories").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const store = getDemoStore();
  const assignedCount = store.products.filter((p) => p.category_id === id).length;
  if (assignedCount > 0) {
    throw new Error(
      `Cannot delete this category because ${assignedCount} product(s) are still assigned to it. Reassign those products to another category first.`
    );
  }
  store.categories = store.categories.filter((c) => c.id !== id);
}

// ============================================================================
// PRODUCTS
// ============================================================================
export interface GetProductsOptions {
  includeUnavailable?: boolean;
  featuredOnly?: boolean;
  categorySlug?: string;
  search?: string;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[]> {
  const { includeUnavailable = false, featuredOnly = false, categorySlug, search } =
    options;
  const db = getDbClient(includeUnavailable);

  if (db) {
    let query = db
      .from("products")
      .select("*, category:categories(*)")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: true });

    if (!includeUnavailable) {
      query = query.eq("is_available", true);
    }
    if (featuredOnly) {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;
    if (!error && data) {
      let mapped: Product[] = data.map((row) => ({
        id: row.id,
        category_id: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description ?? "",
        price: Number(row.price ?? 0),
        image_url: row.image_url ?? "",
        is_available: Boolean(row.is_available),
        is_featured: Boolean(row.is_featured),
        stock: row.stock !== null && row.stock !== undefined ? Number(row.stock) : null,
        created_at: row.created_at,
        updated_at: row.updated_at,
        category: row.category as Category | null,
      }));

      if (!includeUnavailable) {
        mapped = mapped.filter((p) => p.category?.is_active !== false);
      }
      if (categorySlug && categorySlug !== "all") {
        mapped = mapped.filter((p) => p.category?.slug === categorySlug);
      }
      if (search?.trim()) {
        const q = search.trim().toLowerCase();
        mapped = mapped.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.category?.name.toLowerCase().includes(q) ?? false)
        );
      }
      return mapped;
    }
  }

  const store = getDemoStore();
  let items = store.products.map((p) => ({
    ...p,
    category: store.categories.find((c) => c.id === p.category_id) ?? null,
  }));

  if (!includeUnavailable) {
    items = items.filter((p) => p.is_available && p.category?.is_active !== false);
  }
  if (featuredOnly) {
    items = items.filter((p) => p.is_featured);
  }
  if (categorySlug && categorySlug !== "all") {
    items = items.filter((p) => p.category?.slug === categorySlug);
  }
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category?.name.toLowerCase().includes(q) ?? false)
    );
  }

  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDbClient(false);
  if (db) {
    const { data, error } = await db
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        category_id: data.category_id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        price: Number(data.price ?? 0),
        image_url: data.image_url ?? "",
        is_available: Boolean(data.is_available),
        is_featured: Boolean(data.is_featured),
        stock: data.stock !== null && data.stock !== undefined ? Number(data.stock) : null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        category: data.category as Category | null,
      };
    }
  }

  const store = getDemoStore();
  const found = store.products.find((p) => p.slug === slug);
  if (!found) return null;
  return {
    ...found,
    category: store.categories.find((c) => c.id === found.category_id) ?? null,
  };
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts({ includeUnavailable: false });
  const others = all.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category_id === product.category_id);
  const differentCategory = others.filter((p) => p.category_id !== product.category_id);
  return [...sameCategory, ...differentCategory].slice(0, limit);
}

export async function createProduct(input: ProductFormValues): Promise<Product> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("products")
      .insert({
        category_id: input.category_id,
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price,
        image_url: input.image_url || "",
        is_available: input.is_available,
        is_featured: input.is_featured,
        stock: input.stock ?? null,
      })
      .select("*, category:categories(*)")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create product");
    }
    return {
      ...data,
      price: Number(data.price),
      category: data.category as Category | null,
    };
  }

  const store = getDemoStore();
  if (store.products.some((p) => p.slug === input.slug)) {
    throw new Error("A product with this slug already exists.");
  }
  const now = new Date().toISOString();
  const created: Product = {
    id: `prod-${crypto.randomUUID().slice(0, 8)}`,
    category_id: input.category_id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    image_url: input.image_url || "",
    is_available: input.is_available,
    is_featured: input.is_featured,
    stock: input.stock ?? null,
    created_at: now,
    updated_at: now,
    category: store.categories.find((c) => c.id === input.category_id) ?? null,
  };
  store.products.unshift(created);
  return created;
}

export async function updateProduct(
  id: string,
  input: ProductFormValues
): Promise<Product> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("products")
      .update({
        category_id: input.category_id,
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price,
        image_url: input.image_url || "",
        is_available: input.is_available,
        is_featured: input.is_featured,
        stock: input.stock ?? null,
      })
      .eq("id", id)
      .select("*, category:categories(*)")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update product");
    }
    return {
      ...data,
      price: Number(data.price),
      category: data.category as Category | null,
    };
  }

  const store = getDemoStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found.");
  if (store.products.some((p) => p.slug === input.slug && p.id !== id)) {
    throw new Error("Another product already uses this slug.");
  }

  store.products[idx] = {
    ...store.products[idx],
    category_id: input.category_id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    image_url: input.image_url || "",
    is_available: input.is_available,
    is_featured: input.is_featured,
    stock: input.stock ?? null,
    updated_at: new Date().toISOString(),
  };

  return {
    ...store.products[idx],
    category: store.categories.find((c) => c.id === input.category_id) ?? null,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDbClient(true);
  if (db) {
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const store = getDemoStore();
  store.products = store.products.filter((p) => p.id !== id);
}

// ============================================================================
// ORDERS (Server-side Verified Pricing & Creation)
// ============================================================================
export async function createVerifiedOrder(
  payload: CreateOrderPayload
): Promise<{ order: Order; persistedToDatabase: boolean }> {
  const settings = await getStoreSettings();
  const db = getDbClient(true);

  // 1. Load authoritative products from database (or demo catalog when unconfigured)
  const requestedIds = Array.from(new Set(payload.items.map((i) => i.productId)));
  let catalogProducts: Product[] = [];

  if (db) {
    const { data, error } = await db
      .from("products")
      .select("*, category:categories(*)")
      .in("id", requestedIds);

    if (error) {
      throw new Error("Unable to verify menu items right now. Please try again.");
    }
    catalogProducts = (data ?? []).map((row) => ({
      id: row.id,
      category_id: row.category_id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
      price: Number(row.price),
      image_url: row.image_url ?? "",
      is_available: Boolean(row.is_available),
      is_featured: Boolean(row.is_featured),
      stock: row.stock !== null && row.stock !== undefined ? Number(row.stock) : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category as Category | null,
    }));
  } else {
    const store = getDemoStore();
    catalogProducts = store.products
      .filter((p) => requestedIds.includes(p.id))
      .map((p) => ({
        ...p,
        category: store.categories.find((c) => c.id === p.category_id) ?? null,
      }));
  }

  const productMap = new Map(catalogProducts.map((p) => [p.id, p]));

  // 2. Validate availability, stock, and strictly recalculate prices server-side
  const verifiedItems: Array<{
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    notes: string | null;
  }> = [];

  const quantityPerProduct = new Map<string, number>();

  for (const item of payload.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(
        "One or more items in your cart are no longer on the menu. Please refresh your cart."
      );
    }
    if (!product.is_available || product.category?.is_active === false) {
      throw new Error(`"${product.name}" is currently unavailable.`);
    }

    const totalQtyForProduct =
      (quantityPerProduct.get(product.id) ?? 0) + item.quantity;
    quantityPerProduct.set(product.id, totalQtyForProduct);

    if (product.stock !== null && totalQtyForProduct > product.stock) {
      throw new Error(
        `Only ${product.stock} portion(s) of "${product.name}" remaining.`
      );
    }

    const unitPrice = Number(product.price);
    const lineSubtotal = unitPrice * item.quantity;

    const noteParts: string[] = [];
    if (item.spicyLevel) noteParts.push(`Spicy: ${item.spicyLevel}`);
    if (item.notes?.trim()) noteParts.push(item.notes.trim());

    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: unitPrice,
      quantity: item.quantity,
      subtotal: lineSubtotal,
      notes: noteParts.length > 0 ? noteParts.join(" • ") : null,
    });
  }

  const subtotal = verifiedItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (settings.minimum_order > 0 && subtotal < settings.minimum_order) {
    throw new Error(
      `Minimum order amount is Rp${settings.minimum_order.toLocaleString("id-ID")}.`
    );
  }

  const deliveryFee =
    payload.delivery_type === "Delivery" ? Number(settings.delivery_fee || 0) : 0;
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();

  // 3. Persist to Supabase if configured, otherwise store in server demo memory
  if (db) {
    const { data: orderRow, error: orderError } = await db
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: payload.customer_name,
        phone: payload.phone,
        delivery_type: payload.delivery_type,
        delivery_address:
          payload.delivery_type === "Delivery"
            ? payload.delivery_address || null
            : null,
        notes: payload.notes || null,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: payload.payment_method,
        payment_status: "Unpaid",
        order_status: "Pending",
      })
      .select("*")
      .single();

    if (orderError || !orderRow) {
      throw new Error(orderError?.message || "Failed to create order");
    }

    const itemsToInsert = verifiedItems.map((item) => ({
      order_id: orderRow.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      notes: item.notes,
    }));

    const { data: insertedItems, error: itemsError } = await db
      .from("order_items")
      .insert(itemsToInsert)
      .select("*");

    if (itemsError) {
      // Rollback header if items insert fails
      await db.from("orders").delete().eq("id", orderRow.id);
      throw new Error("Failed to save order items. Please try again.");
    }

    const order: Order = {
      ...orderRow,
      subtotal: Number(orderRow.subtotal),
      delivery_fee: Number(orderRow.delivery_fee),
      total: Number(orderRow.total),
      items: (insertedItems ?? []).map((it) => ({
        ...it,
        unit_price: Number(it.unit_price),
        subtotal: Number(it.subtotal),
      })),
    };

    return { order, persistedToDatabase: true };
  }

  // Demo mode server-side order persistence
  const store = getDemoStore();
  const orderId = `ord-${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();
  const orderItems: OrderItem[] = verifiedItems.map((item, idx) => ({
    id: `item-${orderId}-${idx + 1}`,
    order_id: orderId,
    product_id: item.product_id,
    product_name: item.product_name,
    unit_price: item.unit_price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    notes: item.notes,
  }));

  const createdOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_name: payload.customer_name,
    phone: payload.phone,
    delivery_type: payload.delivery_type,
    delivery_address:
      payload.delivery_type === "Delivery" ? payload.delivery_address || null : null,
    notes: payload.notes || null,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    payment_method: payload.payment_method,
    payment_status: "Unpaid",
    order_status: "Pending",
    created_at: now,
    updated_at: now,
    items: orderItems,
  };

  store.orders.unshift(createdOrder);
  return { order: createdOrder, persistedToDatabase: false };
}

export async function getOrders(filters?: {
  status?: string;
  search?: string;
  date?: string;
}): Promise<Order[]> {
  const db = getDbClient(true);
  let orders: Order[] = [];

  if (db) {
    const { data, error } = await db
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      orders = data.map((row) => ({
        id: row.id,
        order_number: row.order_number,
        customer_name: row.customer_name,
        phone: row.phone,
        delivery_type: row.delivery_type,
        delivery_address: row.delivery_address,
        notes: row.notes,
        subtotal: Number(row.subtotal),
        delivery_fee: Number(row.delivery_fee),
        total: Number(row.total),
        payment_method: row.payment_method,
        payment_status: row.payment_status,
        order_status: row.order_status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items: Array.isArray(row.items)
          ? row.items.map((it: OrderItem) => ({
              ...it,
              unit_price: Number(it.unit_price),
              subtotal: Number(it.subtotal),
            }))
          : [],
      }));
    }
  } else {
    orders = [...getDemoStore().orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  if (filters?.status && filters.status !== "All") {
    orders = orders.filter((o) => o.order_status === filters.status);
  }

  if (filters?.date) {
    orders = orders.filter((o) => o.created_at.slice(0, 10) === filters.date);
  }

  if (filters?.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    orders = orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
    );
  }

  return orders;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (!error && data) {
      return {
        ...data,
        subtotal: Number(data.subtotal),
        delivery_fee: Number(data.delivery_fee),
        total: Number(data.total),
        items: Array.isArray(data.items)
          ? data.items.map((it: OrderItem) => ({
              ...it,
              unit_price: Number(it.unit_price),
              subtotal: Number(it.subtotal),
            }))
          : [],
      };
    }
  }

  return (
    getDemoStore().orders.find((o) => o.order_number === orderNumber) ?? null
  );
}

export async function updateOrderStatus(
  id: string,
  updates: { order_status?: OrderStatus; payment_status?: PaymentStatus }
): Promise<Order> {
  const db = getDbClient(true);
  if (db) {
    const { data, error } = await db
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select("*, items:order_items(*)")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update order");
    }

    return {
      ...data,
      subtotal: Number(data.subtotal),
      delivery_fee: Number(data.delivery_fee),
      total: Number(data.total),
      items: Array.isArray(data.items)
        ? data.items.map((it: OrderItem) => ({
            ...it,
            unit_price: Number(it.unit_price),
            subtotal: Number(it.subtotal),
          }))
        : [],
    };
  }

  const store = getDemoStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");

  store.orders[idx] = {
    ...store.orders[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return store.orders[idx];
}

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const isDemoData = !isSupabaseConfigured();
  const orders = await getOrders();

  const todayKey = new Date().toISOString().slice(0, 10);

  const todaysOrders = orders.filter(
    (o) => o.created_at.slice(0, 10) === todayKey
  );
  const ordersToday = todaysOrders.length;
  const revenueToday = todaysOrders
    .filter((o) => o.order_status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(
    (o) =>
      o.order_status === "Pending" ||
      o.order_status === "Confirmed" ||
      o.order_status === "Preparing"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.order_status === "Completed"
  ).length;

  // Best-selling menu items across non-cancelled orders
  const productSales = new Map<
    string,
    { productName: string; quantitySold: number; revenue: number }
  >();

  for (const order of orders) {
    if (order.order_status === "Cancelled") continue;
    for (const item of order.items ?? []) {
      const existing = productSales.get(item.product_name) ?? {
        productName: item.product_name,
        quantitySold: 0,
        revenue: 0,
      };
      existing.quantitySold += item.quantity;
      existing.revenue += item.subtotal;
      productSales.set(item.product_name, existing);
    }
  }

  const bestSelling = Array.from(productSales.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);

  // Sales chart for last 7 days
  const salesLast7Days: DashboardAnalytics["salesLast7Days"] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(d);

    const matching = orders.filter(
      (o) => o.created_at.slice(0, 10) === key && o.order_status !== "Cancelled"
    );

    salesLast7Days.push({
      date: key,
      label,
      revenue: matching.reduce((sum, o) => sum + o.total, 0),
      orders: matching.length,
    });
  }

  const statusDistribution = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.order_status === status).length,
  }));

  return {
    isDemoData,
    ordersToday,
    revenueToday,
    pendingOrders,
    completedOrders,
    recentOrders: orders.slice(0, 6),
    bestSelling,
    salesLast7Days,
    statusDistribution,
  };
}
