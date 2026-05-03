import { createClient } from '@supabase/supabase-js'

// Environment variables - try localStorage first, then process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? localStorage.getItem('NEXT_PUBLIC_SUPABASE_URL') : null)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? localStorage.getItem('NEXT_PUBLIC_SUPABASE_ANON_KEY') : null)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (typeof window !== 'undefined' ? localStorage.getItem('SUPABASE_SERVICE_ROLE_KEY') : null)

// Fallback for development
const finalSupabaseUrl = supabaseUrl || 'https://your-project.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'your-anon-key'
const finalSupabaseServiceKey = supabaseServiceKey || 'your-service-key'

// Client-side Supabase instance
export const supabaseClient = createClient(
  finalSupabaseUrl,
  finalSupabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

// Server-side Supabase instance (for API routes)
export const supabaseServer = createClient(
  finalSupabaseUrl,
  finalSupabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

// Helper function to get current user (server-side)
export async function getCurrentUser() {
  const { data: { user }, error } = await supabaseServer.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

// Helper function to get current user session (server-side)
export async function getCurrentSession() {
  const { data: { session }, error } = await supabaseServer.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  return session
}

// Type definitions for our database
export interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  subscription_plan?: string
  subscription_expires_at?: string
  created_at: string
  updated_at: string
}

export interface AuthError {
  message: string
  code?: string
}

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    })

    if (error) {
      return { 
        success: false, 
        error: {
          message: this.getErrorMessage(error),
          code: 'AUTH_ERROR'
        } 
      }
    }

    return { success: true, data }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    console.log('=== AUTH HELPERS SIGN IN ===')
    console.log('Email:', email)
    console.log('Supabase URL:', finalSupabaseUrl)
    console.log('Supabase Key exists:', !!finalSupabaseAnonKey)
    console.log('Supabase Key length:', finalSupabaseAnonKey?.length)
    console.log('Environment URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Environment Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Supabase signIn result:')
      console.log('Data:', data)
      console.log('Error:', error)

      if (error) {
        console.error('Supabase auth error:', error)
        return { 
          success: false, 
          error: {
            message: this.getErrorMessage(error),
            code: 'AUTH_ERROR',
            originalError: error
          } 
        }
      }

      console.log('Sign in successful!')
      return { success: true, data }
    } catch (err) {
      console.error('Unexpected auth error:', err)
      return { 
        success: false, 
        error: {
          message: 'Unexpected error: ' + String(err),
          code: 'UNKNOWN_ERROR'
        } 
      }
    }
  },

  // Sign out
  async signOut() {
    const { error } = await supabaseClient.auth.signOut()
    
    if (error) {
      return { 
        success: false, 
        error: {
          message: this.getErrorMessage(error),
          code: 'AUTH_ERROR'
        } 
      }
    }

    return { success: true }
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return { 
        success: false, 
        error: {
          message: this.getErrorMessage(error),
          code: 'AUTH_ERROR'
        } 
      }
    }

    return { success: true }
  },

  // Update user profile
  async updateProfile(updates: Partial<User>) {
    const { data: userData } = await supabaseClient.auth.getUser()
    const userId = userData.user?.id
    
    if (!userId) {
      return { 
        success: false, 
        error: {
          message: 'Foydalanuvchi topilmadi',
          code: 'USER_NOT_FOUND'
        } 
      }
    }

    const { data, error } = await (supabaseClient as any)
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { 
        success: false, 
        error: {
          message: this.getErrorMessage(error),
          code: 'AUTH_ERROR'
        } 
      }
    }

    return { success: true, data }
  },

  // Get user-friendly error messages in Uzbek
  getErrorMessage(error: any): string {
    // Handle different error formats from Supabase
    const errorMessage = error?.message || error?.error_description || error.toString()
    
    // Common Supabase auth errors
    switch (errorMessage) {
      case 'Invalid login credentials':
        return 'Email yoki parol noto\'g\'ri. Iltimos, ma\'lumotlarni tekshirib qayta urinib ko\'ring.'
      case 'User already registered':
        return 'Bu email allaqachon ro\'yxatdan o\'tgan. Iltimos, boshqa emaildan foydalaning.'
      case 'Password should be at least 6 characters':
        return 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.'
      case 'Invalid email':
        return 'Email formati noto\'g\'ri. Iltimos, to\'g\'ri email manzilini kiriting.'
      case 'Too many requests':
        return 'Juda ko\'p so\'rov. Iltimos, birozdan so\'ng urinib ko\'ring (5 daqiqa).'
      case 'Email not confirmed':
        return 'Email tasdiqlanmagan. Iltimos, pochtangizni tekshiring va tasdiqlash tugmasini bosing.'
      case 'Signup disabled':
        return 'Ro\'yxatdan o\'ish vaqtincha o\'chirilgan. Iltimos, keyinroq urinib ko\'ring.'
      case 'Invalid password':
        return 'Parol noto\'g\'ri. Iltimos, to\'g\'ri parolni kiriting.'
      case 'User not found':
        return 'Foydalanuvchi topilmadi. Iltimos, ro\'yxatdan o\'tganingizni tekshiring.'
      case 'Weak password':
        return 'Parol juda oddiy. Iltimos, murakkabroq parol tanlang (harf, raqam va belgi).'
      case 'Email rate limit exceeded':
        return 'Email yuborish limiti oshdi. Iltimos, 15 daqiqadan so\'ng urinib ko\'ring.'
      case 'Phone number already registered':
        return 'Bu telefon raqami allaqachon ro\'yxatdan o\'tgan.'
      case 'Security check failed':
        return 'Xavfsizlik tekshiruvi muvaffaqiyatsiz. Iltimos, qayta urinib ko\'ring.'
      case 'New password should be different from old password':
        return 'Yangi parol eski paroldan farq qilishi kerak.'
      case 'Token has expired or is invalid':
        return 'Link muddati o\'tgan yoki noto\'g\'ri. Iltimos, parolni tiklashni qayta boshlang.'
      default:
        // If error contains specific keywords, return appropriate message
        if (errorMessage.toLowerCase().includes('invalid') && errorMessage.toLowerCase().includes('credential')) {
          return 'Email yoki parol noto\'g\'ri. Iltimos, ma\'lumotlarni tekshirib qayta urinib ko\'ring.'
        }
        if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
          return 'Internet aloqasi xatosi. Iltimos, aloqangizni tekshiring.'
        }
        if (errorMessage.toLowerCase().includes('timeout')) {
          return 'Server javob bermayapti. Iltimos, birozdan so\'ng urinib ko\'ring.'
        }
        
        return errorMessage || 'Noma\'lum xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
    }
  },
}

export default supabaseClient
