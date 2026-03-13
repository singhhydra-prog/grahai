// Shared types for the app module

export type TabType = "home" | "ask" | "mychart" | "reports"
export type OverlayType = "kundli" | "daily" | "pricing" | "compatibility" | "onboarding" | "dashboard" | "horoscope" | "reports-detail" | "settings" | "blog" | "chat" | "astrologer" | "checkout" | "auth-login" | "about" | "contact" | "product" | "privacy" | "terms" | "blog-post" | "refer-earn" | "sample-preview" | null

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

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
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
