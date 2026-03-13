/* ════════════════════════════════════════════════════
   GrahAI — Geo-based Pricing Engine
   Auto-detects India vs International users
   Shows ₹ for India, $ for NRI/international
   ════════════════════════════════════════════════════ */

export type Region = "IN" | "INTL"
export type Currency = "INR" | "USD"

export interface PricingTier {
  id: string
  name: string
  nameHi?: string
  description: string
  priceINR: number
  priceUSD: number
  features: string[]
  popular?: boolean
  cta: string
}

export interface MicroTransaction {
  id: string
  name: string
  description: string
  priceINR: number
  priceUSD: number
  icon: string
}

/* ─── Pricing Tiers ─── */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Begin your cosmic journey",
    priceINR: 0,
    priceUSD: 0,
    features: [
      "3 welcome questions to start",
      "1 question per day after",
      "Basic Kundli generation",
      "Daily Panchang overview",
      "Name numerology reading",
      "Sun sign daily insight",
    ],
    cta: "Start Free",
  },
  {
    id: "plus",
    name: "Plus",
    nameHi: "प्लस",
    description: "For the curious seeker",
    priceINR: 199,
    priceUSD: 5,
    popular: true,
    features: [
      "30 questions per month",
      "Full Kundli with Dasha analysis",
      "Nakshatra deep dive",
      "Sanskrit verse references",
      "Tarot 3-card spread",
      "Basic Vastu guidance",
      "Bilingual: Hindi + English",
      "Gemstone recommendations",
    ],
    cta: "Upgrade to Plus",
  },
  {
    id: "premium",
    name: "Premium",
    nameHi: "प्रीमियम",
    description: "Complete cosmic intelligence",
    priceINR: 499,
    priceUSD: 10,
    features: [
      "Unlimited conversations",
      "Full Kundli + Divisional charts",
      "Advanced Dasha predictions",
      "Compatibility analysis",
      "Full 78-card Tarot",
      "Complete Vastu mapping",
      "Monthly transit reports",
      "Priority response speed",
      "Annual prediction reports",
      "Muhurta — auspicious timing",
      "Export to PDF",
    ],
    cta: "Go Premium",
  },
]

/* ─── Micro-Transactions (one-off unlocks) ─── */
export const MICRO_TRANSACTIONS: MicroTransaction[] = [
  { id: "deep-dasha", name: "Dasha Deep Dive", description: "10-year Dasha timeline with monthly breakdowns", priceINR: 49, priceUSD: 2, icon: "🪐" },
  { id: "love-compat", name: "Love Compatibility", description: "Detailed Ashta Koot matching with remedies", priceINR: 79, priceUSD: 3, icon: "💕" },
  { id: "career-report", name: "Career Blueprint", description: "10th house analysis + profession timing", priceINR: 49, priceUSD: 2, icon: "💼" },
  { id: "annual-forecast", name: "Annual Forecast", description: "Month-by-month predictions for the year ahead", priceINR: 99, priceUSD: 4, icon: "📅" },
  { id: "vastu-scan", name: "Vastu Quick Scan", description: "Room-by-room directional analysis", priceINR: 49, priceUSD: 2, icon: "🏠" },
  { id: "gem-rx", name: "Gemstone Rx", description: "Personalized gemstone + metal recommendations", priceINR: 29, priceUSD: 1, icon: "💎" },
]

/* ─── Geo Detection ─── */
let cachedRegion: Region | null = null

export async function detectRegion(): Promise<Region> {
  if (cachedRegion) return cachedRegion

  try {
    // Use timezone as primary heuristic (no API call needed)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) {
      cachedRegion = "IN"
      return "IN"
    }

    // Fallback: try free geo API
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const data = await res.json()
      cachedRegion = data.country_code === "IN" ? "IN" : "INTL"
      return cachedRegion
    }
  } catch {
    // Default to international if detection fails
  }

  cachedRegion = "INTL"
  return "INTL"
}

export function getCurrency(region: Region): Currency {
  return region === "IN" ? "INR" : "USD"
}

export function formatPrice(amount: number, currency: Currency): string {
  if (amount === 0) return "Free"
  if (currency === "INR") return `₹${amount}`
  return `$${amount}`
}

export function getPriceForRegion(tier: PricingTier | MicroTransaction, region: Region): string {
  const currency = getCurrency(region)
  const amount = currency === "INR" ? tier.priceINR : tier.priceUSD
  return formatPrice(amount, currency)
}
