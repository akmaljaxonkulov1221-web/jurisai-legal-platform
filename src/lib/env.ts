// Environment configuration
export const config = {
  // App configuration
  app: {
    name: 'JurisAI',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    description: 'AI-powered legal platform for Uzbekistan'
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    maxTokens: 4000
  },
  
  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    sessionMaxAge: 60 * 60 * 24 * 7 // 7 days
  },
  
  // Development mode
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
}

// Helper function to check if all required env vars are set
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }
  
  return true
}

export default config
