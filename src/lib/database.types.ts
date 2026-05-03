// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'USER' | 'ADMIN'
          subscription_plan: string | null
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'USER' | 'ADMIN'
          subscription_plan?: string | null
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'USER' | 'ADMIN'
          subscription_plan?: string | null
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_method: string
          check_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_method: string
          check_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          payment_method?: string
          check_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_usage: {
        Row: {
          id: string
          user_id: string
          service: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service: string
          tokens_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service?: string
          tokens_used?: number
          created_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
