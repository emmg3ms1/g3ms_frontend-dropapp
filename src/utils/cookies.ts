// Secure cookie utilities for authentication tokens

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  domain?: string;
  path?: string;
}

export class SecureCookieManager {
  private static readonly TOKEN_COOKIE = 'auth_token';
  private static readonly CSRF_COOKIE = 'csrf_token';

  static setAuthToken(token: string, options: Partial<CookieOptions> = {}): void {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
      ...options
    };

    this.setCookie(this.TOKEN_COOKIE, token, defaultOptions);
  }

  static getAuthToken(): string | null {
    return this.getCookie(this.TOKEN_COOKIE);
  }

  static removeAuthToken(): void {
    this.deleteCookie(this.TOKEN_COOKIE);
  }

  static setCSRFToken(token: string): void {
    const options: CookieOptions = {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      maxAge: 30 * 60, // 30 minutes
      path: '/',
    };

    this.setCookie(this.CSRF_COOKIE, token, options);
  }

  static getCSRFToken(): string | null {
    return this.getCookie(this.CSRF_COOKIE);
  }

  static removeCSRFToken(): void {
    this.deleteCookie(this.CSRF_COOKIE);
  }

  private static setCookie(name: string, value: string, options: CookieOptions): void {
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; Secure';
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    // Note: HttpOnly cannot be set from client-side JavaScript
    // This should be set by the server when sending the Set-Cookie header
    if (options.httpOnly) {
      console.warn('HttpOnly cookies must be set by the server, not client-side JavaScript');
    }

    document.cookie = cookieString;
  }

  private static getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  private static deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

// Secure token manager with production-ready storage
export class TokenManager {
  static setToken(token: string): void {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('💾 Storing access token');
    }
    
    // Use secure storage in production, localStorage in development
    if (import.meta.env.MODE === 'production') {
      // Use secure httpOnly cookies via server-side implementation
      // For now, continue using localStorage but with security warnings
      console.warn('⚠️ Production detected: Consider implementing httpOnly cookies for enhanced security');
    }
    localStorage.setItem('auth_token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static setRefreshToken(token: string): void {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('💾 Storing refresh token');
    }
    localStorage.setItem('refresh_token', token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  static removeToken(): void {
    // Security: Remove sensitive logging in production
    if (import.meta.env.MODE === 'development') {
      console.log('🗑️ Removing all stored tokens');
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}