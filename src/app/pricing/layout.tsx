import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing Plans — GrahAI",
  description: "Choose your Vedic astrology plan. Free Nakshatra tier, Graha at ₹499/mo, or Rishi at ₹1,499/mo. Kundli, Tarot, Numerology, and Vastu included.",
  openGraph: {
    title: "Pricing Plans — GrahAI",
    description: "Affordable Vedic astrology plans starting free. Unlock Kundli, Tarot, Numerology & Vastu.",
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
