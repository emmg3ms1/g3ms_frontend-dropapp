// Security monitoring and event logging

export interface SecurityEvent {
  event: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
  userId?: string;
  email?: string;
  data?: any;
}

export class SecurityMonitor {
  private static readonly MAX_EVENTS = 100;
  private static readonly STORAGE_KEY = 'security_events';

  static logEvent(event: string, data?: any): void {
    const securityEvent: SecurityEvent = {
      event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...data
    };

    // In development, log to console
    if (import.meta.env.MODE === 'development') {
      console.warn('🔒 Security Event:', securityEvent);
    }

    // Store event for monitoring
    this.storeEvent(securityEvent);

    // In production, consider sending to external monitoring service
    if (import.meta.env.MODE === 'production') {
      this.sendToMonitoringService(securityEvent);
    }
  }

  static logFailedLogin(email: string, reason: string): void {
    this.logEvent('failed_login', {
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      reason,
      severity: 'medium'
    });
  }

  static logSuccessfulLogin(email: string): void {
    this.logEvent('successful_login', {
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      severity: 'info'
    });
  }

  static logSessionTimeout(userId?: string): void {
    this.logEvent('session_timeout', {
      userId,
      severity: 'low'
    });
  }

  static logSuspiciousActivity(activity: string, data?: any): void {
    this.logEvent('suspicious_activity', {
      activity,
      severity: 'high',
      ...data
    });
  }

  static logTokenRefreshFailure(reason: string): void {
    this.logEvent('token_refresh_failure', {
      reason,
      severity: 'high'
    });
  }

  private static storeEvent(event: SecurityEvent): void {
    try {
      const events = this.getStoredEvents();
      events.push(event);
      
      // Keep only the most recent events
      const recentEvents = events.slice(-this.MAX_EVENTS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to store security event:', error);
    }
  }

  private static getStoredEvents(): SecurityEvent[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve security events:', error);
      return [];
    }
  }

  private static sendToMonitoringService(event: SecurityEvent): void {
    // TODO: Implement integration with external monitoring service
    // This could be services like:
    // - Sentry for error monitoring
    // - LogRocket for user session recording
    // - Custom security logging endpoint
    // - Third-party security monitoring tools
    
    // For now, just store locally
    console.warn('Security monitoring service not configured');
  }

  // Get security events for admin/debugging purposes
  static getEvents(limit?: number): SecurityEvent[] {
    const events = this.getStoredEvents();
    return limit ? events.slice(-limit) : events;
  }

  // Clear stored events (for privacy compliance)
  static clearEvents(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check for suspicious patterns
  static checkForSuspiciousActivity(): boolean {
    const events = this.getStoredEvents();
    const recentEvents = events.filter(e => {
      const eventTime = new Date(e.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return eventTime > oneHourAgo;
    });

    // Check for multiple failed login attempts
    const failedLogins = recentEvents.filter(e => e.event === 'failed_login');
    if (failedLogins.length > 5) {
      this.logSuspiciousActivity('multiple_failed_logins', {
        count: failedLogins.length,
        timeframe: '1_hour'
      });
      return true;
    }

    // Check for rapid session changes
    const sessionEvents = recentEvents.filter(e => 
      ['successful_login', 'session_timeout', 'logout'].includes(e.event)
    );
    if (sessionEvents.length > 10) {
      this.logSuspiciousActivity('rapid_session_changes', {
        count: sessionEvents.length,
        timeframe: '1_hour'
      });
      return true;
    }

    return false;
  }
}

// Export a singleton instance
export const securityMonitor = SecurityMonitor;
