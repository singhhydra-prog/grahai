import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Astrologer — Ask Free Questions · GrahAI",
  description: "Ask the AI Astrologer about love, career, health, and destiny. Free Vedic astrology readings powered by classical Jyotish texts. No login required.",
  openGraph: {
    title: "AI Astrologer — Ask Free Questions · GrahAI",
    description: "Free AI-powered Vedic astrology readings. Ask about love, career & destiny.",
  },
}

export default function AstrologerLayout({ children }: { children: React.ReactNode }) {
  return children
}
