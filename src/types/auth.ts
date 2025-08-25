export type OnboardingState = 
  | 'PENDING_ROLE'
  | 'PENDING_BIRTHDATE'
  | 'PENDING_PHONE_VERIFICATION'
  | 'PENDING_GUARDIAN_INFO'
  | 'READY';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'student' | 'educator' | 'brand';
  createdAt: string;
  updatedAt: string;
  onboardingState?: OnboardingState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  provider?: 'google' | 'microsoft' | 'apple' | 'classlink';
  providerToken?: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
  role?: 'student' | 'educator' | 'brand';
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  googleLogin: (isFromSignup?: boolean) => Promise<void>;
  appleLogin: (isFromSignup?: boolean) => Promise<void>;
  handleAuthCallback: () => Promise<void>;
}