// TypeScript Type Definitions

export interface Interview {
  id: string
  userId: string
  roleDescription: string
  persona: "technical" | "skeptic" | "friendly" | "rushed"
  question: string
  questionType: "technical" | "behavioral"
  videoUrl?: string | null
  audioUrl?: string | null
  transcript?: string | null
  duration: number
  signalsDetected?: Signal[]
  strengths: string[]
  improvements: string[]
  createdAt: Date
  analyzedAt?: Date | null
}

export interface Signal {
  id: string
  interviewId: string
  name: string
  score: number
  definition: string
}

export interface UserProgress {
  id: string
  userId: string
  clarity: number[]
  depth: number[]
  pressure: number[]
  rolefit: number[]
  visibility: number[]
  lastUpdated: Date
  totalInterviews: number
  avgScore: number
}

export interface ProgressSnapshot {
  id: string
  interviewId: string
  clarity: number
  depth: number
  pressure: number
  rolefit: number
  visibility: number
  createdAt: Date
}

export interface AnalysisResult {
  signals: Array<{
    name: string
    score: number
    reason: string
  }>
  strengths: string[]
  improvements: string[]
  nextRecommendation: string
}

export interface RecordingBlob {
  blob: Blob
  duration: number
}

export type PersonaType = "technical" | "skeptic" | "friendly" | "rushed"

export interface PersonaOption {
  value: PersonaType
  label: string
  description: string
}

