import { SiweMessage } from 'siwe';

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  requireStrongPasswords: boolean;
}

export interface LoginAttempt {
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();

  private constructor() {
    this.config = {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      sessionTimeout: 60,
      requireStrongPasswords: true
    };
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.requireStrongPasswords) {
      return { valid: true, errors: [] };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Record login attempt
   */
  recordLoginAttempt(identifier: string, success: boolean, metadata?: Partial<LoginAttempt>): void {
    const attempts = this.loginAttempts.get(identifier) || [];
    
    attempts.push({
      timestamp: new Date(),
      success,
      ...metadata
    });

    // Keep only recent attempts (last 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAttempts = attempts.filter(attempt => attempt.timestamp > cutoff);
    
    this.loginAttempts.set(identifier, recentAttempts);
  }

  /**
   * Check if account is locked due to failed attempts
   */
  isAccountLocked(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier) || [];
    const cutoff = new Date(Date.now() - this.config.lockoutDuration * 60 * 1000);
    
    const recentFailedAttempts = attempts.filter(
      attempt => !attempt.success && attempt.timestamp > cutoff
    );

    return recentFailedAttempts.length >= this.config.maxLoginAttempts;
  }

  /**
   * Get time until account unlock
   */
  getUnlockTime(identifier: string): Date | null {
    if (!this.isAccountLocked(identifier)) return null;

    const attempts = this.loginAttempts.get(identifier) || [];
    const failedAttempts = attempts.filter(attempt => !attempt.success);
    
    if (failedAttempts.length === 0) return null;

    const lastFailedAttempt = failedAttempts[failedAttempts.length - 1];
    return new Date(lastFailedAttempt.timestamp.getTime() + this.config.lockoutDuration * 60 * 1000);
  }

  /**
   * Generate secure nonce for SIWE
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify SIWE message
   */
  async verifySiweMessage(message: string, signature: string): Promise<{ valid: boolean; address?: string; error?: string }> {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });
      
      // Check nonce freshness (should be used within 10 minutes)
      const issuedAt = new Date(siweMessage.issuedAt!);
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      
      if (issuedAt < tenMinutesAgo) {
        return { valid: false, error: 'Message expired' };
      }

      return { valid: true, address: fields.data.address };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Verification failed' };
    }
  }

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate content for harmful patterns
   */
  validateContent(content: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for potential script injection
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content)) {
      issues.push('Script tags are not allowed');
    }

    // Check for potential SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
      /(UNION\s+SELECT)/gi,
      /(\bOR\s+1\s*=\s*1\b)/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(content)) {
        issues.push('Potentially harmful SQL patterns detected');
        break;
      }
    }

    // Check for excessive length
    if (content.length > 10000) {
      issues.push('Content exceeds maximum length');
    }

    return { valid: issues.length === 0, issues };
  }

  /**
   * Generate Content Security Policy header
   */
  generateCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.karmaquest.com wss://api.karmaquest.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }

  /**
   * Hash sensitive data for logging
   */
  async hashForLogging(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    const window = now - windowMs;

    // Get stored requests from localStorage (in production, use Redis)
    const stored = localStorage.getItem(key);
    let requests: number[] = stored ? JSON.parse(stored) : [];

    // Filter out old requests
    requests = requests.filter(timestamp => timestamp > window);

    // Check if limit exceeded
    if (requests.length >= maxRequests) {
      return false;
    }

    // Add current request
    requests.push(now);
    localStorage.setItem(key, JSON.stringify(requests));

    return true;
  }

  /**
   * Clear security data (logout)
   */
  clearSecurityData(): void {
    this.loginAttempts.clear();
    
    // Clear rate limit data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('rate_limit_')) {
        localStorage.removeItem(key);
      }
    });
  }
}