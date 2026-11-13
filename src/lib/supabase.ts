// =============================================================================
// CAPA DE ACCESO A DATOS (DAL) — SUPABASE POSTGRESQL (URBAN_DROP)
// Consulta relacional en una sola petición (evita N+1) mediante PostgREST
// =============================================================================

import type { Product, ProductCategory, ProductMeasurements, SizeKey } from '../data/products';
import { products as fallbackProducts } from '../data/products';

export const SUPABASE_URL =
  import.meta.env?.PUBLIC_SUPABASE_URL || 'https://zbdblhlaacxewkxvlufs.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env?.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_0oXCTZq-eeth1wnZI6b7wQ_ZCZdltsC';

export interface StoreConfig {
  whatsappNumber: string;
  instagramEnabled: boolean;
  instagramUrl: string;
}

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  whatsappNumber: '5215500000000',
  instagramEnabled: true,
  instagramUrl: 'https://instagram.com/direct/inbox/',
};

export interface SupabaseRelationalProductRow {
  id: number;
  slug?: string;
  nombre: string;
  precio: number | string;
  etiqueta: string;
  corte_fit: string;
  info_modelo: string;
  stock_disponible: number;
  activo?: boolean;
  orden: number;
  categorias: {
    slug: ProductCategory;
    nombre: string;
    icono: string;
  } | null;
  producto_imagenes: Array<{
    url: string;
    alt_text: string | null;
    orden: number;
  }>;
  producto_tallas: Array<{
    talla: SizeKey;
    medidas_cm: string;
    stock_talla: number;
    orden: number;
  }>;
  producto_especificaciones: Array<{
    descripcion: string;
    orden: number;
  }>;
}

export interface EnrichedProduct extends Product {
  availableSizes?: Record<SizeKey, boolean>;
  active: boolean;
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9_-]{0,120}$/;

/**
 * Valida estrictamente el formato de un slug de producto para prevenir
 * path traversal, inyección en PostgREST o consultas malformadas.
 */
export function isValidProductSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG_REGEX.test(slug.trim().toLowerCase());
}

/**
 * Genera un slug URL-safe dinámico con sufijo aleatorio criptográfico (CSPRNG).
 * Evita colisiones incluso cuando múltiples productos comparten el mismo nombre.
 */
