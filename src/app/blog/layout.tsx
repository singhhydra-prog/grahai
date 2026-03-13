import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — Vedic Astrology Insights · GrahAI",
  description: "Learn Vedic astrology, Tarot, Numerology, and Vastu with in-depth articles. From birth chart basics to advanced Dasha analysis.",
  openGraph: {
    title: "Blog — Vedic Astrology Insights · GrahAI",
    description: "In-depth Vedic astrology articles and guides.",
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
