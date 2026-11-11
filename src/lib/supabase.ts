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
  nombre: string;
  precio: number | string;
  etiqueta: string;
  corte_fit: string;
  info_modelo: string;
  stock_disponible: number;
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

  return {
    id: row.id,
    name: row.nombre,
    price: `$${numPrice.toFixed(2)}`,
    numericPrice: numPrice,
    category: (row.categorias?.slug || 'hoodies') as ProductCategory,
    tag: row.etiqueta,
    fit: row.corte_fit,
    modelInfo: row.info_modelo,
    stockLeft: row.stock_disponible,
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

/**
 * Obtiene el catálogo completo desde Supabase PostgreSQL en una sola consulta JOIN.
 */
export async function fetchCatalogFromSupabase(): Promise<{
  products: EnrichedProduct[];
  storeConfig: StoreConfig;
  source: 'supabase' | 'fallback';
}> {
  const selectQuery = [
    'id',
    'nombre',
    'precio',
    'etiqueta',
    'corte_fit',
    'info_modelo',
    'stock_disponible',
    'orden',
    'categorias!inner(slug,nombre,icono)',
    'producto_imagenes(url,alt_text,orden)',
    'producto_tallas(talla,medidas_cm,stock_talla,orden)',
    'producto_especificaciones(descripcion,orden)',
  ].join(',');

  const endpoint = `${SUPABASE_URL}/rest/v1/productos?select=${encodeURIComponent(
    selectQuery
  )}&activo=eq.true&order=orden.asc,id.desc`;

  try {
    const [prodRes, storeConfig] = await Promise.all([
      fetch(endpoint, {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: 'application/json',
        },
      }),
      fetchStoreConfigFromSupabase(),
    ]);

    if (!prodRes.ok) {
      throw new Error(`Supabase HTTP ${prodRes.status}`);
    }

    const rows: SupabaseRelationalProductRow[] = await prodRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return { products: fallbackProducts, storeConfig, source: 'fallback' };
    }

    return {
      products: rows.map(mapSupabaseRowToProduct),
      storeConfig,
      source: 'supabase',
    };
  } catch {
    return {
      products: fallbackProducts,
      storeConfig: DEFAULT_STORE_CONFIG,
      source: 'fallback',
    };
  }
}
