# Toko Briyani — Food Ordering Platform & Admin Dashboard

A modern, mobile-first online ordering storefront and store-owner admin console built for **Toko Briyani** with Next.js App Router, TypeScript, Tailwind CSS, Zod, React Hook Form, and Supabase (PostgreSQL + Auth + Storage).

## Features

### Customer Storefront
- **Homepage (`/`)**: Announcement bar with live operating status, editorial hero, 4 featured dishes, brand story, why-choose-us pillars, family feast promo banner, clearly labeled sample testimonials, and configurable footer.
- **Menu Catalog (`/menu`)**: Working category tabs (`All Menu`, `Chicken Briyani`, `Beef Briyani`, `Special Briyani`, `Side Dishes`, `Drinks`), live search, sorting, availability indicators, and IDR pricing.
- **Dish Detail (`/menu/[slug]`)**: Large editorial photography, spice level selector, kitchen notes, quantity stepper, Add to Cart, and related recommendations.
- **Shopping Cart (`/cart`)**: Persisted via `localStorage` and synchronized across tabs, quantity controls, item removal, subtotal, delivery fee preview, and empty state.
- **Checkout (`/checkout` & `/checkout/success`)**: React Hook Form + Zod validation, Pickup vs Delivery, Cash / Bank Transfer / QRIS (manual confirmation), duplicate submission guard, server-side price & total recalculation (`POST /api/orders`), and one-tap WhatsApp order confirmation (`https://wa.me/...`).
- **About (`/about`) & Contact (`/contact`)**: Honest editorial storytelling, editable store info, daily opening hours schedule, WhatsApp CTA, and configurable Google Maps embed placeholder.

### Admin Dashboard (`/admin`)
- **Authentication (`/admin/login`)**: Protected by Next.js middleware and server-side `requireAdmin()` checks backed by Supabase Auth + `public.admin_profiles`. Includes a clearly labeled Demo Preview Mode when Supabase credentials are not yet configured.
- **Overview (`/admin`)**: Today's orders & revenue KPIs, pending/completed counts, 7-day sales bar chart, order status distribution, recent orders, and best-selling menu items.
- **Products (`/admin/products`)**: Full CRUD, search, category filter, pagination, image upload (`POST /api/admin/upload` with MIME & 5MB size validation), availability & featured toggles, and delete confirmation dialog.
- **Categories (`/admin/categories`)**: Full CRUD, sort order, active toggle, and protection preventing deletion of categories that still have assigned products.
- **Orders (`/admin/orders`)**: Search, status filter, date filter, detailed order inspector modal, customer WhatsApp quick-reply link, and live order/payment status updates.
- **Store Settings (`/admin/settings`)**: Edit store name, logo, WhatsApp number, address, daily opening hours, delivery fee, minimum order, description, social links, and Google Maps embed URL.

---

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase Production Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(server-only — never expose in browser code)*
   - `NEXT_PUBLIC_STORE_WHATSAPP` *(international format without `+`, e.g. `6281234567890`)*
3. Run the SQL migrations in order in the Supabase SQL Editor (or via Supabase CLI):
   1. `supabase/migrations/001_initial_schema.sql`
   2. `supabase/migrations/002_rls_and_storage.sql`
   3. `supabase/seed.sql`

### Creating Your First Admin Account

Because raw passwords are never stored in the application database, admin accounts are authenticated via Supabase Auth and authorized via `public.admin_profiles`:

1. In Supabase Dashboard, go to **Authentication → Users → Add User** and create your admin email & password (mark email as confirmed).
2. Copy the newly created user's **UUID** (`auth.users.id`).
3. Run this SQL in the Supabase SQL Editor:

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
VALUES (
  '<PASTE-AUTH-USER-UUID-HERE>',
  'owner@tokobriyani.com',
  'Toko Briyani Owner',
  'admin',
  TRUE
);
```

4. Sign in at `/admin/login` using that email and password.
5. Visit **Admin → Store Settings** to configure your real WhatsApp number, store address, opening hours, and delivery fee.

---

## Verification Scripts

```bash
npm run typecheck
npm run lint
npm run build
```
