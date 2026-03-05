import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "GrahAI — AI-Powered Vedic Astrology",
  description:
    "Experience ancient Vedic wisdom through cutting-edge AI. Personalized Kundli readings, Numerology insights, Tarot guidance, and Vastu consultations — powered by 28 specialized AI agents.",
  keywords: [
    "vedic astrology",
    "kundli",
    "AI astrology",
    "horoscope",
    "numerology",
    "tarot",
    "vastu",
    "jyotish",
    "grahai",
  ],
  openGraph: {
    title: "GrahAI — AI-Powered Vedic Astrology",
    description:
      "Ancient Vedic wisdom meets cutting-edge AI. Get personalized readings across Astrology, Numerology, Tarot & Vastu.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrahAI — AI-Powered Vedic Astrology",
    description:
      "Ancient Vedic wisdom meets cutting-edge AI. Personalized readings powered by 28 specialized AI agents.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
