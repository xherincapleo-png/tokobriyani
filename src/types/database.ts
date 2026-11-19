export type DeliveryType = "Pickup" | "Delivery";

export type PaymentMethod = "Cash" | "Bank Transfer" | "QRIS";

export type PaymentStatus =
  | "Unpaid"
  | "Pending Verification"
  | "Paid"
  | "Refunded";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type SpicyLevel = "Mild" | "Medium" | "Spicy" | "Extra Spicy";

export interface OpeningHourEntry {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface SocialLinks {
  tiktok?: string;
  facebook?: string;
  maps_embed_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  stock: number | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  notes: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url: string | null;
  whatsapp_number: string | null;
  address: string | null;
  opening_hours: OpeningHourEntry[];
  delivery_fee: number;
  minimum_order: number;
  store_description: string;
  instagram_url: string | null;
  social_links: SocialLinks;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "staff";
  is_active: boolean;
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  quantity: number;
  spicyLevel?: SpicyLevel;
  notes?: string;
}

export interface DashboardAnalytics {
  isDemoData: boolean;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: Order[];
  bestSelling: Array<{
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesLast7Days: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  statusDistribution: Array<{
    status: OrderStatus;
    count: number;
  }>;
}
