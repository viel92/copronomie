export const FEATURES = {
  BLOCKCHAIN_VOTES: true,
  AI_NEGOTIATION: true,
  SMART_MATCHING: true,
  AG_MODE: true,
  PHOTO_ANALYSIS: true,
  VIRTUAL_ASSISTANT: true,
  INVERSE_MARKETPLACE: true,
  PREDICTIVE_ANALYTICS: true,
  MULTI_TENANT: true,
  ADVANCED_FILTERS: true,
  REAL_TIME_NOTIFICATIONS: true,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return FEATURES[feature] === true;
};

// Configuration des modules par rôle
export const ROLE_PERMISSIONS = {
  admin: Object.keys(FEATURES) as (keyof typeof FEATURES)[],
  owner: Object.keys(FEATURES) as (keyof typeof FEATURES)[],
  syndic: [
    'AI_NEGOTIATION',
    'SMART_MATCHING', 
    'AG_MODE',
    'PHOTO_ANALYSIS',
    'VIRTUAL_ASSISTANT',
    'INVERSE_MARKETPLACE',
    'PREDICTIVE_ANALYTICS',
    'MULTI_TENANT',
    'ADVANCED_FILTERS',
    'REAL_TIME_NOTIFICATIONS'
  ] as (keyof typeof FEATURES)[],
  conseil_syndical: [
    'BLOCKCHAIN_VOTES',
    'AG_MODE', 
    'PHOTO_ANALYSIS',
    'VIRTUAL_ASSISTANT',
    'ADVANCED_FILTERS'
  ] as (keyof typeof FEATURES)[],
  coproprietaire: [
    'BLOCKCHAIN_VOTES',
    'VIRTUAL_ASSISTANT',
    'PHOTO_ANALYSIS'
  ] as (keyof typeof FEATURES)[]
} as const;

export const hasPermission = (userRole: string, feature: FeatureFlag): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
  return permissions.includes(feature);
};