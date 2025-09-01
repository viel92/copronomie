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
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          organization_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          copropriete_id: string
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          organization_id: string
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          copropriete_id: string
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          organization_id: string
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          copropriete_id?: string
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_copropriete_id_fkey"
            columns: ["copropriete_id"]
            isOneToOne: false
            referencedRelation: "coproprietes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      coproprietes: {
        Row: {
          address: string | null
          budget_annual: number | null
          city: string | null
          created_at: string | null
          id: string
          lots_count: number | null
          metadata: Json | null
          name: string
          organization_id: string
          postal_code: string | null
          syndic_email: string | null
          syndic_name: string | null
          syndic_phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          budget_annual?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          lots_count?: number | null
          metadata?: Json | null
          name: string
          organization_id: string
          postal_code?: string | null
          syndic_email?: string | null
          syndic_name?: string | null
          syndic_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          budget_annual?: number | null
          city?: string | null
          created_at?: string | null
          id?: string
          lots_count?: number | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          postal_code?: string | null
          syndic_email?: string | null
          syndic_name?: string | null
          syndic_phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coproprietes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: {
          amount_ht: number
          amount_ttc: number
          analysis_data: Json | null
          company_address: string | null
          company_email: string | null
          company_name: string
          company_phone: string | null
          company_siret: string | null
          consultation_id: string
          created_at: string | null
          delivery_time: string | null
          file_url: string | null
          id: string
          notes: string | null
          reference_number: string | null
          score: number | null
          status: string | null
          updated_at: string | null
          validity_period: string | null
          vat_rate: number | null
        }
        Insert: {
          amount_ht: number
          amount_ttc: number
          analysis_data?: Json | null
          company_address?: string | null
          company_email?: string | null
          company_name: string
          company_phone?: string | null
          company_siret?: string | null
          consultation_id: string
          created_at?: string | null
          delivery_time?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          validity_period?: string | null
          vat_rate?: number | null
        }
        Update: {
          amount_ht?: number
          amount_ttc?: number
          analysis_data?: Json | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          company_phone?: string | null
          company_siret?: string | null
          consultation_id?: string
          created_at?: string | null
          delivery_time?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          validity_period?: string | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      devis_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          devis_id: string
          id: string
          included: boolean | null
          quantity: number | null
          total_price: number | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          devis_id: string
          id?: string
          included?: boolean | null
          quantity?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          devis_id?: string
          id?: string
          included?: boolean | null
          quantity?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_items_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          organization_id: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          organization_id: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          organization_id?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          max_devis: number | null
          name: string
          plan: string | null
          settings: Json | null
          slug: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_devis?: number | null
          name: string
          plan?: string | null
          settings?: Json | null
          slug: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_devis?: number | null
          name?: string
          plan?: string | null
          settings?: Json | null
          slug?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action: string
          cost_tokens: number | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          organization_id: string
        }
        Insert: {
          action: string
          cost_tokens?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          organization_id: string
        }
        Update: {
          action?: string
          cost_tokens?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
