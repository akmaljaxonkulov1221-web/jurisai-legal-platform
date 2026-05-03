// Test auth functions to debug login issues
import { supabaseClient, authHelpers } from './supabase-client'

// Test function to check Supabase connection
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabaseClient.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful')
    return { success: true }
  } catch (err) {
    console.error('Supabase test error:', err)
    return { success: false, error: String(err) }
  }
}

// Test login with specific credentials
export async function testLogin(email: string, password: string) {
  console.log(`Testing login for: ${email}`)
  
  try {
    // Direct Supabase auth test
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    
    console.log('Direct Supabase result:', { data, error })
    
    if (error) {
      console.error('Direct Supabase error:', error)
      return { success: false, error: error.message, details: error }
    }
    
    console.log('Direct Supabase login successful')
    return { success: true, data }
  } catch (err) {
    console.error('Direct login test error:', err)
    return { success: false, error: String(err) }
  }
}

// Test auth helper function
export async function testAuthHelper(email: string, password: string) {
  console.log(`Testing auth helper for: ${email}`)
  
  try {
    const result = await authHelpers.signIn(email, password)
    
    console.log('Auth helper result:', result)
    
    return result
  } catch (err) {
    console.error('Auth helper test error:', err)
    return { success: false, error: String(err) }
  }
}

// Test user creation (if needed)
export async function createTestUser() {
  console.log('Creating test user...')
  
  try {
    const testEmail = 'admin@jurisai.uz'
    const testPassword = 'password123'
    
    // Try to sign up
    const { data, error } = await supabaseClient.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Admin User',
        },
      },
    })
    
    console.log('Sign up result:', { data, error })
    
    if (error) {
      // User might already exist, try to login
      console.log('User might already exist, trying login...')
      return await testLogin(testEmail, testPassword)
    }
    
    console.log('Test user created successfully')
    return { success: true, data }
  } catch (err) {
    console.error('Create test user error:', err)
    return { success: false, error: String(err) }
  }
}

// Run all tests
export async function runAllTests() {
  console.log('=== AUTH DEBUG TESTS ===')
  
  const results = {
    connection: await testSupabaseConnection(),
    testUser: await createTestUser(),
    directLogin: await testLogin('admin@jurisai.uz', 'password123'),
    authHelper: await testAuthHelper('admin@jurisai.uz', 'password123'),
  }
  
  console.log('=== TEST RESULTS ===')
  console.log(JSON.stringify(results, null, 2))
  
  return results
}
