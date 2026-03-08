/* ════════════════════════════════════════════════════════
   GrahAI — Cosmic Snapshot API
   Zero-signup instant reading from birth date only
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import {
  SIGNS,
  NAKSHATRAS,
  NAKSHATRA_SPAN,
  PLANET_SANSKRIT,
  DAY_LORDS,
  STHIRA_KARAKA,
} from "@/lib/ephemeris/constants"

// ─── Numerology: Life Path Number ──────────────────────
function computeLifePath(date: Date): { number: number; meaning: string } {
  const d = date.getDate()
  const m = date.getMonth() + 1
  const y = date.getFullYear()

  function reduceToSingle(n: number): number {
    // Master numbers
    if (n === 11 || n === 22 || n === 33) return n
    while (n > 9) {
      n = String(n).split("").reduce((a, b) => a + parseInt(b), 0)
    }
    return n
  }

  const dayDigit = reduceToSingle(d)
  const monthDigit = reduceToSingle(m)
  const yearDigit = reduceToSingle(
    String(y).split("").reduce((a, b) => a + parseInt(b), 0)
  )
  const lifePathRaw = dayDigit + monthDigit + yearDigit
  const lifePath = reduceToSingle(lifePathRaw)

  const meanings: Record<number, string> = {
    1: "The Leader — independent, pioneering, ambitious. You forge your own path with courage and originality.",
    2: "The Diplomat — cooperative, intuitive, harmonious. You bring balance and sensitivity to everything you touch.",
    3: "The Creator — expressive, joyful, artistic. Your gift is communication and inspiring others through creativity.",
    4: "The Builder — disciplined, dependable, methodical. You create lasting structures and value hard work.",
    5: "The Adventurer — freedom-loving, versatile, curious. Change is your catalyst for growth.",
    6: "The Nurturer — responsible, loving, protective. You find purpose in caring for others and creating harmony.",
    7: "The Seeker — analytical, spiritual, introspective. You're drawn to deeper truths and hidden wisdom.",
    8: "The Powerhouse — authoritative, ambitious, manifesting. Material and spiritual abundance flows to you.",
    9: "The Humanitarian — compassionate, wise, selfless. Your life purpose involves serving the greater good.",
    11: "Master 11: The Illuminator — visionary, spiritual teacher, channel of higher wisdom.",
    22: "Master 22: The Master Builder — turns grand visions into reality on a large scale.",
    33: "Master 33: The Master Teacher — embodies compassion and uplifts humanity through love.",
  }

  return {
    number: lifePath,
    meaning: meanings[lifePath] || meanings[reduceToSingle(lifePath)] || "A unique soul on a special journey.",
  }
}

// ─── Approximate Sidereal Sun Position ─────────────────
// Tropical → Sidereal using approximate Lahiri ayanamsa
function getSiderealSunLongitude(date: Date): number {
  // Days since J2000.0
  const j2000 = new Date("2000-01-01T12:00:00Z")
  const days = (date.getTime() - j2000.getTime()) / 86400000

  // Mean tropical longitude of Sun (simplified)
  const L = (280.46646 + 0.9856474 * days) % 360

  // Mean anomaly
  const M = ((357.52911 + 0.9856003 * days) % 360) * (Math.PI / 180)

  // Equation of center (simplified)
  const C = 1.9146 * Math.sin(M) + 0.02 * Math.sin(2 * M)

  const tropicalLong = ((L + C) % 360 + 360) % 360

  // Approximate Lahiri ayanamsa for current epoch (~24.17° in 2026)
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397

  const siderealLong = ((tropicalLong - ayanamsa) % 360 + 360) % 360

  return siderealLong
}

// ─── Approximate Moon longitude (very rough for demo) ──
function getApproxMoonLongitude(date: Date): number {
  const j2000 = new Date("2000-01-01T12:00:00Z")
  const days = (date.getTime() - j2000.getTime()) / 86400000
  // Moon's mean longitude (simplified)
  const L = (218.316 + 13.176396 * days) % 360
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397
  return ((L - ayanamsa) % 360 + 360) % 360
}

// ─── Today's Transit Vibe ──────────────────────────────
function getTodayTransitVibe(): { vibe: string; emoji: string; detail: string } {
  const now = new Date()
  const sunLong = getSiderealSunLongitude(now)
  const moonLong = getApproxMoonLongitude(now)

  const sunSign = SIGNS[Math.floor(sunLong / 30)]
  const moonSign = SIGNS[Math.floor(moonLong / 30)]
  const dayLord = DAY_LORDS[now.getDay()]

  const vibes = [
    { vibe: "Expansive & Auspicious", emoji: "✨", detail: `The Sun transits ${sunSign.name} (${sunSign.sanskrit}) while the Moon illuminates ${moonSign.name}. ${dayLord.name} is ruled by ${PLANET_SANSKRIT[dayLord.lord]} — a day for ${dayLord.lord === "Jupiter" ? "wisdom and growth" : dayLord.lord === "Venus" ? "creativity and beauty" : dayLord.lord === "Saturn" ? "discipline and karma" : dayLord.lord === "Sun" ? "confidence and leadership" : dayLord.lord === "Moon" ? "intuition and nurturing" : dayLord.lord === "Mars" ? "courage and action" : "communication and learning"}.` },
  ]

  return vibes[0]
}

// ─── Element personality snapshot ──────────────────────
function getElementInsight(element: string): string {
  const insights: Record<string, string> = {
    Fire: "Your soul burns bright with ambition and passion. Fire signs are natural leaders who inspire others with their enthusiasm and vision.",
    Earth: "Grounded and purposeful, you build lasting foundations. Earth signs are practical visionaries who turn dreams into tangible reality.",
    Air: "Your mind dances with ideas and connections. Air signs are the communicators and thinkers who weave the social fabric of the world.",
    Water: "Deep emotional currents guide your intuition. Water signs feel the unseen, sense the unspoken, and heal through empathy.",
  }
  return insights[element] || "Your unique cosmic blueprint holds profound mysteries."
}

export async function POST(req: NextRequest) {
  try {
    const { birthDate } = await req.json()

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date is required" }, { status: 400 })
    }

    const date = new Date(birthDate)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // ── Sun Sign (Sidereal / Vedic) ──
    const sunLong = getSiderealSunLongitude(date)
    const sunSignIndex = Math.floor(sunLong / 30)
    const sunSign = SIGNS[sunSignIndex]
    const sunDegree = (sunLong % 30).toFixed(1)

    // ── Nakshatra ──
    const nakshatraIndex = Math.floor(sunLong / NAKSHATRA_SPAN)
    const nakshatra = NAKSHATRAS[nakshatraIndex]
    const pada = Math.floor((sunLong - nakshatraIndex * NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1

    // ── Ruling Planet ──
    const rulingPlanet = sunSign.lord
    const rulingPlanetSanskrit = PLANET_SANSKRIT[rulingPlanet]
    const karakas = STHIRA_KARAKA[rulingPlanet]

    // ── Life Path Number ──
    const lifePath = computeLifePath(date)

    // ── Element & Quality ──
    const element = sunSign.element
    const elementInsight = getElementInsight(element)

    // ── Today's Transit Vibe ──
    const transit = getTodayTransitVibe()

    // ── Day of birth insight ──
    const birthDay = date.getDay()
    const birthDayInfo = DAY_LORDS[birthDay]

    return NextResponse.json({
      success: true,
      snapshot: {
        vedicSign: {
          name: sunSign.name,
          sanskrit: sunSign.sanskrit,
          degree: sunDegree,
          element: sunSign.element,
          quality: sunSign.quality,
          lord: rulingPlanet,
          lordSanskrit: rulingPlanetSanskrit,
          gender: sunSign.gender,
        },
        nakshatra: {
          name: nakshatra.name,
          sanskrit: nakshatra.sanskrit,
          lord: nakshatra.lord,
          deity: nakshatra.deity,
          pada,
          symbol: nakshatra.symbol,
          shakti: nakshatra.shakti,
          animal: nakshatra.animal,
          gana: nakshatra.gana,
        },
        lifePath: {
          number: lifePath.number,
          meaning: lifePath.meaning,
        },
        element: {
          name: element,
          insight: elementInsight,
        },
        rulingPlanet: {
          name: rulingPlanet,
          sanskrit: rulingPlanetSanskrit,
          signifies: karakas.join(", "),
        },
        birthDay: {
          name: birthDayInfo.name,
          sanskrit: birthDayInfo.sanskrit,
          lord: birthDayInfo.lord,
          lordSanskrit: PLANET_SANSKRIT[birthDayInfo.lord],
        },
        todayTransit: transit,
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to compute cosmic snapshot" }, { status: 500 })
  }
}
