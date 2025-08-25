// Environment configuration for security-sensitive settings

export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://g3ms-dropapp-dev-820977213107.us-central1.run.app/api/v1',
  
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Security Settings
  ENVIRONMENT: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  
  // Rate Limiting Configuration
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    FORM_ATTEMPTS: 10,
    FORM_WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  },
  
  // Session Configuration
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  
  // Feature Flags
  FEATURES: {
    ALLOW_MOCK_AUTH: import.meta.env.MODE === 'development' && import.meta.env.VITE_ALLOW_MOCK_AUTH === 'true',
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_RATE_LIMITING: true,
  }
} as const;

// Validate required environment variables in production
if (config.IS_PRODUCTION) {
  const requiredVars = ['VITE_API_BASE_URL'];
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
  }
}