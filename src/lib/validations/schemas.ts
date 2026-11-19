import { z } from "zod";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "Unpaid",
  "Pending Verification",
  "Paid",
  "Refunded",
] as const;

export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "QRIS"] as const;
export const DELIVERY_TYPES = ["Pickup", "Delivery"] as const;
export const SPICY_LEVELS = ["Mild", "Medium", "Spicy", "Extra Spicy"] as const;

const phoneRegex = /^[+]?[\d\s-]{9,18}$/;

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Minimum quantity is 1").max(50, "Maximum quantity is 50"),
  spicyLevel: z.enum(SPICY_LEVELS).optional(),
  notes: z.string().max(200, "Item note must be 200 characters or less").optional(),
});

export const checkoutFormSchema = z
  .object({
    customer_name: z
      .string()
      .trim()
      .min(2, "Please enter your full name (at least 2 characters)")
      .max(100, "Name is too long"),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Enter a valid WhatsApp number (e.g. 08123456789 or 628123456789)"),
    delivery_type: z.enum(DELIVERY_TYPES),
    delivery_address: z.string().trim().max(400, "Address is too long").optional(),
    payment_method: z.enum(PAYMENT_METHODS),
    notes: z.string().trim().max(400, "Order notes must be 400 characters or less").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.delivery_type === "Delivery") {
      if (!data.delivery_address || data.delivery_address.trim().length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_address"],
          message: "Please provide a complete delivery address (at least 8 characters)",
        });
      }
    }
  });

export const createOrderPayloadSchema = z
  .object({
    customer_name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(phoneRegex, "Invalid WhatsApp number"),
    delivery_type: z.enum(DELIVERY_TYPES),
    delivery_address: z.string().trim().max(400).optional().nullable(),
    payment_method: z.enum(PAYMENT_METHODS),
    notes: z.string().trim().max(400).optional().nullable(),
    items: z.array(checkoutItemSchema).min(1, "Your cart is empty").max(40, "Too many distinct items"),
  })
  .superRefine((data, ctx) => {
    if (data.delivery_type === "Delivery") {
      if (!data.delivery_address || data.delivery_address.trim().length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_address"],
          message: "Delivery address is required for delivery orders",
        });
      }
    }
  });

export const productSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(5, "Please provide a short appetizing description").max(800),
  price: z.coerce.number().min(0, "Price cannot be negative").max(100000000),
  image_url: z.string().trim().max(500).optional().default(""),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock: z.union([z.coerce.number().int().min(0).max(100000), z.null(), z.literal("")]).transform((v) =>
    v === "" ? null : v
  ),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(80),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(300).optional().nullable(),
  image_url: z.string().trim().max(500).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
});

export const updateOrderStatusSchema = z.object({
  order_status: z.enum(ORDER_STATUSES).optional(),
  payment_status: z.enum(PAYMENT_STATUSES).optional(),
});

export const openingHourSchema = z.object({
  day: z.string().min(1),
  open: z.string().min(1),
  close: z.string().min(1),
  closed: z.boolean(),
});

export const storeSettingsSchema = z.object({
  store_name: z.string().trim().min(2, "Store name is required").max(100),
  logo_url: z.string().trim().max(500).optional().nullable(),
  whatsapp_number: z
    .string()
    .trim()
    .max(25)
    .optional()
    .nullable(),
  address: z.string().trim().max(400).optional().nullable(),
  opening_hours: z.array(openingHourSchema).default([]),
  delivery_fee: z.coerce.number().min(0).max(10000000).default(0),
  minimum_order: z.coerce.number().min(0).max(10000000).default(0),
  store_description: z.string().trim().max(600).default(""),
  instagram_url: z.string().trim().max(300).optional().nullable(),
  social_links: z
    .object({
      tiktok: z.string().trim().max(300).optional().default(""),
      facebook: z.string().trim().max(300).optional().default(""),
      maps_embed_url: z.string().trim().max(600).optional().default(""),
    })
    .default({}),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CreateOrderPayload = z.infer<typeof createOrderPayloadSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;
