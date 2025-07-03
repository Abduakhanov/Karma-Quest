export const FEATURES = {
  marketplace: false,
  web3: false,
  expertConsultations: false,
  premiumFeatures: false,
  socialSharing: false,
  advancedAnalytics: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURES[feature];
};

// Development override (can be used for testing)
export const DEV_OVERRIDES = process.env.NODE_ENV === 'development' ? {
  // marketplace: true, // Uncomment to enable in development
} : {};

// Get final feature state with dev overrides
export const getFeatureState = (feature: FeatureFlag): boolean => {
  return DEV_OVERRIDES[feature] ?? FEATURES[feature];
};