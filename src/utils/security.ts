// Security utilities for rate limiting, input validation, and session management

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > entry.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }
}

// Rate limiter instances
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const formRateLimiter = new RateLimiter(10, 5 * 60 * 1000); // 10 attempts per 5 minutes

// Enhanced input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>"'&]/g, '') // Remove XSS characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script references
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate password strength
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain at least one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Session timeout management
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export class SessionManager {
  private timeoutId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();

  updateActivity(): void {
    this.lastActivity = Date.now();
    this.resetTimeout();
  }

  private resetTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      // Security: Remove sensitive logging in production
      if (import.meta.env.MODE === 'development') {
        console.log('⏰ Session timeout reached, forcing logout');
      }
      
      // Trigger logout - import TokenManager dynamically to avoid circular deps
      import('@/utils/cookies').then(({ TokenManager }) => {
        TokenManager.removeToken();
        sessionStorage.removeItem('csrf_token');
        window.location.href = '/login?reason=timeout';
      });
    }, SESSION_TIMEOUT_MS);
  }

  startSession(): void {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🔄 Starting session management');
    }
    this.updateActivity();
    
    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });
  }

  endSession(): void {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🛑 Ending session management');
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  // Security monitoring - log security-related events
  private logSecurityEvent(event: string, data: any): void {
    const logEntry = {
      event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...data
    };
    
    // In development, log to console
    if (import.meta.env.MODE === 'development') {
      console.warn('🔒 Security Event:', logEntry);
    }
    
    // In production, send to monitoring service
    // TODO: Implement actual security monitoring service integration
    if (import.meta.env.MODE === 'production') {
      // Store in localStorage temporarily for now
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push(logEntry);
      // Keep only last 50 events to prevent storage overflow
      localStorage.setItem('security_logs', JSON.stringify(securityLogs.slice(-50)));
    }
  }
}

export const sessionManager = new SessionManager();

// Security headers validation
export const validateSecurityHeaders = (response: Response): void => {
  const requiredHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection'
  ];

  const missingHeaders = requiredHeaders.filter(header => 
    !response.headers.has(header)
  );

  if (missingHeaders.length > 0) {
    console.warn('Missing security headers:', missingHeaders);
  }
};

// CSRF token management
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getCSRFToken = (): string => {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  return token;
};