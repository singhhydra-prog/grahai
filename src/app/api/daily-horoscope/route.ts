/* ════════════════════════════════════════════════════════
   GrahAI — Daily Horoscope API

   Returns personalized daily guidance with:
   - Category insights (Wealth, Relationship, Career, Self)
   - Lucky elements (colour, number)
   - Panchang timing (Auspicious Time, Rahu Kaal)
   - Today/Tomorrow toggle support

   Uses: Panchang engine + cosmic-snapshot birth data
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import {
  SIGNS,
} from "@/lib/ephemeris/constants"
import { generateDailyInsight, type DailyInsight } from "@/lib/daily-insights/insight-generator"
import type { BirthDetails } from "@/lib/ephemeris/types"
import { resolveTimezoneOffset } from "@/lib/timezone-utils"

// ─── Approximate sidereal positions ────────────────────
function getSiderealSunLongitude(date: Date): number {
  const j2000 = new Date("2000-01-01T12:00:00Z")
  const days = (date.getTime() - j2000.getTime()) / 86400000
  const L = (280.46646 + 0.9856474 * days) % 360
  const M = ((357.52911 + 0.9856003 * days) % 360) * (Math.PI / 180)
  const C = 1.9146 * Math.sin(M) + 0.02 * Math.sin(2 * M)
  const tropicalLong = ((L + C) % 360 + 360) % 360
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397
  return ((tropicalLong - ayanamsa) % 360 + 360) % 360
}

// ─── Rahu Kaal slots (used by auspicious time calc) ────
const RAHU_KAAL_SLOTS: Record<number, number> = {
  0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3,
}

// ─── Auspicious Time (best 1.5-hour window) ────────────
function calculateAuspiciousTime(date: Date, sunrise = 6, sunset = 18) {
  const rahuSlot = RAHU_KAAL_SLOTS[date.getDay()]
  const duration = (sunset - sunrise) / 8
  // Pick a slot that avoids Rahu Kaal — prefer slot 1 or the one right after Rahu
  let bestSlot = rahuSlot < 8 ? rahuSlot + 1 : 1
  if (bestSlot === rahuSlot) bestSlot = (bestSlot % 8) + 1
  const start = sunrise + (bestSlot - 1) * duration
  const end = start + duration
  const fmt = (h: number) => {
    const hrs = Math.floor(h)
    const mins = Math.round((h - hrs) * 60)
    const period = hrs >= 12 ? "PM" : "AM"
    const dh = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs
    return `${String(dh).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`
  }
  return { start: fmt(start), end: fmt(end) }
}

// ─── Lucky elements based on birth sign + day ──────────
const LUCKY_COLOURS: Record<string, string[]> = {
  Aries: ["Red", "Scarlet", "Orange"],
  Taurus: ["Green", "White", "Pink"],
  Gemini: ["Yellow", "Green", "Light Blue"],
  Cancer: ["White", "Silver", "Cream"],
  Leo: ["Gold", "Orange", "Red"],
  Virgo: ["Green", "Dark Brown", "Grey"],
  Libra: ["White", "Light Blue", "Pink"],
  Scorpio: ["Maroon", "Dark Red", "Black"],
  Sagittarius: ["Yellow", "Orange", "Purple"],
  Capricorn: ["Black", "Dark Brown", "Navy"],
  Aquarius: ["Blue", "Electric Blue", "Grey"],
  Pisces: ["Sea Green", "Lavender", "Yellow"],
}

const LUCKY_NUMBERS: Record<string, number[]> = {
  Aries: [1, 9, 8], Taurus: [2, 6, 7], Gemini: [3, 5, 6],
  Cancer: [2, 4, 7], Leo: [1, 4, 9], Virgo: [5, 3, 6],
  Libra: [6, 5, 2], Scorpio: [8, 1, 9], Sagittarius: [3, 7, 9],
  Capricorn: [8, 4, 6], Aquarius: [4, 7, 8], Pisces: [3, 7, 9],
}

// ─── Vara name → planet lord mapping ─────────────────
const VARA_LORD_MAP: Record<string, string> = {
  "Ravivara": "Sun", "Sunday": "Sun",
  "Somavara": "Moon", "Monday": "Moon",
  "Mangalavara": "Mars", "Tuesday": "Mars",
  "Budhavara": "Mercury", "Wednesday": "Mercury",
  "Guruvara": "Jupiter", "Thursday": "Jupiter",
  "Shukravara": "Venus", "Friday": "Venus",
  "Shanivara": "Saturn", "Saturday": "Saturn",
}

function extractVaraLord(vara: string): string {
  // Try exact match first, then partial match from "Somavara (Monday)" format
  if (VARA_LORD_MAP[vara]) return VARA_LORD_MAP[vara]
  for (const [key, lord] of Object.entries(VARA_LORD_MAP)) {
    if (vara.includes(key)) return lord
  }
  return "Sun"
}

// ─── Soften raw transit effects for user-facing display ─
function softenTransitEffect(raw: string | undefined, planet: string, fallback: string): string {
  if (!raw) return fallback
  // Remove the technical prefix "Planet in Nth from Moon (Sign): "
  const colonIdx = raw.indexOf(": ")
  const effectText = colonIdx >= 0 ? raw.substring(colonIdx + 2) : raw
  // Remove brackets like [RETROGRADE — ...]
  const cleaned = effectText.replace(/\s*\[.*?\]\s*/g, "").trim()
  // If the effect is overly negative/terse, wrap it in constructive framing
  const negativeKeywords = ["loss", "imprisonment", "confusion", "danger", "enemies", "disease", "death"]
  const hasNegative = negativeKeywords.some(k => cleaned.toLowerCase().includes(k))
  if (hasNegative) {
    return `${planet}'s transit calls for awareness around ${cleaned.toLowerCase().replace(/,\s*/g, " and ")}. Stay mindful and channel this energy into growth.`
  }
  return `${planet}'s influence today brings ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`
}

