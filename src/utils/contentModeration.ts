export interface ModerationResult {
  approved: boolean;
  confidence: number;
  flags: string[];
  toxicityScore?: number;
  categories?: {
    toxic: number;
    severe_toxic: number;
    obscene: number;
    threat: number;
    insult: number;
    identity_hate: number;
  };
}

export interface ModerationConfig {
  toxicityThreshold: number;
  enableProfanityFilter: boolean;
  enableSpamDetection: boolean;
  enableLanguageDetection: boolean;
  supportedLanguages: string[];
}

export class ContentModerationService {
  private static instance: ContentModerationService;
  private config: ModerationConfig;

  private constructor() {
    this.config = {
      toxicityThreshold: 0.7,
      enableProfanityFilter: true,
      enableSpamDetection: true,
      enableLanguageDetection: true,
      supportedLanguages: ['en', 'ru', 'kk']
    };
  }

  static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  /**
   * Moderate content using multiple checks
   */
  async moderateContent(content: string, userId?: string): Promise<ModerationResult> {
    const flags: string[] = [];
    let approved = true;
    let confidence = 1.0;

    // Basic profanity filter
    if (this.config.enableProfanityFilter) {
      const profanityResult = this.checkProfanity(content);
      if (!profanityResult.clean) {
        flags.push('profanity');
        approved = false;
        confidence = Math.min(confidence, 0.3);
      }
    }

    // Spam detection
    if (this.config.enableSpamDetection) {
      const spamResult = this.detectSpam(content);
      if (spamResult.isSpam) {
        flags.push('spam');
        approved = false;
        confidence = Math.min(confidence, 0.4);
      }
    }

    // Language detection
    if (this.config.enableLanguageDetection) {
      const language = this.detectLanguage(content);
      if (!this.config.supportedLanguages.includes(language)) {
        flags.push('unsupported_language');
        // Don't automatically reject, just flag for review
      }
    }

    // Toxicity analysis (mock implementation)
    const toxicityResult = await this.analyzeToxicity(content);
    if (toxicityResult.toxicityScore && toxicityResult.toxicityScore > this.config.toxicityThreshold) {
      flags.push('toxic');
      approved = false;
      confidence = Math.min(confidence, 1 - toxicityResult.toxicityScore);
    }

    return {
      approved,
      confidence,
      flags,
      toxicityScore: toxicityResult.toxicityScore,
      categories: toxicityResult.categories
    };
  }

  /**
   * Basic profanity filter
   */
  private checkProfanity(content: string): { clean: boolean; flaggedWords: string[] } {
    const profanityList = [
      // English
      'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard',
      // Russian
      'блядь', 'сука', 'пиздец', 'хуй', 'говно',
      // Add more as needed
    ];

    const words = content.toLowerCase().split(/\s+/);
    const flaggedWords: string[] = [];

    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (profanityList.some(profane => cleanWord.includes(profane))) {
        flaggedWords.push(word);
      }
    }

    return {
      clean: flaggedWords.length === 0,
      flaggedWords
    };
  }

  /**
   * Spam detection
   */
  private detectSpam(content: string): { isSpam: boolean; reasons: string[] } {
    const reasons: string[] = [];
    let isSpam = false;

    // Check for excessive repetition
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = new Map<string, number>();
    
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }

    const maxRepetition = Math.max(...wordCount.values());
    if (maxRepetition > words.length * 0.3) {
      reasons.push('excessive_repetition');
      isSpam = true;
    }

    // Check for excessive capitalization
    const capitalRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capitalRatio > 0.5 && content.length > 20) {
      reasons.push('excessive_caps');
      isSpam = true;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\b(buy now|click here|limited time|act fast)\b/gi,
      /\b(free money|easy money|get rich)\b/gi,
      /\b(viagra|cialis|pharmacy)\b/gi,
      /\b(casino|gambling|poker)\b/gi
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        reasons.push('suspicious_keywords');
        isSpam = true;
        break;
      }
    }

    return { isSpam, reasons };
  }

  /**
   * Simple language detection
   */
  private detectLanguage(content: string): string {
    // Simple heuristic-based language detection
    const cyrillicRatio = (content.match(/[а-яё]/gi) || []).length / content.length;
    const latinRatio = (content.match(/[a-z]/gi) || []).length / content.length;

    if (cyrillicRatio > 0.3) {
      // Check for Kazakh-specific characters
      if (/[әіңғүұқөһ]/gi.test(content)) {
        return 'kk';
      }
      return 'ru';
    }

    if (latinRatio > 0.3) {
      return 'en';
    }

    return 'unknown';
  }

  /**
   * Mock toxicity analysis (in production, use Perspective API or similar)
   */
  private async analyzeToxicity(content: string): Promise<{
    toxicityScore?: number;
    categories?: ModerationResult['categories'];
  }> {
    // Mock implementation - in production, call Perspective API
    const mockScore = Math.random() * 0.5; // Most content is not toxic
    
    // Add some bias for certain patterns
    const toxicPatterns = [
      /\b(hate|kill|die|stupid|idiot)\b/gi,
      /\b(racist|sexist|homophobic)\b/gi
    ];

    let adjustedScore = mockScore;
    for (const pattern of toxicPatterns) {
      if (pattern.test(content)) {
        adjustedScore = Math.min(1.0, adjustedScore + 0.3);
      }
    }

    return {
      toxicityScore: adjustedScore,
      categories: {
        toxic: adjustedScore,
        severe_toxic: adjustedScore * 0.5,
        obscene: adjustedScore * 0.3,
        threat: adjustedScore * 0.2,
        insult: adjustedScore * 0.4,
        identity_hate: adjustedScore * 0.1
      }
    };
  }

  /**
   * Queue content for human review
   */
  async queueForReview(content: string, userId: string, moderationResult: ModerationResult): Promise<void> {
    const reviewItem = {
      id: this.generateReviewId(),
      content,
      userId,
      moderationResult,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // In production, send to review queue (database/API)
    console.log('Queued for review:', reviewItem);
    
    // Store in localStorage for demo
    const queue = JSON.parse(localStorage.getItem('moderation-queue') || '[]');
    queue.push(reviewItem);
    localStorage.setItem('moderation-queue', JSON.stringify(queue));
  }

  /**
   * Get pending review items
   */
  getPendingReviews(): any[] {
    return JSON.parse(localStorage.getItem('moderation-queue') || '[]')
      .filter((item: any) => item.status === 'pending');
  }

  /**
   * Generate unique review ID
   */
  private generateReviewId(): string {
    return 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Update moderation config
   */
  updateConfig(newConfig: Partial<ModerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current config
   */
  getConfig(): ModerationConfig {
    return { ...this.config };
  }
}