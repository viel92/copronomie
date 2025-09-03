// Constantes globales pour Copronomie

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  SYNDIC: 'syndic',
  CONSEIL_SYNDICAL: 'conseil_syndical'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Status de comparaison
export const COMPARISON_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ERROR: 'error'
} as const

export type ComparisonStatus = typeof COMPARISON_STATUS[keyof typeof COMPARISON_STATUS]

// Types de fichiers acceptés
export const ACCEPTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
} as const

// Limites de fichiers
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  MIN_FILES: 2
} as const

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Action interdite',
  NOT_FOUND: 'Ressource introuvable',
  VALIDATION_ERROR: 'Données invalides',
  SERVER_ERROR: 'Erreur serveur interne',
  FILE_TOO_LARGE: 'Fichier trop volumineux',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  INSUFFICIENT_FILES: 'Nombre de fichiers insuffisant',
  TOO_MANY_FILES: 'Trop de fichiers',
  PDF_EXTRACTION_ERROR: 'Erreur lors de l\'extraction du PDF',
  AI_ANALYSIS_ERROR: 'Erreur lors de l\'analyse IA'
} as const

// Messages de succès
export const SUCCESS_MESSAGES = {
  COMPARISON_CREATED: 'Comparaison créée avec succès',
  COMPARISON_UPDATED: 'Comparaison mise à jour',
  COMPARISON_DELETED: 'Comparaison supprimée',
  COPROPRIETE_CREATED: 'Copropriété créée avec succès',
  COPROPRIETE_UPDATED: 'Copropriété mise à jour',
  COPROPRIETE_DELETED: 'Copropriété supprimée',
  FILE_UPLOADED: 'Fichier uploadé avec succès',
  PDF_EXPORTED: 'Rapport PDF exporté'
} as const

// Spécialités d'entreprises
export const COMPANY_SPECIALITIES = [
  'Ravalement de façade',
  'Toiture',
  'Plomberie',
  'Électricité',
  'Chauffage',
  'Climatisation',
  'Menuiserie',
  'Peinture',
  'Isolation',
  'Étanchéité',
  'Ascenseurs',
  'Espaces verts',
  'Nettoyage',
  'Gardiennage',
  'Rénovation énergétique'
] as const

// Critères d'évaluation par défaut
export const DEFAULT_EVALUATION_CRITERIA = [
  'Prix total',
  'Qualité des matériaux',
  'Délai de réalisation',
  'Garanties proposées',
  'Références et expérience',
  'Prestations incluses'
] as const

// Seuils de notation
export const SCORE_THRESHOLDS = {
  EXCELLENT: 8,
  GOOD: 6,
  POOR: 4
} as const

// Formats de date
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  FULL: 'dd/MM/yyyy HH:mm'
} as const

// URLs d'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password'
  },
  COMPARISONS: {
    LIST: '/api/comparisons',
    CREATE: '/api/comparisons',
    DETAILS: (id: string) => `/api/comparisons/${id}`,
    UPDATE: (id: string) => `/api/comparisons/${id}`,
    DELETE: (id: string) => `/api/comparisons/${id}`,
    COMPARE: '/api/compare-devis'
  },
  COPROPRIETES: {
    LIST: '/api/coproprietes',
    CREATE: '/api/coproprietes',
    DETAILS: (id: string) => `/api/coproprietes/${id}`,
    UPDATE: (id: string) => `/api/coproprietes/${id}`,
    DELETE: (id: string) => `/api/coproprietes/${id}`
  },
  COMPANIES: {
    LIST: '/api/companies',
    CREATE: '/api/companies',
    DETAILS: (id: string) => `/api/companies/${id}`,
    UPDATE: (id: string) => `/api/companies/${id}`,
    DELETE: (id: string) => `/api/companies/${id}`
  },
  FILES: {
    UPLOAD: '/api/upload',
    ANALYZE_PDF: '/api/analyze-devis'
  }
} as const

// Configuration pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const

// Timeouts
export const TIMEOUTS = {
  FILE_UPLOAD: 30000, // 30s
  AI_ANALYSIS: 120000, // 2min
  PDF_EXTRACTION: 15000 // 15s
} as const