import type {
  Category,
  Order,
  Product,
  StoreSettings,
} from "@/types/database";

export interface DemoStoreState {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}

export const SAMPLE_TESTIMONIALS = [
  {
    id: "sample-1",
    name: "Sample Customer A",
    context: "Family Dinner Order",
    quote:
      "The basmati rice arrived warm and deeply fragrant, with separate fluffy grains and tender spiced chicken. Everyone at the table asked where we ordered from.",
    dish: "Chicken Briyani & Samosa",
  },
  {
    id: "sample-2",
    name: "Sample Customer B",
    context: "Weekend Gathering",
    quote:
      "Generous portions and balanced spices—nothing overpowering, just comforting warmth. Pairing the Special Briyani with chilled Mango Lassi was our highlight.",
    dish: "Special Briyani & Mango Lassi",
  },
  {
    id: "sample-3",
    name: "Sample Customer C",
    context: "Office Lunch Pickup",
    quote:
      "Ordering online and confirming over WhatsApp took less than two minutes. The Beef Briyani and Garlic Naan were packed neatly and ready right on time.",
    dish: "Beef Briyani & Garlic Naan",
  },
];

function createInitialCategories(): Category[] {
  const createdAt = "2026-01-15T08:00:00.000Z";
  return [
    {
      id: "cat-chicken-briyani",
      name: "Chicken Briyani",
      slug: "chicken-briyani",
      description:
        "Fragrant long-grain basmati rice layered with spiced, tender chicken and toasted aromatics.",
      image_url: "/images/chicken-briyani.jpg",
      is_active: true,
      sort_order: 1,
      created_at: createdAt,
    },
    {
      id: "cat-beef-briyani",
      name: "Beef Briyani",
      slug: "beef-briyani",
      description:
        "Slow-braised spiced beef paired with saffron-infused basmati rice and caramelized shallots.",
      image_url: "/images/beef-briyani.jpg",
      is_active: true,
      sort_order: 2,
      created_at: createdAt,
    },
    {
      id: "cat-special-briyani",
      name: "Special Briyani",
      slug: "special-briyani",
      description:
        "Signature house creations and celebratory platters crafted for hearty appetites.",
      image_url: "/images/special-briyani.jpg",
      is_active: true,
      sort_order: 3,
      created_at: createdAt,
    },
    {
      id: "cat-side-dishes",
      name: "Side Dishes",
      slug: "side-dishes",
      description:
        "Crisp savory bites, smoky tandoor-inspired plates, and freshly baked flatbreads.",
      image_url: "/images/chicken-tikka.jpg",
      is_active: true,
      sort_order: 4,
      created_at: createdAt,
    },
    {
      id: "cat-drinks",
      name: "Drinks",
      slug: "drinks",
      description:
        "Cooling, aromatic beverages balanced to complement warm spices.",
      image_url: "/images/mango-lassi.jpg",
      is_active: true,
      sort_order: 5,
      created_at: createdAt,
    },
  ];
}

function createInitialProducts(): Product[] {
  const ts = "2026-01-15T08:00:00.000Z";
  return [
    {
      id: "prod-chicken-briyani",
      category_id: "cat-chicken-briyani",
      name: "Chicken Briyani",
      slug: "chicken-briyani",
      description:
        "Fragrant saffron-streaked basmati rice steamed with tender spice-marinated chicken, caramelized shallots, fresh mint, and a side of cooling cucumber raita.",
      price: 35000,
      image_url: "/images/chicken-briyani.jpg",
      is_available: true,
      is_featured: true,
      stock: 30,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-beef-briyani",
      category_id: "cat-beef-briyani",
      name: "Beef Briyani",
      slug: "beef-briyani",
      description:
        "Richly spiced slow-braised beef folded into aromatic long-grain basmati rice, finished with toasted almonds, crispy shallots, and warm house gravy.",
      price: 45000,
      image_url: "/images/beef-briyani.jpg",
      is_available: true,
      is_featured: true,
      stock: 25,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-special-briyani",
      category_id: "cat-special-briyani",
      name: "Special Briyani",
      slug: "special-briyani",
      description:
        "Our generous house platter bringing together spiced chicken, braised beef, golden seared egg, roasted cashews, and saffron basmati rice served with raita and curry.",
      price: 55000,
      image_url: "/images/special-briyani.jpg",
      is_available: true,
      is_featured: true,
      stock: 20,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-egg-briyani",
      category_id: "cat-special-briyani",
      name: "Egg Briyani",
      slug: "egg-briyani",
      description:
        "Pan-seared spiced boiled eggs nestled in fragrant herb and saffron basmati rice, topped with sweet caramelized onions and fresh coriander.",
      price: 28000,
      image_url: "/images/egg-briyani.jpg",
      is_available: true,
      is_featured: false,
      stock: 35,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-chicken-tikka",
      category_id: "cat-side-dishes",
      name: "Chicken Tikka",
      slug: "chicken-tikka",
      description:
        "Boneless chicken marinated in yogurt and warm roasted spices, charred until smoky and juicy, served with fresh mint chutney and lime.",
      price: 32000,
      image_url: "/images/chicken-tikka.jpg",
      is_available: true,
      is_featured: true,
      stock: 25,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-samosa",
      category_id: "cat-side-dishes",
      name: "Samosa",
      slug: "samosa",
      description:
        "Crisp, flaky golden pastry triangles filled with warmly spiced potatoes and green peas, paired with sweet tamarind and fresh mint dipping sauces.",
      price: 15000,
      image_url: "/images/samosa.jpg",
      is_available: true,
      is_featured: false,
      stock: 40,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-garlic-naan",
      category_id: "cat-side-dishes",
      name: "Garlic Naan",
      slug: "garlic-naan",
      description:
        "Soft, blistered flatbread brushed generously with melted ghee, roasted minced garlic, and finely chopped coriander—ideal for scooping rich curry.",
      price: 12000,
      image_url: "/images/garlic-naan.jpg",
      is_available: true,
      is_featured: false,
      stock: 50,
      created_at: ts,
      updated_at: ts,
    },
    {
      id: "prod-mango-lassi",
      category_id: "cat-drinks",
      name: "Mango Lassi",
      slug: "mango-lassi",
      description:
        "Chilled, velvety yogurt smoothie blended with ripe sweet mango, a whisper of cardamom, and garnished with crushed pistachios.",
      price: 18000,
      image_url: "/images/mango-lassi.jpg",
      is_available: true,
      is_featured: false,
      stock: 40,
      created_at: ts,
      updated_at: ts,
    },
  ];
}

