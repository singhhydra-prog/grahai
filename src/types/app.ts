/* ═══════════════════════════════════════
   GrahAI v3 — Premium AI Jyotish App
   Navy/Gold design · 5-tab navigation
   ═══════════════════════════════════════ */

/** Primary navigation tabs */
export type TabType = "home" | "ask" | "chart" | "reports" | "profile"

/** Overlay screens that slide over content */
export type OverlayType =
  | "ask-chat"
  | "report-detail"
  | "pricing"
  | "settings"

/** Onboarding step identifiers */
export type OnboardingStep =
  | "welcome"
  | "intent"
  | "trust"
  | "birth-details"
  | "instant-reveal"

/** User intent from onboarding */
export type IntentCategory =
  | "career"
  | "love"
  | "marriage"
  | "money"
  | "emotional"
  | "daily"
  | "exploring"

/** Birth data collected during onboarding */
export interface BirthData {
  name: string
  gender?: "male" | "female" | "other"
  dateOfBirth: string
  timeOfBirth: string
  timeUnknown?: boolean
  placeOfBirth: string
  latitude?: number
  longitude?: number
  timezone?: string
}

/** Astrological profile computed from birth data */
export interface AstroProfile {
  moonSign: string
  risingSign: string
  sunSignVedic: string
  sunSignWestern: string
  nakshatra: string
  nakshatraPada?: number
  currentDasha?: string
  dominantTheme?: string
}

/** Cosmic snapshot returned after onboarding */
export interface CosmicSnapshot {
  profile: AstroProfile
  todayInsight: string
  dominantLifeTheme: string
  suggestedFirstQuestion: string
}

/** Structured ask response — every answer follows this format */
export interface AskResponse {
  directAnswer: string
  whyShowingUp: string
  whatToDo: string
  whatToAvoid: string
  timeWindow: string
  remedy?: string
  sourceExplanation?: string
  followUpChips: string[]
}

/** Chat message */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  structured?: AskResponse
  timestamp: number
  isStreaming?: boolean
  topic?: string
}

/** Daily guidance for home screen */
export interface DailyGuidance {
  theme: string
  headline: string
  body: string
  doList: string[]
  avoidList: string[]
  loveCard?: string
  careerCard?: string
  energyCard?: string
}

/** Report card */
export interface ReportCard {
  id: string
  title: string
  description: string
  whatItHelps: string
  whatsInside: string[]
  category: ReportCategoryId
  pricing: "free" | "plus" | "premium" | "one-time"
  price?: number
  isUnlocked?: boolean
  previewSnippet?: string
  icon: string
}

export type ReportCategoryId =
  | "love-compatibility"
  | "career-blueprint"
  | "marriage-timing"
  | "annual-forecast"
  | "wealth-growth"
  | "dasha-deep-dive"

/** User profile */
export interface UserProfile {
  id?: string
  name: string
  email?: string
  birthData: BirthData
  astroProfile?: AstroProfile
  tier: "free" | "plus" | "premium"
  questionsRemaining: number
  reportsUnlocked: string[]
  createdAt?: string
}

/** Pricing tier */
export interface PricingTier {
  id: "free" | "plus" | "premium"
  name: string
  price: number
  period: "month" | "year"
  features: string[]
  questionsPerDay: number
  highlighted?: boolean
}
