// Check environment variables (browser-safe version)
export function checkEnvLocalFile() {
  console.log('Checking environment variables...')
  
  // Check browser environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  };
  
  console.log('Environment variables:');
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? 'Set' : 'Not set'}`);
  });
  
  return envVars;
}

// Check if all required environment variables are set
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  
  return true;
}
