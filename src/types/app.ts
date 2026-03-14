/* ═══════════════════════════════════════
   GrahAI — Frontend Type Definitions
   ═══════════════════════════════════════ */

/** Bottom navigation tabs */
export type TabType = "home" | "ask" | "reports" | "profile"

/** Overlay screens (modals, full-screen views) */
export type OverlayType =
  | "onboarding"
  | "pricing"
  | "settings"
  | "report-detail"
  | "compatibility"
  | "notifications"
  | "edit-profile"
  | "birth-details"

/** Birth data collected during onboarding */
export interface BirthData {
  name: string
  dateOfBirth: string      // ISO date string
  timeOfBirth: string      // HH:MM format
  placeOfBirth: string
  latitude?: number
  longitude?: number
  timezone?: string
}

/** Chat message in Ask tab */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  isStreaming?: boolean
}

/** Astrological report */
export interface Report {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string             // emoji or icon name
  isFree: boolean
  isPurchased?: boolean
  price?: number           // in INR
  validityDays?: number
  sections?: ReportSection[]
}

export interface ReportSection {
  title: string
  content: string
}

/** Life area categories for reports */
export interface LifeArea {
  id: string
  label: string
  icon: string
  color: string            // tailwind color class
  reports: Report[]
}

/** User profile data */
export interface UserProfile {
  name: string
  email: string
  plan: "free" | "plus" | "premium"
  birthData?: BirthData
  questionsToday: number
  streakDays: number
  joinedAt: string
}

/** Daily insight card */
export interface DailyInsight {
  title: string
  body: string
  category: string
  icon: string
}

/** Cosmic snapshot (home screen) */
export interface CosmicSnapshot {
  greeting: string
  moonSign: string
  currentDasha: string
  luckyNumber: number
  dominantPlanet: string
  briefInsight: string
}
