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
      api_usage_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          metadata: Json | null
          method: string
          provider: string
          request_size: number | null
          response_size: number | null
          response_time_ms: number | null
          status_code: number | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          method?: string
          provider?: string
          request_size?: number | null
          response_size?: number | null
          response_time_ms?: number | null
          status_code?: number | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          method?: string
          provider?: string
          request_size?: number | null
          response_size?: number | null
          response_time_ms?: number | null
          status_code?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          operation: string
          record_id: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          operation: string
          record_id?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          operation?: string
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      ingest_state: {
        Row: {
          last_cursor: string | null
          last_error: string | null
          last_item_ts: string | null
          last_run_at: string | null
          source: string
        }
        Insert: {
          last_cursor?: string | null
          last_error?: string | null
          last_item_ts?: string | null
          last_run_at?: string | null
          source: string
        }
        Update: {
          last_cursor?: string | null
          last_error?: string | null
          last_item_ts?: string | null
          last_run_at?: string | null
          source?: string
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
      oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: string
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string
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
      rate_limits: {
        Row: {
          action: string
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action?: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      realtyna_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          principal_id: string | null
          principal_type: string
          refresh_token: string | null
          scope: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          principal_id?: string | null
          principal_type: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          principal_id?: string | null
          principal_type?: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_requests: number
          p_window_minutes: number
        }
        Returns: boolean
      }
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
      log_data_access: {
        Args: {
          p_ip_address?: unknown
          p_metadata?: Json
          p_operation: string
          p_record_id?: string
          p_table_name: string
          p_user_agent?: string
        }
        Returns: undefined
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
