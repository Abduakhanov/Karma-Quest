export interface KarmaType {
  id: string;
  name: string;
  description: string;
  icon: string;
  traits: string[];
  challenges: string[];
  lifeLesson: string;
  spiritualGift: string;
  recommendations: string[];
  compatibleTypes: string[];
  element: 'fire' | 'earth' | 'air' | 'water';
  chakra: string;
  color: string;
}

export interface KarmaTest {
  id: string;
  beliefSystem: string;
  questions: KarmaQuestion[];
  scoringMethod: 'weighted' | 'categorical' | 'intuitive';
  resultMapping: { [key: string]: string };
}

export interface KarmaQuestion {
  id: string;
  type: 'choice' | 'scale' | 'scenario' | 'priority';
  question: string;
  options?: KarmaOption[];
  weight?: number;
  category?: string;
}

export interface KarmaOption {
  id: string;
  text: string;
  value: number | string;
  karmaType?: string;
}

export interface KarmaAnalysisResult {
  primaryKarma: KarmaType;
  secondaryKarma?: KarmaType;
  confidence: number;
  detailedAnalysis: {
    strengths: string[];
    challenges: string[];
    lifeLesson: string;
    spiritualGift: string;
    recommendations: string[];
  };
  beliefSystemInsights: {
    [beliefSystem: string]: {
      interpretation: string;
      specificGuidance: string[];
    };
  };
}