// ─── Map per-user DailyInsight → legacy API response format ─
function mapInsightToResponse(
  insight: DailyInsight,
  targetDate: Date,
  dayOffset: number,
  signName: string,
  placeOfBirth?: string,
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dateLabel = `${months[targetDate.getMonth()]} ${targetDate.getDate()}`
  const seed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate()
  const colours = LUCKY_COLOURS[signName] || ["White"]
  const numbers = LUCKY_NUMBERS[signName] || [7]

  // Compute real auspicious time window (avoid Rahu Kaal)
  const auspiciousTime = calculateAuspiciousTime(targetDate)

  // Extract vara lord planet name from vara string like "Somavara (Monday)"
  const varaLord = extractVaraLord(insight.panchang.vara)

  // Ensure overallTrend starts with a capital letter and is a complete sentence
  const trend = insight.overallTrend || "A balanced day ahead"
  const capitalizedTrend = trend.charAt(0).toUpperCase() + trend.slice(1)

  return {
    success: true,
    date: dateLabel,
    dayOffset,
    personalized: true,
    theme: {
      title: insight.headline,
      headline: insight.headline,
      action: insight.activities.favorable.slice(0, 2).join(". ") || "Focus on your highest-priority task today.",
      caution: insight.activities.unfavorable.slice(0, 2).join(". ") || "Avoid impulsive decisions during Rahu Kaal.",
      whyActive: `${insight.moonTransit.effect} ${insight.dashaContext.interpretation.split(". ").slice(0, 2).join(". ")}.`,
      source: {
        principle: `Moon in ${insight.moonTransit.currentSign} (${insight.moonTransit.nakshatra})`,
        text: `${capitalizedTrend}. ${insight.dashaContext.mahadasha} Mahadasha with ${insight.dashaContext.antardasha} Antardasha active.`,
        reference: insight.bphsVerse.source,
      },
    },
    panchang: {
      tithi: insight.panchang.tithi,
      paksha: insight.panchang.tithi.includes("Purnima") ? "Shukla Paksha" : insight.panchang.tithi.includes("Amavasya") ? "Krishna Paksha" : "Shukla Paksha",
      nakshatra: insight.panchang.nakshatra,
      vara: insight.panchang.vara,
      varaLord,
    },
    timing: {
      auspiciousTime,
      rahuKaal: { start: insight.panchang.rahuKaal.split(" - ")[0] || "Unknown", end: insight.panchang.rahuKaal.split(" - ")[1] || "Unknown" },
    },
    lucky: {
      colour: colours[seed % colours.length],
      number: numbers[seed % numbers.length],
    },
    categories: {
      wealth: softenTransitEffect(
        insight.keyTransits.find(t => t.planet === "Jupiter")?.effect,
        "Jupiter",
        `${insight.dashaContext.mahadasha} period influences your financial growth. ${capitalizedTrend}.`,
      ),
      relationship: softenTransitEffect(
        insight.keyTransits.find(t => t.planet === "Venus")?.effect,
        "Venus",
        `Moon in ${insight.moonTransit.currentSign} colors your emotional connections today. ${insight.moonTransit.effect}.`,
      ),
      career: softenTransitEffect(
        insight.keyTransits.find(t => t.planet === "Saturn")?.effect,
        "Saturn",
        `${insight.dashaContext.mahadasha} Mahadasha shapes your professional direction. Focus on long-term goals.`,
      ),
      self: `${insight.moonTransit.effect} ${insight.dailyRemedy.reason}`,
    },
    moonSign: insight.moonTransit.currentSign,
    sunSign: signName,
    place: placeOfBirth || "Unknown",
    dashaContext: {
      mahadasha: insight.dashaContext.mahadasha,
      antardasha: insight.dashaContext.antardasha,
      interpretation: insight.dashaContext.interpretation,
    },
    dailyRemedy: insight.dailyRemedy,
    bphsVerse: insight.bphsVerse,
    sadeSati: insight.sadeSatiActive ? {
      active: true,
      phase: insight.sadeSatiPhase,
      advice: insight.sadeSatiAdvice,
    } : { active: false },
  }
}

