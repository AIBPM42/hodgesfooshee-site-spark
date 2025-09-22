export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          county: string | null
          enabled: boolean | null
          lat: number | null
          lng: number | null
          name: string
          slug: string
          sort_order: number | null
          state: string | null
        }
        Insert: {
          county?: string | null
          enabled?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          slug: string
          sort_order?: number | null
          state?: string | null
        }
        Update: {
          county?: string | null
          enabled?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          slug?: string
          sort_order?: number | null
          state?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          payload: Json | null
          updated_at: string | null
        }
        Insert: {
          enabled?: boolean
          key: string
          payload?: Json | null
          updated_at?: string | null
        }
        Update: {
          enabled?: boolean
          key?: string
          payload?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_listings: {
        Row: {
          listing_id: string
          rank: number | null
          tag: string | null
        }
        Insert: {
          listing_id: string
          rank?: number | null
          tag?: string | null
        }
        Update: {
          listing_id?: string
          rank?: number | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "mls_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "public_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_links: {
        Row: {
          created_at: string | null
          id: string
          label: string
          order_index: number | null
          section: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          order_index?: number | null
          section: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          order_index?: number | null
          section?: string
          url?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      mls_listings: {
        Row: {
          address: string | null
          baths: number | null
          beds: number | null
          city: string | null
          county: string | null
          created_at: string | null
          id: string
          lat: number | null
          lng: number | null
          mls_id: string
          photos: Json | null
          price: number | null
          property_type: string | null
          remarks: string | null
          source_updated_at: string | null
          sqft: number | null
          state: string | null
          status: string | null
          sv: unknown | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          mls_id: string
          photos?: Json | null
          price?: number | null
          property_type?: string | null
          remarks?: string | null
          source_updated_at?: string | null
          sqft?: number | null
          state?: string | null
          status?: string | null
          sv?: unknown | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          mls_id?: string
          photos?: Json | null
          price?: number | null
          property_type?: string | null
          remarks?: string | null
          source_updated_at?: string | null
          sqft?: number | null
          state?: string | null
          status?: string | null
          sv?: unknown | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      mls_raw_listings: {
        Row: {
          created_at: string
          id: string
          ingested_at: string
          mls_id: string
          payload: Json
        }
        Insert: {
          created_at?: string
          id?: string
          ingested_at?: string
          mls_id: string
          payload: Json
        }
        Update: {
          created_at?: string
          id?: string
          ingested_at?: string
          mls_id?: string
          payload?: Json
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          id: string
          is_enabled: boolean | null
          kind: string
          order_index: number | null
          page: string
          payload: Json
          slot: string
          state: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          is_enabled?: boolean | null
          kind: string
          order_index?: number | null
          page: string
          payload: Json
          slot: string
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          is_enabled?: boolean | null
          kind?: string
          order_index?: number | null
          page?: string
          payload?: Json
          slot?: string
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          content_md: string | null
          cover_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content_md?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content_md?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_tokens: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_listings: {
        Row: {
          address: string | null
          baths: number | null
          beds: number | null
          city: string | null
          county: string | null
          id: string | null
          mls_id: string | null
          photos: Json | null
          price: number | null
          property_type: string | null
          source_updated_at: string | null
          sqft: number | null
          state: string | null
          status: string | null
          thumb: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          county?: string | null
          id?: string | null
          mls_id?: string | null
          photos?: Json | null
          price?: number | null
          property_type?: string | null
          source_updated_at?: string | null
          sqft?: number | null
          state?: string | null
          status?: string | null
          thumb?: never
          zip?: string | null
        }
        Update: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          county?: string | null
          id?: string | null
          mls_id?: string | null
          photos?: Json | null
          price?: number | null
          property_type?: string | null
          source_updated_at?: string | null
          sqft?: number | null
          state?: string | null
          status?: string | null
          thumb?: never
          zip?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      populate_cities_from_mls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_listings: {
        Args: {
          filter_city?: string
          max_baths?: number
          max_beds?: number
          max_price?: number
          min_baths?: number
          min_beds?: number
          min_price?: number
          page_limit?: number
          page_offset?: number
          search_query?: string
          sort_by?: string
        }
        Returns: {
          address: string
          baths: number
          beds: number
          city: string
          county: string
          id: string
          mls_id: string
          photos: Json
          price: number
          property_type: string
          sqft: number
          state: string
          thumb: string
          total_count: number
          zip: string
        }[]
      }
      transform_mls_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "agent", "viewer"],
    },
  },
} as const
