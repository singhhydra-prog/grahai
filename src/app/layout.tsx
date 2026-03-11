import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import LenisProvider from "@/components/LenisProvider"
import { AppProviders } from "@/components/Providers"
import CosmicBackground from "@/components/CosmicBackground"
import PWARegister from "@/components/PWARegister"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

/* ═══ PWA VIEWPORT ═══ */
export const viewport: Viewport = {
  themeColor: "#0E1538",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GrahAI",
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
        <PWARegister />
        <CosmicBackground />
        <LenisProvider>
          <AppProviders>{children}</AppProviders>
        </LenisProvider>
      </body>
    </html>
  )
}
