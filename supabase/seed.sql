-- ============================================================================
-- Toko Briyani — Seed Data (Demo Menu & Editable Placeholder Store Settings)
-- Safe to run repeatedly (idempotent via ON CONFLICT)
-- ============================================================================

-- 1. Seed Categories
INSERT INTO public.categories (name, slug, description, is_active, sort_order)
VALUES
  ('Chicken Briyani', 'chicken-briyani', 'Fragrant long-grain basmati rice layered with spiced, tender chicken and toasted aromatics.', TRUE, 1),
  ('Beef Briyani', 'beef-briyani', 'Slow-braised spiced beef paired with saffron-infused basmati rice and caramelized shallots.', TRUE, 2),
  ('Special Briyani', 'special-briyani', 'Signature house creations and celebratory platters crafted for hearty appetites.', TRUE, 3),
  ('Side Dishes', 'side-dishes', 'Crisp savory bites, smoky tandoor-inspired plates, and freshly baked flatbreads.', TRUE, 4),
  ('Drinks', 'drinks', 'Cooling, aromatic beverages balanced to complement warm spices.', TRUE, 5)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 2. Seed Initial Demo Products (prices editable in Admin Dashboard)
INSERT INTO public.products (category_id, name, slug, description, price, image_url, is_available, is_featured, stock)
SELECT
  c.id,
  p.name,
  p.slug,
  p.description,
  p.price,
  p.image_url,
  p.is_available,
  p.is_featured,
  p.stock
FROM (
  VALUES
    (
      'chicken-briyani',
      'Chicken Briyani',
      'chicken-briyani',
      'Fragrant saffron-streaked basmati rice steamed with tender spice-marinated chicken, caramelized shallots, fresh mint, and a side of cooling cucumber raita.',
      35000.00,
      '/images/chicken-briyani.jpg',
      TRUE,
      TRUE,
      30
    ),
    (
      'beef-briyani',
      'Beef Briyani',
      'beef-briyani',
      'Richly spiced slow-braised beef folded into aromatic long-grain basmati rice, finished with toasted almonds, crispy shallots, and warm house gravy.',
      45000.00,
      '/images/beef-briyani.jpg',
      TRUE,
      TRUE,
      25
    ),
    (
      'special-briyani',
      'Special Briyani',
      'special-briyani',
      'Our generous house platter bringing together spiced chicken, braised beef, golden seared egg, roasted cashews, and saffron basmati rice served with raita and curry.',
      55000.00,
      '/images/special-briyani.jpg',
      TRUE,
      TRUE,
      20
    ),
    (
      'special-briyani',
      'Egg Briyani',
      'egg-briyani',
      'Pan-seared spiced boiled eggs nestled in fragrant herb and saffron basmati rice, topped with sweet caramelized onions and fresh coriander.',
      28000.00,
      '/images/egg-briyani.jpg',
      TRUE,
      FALSE,
      35
    ),
    (
      'side-dishes',
      'Chicken Tikka',
      'chicken-tikka',
      'Boneless chicken marinated in yogurt and warm roasted spices, charred until smoky and juicy, served with fresh mint chutney and lime.',
      32000.00,
      '/images/chicken-tikka.jpg',
      TRUE,
      TRUE,
      25
    ),
    (
      'side-dishes',
      'Samosa',
      'samosa',
      'Crisp, flaky golden pastry triangles filled with warmly spiced potatoes and green peas, paired with sweet tamarind and fresh mint dipping sauces.',
      15000.00,
      '/images/samosa.jpg',
      TRUE,
      FALSE,
      40
    ),
    (
      'side-dishes',
      'Garlic Naan',
      'garlic-naan',
      'Soft, blistered flatbread brushed generously with melted ghee, roasted minced garlic, and finely chopped coriander—ideal for scooping rich curry.',
      12000.00,
      '/images/garlic-naan.jpg',
      TRUE,
      FALSE,
      50
    ),
    (
      'drinks',
      'Mango Lassi',
      'mango-lassi',
      'Chilled, velvety yogurt smoothie blended with ripe sweet mango, a whisper of cardamom, and garnished with crushed pistachios.',
      18000.00,
      '/images/mango-lassi.jpg',
      TRUE,
      FALSE,
      40
    )
) AS p(category_slug, name, slug, description, price, image_url, is_available, is_featured, stock)
JOIN public.categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured;

-- 3. Seed Singleton Store Settings (Editable Placeholder Information)
INSERT INTO public.store_settings (
  singleton_key,
  store_name,
  logo_url,
  whatsapp_number,
  address,
  opening_hours,
  delivery_fee,
  minimum_order,
  store_description,
  instagram_url,
  social_links
)
VALUES (
  TRUE,
  'Toko Briyani',
  NULL,
  '6280000000000',
  'Store address placeholder — configure your kitchen address in Admin > Store Settings.',
  '[
    {"day": "Monday", "open": "10:00", "close": "21:00", "closed": false},
    {"day": "Tuesday", "open": "10:00", "close": "21:00", "closed": false},
    {"day": "Wednesday", "open": "10:00", "close": "21:00", "closed": false},
    {"day": "Thursday", "open": "10:00", "close": "21:00", "closed": false},
    {"day": "Friday", "open": "11:00", "close": "22:00", "closed": false},
    {"day": "Saturday", "open": "10:00", "close": "22:00", "closed": false},
    {"day": "Sunday", "open": "10:00", "close": "21:00", "closed": false}
  ]'::jsonb,
  15000.00,
  0.00,
  'Authentic, freshly steamed Briyani layered with aromatic whole spices, fragrant basmati rice, and comforting flavors made to gather around.',
  'https://instagram.com/tokobriyani.placeholder',
  '{"tiktok": "", "facebook": "", "maps_embed_url": ""}'::jsonb
)
ON CONFLICT (singleton_key) DO NOTHING;
