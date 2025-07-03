export interface Quest {
  key: string;
  title: string;
  description?: string;
  category: 'health' | 'relationships' | 'finances' | 'spirituality' | 'career';
  priority: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
  beliefSystem?: string;
  translatedBy?: 'human' | 'gpt' | 'auto';
  qualityScore?: number;
  completed?: boolean;
  createdAt?: Date;
}

export interface QuestLocale {
  questKey: string;
  lng: string;
  title: string;
  description?: string;
  translatedBy: 'human' | 'gpt' | 'auto';
  qualityScore: number;
  updatedAt: Date;
}

export interface TranslationJob {
  id: number;
  questKey: string;
  targetLng: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface QuestResponse {
  quests: Quest[];
  fallback?: string;
  translationInProgress?: boolean;
  missingCount?: number;
}