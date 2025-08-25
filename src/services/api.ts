import { LoginCredentials, SignupCredentials, User, OnboardingState } from '@/types/auth';
import { loginRateLimiter, validateSecurityHeaders, getCSRFToken, sessionManager, sanitizeInput } from '@/utils/security';
import { TokenManager } from '@/utils/cookies';
import { config } from '@/config/environment';
import { securityMonitor } from '@/utils/securityMonitoring';

// Environment-based API configuration for security
const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  private getAuthHeaders() {
    const token = TokenManager.getToken();
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCSRFToken(),
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Validate security headers
      validateSecurityHeaders(response);
      
      // Update session activity
      sessionManager.updateActivity();
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Sanitize error information to prevent information disclosure
      if (error instanceof Error) {
        const sanitizedMessage = sanitizeInput(error.message.slice(0, 200));
        throw new Error(sanitizedMessage || 'Request failed. Please try again.');
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ user: User; session: { access_token: string; refresh_token: string; expires_in: number } }> {
    // Rate limiting for login attempts
    if (!loginRateLimiter.isAllowed(credentials.email)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(credentials.email) / 1000 / 60);
      securityMonitor.logFailedLogin(credentials.email, 'rate_limited');
      throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
    }

    try {
      const response = await this.request<{ user: User; session: { access_token: string; refresh_token: string; expires_in: number } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });
      
      // Log successful login
      securityMonitor.logSuccessfulLogin(credentials.email);
      return response;
    } catch (error) {
      // Log failed login attempt
      securityMonitor.logFailedLogin(credentials.email, 'invalid_credentials');
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<{ user: User; session: { access_token: string; refresh_token: string; expires_in: number } }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });
  }

  async googleAuth(credential: string): Promise<{ user: User; session: { access_token: string; refresh_token: string } }> {
    // Security: Remove sensitive logging in production
    if (config.IS_DEVELOPMENT) {
      console.log('📤 Sending Google auth request to backend');
    }
    
    const requestBody = {
      accessToken: credential
    };
    
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async appleAuth(credential: string): Promise<{ user: User; session: { access_token: string; refresh_token: string } }> {
    // Security: Remove sensitive logging in production
    if (config.IS_DEVELOPMENT) {
      console.log('📤 Sending Apple auth request to backend');
    }
    
    const requestBody = {
      accessToken: credential
    };
    
    return this.request('/auth/apple', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async refreshToken(): Promise<{ session: { access_token: string; refresh_token: string; expires_in: number } }> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      securityMonitor.logTokenRefreshFailure('no_refresh_token');
      throw new Error('No refresh token available');
    }

    try {
      return await this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken
        }),
      });
    } catch (error) {
      securityMonitor.logTokenRefreshFailure('refresh_failed');
      throw error;
    }
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User profile endpoints
  async getCurrentUser(): Promise<User> {
    return this.request('/users/me');
  }

  // Onboarding endpoints
  async getOnboardingStatus(): Promise<{ state: OnboardingState }> {
    return this.request('/onboarding/status');
  }

  async setRole(role: string): Promise<{ state: OnboardingState }> {
    return this.request('/onboarding/role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  async setBirthdate(birthDate: string): Promise<{ state: OnboardingState }> {
    return this.request('/onboarding/student/birthdate', {
      method: 'POST',
      body: JSON.stringify({ birthDate }),
    });
  }

  async sendPhoneOTP(phoneE164: string): Promise<{ ok: boolean }> {
    return this.request('/onboarding/phone/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneE164 }),
    });
  }

  async verifyPhoneOTP(phoneE164: string, code: string): Promise<{ state: OnboardingState }> {
    return this.request('/onboarding/phone/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneE164, code }),
    });
  }

  async createGuardianRequest(data: {
    studentFirstName: string;
    studentLastName: string;
    parentFirstName: string;
    parentLastName: string;
    parentPhone: string;
  }): Promise<{ state: OnboardingState }> {
    return this.request('/onboarding/guardian', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Drop endpoints
  async getDrops(): Promise<any[]> {
    return this.request('/drops');
  }

  async getDropTemplates(): Promise<{ data: any[] }> {
    return this.request('/templates');
  }

  async getDropVideos(): Promise<{ data: any[] }> {
    return this.request('/videos?type=DROP_VIDEO');
  }

  async getTopics(isFunTopic: boolean = false): Promise<{ data: any[] }> {
    return this.request(`/topics?isFunTopic=${isFunTopic}`);
  }

  async getSchools(page: number = 1, limit: number = 100, search?: string): Promise<{ data: any[], meta: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    return this.request(`/schools?${params.toString()}`);
  }

  async getGrades(isPureGrade: boolean = true): Promise<{ data: any[] }> {
    return this.request(`/grades?isPureGrade=${isPureGrade}`);
  }

  async createDrop(dropData: any): Promise<{ drop: any }> {
    return this.request('/admin/drops', {
      method: 'POST',
      body: JSON.stringify(dropData),
    });
  }

  async getEducatorDrops(page: number = 1, limit: number = 100): Promise<{ data: any[], meta: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request(`/admin/drops?${params.toString()}`);
  }

  async publishDrop(dropId: string, isPublished: boolean): Promise<any> {
    return this.request(`/admin/drops/${dropId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ isPublished }),
    });
  }
  async completeDrop(dropId: string): Promise<any> {
    return this.request(`/drops/${dropId}/complete`, {
      method: 'POST',
    });
  }

  async getUserDrops(): Promise<any[]> {
    return this.request('/drops/user');
  }
}

export const apiService = new ApiService();