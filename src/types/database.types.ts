export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      categorias: {
        Row: {
          activo: boolean;
          created_at: string;
          icono: string;
          id: number;
          nombre: string;
          orden: number;
          slug: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          icono?: string;
          id?: never;
          nombre: string;
          orden?: number;
          slug: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          icono?: string;
          id?: never;
          nombre?: string;
          orden?: number;
          slug?: string;
        };
        Relationships: [];
      };
      producto_especificaciones: {
        Row: {
          created_at: string;
          descripcion: string;
          id: number;
          orden: number;
          producto_id: number;
        };
        Insert: {
          created_at?: string;
          descripcion: string;
          id?: never;
          orden?: number;
          producto_id: number;
        };
        Update: {
          created_at?: string;
          descripcion?: string;
          id?: never;
          orden?: number;
          producto_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "producto_especificaciones_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          }
        ];
      };
      producto_imagenes: {
        Row: {
          alt_text: string | null;
          created_at: string;
          id: number;
          orden: number;
          producto_id: number;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          id?: never;
          orden?: number;
          producto_id: number;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          id?: never;
          orden?: number;
          producto_id?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "producto_imagenes_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          }
        ];
      };
      producto_tallas: {
        Row: {
          created_at: string;
          id: number;
          medidas_cm: string;
          orden: number;
          producto_id: number;
          stock_talla: number;
          talla: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          medidas_cm: string;
          orden?: number;
          producto_id: number;
          stock_talla?: number;
          talla: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          medidas_cm?: string;
          orden?: number;
          producto_id?: number;
          stock_talla?: number;
          talla?: string;
        };
        Relationships: [
          {
            foreignKeyName: "producto_tallas_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          }
        ];
      };
      productos: {
        Row: {
          activo: boolean;
          categoria_id: number;
          corte_fit: string;
          created_at: string;
          etiqueta: string;
          id: number;
          info_modelo: string;
          nombre: string;
          orden: number;
          precio: number;
          slug: string;
          stock_disponible: number;
        };
        Insert: {
          activo?: boolean;
          categoria_id: number;
          corte_fit: string;
          created_at?: string;
          etiqueta: string;
          id?: never;
          info_modelo: string;
          nombre: string;
          orden?: number;
          precio: number;
          slug?: string;
          stock_disponible?: number;
        };
        Update: {
          activo?: boolean;
          categoria_id?: number;
          corte_fit?: string;
          created_at?: string;
          etiqueta?: string;
          id?: never;
          info_modelo?: string;
          nombre?: string;
          orden?: number;
          precio?: number;
          slug?: string;
          stock_disponible?: number;
        };
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
