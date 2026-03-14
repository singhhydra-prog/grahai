import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import CosmicBackground from "@/components/ui/CosmicBackground"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#08091A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://grahai.vercel.app"),
  title: "GrahAI · Jyotish Darpan",
  description:
    "Your Planets, Your Path. Personalized Vedic astrology powered by AI — daily insights, kundli readings, and life guidance.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
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
    title: "GrahAI · Jyotish Darpan",
    description: "Personalized Vedic astrology powered by AI.",
    type: "website",
    locale: "en_IN",
    url: "https://grahai.vercel.app",
    siteName: "GrahAI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-bg text-text">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <CosmicBackground />
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <main id="main-content" className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
