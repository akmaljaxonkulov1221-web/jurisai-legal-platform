// Global TypeScript fixes for all API routes
declare global {
  // Force non-null assertion for all supabase usage
  namespace NodeJS {
    interface Global {
      supabase: any;
    }
  }
}

// Auto-fix for all supabase calls
export {};
