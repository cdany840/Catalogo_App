-- =============================================================================
-- DATOS SEMILLA (SEED) — URBAN_DROP (Catálogo Drop #04)
-- Pobla las 5 tablas relacionales:
--   1. categorias
--   2. productos
--   3. producto_imagenes
--   4. producto_tallas
--   5. producto_especificaciones
-- =============================================================================

begin;

-- Limpiar datos previos manteniendo reinicio de secuencias
truncate table
  public.producto_especificaciones,
  public.producto_tallas,
  public.producto_imagenes,
  public.productos,
  public.categorias
restart identity cascade;

-- 1. Insertar Categorías
insert into public.categorias (slug, nombre, icono, orden) values
  ('hoodies', 'Hoodies', 'fa-shirt', 1),
  ('pantalones', 'Pantalones', 'fa-lines-leaning', 2),
  ('t-shirts', 'T-Shirts', 'fa-bolt', 3),
  ('chaquetas', 'Chaquetas', 'fa-vest-patches', 4);

-- 2. Insertar Productos
insert into public.productos (categoria_id, nombre, precio, etiqueta, corte_fit, info_modelo, stock_disponible, orden) values
  ((select id from public.categorias where slug = 'hoodies'), 'Oversized Street Hoodie', 42.00, 'Colección Drop #04', 'Oversized Boxy', '1.78m — Usa Talla L', 4, 1),
  ((select id from public.categorias where slug = 'pantalones'), 'Jeans Cargo Wide Leg', 55.00, 'Tendencia Viral', 'Wide Leg Loose', '1.82m — Usa Talla L', 3, 2),
  ((select id from public.categorias where slug = 't-shirts'), 'Graphic Boxy Tee Cyber', 28.00, 'Edición Limitada', 'Boxy Heavyweight', '1.74m — Usa Talla M', 5, 3),
  ((select id from public.categorias where slug = 'chaquetas'), 'Bomber Techwear Parachute', 68.00, 'Drop Exclusivo', 'Cropped Boxy Fit', '1.80m — Usa Talla L', 2, 4),
  ((select id from public.categorias where slug = 'hoodies'), 'Zip-Up Hoodie Acid Wash', 48.00, 'Restock Limitado', 'Drop Shoulder Boxy', '1.81m — Usa Talla L', 4, 5),
  ((select id from public.categorias where slug = 'pantalones'), 'Parachute Nylon Track Pants', 52.00, 'Street Utility', 'Baggy Ajustable', '1.79m — Usa Talla M', 6, 6),
  ((select id from public.categorias where slug = 't-shirts'), 'Washed Vintage Heavy Tee', 32.00, 'Essential Drop', 'Oversized Drop', '1.75m — Usa Talla M', 5, 7),
  ((select id from public.categorias where slug = 'chaquetas'), 'Chaqueta Denim Distressed', 64.00, 'Edición Numerada', 'Relaxed Trucker', '1.76m — Usa Talla M', 3, 8);

-- 3. Insertar Imágenes por Producto
insert into public.producto_imagenes (producto_id, url, alt_text, orden) values
  -- Producto 1: Oversized Street Hoodie
  (1, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=700', 'Oversized Street Hoodie - Vista Frontal', 1),
  (1, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=700', 'Oversized Street Hoodie - Detalle Textura', 2),
  (1, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700', 'Oversized Street Hoodie - Fit Completo', 3),
  -- Producto 2: Jeans Cargo Wide Leg
  (2, 'https://images.unsplash.com/photo-1542272604-780c36856d66?auto=format&fit=crop&q=80&w=700', 'Jeans Cargo Wide Leg - Vista Frontal', 1),
  (2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=700', 'Jeans Cargo Wide Leg - Detalle Bolsillos', 2),
  (2, 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=700', 'Jeans Cargo Wide Leg - Lavado Acid Wash', 3),
  -- Producto 3: Graphic Boxy Tee Cyber
  (3, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700', 'Graphic Boxy Tee Cyber - Vista Frontal', 1),
  (3, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=700', 'Graphic Boxy Tee Cyber - Estampado Posterior', 2),
  (3, 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=700', 'Graphic Boxy Tee Cyber - Detalle Cuello', 3),
  -- Producto 4: Bomber Techwear Parachute
  (4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=700', 'Bomber Techwear Parachute - Vista Frontal', 1),
  (4, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=700', 'Bomber Techwear Parachute - Vista Lateral', 2),
  (4, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=700', 'Bomber Techwear Parachute - Detalle Cierres', 3),
  -- Producto 5: Zip-Up Hoodie Acid Wash
  (5, 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&q=80&w=700', 'Zip-Up Hoodie Acid Wash - Vista Frontal', 1),
  (5, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=700', 'Zip-Up Hoodie Acid Wash - Detalle Costuras', 2),
  (5, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=700', 'Zip-Up Hoodie Acid Wash - Textura Mineral', 3),
  -- Producto 6: Parachute Nylon Track Pants
  (6, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=700', 'Parachute Nylon Track Pants - Vista Frontal', 1),
  (6, 'https://images.unsplash.com/photo-1542272604-780c36856d66?auto=format&fit=crop&q=80&w=700', 'Parachute Nylon Track Pants - Detalle Stoppers', 2),
  (6, 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=700', 'Parachute Nylon Track Pants - Fit Baggy', 3),
  -- Producto 7: Washed Vintage Heavy Tee
  (7, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=700', 'Washed Vintage Heavy Tee - Vista Frontal', 1),
  (7, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700', 'Washed Vintage Heavy Tee - Caída Oversized', 2),
  (7, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=700', 'Washed Vintage Heavy Tee - Lavado Stone Wash', 3),
  -- Producto 8: Chaqueta Denim Distressed
  (8, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=700', 'Chaqueta Denim Distressed - Vista Frontal', 1),
  (8, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=700', 'Chaqueta Denim Distressed - Detalle Desgaste', 2),
  (8, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=700', 'Chaqueta Denim Distressed - Botones Acero', 3);

-- 4. Insertar Tallas y Medidas Exactas en cm
insert into public.producto_tallas (producto_id, talla, medidas_cm, stock_talla, orden) values
  -- Producto 1
  (1, 'S', 'Pecho: 56cm | Largo: 68cm', 1, 1),
  (1, 'M', 'Pecho: 59cm | Largo: 71cm', 1, 2),
  (1, 'L', 'Pecho: 62cm | Largo: 74cm', 1, 3),
  (1, 'XL', 'Pecho: 65cm | Largo: 77cm', 1, 4),
  -- Producto 2
  (2, 'S', 'Cintura: 78cm | Largo: 104cm', 1, 1),
  (2, 'M', 'Cintura: 82cm | Largo: 106cm', 1, 2),
  (2, 'L', 'Cintura: 88cm | Largo: 108cm', 1, 3),
  (2, 'XL', 'Cintura: 94cm | Largo: 110cm', 0, 4),
  -- Producto 3
  (3, 'S', 'Pecho: 52cm | Largo: 66cm', 1, 1),
  (3, 'M', 'Pecho: 55cm | Largo: 69cm', 2, 2),
  (3, 'L', 'Pecho: 58cm | Largo: 72cm', 1, 3),
  (3, 'XL', 'Pecho: 61cm | Largo: 75cm', 1, 4),
  -- Producto 4
  (4, 'S', 'Pecho: 58cm | Largo: 64cm', 0, 1),
  (4, 'M', 'Pecho: 61cm | Largo: 66cm', 1, 2),
  (4, 'L', 'Pecho: 64cm | Largo: 69cm', 1, 3),
  (4, 'XL', 'Pecho: 67cm | Largo: 72cm', 0, 4),
  -- Producto 5
  (5, 'S', 'Pecho: 57cm | Largo: 67cm', 1, 1),
  (5, 'M', 'Pecho: 60cm | Largo: 70cm', 1, 2),
  (5, 'L', 'Pecho: 63cm | Largo: 73cm', 1, 3),
  (5, 'XL', 'Pecho: 66cm | Largo: 76cm', 1, 4),
  -- Producto 6
  (6, 'S', 'Cintura: 74-82cm | Largo: 103cm', 1, 1),
  (6, 'M', 'Cintura: 80-88cm | Largo: 105cm', 2, 2),
  (6, 'L', 'Cintura: 86-94cm | Largo: 107cm', 2, 3),
  (6, 'XL', 'Cintura: 92-100cm | Largo: 109cm', 1, 4),
  -- Producto 7
  (7, 'S', 'Pecho: 54cm | Largo: 68cm', 1, 1),
  (7, 'M', 'Pecho: 57cm | Largo: 71cm', 2, 2),
  (7, 'L', 'Pecho: 60cm | Largo: 74cm', 1, 3),
  (7, 'XL', 'Pecho: 63cm | Largo: 77cm', 1, 4),
  -- Producto 8
  (8, 'S', 'Pecho: 56cm | Largo: 63cm', 1, 1),
  (8, 'M', 'Pecho: 59cm | Largo: 65cm', 1, 2),
  (8, 'L', 'Pecho: 62cm | Largo: 68cm', 1, 3),
  (8, 'XL', 'Pecho: 65cm | Largo: 70cm', 0, 4);

-- 5. Insertar Especificaciones de Material y Cuidados
insert into public.producto_especificaciones (producto_id, descripcion, orden) values
  -- Producto 1
  (1, '100% Algodón Peinado Pesado (320 GSM)', 1),
  (1, 'Capucha doble felpa con caída estructurada', 2),
  (1, 'Corte Boxy Streetwear de hombro caído', 3),
  -- Producto 2
  (2, 'Mezclilla rígida 14 oz de alta durabilidad', 1),
  (2, '6 bolsillos funcionales cargo con broche', 2),
  (2, 'Lavado Vintage Acid Wash resistente', 3),
  -- Producto 3
  (3, '100% Algodón Premium 240 GSM', 1),
  (3, 'Estampado frontal y posterior Tacto Cero', 2),
  (3, 'Cuello acanalado reforzado de 2.5cm', 3),
  -- Producto 4
  (4, 'Nylon Ripstop repelente al agua (DWR)', 1),
  (4, 'Cierres metálicos YKK de doble vía y bolsillo utility', 2),
  (4, 'Forro térmico ligero acolchado en diamante', 3),
  -- Producto 5
  (5, 'French Terry 350 GSM con lavado mineral artesanal', 1),
  (5, 'Cierre metálico frontal completo de alta resistencia', 2),
  (5, 'Costuras expuestas overlock de estética industrial', 3),
  -- Producto 6
  (6, 'Tejido técnico ultraligero con pinzas articuladas en rodilla', 1),
  (6, 'Stoppers elásticos en cintura y tobillos para silueta 2 en 1', 2),
  (6, 'Secado rápido y bolsillos laterales de gran capacidad', 3),
  -- Producto 7
  (7, 'Algodón Jersey 260 GSM con proceso Enzyme Stone Wash', 1),
  (7, 'Acabado desgastado único en cada pieza', 2),
  (7, 'Pre-encogida para mantener el fit tras cada lavado', 3),
  -- Producto 8
  (8, 'Denim 13.5 oz 100% algodón con desgaste artesanal', 1),
  (8, 'Botones de acero pavonado grabados a láser', 2),
  (8, 'Bolsillos internos profundos y ajuste lateral en cintura', 3);

commit;
