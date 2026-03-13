import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daily Insights — GrahAI",
  description: "Personalized daily Vedic insights with Panchang, transit analysis, Dasha context, and daily remedies tailored to your birth chart.",
  openGraph: {
    title: "Daily Insights — GrahAI",
    description: "Personalized daily Vedic astrology insights and Panchang.",
  },
}

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children
}
