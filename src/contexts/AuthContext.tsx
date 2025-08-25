import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, AuthContextType, LoginCredentials, SignupCredentials } from '@/types/auth';
import { apiService } from '@/services/api';
import { TokenManager } from '@/utils/cookies';
import { sessionManager } from '@/utils/security';
import { securityMonitor } from '@/utils/securityMonitoring';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authProcessing, setAuthProcessing] = useState(false);

  // Centralized state clearing function
  const clearAuthState = () => {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🧹 Clearing all authentication state');
    }
    setUser(null);
    setIsAuthenticated(false);
    TokenManager.removeToken();
    sessionManager.endSession();
  };

  // Centralized state setting function
  const setAuthState = (userData: User, token: string, refreshToken?: string) => {
    // Security: Remove sensitive user data from logs
    if (import.meta.env.MODE === 'development') {
      console.log('✅ Setting authentication state for user:', userData.email);
    }
    setUser(userData);
    setIsAuthenticated(true);
    TokenManager.setToken(token);
    if (refreshToken) {
      TokenManager.setRefreshToken(refreshToken);
    }
    sessionManager.startSession();
  };

  // Centralized post-authentication flow
  const handlePostAuthFlow = async (userData: User, isFromSignup: boolean = false) => {
    // Prevent multiple calls to postAuth flow
    if (authProcessing) {
      // Security: Remove sensitive logging in production
      if (import.meta.env.MODE === 'development') {
        console.log('⏸️ PostAuth flow already in progress, skipping');
      }
      return;
    }
    
    setAuthProcessing(true);
    try {
      // Security: Remove sensitive user data from logs
      if (import.meta.env.MODE === 'development') {
        console.log('🎯 Starting post-auth flow for user:', userData.email);
        console.log('🎯 Is from signup flow:', isFromSignup);
      }
      
      // Get current user profile and onboarding status
      const [userProfile, onboardingStatus] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getOnboardingStatus()
      ]);
      
      // Security: Remove sensitive data from logs
      if (import.meta.env.MODE === 'development') {
        console.log('📋 User profile:', userProfile);
        console.log('📋 Onboarding status:', onboardingStatus);
      }
      
      // Update user state with latest profile
      setUser(userProfile);
      
      // Add a small delay to ensure state is fully updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Handle onboarding flow based on state
      if (onboardingStatus.state === 'READY') {
        // User is fully onboarded, redirect based on role
        if (isFromSignup) {
          // For new signups, always show welcome/dashboard first
          window.location.href = '/dashboard';
        } else {
          // For existing users, go to role-specific dashboard
          redirectToRoleDashboard(userProfile.role);
        }
      } else {
        // User needs to complete onboarding
        redirectToOnboardingStep(onboardingStatus.state);
      }
      
    } catch (error) {
      console.error('❌ Failed to complete post-auth flow:', error);
      // Fallback to dashboard if API calls fail
      window.location.href = '/dashboard';
    } finally {
      setAuthProcessing(false);
    }
  };
  
  const redirectToOnboardingStep = (state: string) => {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🔄 Redirecting to onboarding step:', state);
    }
    switch (state) {
      case 'PENDING_ROLE':
        window.location.href = '/onboarding/role';
        break;
      case 'PENDING_BIRTHDATE':
        window.location.href = '/onboarding/birthdate';
        break;
      case 'PENDING_PHONE_VERIFICATION':
        window.location.href = '/onboarding/phone';
        break;
      case 'PENDING_GUARDIAN_INFO':
        window.location.href = '/onboarding/guardian';
        break;
      default:
        window.location.href = '/dashboard';
    }
  };
  
  const redirectToRoleDashboard = (role: string) => {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🎯 Redirecting to role dashboard:', role);
    }
    switch (role) {
      case 'student':
        window.location.href = '/drops/main';
        break;
      case 'educator':
        window.location.href = '/drops/main';
        break;
      case 'brand':
        window.location.href = '/profile';
        break;
      default:
        window.location.href = '/drops/main';
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Security: Remove sensitive logging in production
      if (import.meta.env.MODE === 'development') {
        console.log('🔄 Initializing authentication state');
      }
      setIsLoading(true);
      
      try {
        const token = TokenManager.getToken();
        if (token) {
          // Security: Remove sensitive logging in production
          if (import.meta.env.MODE === 'development') {
            console.log('🔍 Found existing token, validating with backend');
          }
          try {
            // Validate token with backend
            const userData = await apiService.getCurrentUser();
            setAuthState(userData, token);
            // Security: Remove sensitive user data from logs
            if (import.meta.env.MODE === 'development') {
              console.log('✅ Token validated, user authenticated:', userData.email);
            }
          } catch (error) {
            console.error('❌ Token validation failed:', error);
            // Clear invalid token to prevent loops
            clearAuthState();
          }
        } else {
          // Security: Remove sensitive logging in production
          if (import.meta.env.MODE === 'development') {
            console.log('ℹ️ No existing token found');
          }
        }
      } catch (error) {
        console.error('❌ Failed to validate existing token:', error);
        // Clear invalid token
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for Supabase auth state changes
    if (isSupabaseConfigured()) {
      // Security: Remove sensitive logging in production
      if (import.meta.env.MODE === 'development') {
        console.log('🔄 Setting up Supabase auth state listener');
      }
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Security: Remove sensitive logging in production
        if (import.meta.env.MODE === 'development') {
          console.log('🔄 Supabase auth state change:', event, session?.user?.email);
        }
        
        // Prevent processing if we're already handling auth
        if (authProcessing) {
          // Security: Remove sensitive logging in production
          if (import.meta.env.MODE === 'development') {
            console.log('⏸️ Auth processing in progress, skipping state change');
          }
          return;
        }
        
        // Prevent processing if we're already authenticated and this is just a session refresh
        if (event === 'TOKEN_REFRESHED' && isAuthenticated) {
          console.log('🔄 Token refreshed, skipping processing');
          return;
        }
        
        if (event === 'SIGNED_IN' && session) {
          // Skip if we already have this session processed
          const currentToken = TokenManager.getToken();
          if (currentToken && session.access_token === currentToken) {
            console.log('⏸️ Session already processed, skipping');
            return;
          }
          
          // Check if this is from a signup flow
          const isFromSignup = sessionStorage.getItem('auth_from_signup') === 'true';
          sessionStorage.removeItem('auth_from_signup'); // Clean up
          
          setAuthProcessing(true);
          try {
            await handleSupabaseSession(session, isFromSignup);
          } catch (error) {
            console.error('❌ Failed to handle Supabase session:', error);
            clearAuthState();
          } finally {
            setAuthProcessing(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🔄 Supabase signed out, clearing auth state');
          // Only clear state if we're not already in the process of logging out
          if (isAuthenticated) {
            clearAuthState();
          }
        }
      });

      return () => {
        console.log('🧹 Cleaning up Supabase auth listener');
        subscription.unsubscribe();
      };
    }
  }, []); // Run only once on mount to prevent re-initialization

  // Handle Supabase OAuth session
  const handleSupabaseSession = async (session: any, isFromSignup: boolean = false) => {
    // Prevent duplicate processing
    if (authProcessing) {
      console.log('⏸️ Already processing auth, skipping session handling');
      return;
    }
    
    try {
      console.log('🔄 Processing Supabase session:', session.user?.email);
      console.log('🔄 Is from signup flow:', isFromSignup);
      
      // Extract provider information
      const provider = session.user?.app_metadata?.provider;
      console.log('🔍 Detected provider:', provider);
      
      // Use Supabase session access token (JWT)
      const supabaseAccessToken = session.access_token;
      console.log('📤 Using Supabase session token:', supabaseAccessToken?.substring(0, 50) + '...');
      
      let backendResponse;
      
      if (provider === 'google') {
        console.log('📤 Sending Supabase session token to Google auth endpoint');
        backendResponse = await apiService.googleAuth(supabaseAccessToken);
      } else if (provider === 'apple') {
        console.log('📤 Sending Supabase session token to Apple auth endpoint');
        backendResponse = await apiService.appleAuth(supabaseAccessToken);
      } else {
        throw new Error(`Unsupported OAuth provider: ${provider}`);
      }

      console.log('✅ Backend authentication successful:', backendResponse.user?.email);

      // Set authentication state with backend tokens
      if (backendResponse.session?.access_token) {
        setAuthState(
          backendResponse.user,
          backendResponse.session.access_token,
          backendResponse.session.refresh_token
        );
      }
      
      console.log('✅ Social authentication completed successfully');
      
      // Follow post-auth flow for proper redirection
      await handlePostAuthFlow(backendResponse.user, isFromSignup);
      
    } catch (error) {
      console.error('❌ Failed to process social authentication:', error);
      
      // Clear Supabase session on backend failure
      await supabase.auth.signOut();
      clearAuthState();
      
      toast.error('Authentication failed. Please try again.');
      throw error;
    }
  };

  // Email/password login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log('🔄 Starting email/password login for:', credentials.email);
    setIsLoading(true);
    
    try {
      const response = await apiService.login(credentials);
      console.log('✅ Backend login successful:', response.user?.email);
      
      // Set authentication state
      setAuthState(
        response.user,
        response.session.access_token,
        response.session.refresh_token
      );
      
      // Follow post-auth flow
      await handlePostAuthFlow(response.user, false);
    } catch (error) {
      console.error('❌ Email/password login failed:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Email/password signup
  const signup = async (credentials: SignupCredentials): Promise<void> => {
    console.log('🔄 Starting email/password signup for:', credentials.email);
    setIsLoading(true);
    
    try {
      const response = await apiService.signup(credentials);
      console.log('✅ Backend signup successful:', response.user?.email);
      
      // Set authentication state
      setAuthState(
        response.user,
        response.session.access_token,
        response.session.refresh_token
      );
      
      // Follow post-auth flow
      await handlePostAuthFlow(response.user, true);
    } catch (error) {
      console.error('❌ Email/password signup failed:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const googleLogin = async (isFromSignup: boolean = false): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Google authentication is not configured. Please check your Supabase settings.');
    }

    try {
      console.log('🚀 Starting Google OAuth flow, isFromSignup:', isFromSignup);
      setIsLoading(true);
      
      // Store signup context in sessionStorage for the auth state listener
      if (isFromSignup) {
        sessionStorage.setItem('auth_from_signup', 'true');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Google OAuth initiation failed:', error);
        throw new Error(error.message || 'Failed to start Google authentication');
      }

      console.log('✅ Google OAuth flow initiated');
      // Note: The actual authentication will be handled by the auth state change listener
      
    } catch (error) {
      setIsLoading(false);
      clearAuthState();
      console.error('❌ Google login error:', error);
      throw error;
    }
  };

  // Apple OAuth login
  const appleLogin = async (isFromSignup: boolean = false): Promise<void> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Apple authentication is not configured. Please check your Supabase settings.');
    }

    try {
      console.log('🚀 Starting Apple OAuth flow, isFromSignup:', isFromSignup);
      setIsLoading(true);
      
      // Store signup context in sessionStorage for the auth state listener
      if (isFromSignup) {
        sessionStorage.setItem('auth_from_signup', 'true');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ Apple OAuth initiation failed:', error);
        throw new Error(error.message || 'Failed to start Apple authentication');
      }

      console.log('✅ Apple OAuth flow initiated');
      // Note: The actual authentication will be handled by the auth state change listener
      
    } catch (error) {
      setIsLoading(false);
      clearAuthState();
      console.error('❌ Apple login error:', error);
      throw error;
    }
  };

  // Logout with proper cleanup
  const logout = async (): Promise<void> => {
    console.log('🔄 Starting logout process');
    
    // Prevent multiple logout calls
    if (authProcessing) {
      console.log('⏸️ Logout already in progress');
      return;
    }
    
    setAuthProcessing(true);
    
    try {
      // Only call backend logout if we have an access token
      const token = TokenManager.getToken();
      if (token) {
        console.log('📤 Calling backend logout endpoint');
        try {
          await apiService.logout();
          console.log('✅ Backend logout successful');
        } catch (error) {
          console.error('❌ Backend logout failed (continuing with cleanup):', error);
        }
      } else {
        console.log('ℹ️ No access token found, skipping backend logout');
      }

      // Clear Supabase session
      if (isSupabaseConfigured()) {
        console.log('📤 Signing out from Supabase');
        await supabase.auth.signOut();
      }

      // Clear all local state
      clearAuthState();
      console.log('✅ Logout completed successfully');
      
    } catch (error) {
      console.error('❌ Logout error (forcing cleanup):', error);
      // Force cleanup even if logout fails
      clearAuthState();
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } finally {
      setAuthProcessing(false);
    }
  };

  // Token refresh with proper error handling
  const refreshToken = async (): Promise<void> => {
    console.log('🔄 Refreshing authentication token');
    
    try {
      const response = await apiService.refreshToken();
      console.log('✅ Token refresh successful');
      
      TokenManager.setToken(response.session.access_token);
      if (response.session.refresh_token) {
        TokenManager.setRefreshToken(response.session.refresh_token);
      }
    } catch (error) {
      console.error('❌ Token refresh failed, logging out:', error);
      await logout();
      throw error;
    }
  };

  // Handle OAuth callback
  const handleAuthCallback = async (): Promise<void> => {
    console.log('🎯 Processing authentication callback');
    
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      setIsLoading(true);
      
      // Get the current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Failed to get Supabase session:', error);
        throw new Error(error.message || 'Failed to retrieve authentication session');
      }

      if (!session) {
        console.error('❌ No session found in callback');
        throw new Error('No authentication session found');
      }

      console.log('✅ Supabase session retrieved, processing with backend');
      
      // Process the session with backend (this will handle the postAuth flow)
      await handleSupabaseSession(session);
      
    } catch (error) {
      console.error('❌ Auth callback processing failed:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token: TokenManager.getToken(),
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshToken,
    googleLogin,
    appleLogin,
    handleAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};