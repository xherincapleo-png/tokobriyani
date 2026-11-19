-- ============================================================================
-- Toko Briyani — Migration 002: Row Level Security (RLS) & Storage Policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper function to check whether the current authenticated user is an active admin
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
      AND is_active = TRUE
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable RLS on all tables
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- categories policies
-- Public can read active categories; admins can perform full CRUD
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories"
  ON public.categories
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- products policies
-- Public can read available products in active categories; admins can manage all
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read available products" ON public.products;
CREATE POLICY "Public read available products"
  ON public.products
  FOR SELECT
  USING (
    (
      is_available = TRUE
      AND EXISTS (
        SELECT 1 FROM public.categories c
        WHERE c.id = products.category_id AND c.is_active = TRUE
      )
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products"
  ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- orders policies
-- Orders are created through the validated server-side API route using the
-- service role key so clients cannot tamper with prices or totals.
-- Only authenticated admins can read or update orders directly via RLS.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins read orders" ON public.orders;
CREATE POLICY "Admins read orders"
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders"
  ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders"
  ON public.orders
  FOR DELETE
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- order_items policies
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins read order items" ON public.order_items;
CREATE POLICY "Admins read order items"
  ON public.order_items
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins manage order items" ON public.order_items;
CREATE POLICY "Admins manage order items"
  ON public.order_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- store_settings policies
-- Public can read store info (name, hours, fee, WhatsApp); only admins update
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read store settings" ON public.store_settings;
CREATE POLICY "Public read store settings"
  ON public.store_settings
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admins update store settings" ON public.store_settings;
CREATE POLICY "Admins update store settings"
  ON public.store_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- admin_profiles policies
-- Users can read their own profile; only admins can view/manage admin profiles
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins read own profile" ON public.admin_profiles;
CREATE POLICY "Admins read own profile"
  ON public.admin_profiles
  FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- Supabase Storage bucket for product & brand images
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public view product images" ON storage.objects;
CREATE POLICY "Public view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
