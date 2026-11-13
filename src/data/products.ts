// =============================================================================
// MODELO DE DATOS Y CATÁLOGO — URBAN_DROP (TypeScript Estricto)
// =============================================================================

export type SizeKey = 'S' | 'M' | 'L' | 'XL';
export type ProductCategory = 'hoodies' | 'pantalones' | 't-shirts' | 'chaquetas';

export interface ProductMeasurements {
  S: string;
  M: string;
  L: string;
  XL: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  numericPrice: number;
  category: ProductCategory;
  tag: string;
  fit: string;
  modelInfo: string;
  stockLeft: number;
  active?: boolean;
  images: string[];
  measurements: ProductMeasurements;
  specs: string[];
}

export interface CategoryOption {
  id: 'todos' | ProductCategory;
  label: string;
  icon: string;
}

export const categories: CategoryOption[] = [
  { id: 'todos', label: 'Todos', icon: 'fa-border-all' },
  { id: 'hoodies', label: 'Hoodies', icon: 'fa-shirt' },
  { id: 'pantalones', label: 'Pantalones', icon: 'fa-Lines-leaning' },
  { id: 't-shirts', label: 'T-Shirts', icon: 'fa-bolt' },
  { id: 'chaquetas', label: 'Chaquetas', icon: 'fa-vest-patches' },
];

export const sizes: readonly SizeKey[] = ['S', 'M', 'L', 'XL'] as const;

export const WHATSAPP_PHONE = '5215500000000';
export const INSTAGRAM_HANDLE = 'urbandrop.official';