// ─── API Handler ───────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { birthDate, birthTime, placeOfBirth, latitude, longitude, timezone, offset, name, userId } = body

    // offset: 0 = today, 1 = tomorrow, 2-6 = rest of week
    const dayOffset = typeof offset === "number" && offset >= 0 && offset <= 6 ? offset : 0
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + dayOffset)

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date required" }, { status: 400 })
    }

    const dob = new Date(birthDate)
    if (isNaN(dob.getTime())) {
      return NextResponse.json({ error: "Invalid birth date" }, { status: 400 })
    }

    // Resolve timezone: handles both IANA strings ("Asia/Kolkata") and numbers (5.5)
    const numericTimezone = resolveTimezoneOffset(timezone, birthDate)

    // ─── Validate required birth data for personalization ────
    if (!latitude || !longitude) {
      return NextResponse.json({
        success: false,
        error: "Birth location (latitude/longitude) required for personalized horoscope",
        code: "MISSING_LOCATION",
      }, { status: 400 })
    }

    const lat = Number(latitude)
    const lng = Number(longitude)
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({
        success: false,
        error: "Invalid latitude/longitude values",
        code: "INVALID_COORDINATES",
      }, { status: 400 })
    }

    if (!birthTime) {
      return NextResponse.json({
        success: false,
        error: "Birth time required for accurate chart calculations. Please update your birth details.",
        code: "MISSING_BIRTH_TIME",
      }, { status: 400 })
    }

    // ─── Generate personalized chart-based horoscope ───────
    try {
      const birthDetails: BirthDetails = {
        date: birthDate,
        time: birthTime,
        place: placeOfBirth || "Unknown",
        latitude: lat,
        longitude: lng,
        timezone: numericTimezone,
      }

      const insight = await generateDailyInsight(
        userId || "anonymous",
        birthDetails,
        name || "User",
        targetDate,
      )

      // Calculate birth sun sign for lucky elements
      const birthSunLong = getSiderealSunLongitude(dob)
      const sunSign = SIGNS[Math.floor(birthSunLong / 30)]
      if (!sunSign) {
        return NextResponse.json({
          success: false,
          error: "Unable to calculate sun sign from birth date. Please verify your birth details.",
          code: "SUN_SIGN_CALCULATION_FAILED",
        }, { status: 500 })
      }

      return NextResponse.json(mapInsightToResponse(
        insight, targetDate, dayOffset, sunSign.name, placeOfBirth,
      ))
    } catch (genErr) {
      console.error("[daily-horoscope] Personalized insight generation FAILED:", {
        error: genErr instanceof Error ? genErr.message : String(genErr),
        stack: genErr instanceof Error ? genErr.stack?.split("\n").slice(0, 3).join(" | ") : undefined,
        birthDetails: { date: birthDate, time: birthTime, lat: latitude, lng: longitude, tz: timezone, resolvedTz: numericTimezone },
        dayOffset,
      })
      return NextResponse.json({
        success: false,
        error: "Failed to generate personalized horoscope. Please try again.",
        code: "GENERATION_FAILED",
        reason: genErr instanceof Error ? genErr.message : "Unknown error",
      }, { status: 500 })
    }
  } catch (err) {
    console.error("Daily horoscope error:", err)
    return NextResponse.json({ error: "Failed to generate horoscope" }, { status: 500 })
  }
}
