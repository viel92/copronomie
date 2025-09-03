// Types générés automatiquement par Supabase
// À remplacer par: supabase gen types typescript --project-id YOUR_PROJECT_ID

export interface Database {
  public: {
    Tables: {
      comparisons: {
        Row: {
          id: string
          user_id: string
          copropriete_id: string | null
          data: any // JSON
          files_count: number
          status: 'pending' | 'completed' | 'error'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          copropriete_id?: string | null
          data: any
          files_count: number
          status?: 'pending' | 'completed' | 'error'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          copropriete_id?: string | null
          data?: any
          files_count?: number
          status?: 'pending' | 'completed' | 'error'
          created_at?: string
          updated_at?: string | null
        }
      }
      coproprietes: {
        Row: {
          id: string
          user_id: string
          nom: string
          adresse: string | null
          nb_lots: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          adresse?: string | null
          nb_lots?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          adresse?: string | null
          nb_lots?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          nom: string
          siret: string | null
          specialites: string[]
          adresse: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          nom: string
          siret?: string | null
          specialites: string[]
          adresse?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          nom?: string
          siret?: string | null
          specialites?: string[]
          adresse?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          nom: string | null
          prenom: string | null
          role: 'admin' | 'syndic' | 'conseil_syndical'
          coproprietes: string[]
          created_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          nom?: string | null
          prenom?: string | null
          role: 'admin' | 'syndic' | 'conseil_syndical'
          coproprietes?: string[]
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          nom?: string | null
          prenom?: string | null
          role?: 'admin' | 'syndic' | 'conseil_syndical'
          coproprietes?: string[]
          created_at?: string
          last_login?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'syndic' | 'conseil_syndical'
      comparison_status: 'pending' | 'completed' | 'error'
    }
  }
}

// Types utilitaires
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]