export function generateDynamicProductSlug(name: string): string {
  const base = (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '') || 'drop';

  const bytes = new Uint8Array(4);
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${base}-${suffix}`;
}

/**
 * Construye una URL absoluta HTTPS optimizada (< 300 KB, JPEG/WebP estándar)
 * para vistas previas Open Graph en WhatsApp, Instagram y X.
 */
export function buildOgImageUrl(rawUrl: string | undefined, siteBaseUrl: string): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&fm=jpg&q=75&w=1080&h=1080';
  if (!rawUrl || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return defaultFallback;
  }

  try {
    const resolved = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? new URL(rawUrl)
      : new URL(rawUrl, siteBaseUrl);

    // Forzar HTTPS para compatibilidad estricta con crawlers de WhatsApp/Instagram
    if (resolved.protocol === 'http:') {
      resolved.protocol = 'https:';
    }

    if (resolved.hostname.includes('images.unsplash.com')) {
      resolved.searchParams.set('auto', 'format');
      resolved.searchParams.set('fit', 'crop');
      resolved.searchParams.set('fm', 'jpg');
      resolved.searchParams.set('q', '75');
      resolved.searchParams.set('w', '1080');
      resolved.searchParams.set('h', '1080');
    }

    return resolved.toString();
  } catch {
    return defaultFallback;
  }
}

/**
 * Genera el enlace estructurado de WhatsApp incluyendo nombre, talla y URL directa.
 */
export function buildWhatsAppLink(
  phone: string,
  productName: string,
  selectedSize: string,
  productUrl: string,
  price?: string,
  measurements?: string
): string {
  const cleanPhone = (phone || DEFAULT_STORE_CONFIG.whatsappNumber).replace(/\D/g, '');
  const priceText = price ? ` (${price})` : '';
  const measText = measurements ? ` [${measurements}]` : '';
  const message =
    `Hola URBAN_DROP, me interesa esta prenda:\n` +
    `• Producto: ${productName}${priceText}\n` +
    `• Talla: ${selectedSize}${measText}\n` +
    `• Enlace: ${productUrl}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Transforma una fila relacional de Supabase (con JOINs a las 5 tablas)
 * al contrato tipado `EnrichedProduct` utilizado por la interfaz de URBAN_DROP.
 */
export function mapSupabaseRowToProduct(row: SupabaseRelationalProductRow): EnrichedProduct {
  const numPrice = typeof row.precio === 'number' ? row.precio : parseFloat(String(row.precio));

  const sortedImages = [...(row.producto_imagenes || [])]
    .sort((a, b) => a.orden - b.orden)
    .map((img) => img.url);

  const measurements: ProductMeasurements = {
    S: 'Pecho: 56cm | Largo: 68cm',
    M: 'Pecho: 59cm | Largo: 71cm',
    L: 'Pecho: 62cm | Largo: 74cm',
    XL: 'Pecho: 65cm | Largo: 77cm',
  };

  const availableSizes: Record<SizeKey, boolean> = {
    S: false,
    M: false,
    L: false,
    XL: false,
  };

  const hasAnySizeRow = Array.isArray(row.producto_tallas) && row.producto_tallas.length > 0;

  for (const t of row.producto_tallas || []) {
    if (t.talla in measurements) {
      measurements[t.talla] = t.medidas_cm;
      availableSizes[t.talla] = (t.stock_talla ?? 1) > 0;
    }
  }

  if (!hasAnySizeRow) {
    availableSizes.S = true;
    availableSizes.M = true;
    availableSizes.L = true;
    availableSizes.XL = true;
  }

  const sortedSpecs = [...(row.producto_especificaciones || [])]
    .sort((a, b) => a.orden - b.orden)
    .map((s) => s.descripcion);

  const baseSlug = (row.nombre || 'drop')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'drop';

  return {
    id: row.id,
    slug: row.slug && isValidProductSlug(row.slug) ? row.slug : `${baseSlug}-${row.id}`,
    name: row.nombre,
    price: `$${numPrice.toFixed(2)}`,
    numericPrice: numPrice,
    category: (row.categorias?.slug || 'hoodies') as ProductCategory,
    tag: row.etiqueta,
    fit: row.corte_fit,
    modelInfo: row.info_modelo,
    stockLeft: row.stock_disponible,
    active: row.activo !== false,
    images:
      sortedImages.length > 0
        ? sortedImages
        : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=700'],
    measurements,
    availableSizes,
    specs: sortedSpecs.length > 0 ? sortedSpecs : ['100% Algodón Streetwear Premium'],
  };
}

/**
 * Obtiene la configuración de canales sociales (WhatsApp e Instagram) desde Supabase.
 */
export async function fetchStoreConfigFromSupabase(): Promise<StoreConfig> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/configuracion_tienda?select=whatsapp_numero,instagram_activo,instagram_url&clave=eq.principal&limit=1`,
      {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: 'application/json',
        },
      }
    );
    if (!res.ok) return DEFAULT_STORE_CONFIG;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return DEFAULT_STORE_CONFIG;
    const row = rows[0];
    return {
      whatsappNumber: row.whatsapp_numero || DEFAULT_STORE_CONFIG.whatsappNumber,
      instagramEnabled: typeof row.instagram_activo === 'boolean' ? row.instagram_activo : true,
      instagramUrl: row.instagram_url || DEFAULT_STORE_CONFIG.instagramUrl,
    };
  } catch {
    return DEFAULT_STORE_CONFIG;
  }
}

const PRODUCT_RELATIONAL_SELECT = [
  'id',
  'nombre',
  'precio',
  'etiqueta',
  'corte_fit',
  'info_modelo',
  'stock_disponible',
  'activo',
  'orden',
  'categorias!inner(slug,nombre,icono)',
  'producto_imagenes(url,alt_text,orden)',
  'producto_tallas(talla,medidas_cm,stock_talla,orden)',
  'producto_especificaciones(descripcion,orden)',
].join(',');

const PRODUCT_RELATIONAL_SELECT_WITH_SLUG = `slug,${PRODUCT_RELATIONAL_SELECT}`;

/**
 * Obtiene el catálogo completo desde Supabase PostgreSQL en una sola consulta JOIN.
 * Si la columna `slug` aún no existe en la tabla, hace fallback transparente y genera slugs dinámicos.
 */
export async function fetchCatalogFromSupabase(): Promise<{
  products: EnrichedProduct[];
  storeConfig: StoreConfig;
  source: 'supabase' | 'fallback';
}> {
  const buildEndpoint = (selectCols: string) =>
    `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
      selectCols
    )}&activo=eq.true&order=orden.asc,id.desc`;

  try {
    const [initialProdRes, storeConfig] = await Promise.all([
      fetch(buildEndpoint(PRODUCT_RELATIONAL_SELECT_WITH_SLUG), {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: 'application/json',
        },
      }),
      fetchStoreConfigFromSupabase(),
    ]);

    let prodRes = initialProdRes;
    if (!prodRes.ok && prodRes.status === 400) {
      prodRes = await fetch(buildEndpoint(PRODUCT_RELATIONAL_SELECT), {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: 'application/json',
        },
      });
    }

    if (!prodRes.ok) {
      throw new Error(`Supabase HTTP ${prodRes.status}`);
    }

    const rows: SupabaseRelationalProductRow[] = await prodRes.json();
    if (!Array.isArray(rows)) {
      return {
        products: fallbackProducts.map((p) => ({ ...p, active: true })),
        storeConfig,
        source: 'fallback',
      };
    }

    return {
      products: rows.map(mapSupabaseRowToProduct),
      storeConfig,
      source: 'supabase',
    };
  } catch {
    return {
      products: fallbackProducts.map((p) => ({ ...p, active: true })),
      storeConfig: DEFAULT_STORE_CONFIG,
      source: 'fallback',
    };
  }
}

/**
 * Obtiene un producto individual por su `slug` desde Supabase PostgreSQL
 * junto con la configuración de tienda y productos relacionados.
 * Soporta tanto columna `slug` nativa en DB como slugs dinámicos `<nombre>-<id>`.
 */
export async function fetchProductBySlugFromSupabase(slug: string): Promise<{
  product: EnrichedProduct | null;
  relatedProducts: EnrichedProduct[];
  storeConfig: StoreConfig;
  source: 'supabase' | 'fallback';
}> {
  if (!isValidProductSlug(slug)) {
    return {
      product: null,
      relatedProducts: [],
      storeConfig: DEFAULT_STORE_CONFIG,
      source: 'supabase',
    };
  }

  const normalizedSlug = slug.trim().toLowerCase();
  const trailingIdMatch = normalizedSlug.match(/(?:^|-)(\d+)$/);
  const fallbackId = trailingIdMatch ? Number(trailingIdMatch[1]) : null;

  const bySlugEndpoint = `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
    PRODUCT_RELATIONAL_SELECT_WITH_SLUG
  )}&slug=eq.${encodeURIComponent(slug)}&limit=1`;

  const relatedBySlugEndpoint = `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
    PRODUCT_RELATIONAL_SELECT_WITH_SLUG
  )}&activo=eq.true&slug=neq.${encodeURIComponent(slug)}&order=orden.asc,id.desc&limit=4`;

  const headers = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Accept: 'application/json',
  };

  try {
    const [prodRes, relatedRes, storeConfig] = await Promise.all([
      fetch(bySlugEndpoint, { headers }),
      fetch(relatedBySlugEndpoint, { headers }),
      fetchStoreConfigFromSupabase(),
    ]);

    let rows: SupabaseRelationalProductRow[] = [];
    let usedIdFallback = false;

    if (prodRes.ok) {
      const parsed = await prodRes.json();
      if (Array.isArray(parsed)) rows = parsed;
    }

    // Fallback transparente por ID embebido si la columna `slug` no existe o no hubo coincidencia exacta
    if ((!prodRes.ok || rows.length === 0) && fallbackId && Number.isFinite(fallbackId)) {
      const byIdEndpoint = `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
        PRODUCT_RELATIONAL_SELECT
      )}&id=eq.${fallbackId}&limit=1`;
      const idRes = await fetch(byIdEndpoint, { headers });
      if (idRes.ok) {
        const idRows = await idRes.json();
        if (Array.isArray(idRows) && idRows.length > 0) {
          rows = idRows;
          usedIdFallback = true;
        }
      }
    } else if (!prodRes.ok && prodRes.status !== 400) {
      throw new Error(`Supabase HTTP ${prodRes.status}`);
    }

    if (rows.length === 0) {
      const fb = fallbackProducts.find((p) => p.slug === slug);
      if (fb) {
        const fbRelated = fallbackProducts
          .filter((p) => p.slug !== slug)
          .slice(0, 4)
          .map((p) => ({ ...p, active: true }));
        return {
          product: { ...fb, active: fb.active !== false },
          relatedProducts: fbRelated,
          storeConfig,
          source: 'fallback',
        };
      }
      return { product: null, relatedProducts: [], storeConfig, source: 'supabase' };
    }

    const product = mapSupabaseRowToProduct(rows[0]);
    let relatedProducts: EnrichedProduct[] = [];
    if (!usedIdFallback && relatedRes.ok) {
      const relRows: SupabaseRelationalProductRow[] = await relatedRes.json();
      if (Array.isArray(relRows)) {
        relatedProducts = relRows.map(mapSupabaseRowToProduct);
      }
    } else {
      const relByIdEndpoint = `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
        PRODUCT_RELATIONAL_SELECT
      )}&activo=eq.true&id=neq.${product.id}&order=orden.asc,id.desc&limit=4`;
      const relByIdRes = await fetch(relByIdEndpoint, { headers });
      if (relByIdRes.ok) {
        const relRows: SupabaseRelationalProductRow[] = await relByIdRes.json();
        if (Array.isArray(relRows)) {
          relatedProducts = relRows.map(mapSupabaseRowToProduct);
        }
      }
    }

    return {
      product,
      relatedProducts,
      storeConfig,
      source: 'supabase',
    };
  } catch {
    const fb = fallbackProducts.find((p) => p.slug === slug);
    if (fb) {
      return {
        product: { ...fb, active: fb.active !== false },
        relatedProducts: fallbackProducts
          .filter((p) => p.slug !== slug)
          .slice(0, 4)
          .map((p) => ({ ...p, active: true })),
        storeConfig: DEFAULT_STORE_CONFIG,
        source: 'fallback',
      };
    }
    return {
      product: null,
      relatedProducts: [],
      storeConfig: DEFAULT_STORE_CONFIG,
      source: 'fallback',
    };
  }
}