export const products: Product[] = [
  {
    id: 1,
    slug: "oversized-street-hoodie-7f3a91c2",
    name: "Oversized Street Hoodie",
    price: "$42.00",
    numericPrice: 42,
    category: "hoodies",
    tag: "Colección Drop #04",
    fit: "Oversized Boxy",
    modelInfo: "1.78m — Usa Talla L",
    stockLeft: 4,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 56cm | Largo: 68cm',
      M: 'Pecho: 59cm | Largo: 71cm',
      L: 'Pecho: 62cm | Largo: 74cm',
      XL: 'Pecho: 65cm | Largo: 77cm'
    },
    specs: [
      "100% Algodón Peinado Pesado (320 GSM)",
      "Capucha doble felpa con caída estructurada",
      "Corte Boxy Streetwear de hombro caído"
    ]
  },
  {
    id: 2,
    slug: "jeans-cargo-wide-leg-4b8e20d5",
    name: "Jeans Cargo Wide Leg",
    price: "$55.00",
    numericPrice: 55,
    category: "pantalones",
    tag: "Tendencia Viral",
    fit: "Wide Leg Loose",
    modelInfo: "1.82m — Usa Talla L",
    stockLeft: 3,
    images: [
      "https://images.unsplash.com/photo-1542272604-780c36856d66?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Cintura: 78cm | Largo: 104cm',
      M: 'Cintura: 82cm | Largo: 106cm',
      L: 'Cintura: 88cm | Largo: 108cm',
      XL: 'Cintura: 94cm | Largo: 110cm'
    },
    specs: [
      "Mezclilla rígida 14 oz de alta durabilidad",
      "6 bolsillos funcionales cargo con broche",
      "Lavado Vintage Acid Wash resistente"
    ]
  },
  {
    id: 3,
    slug: "graphic-boxy-tee-cyber-9c1d44e7",
    name: "Graphic Boxy Tee Cyber",
    price: "$28.00",
    numericPrice: 28,
    category: "t-shirts",
    tag: "Edición Limitada",
    fit: "Boxy Heavyweight",
    modelInfo: "1.74m — Usa Talla M",
    stockLeft: 5,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 52cm | Largo: 66cm',
      M: 'Pecho: 55cm | Largo: 69cm',
      L: 'Pecho: 58cm | Largo: 72cm',
      XL: 'Pecho: 61cm | Largo: 75cm'
    },
    specs: [
      "100% Algodón Premium 240 GSM",
      "Estampado frontal y posterior Tacto Cero",
      "Cuello acanalado reforzado de 2.5cm"
    ]
  },
  {
    id: 4,
    slug: "bomber-techwear-parachute-2e6f83a1",
    name: "Bomber Techwear Parachute",
    price: "$68.00",
    numericPrice: 68,
    category: "chaquetas",
    tag: "Drop Exclusivo",
    fit: "Cropped Boxy Fit",
    modelInfo: "1.80m — Usa Talla L",
    stockLeft: 2,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 58cm | Largo: 64cm',
      M: 'Pecho: 61cm | Largo: 66cm',
      L: 'Pecho: 64cm | Largo: 69cm',
      XL: 'Pecho: 67cm | Largo: 72cm'
    },
    specs: [
      "Nylon Ripstop repelente al agua (DWR)",
      "Cierres metálicos YKK de doble vía y bolsillo utility",
      "Forro térmico ligero acolchado en diamante"
    ]
  },
  {
    id: 5,
    slug: "zip-up-hoodie-acid-wash-5a7c19b4",
    name: "Zip-Up Hoodie Acid Wash",
    price: "$48.00",
    numericPrice: 48,
    category: "hoodies",
    tag: "Restock Limitado",
    fit: "Drop Shoulder Boxy",
    modelInfo: "1.81m — Usa Talla L",
    stockLeft: 4,
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 57cm | Largo: 67cm',
      M: 'Pecho: 60cm | Largo: 70cm',
      L: 'Pecho: 63cm | Largo: 73cm',
      XL: 'Pecho: 66cm | Largo: 76cm'
    },
    specs: [
      "French Terry 350 GSM con lavado mineral artesanal",
      "Cierre metálico frontal completo de alta resistencia",
      "Costuras expuestas overlock de estética industrial"
    ]
  },
  {
    id: 6,
    slug: "parachute-nylon-track-pants-8d3e52f0",
    name: "Parachute Nylon Track Pants",
    price: "$52.00",
    numericPrice: 52,
    category: "pantalones",
    tag: "Street Utility",
    fit: "Baggy Ajustable",
    modelInfo: "1.79m — Usa Talla M",
    stockLeft: 6,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1542272604-780c36856d66?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Cintura: 74-82cm | Largo: 103cm',
      M: 'Cintura: 80-88cm | Largo: 105cm',
      L: 'Cintura: 86-94cm | Largo: 107cm',
      XL: 'Cintura: 92-100cm | Largo: 109cm'
    },
    specs: [
      "Tejido técnico ultraligero con pinzas articuladas en rodilla",
      "Stoppers elásticos en cintura y tobillos para silueta 2 en 1",
      "Secado rápido y bolsillos laterales de gran capacidad"
    ]
  },
  {
    id: 7,
    slug: "washed-vintage-heavy-tee-1f9b64c8",
    name: "Washed Vintage Heavy Tee",
    price: "$32.00",
    numericPrice: 32,
    category: "t-shirts",
    tag: "Essential Drop",
    fit: "Oversized Drop",
    modelInfo: "1.75m — Usa Talla M",
    stockLeft: 5,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 54cm | Largo: 68cm',
      M: 'Pecho: 57cm | Largo: 71cm',
      L: 'Pecho: 60cm | Largo: 74cm',
      XL: 'Pecho: 63cm | Largo: 77cm'
    },
    specs: [
      "Algodón Jersey 260 GSM con proceso Enzyme Stone Wash",
      "Acabado desgastado único en cada pieza",
      "Pre-encogida para mantener el fit tras cada lavado"
    ]
  },
  {
    id: 8,
    slug: "chaqueta-denim-distressed-6c4a08e3",
    name: "Chaqueta Denim Distressed",
    price: "$64.00",
    numericPrice: 64,
    category: "chaquetas",
    tag: "Edición Numerada",
    fit: "Relaxed Trucker",
    modelInfo: "1.76m — Usa Talla M",
    stockLeft: 3,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=700",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=700"
    ],
    measurements: {
      S: 'Pecho: 56cm | Largo: 63cm',
      M: 'Pecho: 59cm | Largo: 65cm',
      L: 'Pecho: 62cm | Largo: 68cm',
      XL: 'Pecho: 65cm | Largo: 70cm'
    },
    specs: [
      "Denim 13.5 oz 100% algodón con desgaste artesanal",
      "Botones de acero pavonado grabados a láser",
      "Bolsillos internos profundos y ajuste lateral en cintura"
    ]
  }
];
