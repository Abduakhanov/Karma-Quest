export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  totalXp: number;
  avatar: string;
  joinDate: Date;
  beliefSystems: string[];
  onboardingStage: 'landing' | 'belief-pick' | 'profile' | 'insight' | 'quest-builder' | 'dashboard';
  birthDate?: Date;
  timezone?: string;
  preferredLanguage?: string;
  web3Address?: string;
}

export interface BeliefSystem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'spiritual' | 'psychological' | 'scientific' | 'traditional';
  adapterKey: string;
  popular: boolean;
  weight?: number;
}

export interface KarmaAnalysis {
  overallScore: number;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  areas: {
    health: number;
    relationships: number;
    finances: number;
    spirituality: number;
    career: number;
  };
  insights: {
    [beliefSystemId: string]: {
      score: number;
      explanation: string;
      recommendations: string[];
    };
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'relationships' | 'finances' | 'spirituality' | 'career';
  priority: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  xpReward: number;
  dueDate?: Date;
  createdAt: Date;
  source: 'auto-generated' | 'user-created' | 'expert-assigned';
  beliefSystemSource?: string;
  expertId?: string;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  insights?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  encrypted?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  condition: string;
  nftMinted?: boolean;
  nftTokenId?: string;
}

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  description: string;
  verified: boolean;
  responseTime: string;
  completedSessions: number;
  web3Address?: string;
}

export interface AppState {
  user: User | null;
  currentPage: 'landing' | 'onboarding' | 'dashboard' | 'tasks' | 'diary' | 'rewards' | 'marketplace' | 'web3';
  onboardingStep: number;
  karmaAnalysis: KarmaAnalysis | null;
  tasks: Task[];
  diaryEntries: DiaryEntry[];
  achievements: Achievement[];
  suggestedTasks: Task[];
  isLoading: boolean;
  experts?: Expert[];
  web3Connected?: boolean;
}

export interface OnboardingData {
  selectedBeliefs: string[];
  profileData: {
    name: string;
    birthDate?: Date;
    timezone: string;
    preferredLanguage?: string;
  };
  karmaInsight?: KarmaAnalysis;
  selectedTasks: string[];
}

export interface NFTBadge {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  achievementId: string;
  mintedAt: Date;
  transactionHash: string;
}

export interface Web3State {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  badges: NFTBadge[];
  onChainXP: number;
  karmaTokens: number;
}