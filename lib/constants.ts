// Application Constants
// Centralized configuration values to avoid magic numbers/strings

// Interview Configuration
export const MAX_QUESTIONS = 5
export const MAX_RECORDING_SECONDS = 300 // 5 minutes
export const MIN_RECORDING_SECONDS = 10
export const RECORDING_CHUNK_INTERVAL_MS = 1000

// Question Types
export const QUESTION_TYPES = [
  'technical',
  'behavioral',
  'system_design',
  'leadership',
  'problem_solving',
  'culture_fit',
  'role_specific',
  'situational',
] as const

export type QuestionType = (typeof QUESTION_TYPES)[number]

// Interviewer Personas
export const PERSONAS = ['technical', 'skeptic', 'friendly', 'rushed'] as const
export type PersonaType = (typeof PERSONAS)[number]

export const PERSONA_INFO: Record<PersonaType, { label: string; emoji: string; description: string }> = {
  technical: {
    label: 'The Technical',
    emoji: '🔧',
    description: 'Deep technical questions, expects detailed explanations',
  },
  skeptic: {
    label: 'The Skeptic',
    emoji: '🤨',
    description: 'Challenges your answers, pushes for edge cases',
  },
  friendly: {
    label: 'The Friendly',
    emoji: '😊',
    description: 'Warm and supportive, focuses on culture fit',
  },
  rushed: {
    label: 'The Rushed',
    emoji: '⚡',
    description: 'Time-constrained, expects concise answers',
  },
}

// UI Timing
export const LOADING_DELAY_MS = 800
export const TOAST_DURATION_MS = 5000
export const TOAST_DURATION_ERROR_MS = 8000
export const DEBOUNCE_DELAY_MS = 300
export const ANIMATION_DURATION_MS = 300

// API Configuration
export const API_TIMEOUT_MS = 30000
export const MAX_RETRIES = 3
export const RETRY_DELAY_MS = 1000

// Rate Limiting
export const RATE_LIMIT_REQUESTS = 10
export const RATE_LIMIT_WINDOW_SECONDS = 60

// Validation Limits
export const MAX_ROLE_DESCRIPTION_LENGTH = 500
export const MIN_ROLE_DESCRIPTION_LENGTH = 3
export const MAX_TRANSCRIPT_LENGTH = 50000

// Scoring
export const MIN_SCORE = 0
export const MAX_SCORE = 10
export const PASSING_SCORE = 7

// Session Storage Keys
export const STORAGE_KEYS = {
  INTERVIEW_PREFIX: 'interview_',
  USER_PREFERENCES: 'user_preferences',
  LAST_ROLE: 'last_role',
  LAST_PERSONA: 'last_persona',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  NEW_INTERVIEW: '/interview/new',
  INTERVIEW_SESSION: (id: string) => `/interview/session/${id}`,
  INTERVIEW_RESULTS: (id: string) => `/interview/results/${id}`,
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
} as const

// Internal Page Routes
export const LEGAL_ROUTES = {
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact',
} as const

// External URLs
export const EXTERNAL_URLS = {
  SUPPORT_EMAIL: 'support@prepscore.ai',
  PAYPAL_DONATE: 'https://www.paypal.com/paypalme/MiroslavGruevski',
} as const

