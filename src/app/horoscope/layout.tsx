import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daily Horoscope — GrahAI",
  description: "AI-powered daily horoscope based on your Vedic birth chart. Personalized planetary transits, Panchang, and Dasha-aware predictions.",
  openGraph: {
    title: "Daily Horoscope — GrahAI",
    description: "AI-powered daily horoscope based on your Vedic birth chart.",
  },
}

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return children
}
