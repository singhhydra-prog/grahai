// Shared types for the GrahAI app

// Bottom nav now includes Profile as a 5th tab
export type TabType = "home" | "ask" | "mychart" | "reports" | "profile"

export type OverlayType =
  | "kundli"
  | "daily"
  | "pricing"
  | "compatibility"
  | "onboarding"
  | "dashboard"
  | "horoscope"
  | "reports-detail"
  | "settings"
  | "blog"
  | "chat"
  | "astrologer"
  | "checkout"
  | "auth-login"
  | "about"
  | "contact"
  | "product"
  | "privacy"
  | "terms"
  | "blog-post"
  | "refer-earn"
  | "sample-preview"
  | "source-drawer"
  | "upgrade"
  | null

// ─── Chat ──────────────────────────────────────
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
  sources?: AstroSource[]
  followUps?: string[]
}

// ─── Astro Sources (visible reasoning) ─────────
export interface AstroSource {
  label: string          // e.g. "Saturn in 10th House"
  system: string         // e.g. "Vedic · Parashari"
  reference?: string     // e.g. "BPHS Ch.24 Sl.3"
  confidence?: "high" | "medium" | "low"
}

// ─── Birth Data ────────────────────────────────
export interface BirthData {
  name?: string
  dateOfBirth?: string   // ISO date
  timeOfBirth?: string   // HH:MM
  placeOfBirth?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

// ─── Profile ───────────────────────────────────
export interface UserProfile {
  id: string
  name: string
  email: string
  birth_data: BirthData
  preferences: UserPreferences
  plan: "free" | "plus" | "premium"
  question_count_today: number
  streak_days: number
  last_active_at: string
}

export interface UserPreferences {
  language: "en" | "hi"
  tone: "calm" | "direct" | "poetic"
  notifications?: boolean
}

// ─── Cosmic Identity ───────────────────────────
export interface CosmicIdentity {
  sunSign: string
  moonSign: string
  ascendant: string
  nakshatra: string
  currentDasha: string
  dashaEndDate?: string
}

// ─── Reports ───────────────────────────────────
export interface ReportCollection {
  id: string
  lifeArea: string        // "Career", "Love", "Wealth", etc.
  title: string
  description: string
  icon: string
  reports: ReportItem[]
}

export interface ReportItem {
  id: string
  title: string
  description: string
  price: number
  currency: string
  tier: "free" | "plus" | "premium"
  badges?: string[]
  includes?: string[]
}

// ─── Insight Cards ─────────────────────────────
export interface InsightCard {
  id: string
  title: string
  body: string
  sources: AstroSource[]
  category: "transit" | "dasha" | "natal" | "remedy"
  urgency?: "high" | "medium" | "low"
  cta?: { label: string; action: string }
}

// ─── Timeline Events ───────────────────────────
export interface TimelineEvent {
  id: string
  date: string
  title: string
  body: string
  type: "transit" | "dasha-shift" | "eclipse" | "retrograde"
  sources: AstroSource[]
}

// ─── Legacy compat ─────────────────────────────
export interface CosmicStory {
  id: string
  emoji: string
  tag: string
  tagColor: string
  title: string
  titleHi: string
  body: string
  source: string
  sourceRef: string
  cta: { label: string; action: string }
  gradient: string
}

export interface TopUpModule {
  id: string
  icon: React.ReactNode
  title: string
  titleHi: string
  price: string
  priceLabel: string
  description: string
  tag?: string
  action: string
  gradient: string
}
