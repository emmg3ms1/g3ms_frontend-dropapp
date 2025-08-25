import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, OnboardingState } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingState: OnboardingState | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingState: (state: OnboardingState | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isLoading: true,
      isAuthenticated: false,
      onboardingState: null,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setTokens: (accessToken, refreshToken) => {
        set({ 
          token: accessToken,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: !!accessToken
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setOnboardingState: (state) => {
        set({ onboardingState: state });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          onboardingState: null,
          isLoading: false
        });
      },

      initializeAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          // Validate token with backend
          const { apiService } = await import('@/services/api');
          const userData = await apiService.getCurrentUser();
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Token validation failed:', error);
          get().clearAuth();
        }
      }
    }),
    {
      name: 'g3ms-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        onboardingState: state.onboardingState
      }),
    }
  )
);

// Initialize auth on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}