import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kundli — Birth Chart · GrahAI",
  description: "Generate your Vedic birth chart (Kundli) with AI. Full Rashi, Navamsa, Dasha periods, Yogas, Doshas, and planetary positions powered by Swiss Ephemeris.",
  openGraph: {
    title: "Kundli — Birth Chart · GrahAI",
    description: "Generate your Vedic Kundli with AI. Full Rashi, Dasha, Yogas, and Doshas.",
  },
}

export default function KundliLayout({ children }: { children: React.ReactNode }) {
  return children
}