function createInitialSettings(): StoreSettings {
  return {
    id: "store-settings-singleton",
    store_name: "Toko Briyani",
    logo_url: null,
    whatsapp_number: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "6280000000000",
    address:
      "Store address placeholder — update your street address in Admin > Store Settings.",
    opening_hours: [
      { day: "Monday", open: "10:00", close: "21:00", closed: false },
      { day: "Tuesday", open: "10:00", close: "21:00", closed: false },
      { day: "Wednesday", open: "10:00", close: "21:00", closed: false },
      { day: "Thursday", open: "10:00", close: "21:00", closed: false },
      { day: "Friday", open: "11:00", close: "22:00", closed: false },
      { day: "Saturday", open: "10:00", close: "22:00", closed: false },
      { day: "Sunday", open: "10:00", close: "21:00", closed: false },
    ],
    delivery_fee: 15000,
    minimum_order: 0,
    store_description:
      "Authentic, freshly steamed Briyani layered with aromatic whole spices, fragrant basmati rice, and comforting flavors made to gather around.",
    instagram_url: "https://instagram.com/tokobriyani.placeholder",
    social_links: {
      tiktok: "",
      facebook: "",
      maps_embed_url: "",
    },
    updated_at: "2026-01-15T08:00:00.000Z",
  };
}

