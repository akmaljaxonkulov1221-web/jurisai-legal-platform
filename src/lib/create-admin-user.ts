// Create admin user script for Supabase
import { supabaseClient } from './supabase-client'

export async function createAdminUser() {
  const adminEmail = 'admin@jurisai.uz'
  const adminPassword = 'password123'
  const adminName = 'Admin User'

  console.log('Creating admin user...')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)

  try {
    // First, try to sign up the user
    const { data, error } = await supabaseClient.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: adminName,
          role: 'ADMIN'
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)
      
      // If user already exists, try to get the user
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('User already exists, trying to sign in...')
        
        const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        })
        
        if (signInError) {
          console.error('Sign in error:', signInError)
          return { success: false, error: signInError.message }
        }
        
        console.log('User signed in successfully:', signInData)
        return { success: true, data: signInData }
      }
      
      return { success: false, error: error.message }
    }

    console.log('User created successfully:', data)
    
    // If signup successful, try to sign in
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })
    
    if (signInError) {
      console.error('Sign in error after signup:', signInError)
      return { success: false, error: signInError.message }
    }
    
    console.log('User signed in successfully:', signInData)
    return { success: true, data: signInData }
    
  } catch (err) {
    console.error('Create admin user error:', err)
    return { success: false, error: String(err) }
  }
}

// Create test users
export async function createTestUsers() {
  const users = [
    { email: 'user@jurisai.uz', password: 'password123', name: 'Test User' },
    { email: 'demo@jurisai.uz', password: 'password123', name: 'Demo User' },
    { email: 'test@jurisai.uz', password: 'password123', name: 'Test Account' }
  ]

  const results = []

  for (const user of users) {
    console.log(`Creating user: ${user.email}`)
    
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: 'USER'
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log(`User ${user.email} already exists`)
          results.push({ email: user.email, status: 'exists' })
        } else {
          console.error(`Error creating ${user.email}:`, error)
          results.push({ email: user.email, status: 'error', error: error.message })
        }
      } else {
        console.log(`User ${user.email} created successfully`)
        results.push({ email: user.email, status: 'created', data })
      }
    } catch (err) {
      console.error(`Error creating ${user.email}:`, err)
      results.push({ email: user.email, status: 'error', error: String(err) })
    }
  }

  return results
}
