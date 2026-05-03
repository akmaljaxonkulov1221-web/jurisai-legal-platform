// Check environment variables
export function checkEnvironmentVariables() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }

  const issues = []

  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing')
  } else {
    issues.push(`✅ NEXT_PUBLIC_SUPABASE_URL: ${env.NEXT_PUBLIC_SUPABASE_URL}`)
  }

  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
  } else {
    const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (key.startsWith('sb_publishable_')) {
      issues.push(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key.substring(0, 20)}...`)
    } else {
      issues.push(`⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY format may be incorrect`)
    }
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    issues.push('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing (optional)')
  } else {
    issues.push(`✅ SUPABASE_SERVICE_ROLE_KEY: ${env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`)
  }

  if (!env.NEXTAUTH_SECRET) {
    issues.push('⚠️ NEXTAUTH_SECRET is missing (optional for Supabase)')
  } else {
    issues.push(`✅ NEXTAUTH_SECRET: ${env.NEXTAUTH_SECRET.substring(0, 10)}...`)
  }

  if (!env.NEXTAUTH_URL) {
    issues.push('⚠️ NEXTAUTH_URL is missing (optional for Supabase)')
  } else {
    issues.push(`✅ NEXTAUTH_URL: ${env.NEXTAUTH_URL}`)
  }

  if (!env.OPENAI_API_KEY) {
    issues.push('⚠️ OPENAI_API_KEY is missing (AI features will not work)')
  } else {
    issues.push(`✅ OPENAI_API_KEY: ${env.OPENAI_API_KEY.substring(0, 10)}...`)
  }

  return {
    env,
    issues,
    isConfigured: env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}

// Check if Supabase is accessible
export async function checkSupabaseAccess() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
      }
    })

    if (response.ok) {
      return { success: true, status: response.status }
    } else {
      return { success: false, status: response.status, error: response.statusText }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
