export interface OnboardingData {
  selectedBeliefs: string[];
  profileData: {
    name: string;
    birthDate?: Date;
    timezone: string;
    preferredLanguage?: string;
  };
  karmaInsight?: any;
  selectedTasks: string[];
}