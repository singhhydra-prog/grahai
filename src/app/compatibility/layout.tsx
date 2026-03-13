import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compatibility Matching — GrahAI",
  description: "Vedic Kundli matching (Gun Milan) with AI. Check your romantic, friendship, and business compatibility based on Ashtakoot scoring.",
  openGraph: {
    title: "Compatibility Matching — GrahAI",
    description: "Vedic Kundli matching (Gun Milan) powered by AI.",
  },
}

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return children
}
