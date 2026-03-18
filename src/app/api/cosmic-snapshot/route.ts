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
function computeLifePath(date: Date, moonSignName: string = "", moonSignQuality: string = ""): { number: number; meaning: string } {
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

  let baseMeaning = meanings[lifePath] || meanings[reduceToSingle(lifePath)] || "A unique soul on a special journey."

  if (moonSignName && moonSignQuality) {
    baseMeaning += ` Combined with your ${moonSignName} Moon, this amplifies your ${moonSignQuality} nature.`
  }

  return {
    number: lifePath,
    meaning: baseMeaning,
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

// ─── Approximate Moon longitude (improved) ──────────────
function getApproxMoonLongitude(date: Date): number {
  const j2000 = new Date("2000-01-01T12:00:00Z")
  const days = (date.getTime() - j2000.getTime()) / 86400000
  // Moon's mean longitude with basic perturbation terms
  const L0 = 218.316 + 13.176396 * days
  const M = ((134.963 + 13.064993 * days) % 360) * (Math.PI / 180)
  const F = ((93.272 + 13.229350 * days) % 360) * (Math.PI / 180)
  // Major perturbation: evection + variation
  const perturbation = 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * F - M)
  const tropicalLong = ((L0 + perturbation) % 360 + 360) % 360
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397
  return ((tropicalLong - ayanamsa) % 360 + 360) % 360
}

// ─── Approximate Rising Sign (Lagna / Ascendant) ────────
// Uses Local Sidereal Time to estimate the rising sign
function getApproxRisingSign(date: Date, birthTime: string, latitude: number, longitude: number): { sign: string; sanskrit: string; degree: string } | null {
  try {
    if (!birthTime || !latitude || !longitude) return null

    // Parse birth time
    const [hours, minutes] = birthTime.split(":").map(Number)
    if (isNaN(hours) || isNaN(minutes)) return null

    // Create datetime combining date + time in UTC approximation
    const dt = new Date(date)
    dt.setHours(hours, minutes, 0, 0)

    // Julian centuries since J2000.0
    const j2000 = new Date("2000-01-01T12:00:00Z")
    const JD = 2451545.0 + (dt.getTime() - j2000.getTime()) / 86400000
    const T = (JD - 2451545.0) / 36525

    // Greenwich Mean Sidereal Time (in degrees)
    const GMST = (280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T) % 360

    // Local Sidereal Time
    const LST = ((GMST + longitude) % 360 + 360) % 360

    // Obliquity of ecliptic
    const obliquity = (23.4393 - 0.0130 * T) * (Math.PI / 180)
    const lstRad = LST * (Math.PI / 180)
    const latRad = latitude * (Math.PI / 180)

    // Ascendant formula
    const y = -Math.cos(lstRad)
    const x = Math.sin(obliquity) * Math.tan(latRad) + Math.cos(obliquity) * Math.sin(lstRad)
    let ascendantTropical = Math.atan2(y, x) * (180 / Math.PI)
    ascendantTropical = ((ascendantTropical % 360) + 360) % 360

    // Convert to sidereal
    const year = dt.getFullYear() + (dt.getMonth() + 1) / 12
    const ayanamsa = 23.85 + (year - 2000) * 0.01397
    const ascendantSidereal = ((ascendantTropical - ayanamsa) % 360 + 360) % 360

    const signIndex = Math.floor(ascendantSidereal / 30)
    const sign = SIGNS[signIndex]
    const degree = (ascendantSidereal % 30).toFixed(1)

    return { sign: sign.name, sanskrit: sign.sanskrit, degree }
  } catch {
    return null
  }
}

// ─── Today's Transit Vibe ──────────────────────────────
function getTodayTransitVibe(userMoonSignIndex: number): { vibe: string; emoji: string; detail: string } {
  const now = new Date()
  const sunLong = getSiderealSunLongitude(now)
  const moonLong = getApproxMoonLongitude(now)
  const daysSinceEpoch = Math.floor((now.getTime() - new Date("2000-01-01").getTime()) / 86400000)

  const sunSign = SIGNS[Math.floor(sunLong / 30)]
  const moonSign = SIGNS[Math.floor(moonLong / 30)]
  const dayLord = DAY_LORDS[now.getDay()]

  // Use user's moon sign index combined with date to select a vibe deterministically
  const vibeIndex = (userMoonSignIndex + daysSinceEpoch) % 3

  const vibes = [
    { vibe: "Expansive & Auspicious", emoji: "✨", detail: `The Sun transits ${sunSign.name} (${sunSign.sanskrit}) while the Moon illuminates ${moonSign.name}. ${dayLord.name} is ruled by ${PLANET_SANSKRIT[dayLord.lord]} — a day for ${dayLord.lord === "Jupiter" ? "wisdom and growth" : dayLord.lord === "Venus" ? "creativity and beauty" : dayLord.lord === "Saturn" ? "discipline and karma" : dayLord.lord === "Sun" ? "confidence and leadership" : dayLord.lord === "Moon" ? "intuition and nurturing" : dayLord.lord === "Mars" ? "courage and action" : "communication and learning"}.` },
    { vibe: "Introspective & Grounding", emoji: "🌍", detail: `The Sun in ${sunSign.name} asks for reflection as the Moon aligns with ${moonSign.name}. With ${dayLord.name} governed by ${PLANET_SANSKRIT[dayLord.lord]}, this is a day for stabilizing foundations and examining your inner landscape.` },
    { vibe: "Dynamic & Transformative", emoji: "⚡", detail: `The Sun's transit through ${sunSign.name} meets dynamic ${moonSign.name} energy. ${dayLord.name} (ruled by ${PLANET_SANSKRIT[dayLord.lord]}) invites action and positive change. Your lunar influence suggests this is a powerful moment for new initiatives.` },
  ]

  return vibes[vibeIndex]
}

// ─── Element personality snapshot ──────────────────────
function getElementInsight(element: string, rulingPlanet: string = "", nakshatraName: string = ""): string {
  const insights: Record<string, string> = {
    Fire: "Your soul burns bright with ambition and passion. Fire signs are natural leaders who inspire others with their enthusiasm and vision.",
    Earth: "Grounded and purposeful, you build lasting foundations. Earth signs are practical visionaries who turn dreams into tangible reality.",
    Air: "Your mind dances with ideas and connections. Air signs are the communicators and thinkers who weave the social fabric of the world.",
    Water: "Deep emotional currents guide your intuition. Water signs feel the unseen, sense the unspoken, and heal through empathy.",
  }
  let baseInsight = insights[element] || "Your unique cosmic blueprint holds profound mysteries."

  if (rulingPlanet && nakshatraName) {
    baseInsight += ` Ruled by ${rulingPlanet}, your cosmic authority channels through ${nakshatraName} nakshatra's unique energy.`
  }

  return baseInsight
}

export async function POST(req: NextRequest) {
  try {
    const { birthDate, birthTime, latitude, longitude } = await req.json()

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

    // ── Moon Sign (Sidereal / Vedic) ──
    // Use birth time if available for better Moon accuracy
    const moonDate = birthTime ? (() => {
      const [h, m] = birthTime.split(":").map(Number)
      const d = new Date(date)
      d.setHours(h || 0, m || 0, 0, 0)
      return d
    })() : date
    const moonLong = getApproxMoonLongitude(moonDate)
    const moonSignIndex = Math.floor(moonLong / 30)
    const moonSign = SIGNS[moonSignIndex]
    const moonDegree = (moonLong % 30).toFixed(1)

    // ── Moon Nakshatra (Janma Nakshatra — the primary nakshatra in Jyotish) ──
    const moonNakshatraIndex = Math.floor(moonLong / NAKSHATRA_SPAN)
    const moonNakshatra = NAKSHATRAS[moonNakshatraIndex]
    const moonNakshatraPada = Math.floor((moonLong - moonNakshatraIndex * NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1

    // ── Sun Nakshatra (secondary) ──
    const sunNakshatraIndex = Math.floor(sunLong / NAKSHATRA_SPAN)
    const sunNakshatra = NAKSHATRAS[sunNakshatraIndex]
    const sunNakshatraPada = Math.floor((sunLong - sunNakshatraIndex * NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1

    // ── Rising Sign (Lagna) — requires birth time + location ──
    const rising = (birthTime && latitude && longitude)
      ? getApproxRisingSign(date, birthTime, latitude, longitude)
      : null

    // ── Ruling Planet ──
    const rulingPlanet = sunSign.lord
    const rulingPlanetSanskrit = PLANET_SANSKRIT[rulingPlanet]
    const karakas = STHIRA_KARAKA[rulingPlanet]

    // ── Life Path Number ──
    const lifePath = computeLifePath(date, moonSign.name, moonSign.quality)

    // ── Element & Quality ──
    const element = sunSign.element
    const elementInsight = getElementInsight(element, rulingPlanet, moonNakshatra.name)

    // ── Today's Transit Vibe ──
    const transit = getTodayTransitVibe(moonSignIndex)

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
        moonSign: {
          name: moonSign.name,
          sanskrit: moonSign.sanskrit,
          degree: moonDegree,
          element: moonSign.element,
          lord: moonSign.lord,
        },
        risingSign: rising ? {
          name: rising.sign,
          sanskrit: rising.sanskrit,
          degree: rising.degree,
        } : null,
        nakshatra: {
          name: moonNakshatra.name,
          sanskrit: moonNakshatra.sanskrit,
          lord: moonNakshatra.lord,
          deity: moonNakshatra.deity,
          pada: moonNakshatraPada,
          symbol: moonNakshatra.symbol,
          shakti: moonNakshatra.shakti,
          animal: moonNakshatra.animal,
          gana: moonNakshatra.gana,
        },
        sunNakshatra: {
          name: sunNakshatra.name,
          sanskrit: sunNakshatra.sanskrit,
          lord: sunNakshatra.lord,
          pada: sunNakshatraPada,
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