function daysAgoIso(daysAgo: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

function createDemoOrders(): Order[] {
  return [
    {
      id: "demo-ord-1",
      order_number: "TB-DEMO-1001",
      customer_name: "Demo Customer — Amina",
      phone: "081200000001",
      delivery_type: "Delivery",
      delivery_address: "Sample Street No. 12 (Demo Order)",
      notes: "Extra raita on the side",
      subtotal: 125000,
      delivery_fee: 15000,
      total: 140000,
      payment_method: "QRIS",
      payment_status: "Paid",
      order_status: "Preparing",
      created_at: daysAgoIso(0, 11),
      updated_at: daysAgoIso(0, 11),
      items: [
        {
          id: "demo-item-1",
          order_id: "demo-ord-1",
          product_id: "prod-special-briyani",
          product_name: "Special Briyani",
          unit_price: 55000,
          quantity: 1,
          subtotal: 55000,
          notes: "Spicy: Medium",
        },
        {
          id: "demo-item-2",
          order_id: "demo-ord-1",
          product_id: "prod-chicken-briyani",
          product_name: "Chicken Briyani",
          unit_price: 35000,
          quantity: 2,
          subtotal: 70000,
          notes: "Spicy: Mild",
        },
      ],
    },
    {
      id: "demo-ord-2",
      order_number: "TB-DEMO-1002",
      customer_name: "Demo Customer — Farhan",
      phone: "081200000002",
      delivery_type: "Pickup",
      delivery_address: null,
      notes: "Pickup around 13:00",
      subtotal: 81000,
      delivery_fee: 0,
      total: 81000,
      payment_method: "Cash",
      payment_status: "Unpaid",
      order_status: "Pending",
      created_at: daysAgoIso(0, 10),
      updated_at: daysAgoIso(0, 10),
      items: [
        {
          id: "demo-item-3",
          order_id: "demo-ord-2",
          product_id: "prod-beef-briyani",
          product_name: "Beef Briyani",
          unit_price: 45000,
          quantity: 1,
          subtotal: 45000,
          notes: "Spicy: Spicy",
        },
        {
          id: "demo-item-4",
          order_id: "demo-ord-2",
          product_id: "prod-mango-lassi",
          product_name: "Mango Lassi",
          unit_price: 18000,
          quantity: 2,
          subtotal: 36000,
          notes: null,
        },
      ],
    },
    {
      id: "demo-ord-3",
      order_number: "TB-DEMO-1003",
      customer_name: "Demo Customer — Nadia",
      phone: "081200000003",
      delivery_type: "Delivery",
      delivery_address: "Sample Residence Block B (Demo Order)",
      notes: null,
      subtotal: 152000,
      delivery_fee: 15000,
      total: 167000,
      payment_method: "Bank Transfer",
      payment_status: "Paid",
      order_status: "Completed",
      created_at: daysAgoIso(1, 18),
      updated_at: daysAgoIso(1, 19),
      items: [
        {
          id: "demo-item-5",
          order_id: "demo-ord-3",
          product_id: "prod-beef-briyani",
          product_name: "Beef Briyani",
          unit_price: 45000,
          quantity: 2,
          subtotal: 90000,
          notes: null,
        },
        {
          id: "demo-item-6",
          order_id: "demo-ord-3",
          product_id: "prod-chicken-tikka",
          product_name: "Chicken Tikka",
          unit_price: 32000,
          quantity: 1,
          subtotal: 32000,
          notes: null,
        },
        {
          id: "demo-item-7",
          order_id: "demo-ord-3",
          product_id: "prod-samosa",
          product_name: "Samosa",
          unit_price: 15000,
          quantity: 2,
          subtotal: 30000,
          notes: null,
        },
      ],
    },
    {
      id: "demo-ord-4",
      order_number: "TB-DEMO-1004",
      customer_name: "Demo Customer — Rizky",
      phone: "081200000004",
      delivery_type: "Delivery",
      delivery_address: "Sample Office Tower Floor 5 (Demo Order)",
      notes: "Leave at reception desk",
      subtotal: 134000,
      delivery_fee: 15000,
      total: 149000,
      payment_method: "QRIS",
      payment_status: "Paid",
      order_status: "Completed",
      created_at: daysAgoIso(2, 12),
      updated_at: daysAgoIso(2, 13),
      items: [
        {
          id: "demo-item-8",
          order_id: "demo-ord-4",
          product_id: "prod-chicken-briyani",
          product_name: "Chicken Briyani",
          unit_price: 35000,
          quantity: 3,
          subtotal: 105000,
          notes: null,
        },
        {
          id: "demo-item-9",
          order_id: "demo-ord-4",
          product_id: "prod-garlic-naan",
          product_name: "Garlic Naan",
          unit_price: 12000,
          quantity: 1,
          subtotal: 12000,
          notes: null,
        },
        {
          id: "demo-item-10",
          order_id: "demo-ord-4",
          product_id: "prod-mango-lassi",
          product_name: "Mango Lassi",
          unit_price: 17000,
          quantity: 1,
          subtotal: 17000,
          notes: null,
        },
      ],
    },
    {
      id: "demo-ord-5",
      order_number: "TB-DEMO-1005",
      customer_name: "Demo Customer — Sinta",
      phone: "081200000005",
      delivery_type: "Pickup",
      delivery_address: null,
      notes: null,
      subtotal: 110000,
      delivery_fee: 0,
      total: 110000,
      payment_method: "QRIS",
      payment_status: "Paid",
      order_status: "Completed",
      created_at: daysAgoIso(4, 17),
      updated_at: daysAgoIso(4, 18),
      items: [
        {
          id: "demo-item-11",
          order_id: "demo-ord-5",
          product_id: "prod-special-briyani",
          product_name: "Special Briyani",
          unit_price: 55000,
          quantity: 2,
          subtotal: 110000,
          notes: null,
        },
      ],
    },
    {
      id: "demo-ord-6",
      order_number: "TB-DEMO-1006",
      customer_name: "Demo Customer — Hendra",
      phone: "081200000006",
      delivery_type: "Delivery",
      delivery_address: "Sample Park Avenue No. 8 (Demo Order)",
      notes: null,
      subtotal: 92000,
      delivery_fee: 15000,
      total: 107000,
      payment_method: "Bank Transfer",
      payment_status: "Paid",
      order_status: "Completed",
      created_at: daysAgoIso(5, 19),
      updated_at: daysAgoIso(5, 20),
      items: [
        {
          id: "demo-item-12",
          order_id: "demo-ord-6",
          product_id: "prod-egg-briyani",
          product_name: "Egg Briyani",
          unit_price: 28000,
          quantity: 2,
          subtotal: 56000,
          notes: null,
        },
        {
          id: "demo-item-13",
          order_id: "demo-ord-6",
          product_id: "prod-mango-lassi",
          product_name: "Mango Lassi",
          unit_price: 18000,
          quantity: 2,
          subtotal: 36000,
          notes: null,
        },
      ],
    },
  ];
}

const globalForDemo = globalThis as unknown as {
  __tokoBriyaniDemoStore?: DemoStoreState;
};

export function getDemoStore(): DemoStoreState {
  if (!globalForDemo.__tokoBriyaniDemoStore) {
    globalForDemo.__tokoBriyaniDemoStore = {
      categories: createInitialCategories(),
      products: createInitialProducts(),
      orders: createDemoOrders(),
      settings: createInitialSettings(),
    };
  }
  return globalForDemo.__tokoBriyaniDemoStore;
}
