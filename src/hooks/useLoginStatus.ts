import { useAuth } from '@/contexts/AuthContext';

// Production-only authentication - no bypasses allowed
const BYPASS_AUTH = import.meta.env.MODE === 'development' ? false : false;

export const useLoginStatus = () => {
  const { user: authUser } = useAuth();
  
  // User is considered logged in if BYPASS_AUTH is true OR they have a real auth user
  const isLoggedIn = BYPASS_AUTH || !!authUser;
  
  return { isLoggedIn };
};