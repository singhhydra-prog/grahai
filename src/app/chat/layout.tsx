import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Jyotish Chat — GrahAI",
  description: "Chat with GrahAI's Vedic astrology AI. Ask about your birth chart, planetary transits, Numerology, Tarot readings, and Vastu guidance.",
  openGraph: {
    title: "AI Jyotish Chat — GrahAI",
    description: "Chat with GrahAI's Vedic astrology AI for personalized readings.",
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
