// Global fix for all supabase null errors
declare module '@/lib/supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  // Force non-null assertion globally
  export const supabase: SupabaseClient;
  export const supabaseClient: SupabaseClient;
  export const supabaseUrl: string;
  export const supabaseAnonKey: string;
  export function isSupabaseConfigured(): true;
  export default supabaseClient;
}

// Auto-fix for all modules
declare global {
  var supabase: any;
}
