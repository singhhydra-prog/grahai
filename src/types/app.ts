/* ═══════════════════════════════════════
   GrahAI — Frontend Type Definitions
   Melooha-style 3-tab layout
   ═══════════════════════════════════════ */

/** Bottom navigation tabs (matches Melooha) */
export type TabType = "compatibility" | "questions" | "reports"

/** Overlay screens */
export type OverlayType =
  | "profile"
  | "pricing"
  | "settings"
  | "report-detail"
  | "sidebar"

/** Birth data */
export interface BirthData {
  name: string
  gender?: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  latitude?: number
  longitude?: number
  timezone?: string
}

/** Astrological profile */
export interface AstroProfile {
  sunSignVedic: string
  sunSignWestern: string
  moonSign: string
  ascendant: string
  birthNakshatra: string
  nakshatraCharan: number
}

/** Chat message */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  isStreaming?: boolean
  senderName?: string
}

/** Report card data */
export interface ReportCard {
  id: string
  title: string
  subtitle: string
  guidancePeriod: string
  isLocked: boolean
  isFree?: boolean
  isNew?: boolean
  isTrending?: boolean
  category: string
}

/** Report category section */
export interface ReportCategory {
  id: string
  title: string
  reports: ReportCard[]
}

/** User profile */
export interface UserProfile {
  name: string
  initials: string
  email?: string
  gender: string
  birthData?: BirthData
  astroProfile?: AstroProfile
  questionsLeft: number
  reportsLeft: number
}
