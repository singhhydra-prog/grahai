import type { Metadata } from "next"
import { Inter } from "next/font/google"
import LenisProvider from "@/components/LenisProvider"
import { AppProviders } from "@/components/Providers"
import CosmicBackground from "@/components/CosmicBackground"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://grahai.vercel.app"),
  title: "GrahAI — AI-Powered Vedic Astrology",
  description:
    "Your Planets, Your Path. Personalized Kundli readings, Numerology insights, Tarot guidance, and Vastu consultations — powered by AI trained on classical Sanskrit texts.",
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
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "GrahAI — AI-Powered Vedic Astrology",
    description:
      "Ancient Vedic wisdom meets cutting-edge AI. Get personalized readings across Astrology, Numerology, Tarot & Vastu.",
    type: "website",
    locale: "en_IN",
    url: "https://grahai.vercel.app",
    siteName: "GrahAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GrahAI — AI-Powered Vedic Astrology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrahAI — AI-Powered Vedic Astrology",
    description:
      "Your Planets, Your Path. Personalized Vedic readings across Astrology, Numerology, Tarot & Vastu.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CosmicBackground />
        <LenisProvider>
          <AppProviders>{children}</AppProviders>
        </LenisProvider>
      </body>
    </html>
  )
}
