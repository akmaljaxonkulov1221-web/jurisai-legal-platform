// Check environment variables (browser-safe version)
export function checkEnvLocalFile() {
  console.log('Checking environment variables...')
  
  // Check browser environment variables
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  };
  
  console.log('Environment variables:');
  Object.entries(envVars).forEach(([key, value]) => {
    const maskedValue = value ? `${key.includes('KEY') || key.includes('SECRET') ? '***' + value.slice(-4) : value}` : 'Not set';
    console.log(`${key}: ${maskedValue}`);
  });
  
  return envVars;
}

// Check if all required environment variables are set
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const optional = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'OPENAI_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  const missingOptional = optional.filter(key => !process.env[key]);
  
  const result = {
    isValid: missing.length === 0,
    required: {
      set: required.filter(key => process.env[key]),
      missing: missing
    },
    optional: {
      set: optional.filter(key => process.env[key]),
      missing: missingOptional
    }
  };
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  }
  
  if (missingOptional.length > 0) {
    console.warn('Missing optional environment variables:', missingOptional);
  }
  
  return result;
}

// Check runtime environment
export function checkRuntimeEnvironment() {
  const isBrowser = typeof window !== 'undefined';
  const isServer = typeof window === 'undefined';
  
  const runtime = {
    isBrowser,
    isServer,
    userAgent: isBrowser ? navigator.userAgent : 'Server',
    platform: isBrowser ? navigator.platform : 'Server',
    language: isBrowser ? navigator.language : 'en-US'
  };
  
  console.log('Runtime Environment:', runtime);
  return runtime;
}

// Validate Supabase configuration
export function validateSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const validation = {
    url: {
      isSet: !!supabaseUrl,
      isValid: supabaseUrl ? supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co') : false,
      value: supabaseUrl || null
    },
    anonKey: {
      isSet: !!supabaseAnonKey,
      isValid: supabaseAnonKey ? supabaseAnonKey.startsWith('eyJ') && supabaseAnonKey.length > 100 : false,
      value: supabaseAnonKey ? supabaseAnonKey.slice(0, 20) + '...' : null
    }
  };
  
  const isValid = validation.url.isValid && validation.anonKey.isValid;
  
  console.log('Supabase Configuration:', {
    url: validation.url,
    anonKey: { ...validation.anonKey, value: validation.anonKey.value },
    isValid
  });
  
  return { ...validation, isValid };
}

// Test environment connectivity (browser-safe)
export async function testEnvironmentConnectivity() {
  const results = {
    supabase: { status: 'pending' as 'pending' | 'success' | 'error', error: null as string | null },
    api: { status: 'pending' as 'pending' | 'success' | 'error', error: null as string | null }
  };
  
  // Test Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Content-Type': 'application/json'
        }
      });
      
      results.supabase.status = response.ok ? 'success' : 'error';
      if (!response.ok) {
        results.supabase.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } else {
      results.supabase.status = 'error';
      results.supabase.error = 'Supabase URL not configured';
    }
  } catch (error) {
    results.supabase.status = 'error';
    results.supabase.error = String(error);
  }
  
  // Test API connectivity
  try {
    const response = await fetch('/api/health', {
      method: 'GET'
    });
    
    results.api.status = response.ok ? 'success' : 'error';
    if (!response.ok) {
      results.api.error = `HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (error) {
    results.api.status = 'error';
    results.api.error = String(error);
  }
  
  console.log('Environment Connectivity Test:', results);
  return results;
}

// Comprehensive environment check
export async function performFullEnvironmentCheck() {
  console.log('🔍 Performing full environment check...');
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: checkEnvLocalFile(),
    validation: validateEnvironment(),
    runtime: checkRuntimeEnvironment(),
    supabase: validateSupabaseConfig(),
    connectivity: await testEnvironmentConnectivity()
  };
  
  const overallStatus = {
    isHealthy: results.validation.isValid && results.supabase.isValid,
    issues: [] as string[]
  };
  
  if (!results.validation.isValid) {
    overallStatus.issues.push('Missing required environment variables');
  }
  
  if (!results.supabase.isValid) {
    overallStatus.issues.push('Invalid Supabase configuration');
  }
  
  if (results.connectivity.supabase.status !== 'success') {
    overallStatus.issues.push('Supabase connectivity failed');
  }
  
  console.log('📊 Full Environment Check Results:', {
    ...results,
    overallStatus
  });
  
  return { ...results, overallStatus };
}

// Export all functions for easy import
export default {
  checkEnvLocalFile,
  validateEnvironment,
  checkRuntimeEnvironment,
  validateSupabaseConfig,
  testEnvironmentConnectivity,
  performFullEnvironmentCheck
};
