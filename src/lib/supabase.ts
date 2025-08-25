import { createClient } from '@supabase/supabase-js';

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey && 
         supabaseAnonKey !== 'placeholder' &&
         supabaseUrl.includes('supabase.co');
};

// Use environment variables or fallback to development values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjeapdijymvwjhipsdxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZWFwZGlqeW12d2poaXBzZHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzA1MjgsImV4cCI6MjA2OTU0NjUyOH0.QL-XZ_AJwOvLzkmZpAe7z2b2XKRE8BLRlWCVMwu6MJk';

console.log('🔧 Supabase configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  isConfigured: isSupabaseConfigured()
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.MODE === 'development'
  },
});