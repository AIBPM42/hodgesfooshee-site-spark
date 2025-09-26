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
        Relationships: []
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
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json | null
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
          bathrooms_total_integer: number | null
          bedrooms_total: number | null
          city: string | null
          created_at: string | null
          id: number
          list_price: number | null
          listing_id: string | null
          listing_key: string
          living_area: number | null
          modification_timestamp: string | null
          rf_modification_timestamp: string | null
          standard_status: string | null
          updated_at: string | null
        }
        Insert: {
          bathrooms_total_integer?: number | null
          bedrooms_total?: number | null
          city?: string | null
          created_at?: string | null
          id?: number
          list_price?: number | null
          listing_id?: string | null
          listing_key: string
          living_area?: number | null
          modification_timestamp?: string | null
          rf_modification_timestamp?: string | null
          standard_status?: string | null
          updated_at?: string | null
        }
        Update: {
          bathrooms_total_integer?: number | null
          bedrooms_total?: number | null
          city?: string | null
          created_at?: string | null
          id?: number
          list_price?: number | null
          listing_id?: string | null
          listing_key?: string
          living_area?: number | null
          modification_timestamp?: string | null
          rf_modification_timestamp?: string | null
          standard_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mls_members: {
        Row: {
          created_at: string | null
          id: number
          member_email: string | null
          member_first_name: string | null
          member_full_name: string | null
          member_id: string | null
          member_key: string
          member_last_name: string | null
          member_login_id: string | null
          member_mobile_phone: string | null
          member_phone: string | null
          member_status: string | null
          member_type: string | null
          modification_timestamp: string | null
          office_key: string | null
          office_name: string | null
          rf_modification_timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          member_email?: string | null
          member_first_name?: string | null
          member_full_name?: string | null
          member_id?: string | null
          member_key: string
          member_last_name?: string | null
          member_login_id?: string | null
          member_mobile_phone?: string | null
          member_phone?: string | null
          member_status?: string | null
          member_type?: string | null
          modification_timestamp?: string | null
          office_key?: string | null
          office_name?: string | null
          rf_modification_timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          member_email?: string | null
          member_first_name?: string | null
          member_full_name?: string | null
          member_id?: string | null
          member_key?: string
          member_last_name?: string | null
          member_login_id?: string | null
          member_mobile_phone?: string | null
          member_phone?: string | null
          member_status?: string | null
          member_type?: string | null
          modification_timestamp?: string | null
          office_key?: string | null
          office_name?: string | null
          rf_modification_timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mls_offices: {
        Row: {
          created_at: string | null
          id: number
          modification_timestamp: string | null
          office_address1: string | null
          office_city: string | null
          office_country: string | null
          office_email: string | null
          office_id: string | null
          office_key: string
          office_name: string | null
          office_phone: string | null
          office_postal_code: string | null
          office_state_or_province: string | null
          office_status: string | null
          rf_modification_timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          modification_timestamp?: string | null
          office_address1?: string | null
          office_city?: string | null
          office_country?: string | null
          office_email?: string | null
          office_id?: string | null
          office_key: string
          office_name?: string | null
          office_phone?: string | null
          office_postal_code?: string | null
          office_state_or_province?: string | null
          office_status?: string | null
          rf_modification_timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          modification_timestamp?: string | null
          office_address1?: string | null
          office_city?: string | null
          office_country?: string | null
          office_email?: string | null
          office_id?: string | null
          office_key?: string
          office_name?: string | null
          office_phone?: string | null
          office_postal_code?: string | null
          office_state_or_province?: string | null
          office_status?: string | null
          rf_modification_timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mls_open_houses: {
        Row: {
          created_at: string | null
          id: number
          listing_key: string | null
          modification_timestamp: string | null
          open_house_date: string | null
          open_house_end_time: string | null
          open_house_id: string | null
          open_house_key: string
          open_house_remarks: string | null
          open_house_start_time: string | null
          rf_modification_timestamp: string | null
          showing_agent_first_name: string | null
          showing_agent_key: string | null
          showing_agent_last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          listing_key?: string | null
          modification_timestamp?: string | null
          open_house_date?: string | null
          open_house_end_time?: string | null
          open_house_id?: string | null
          open_house_key: string
          open_house_remarks?: string | null
          open_house_start_time?: string | null
          rf_modification_timestamp?: string | null
          showing_agent_first_name?: string | null
          showing_agent_key?: string | null
          showing_agent_last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          listing_key?: string | null
          modification_timestamp?: string | null
          open_house_date?: string | null
          open_house_end_time?: string | null
          open_house_id?: string | null
          open_house_key?: string
          open_house_remarks?: string | null
          open_house_start_time?: string | null
          rf_modification_timestamp?: string | null
          showing_agent_first_name?: string | null
          showing_agent_key?: string | null
          showing_agent_last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mls_postal_codes: {
        Row: {
          city: string | null
          country: string | null
          county_or_parish: string | null
          created_at: string | null
          id: number
          modification_timestamp: string | null
          postal_code: string | null
          postal_code_key: string
          postal_code_plus4: string | null
          rf_modification_timestamp: string | null
          state_or_province: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          county_or_parish?: string | null
          created_at?: string | null
          id?: never
          modification_timestamp?: string | null
          postal_code?: string | null
          postal_code_key: string
          postal_code_plus4?: string | null
          rf_modification_timestamp?: string | null
          state_or_province?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          county_or_parish?: string | null
          created_at?: string | null
          id?: never
          modification_timestamp?: string | null
          postal_code?: string | null
          postal_code_key?: string
          postal_code_plus4?: string | null
          rf_modification_timestamp?: string | null
          state_or_province?: string | null
          updated_at?: string | null
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
          token_type: string | null
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
          token_type?: string | null
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
          token_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_log: {
        Row: {
          completed_at: string | null
          error_message: string | null
          function_name: string
          id: string
          metadata: Json | null
          records_processed: number | null
          started_at: string | null
          success: boolean | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          function_name: string
          id?: string
          metadata?: Json | null
          records_processed?: number | null
          started_at?: string | null
          success?: boolean | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          function_name?: string
          id?: string
          metadata?: Json | null
          records_processed?: number | null
          started_at?: string | null
          success?: boolean | null
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
      [_ in never]: never
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
      get_sync_counts: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
