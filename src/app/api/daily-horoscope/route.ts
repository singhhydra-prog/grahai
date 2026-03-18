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

// ─── Generate a distinct, chart-specific theme title ──
// Seed includes birth data so different users get different titles on the same day
function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function generateThemeTitle(insight: DailyInsight, targetDate: Date, birthDate?: string): string {
  // Combine date + user birth data so each person gets a unique title
  const dateStr = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}`
  const userStr = `${insight.dashaContext.mahadasha}-${insight.moonTransit.currentSign}-${insight.moonTransit.houseFromMoon}-${birthDate || ""}`
  const seed = hashSeed(dateStr + userStr)

  const moonSign = insight.moonTransit.currentSign
  const mahadasha = insight.dashaContext.mahadasha
  const antardasha = insight.dashaContext.antardasha
  const nakshatra = insight.moonTransit.nakshatra
  const house = insight.moonTransit.houseFromMoon
  const trend = insight.overallTrend

  if (trend === "favorable") {
    const pool = [
      `${mahadasha}'s Blessing in ${moonSign}`,
      `${moonSign} Moon Opens Doors`,
      `${nakshatra} Illuminates Your Path`,
      `House ${house} Activates — Momentum Builds`,
      `${antardasha} Sub-period Fuels Growth`,
      `Clarity Under ${moonSign}'s Light`,
      `${mahadasha}–${antardasha}: A Window Opens`,
      `Your ${moonSign} Transit Shines Today`,
      `Cosmic Alignment in House ${house}`,
      `${nakshatra}'s Gift to Your ${mahadasha} Phase`,
    ]
    return pool[seed % pool.length]
  }

  if (trend === "challenging") {
    const pool = [
      `Patience Under ${mahadasha}'s Watch`,
      `${moonSign} Moon Asks for Stillness`,
      `${nakshatra} Calls for Reflection`,
      `House ${house} Tests — Grow Through It`,
      `${antardasha} Sub-period: Navigate Carefully`,
      `${mahadasha}–${antardasha}: Slow Is Powerful`,
      `${moonSign} Teaches Through Resistance`,
      `Inner Strength in ${nakshatra}`,
      `Steady Your Course — House ${house} Active`,
      `${mahadasha}'s Lesson in Patience`,
    ]
    return pool[seed % pool.length]
  }

  // Mixed
  const pool = [
    `Moon in ${moonSign}: Read the Signs`,
    `${mahadasha} Period — Stay Centered`,
    `${nakshatra} Brings Both Light and Shadow`,
    `House ${house}: Balance Action with Rest`,
    `${antardasha} Within ${mahadasha} — Choose Wisely`,
    `${moonSign}'s Dual Energy Today`,
    `${mahadasha}–${antardasha}: The Middle Path`,
    `${nakshatra} Transit — Selective Action Wins`,
    `House ${house} Active — Be Deliberate`,
    `Navigate ${moonSign}'s Tides`,
  ]
  return pool[seed % pool.length]
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

// ─── Personalized headline with varied templates ──────────
function generatePersonalizedHeadline(insight: DailyInsight, targetDate: Date, birthDate?: string): string {
  const seed = hashSeed(`hl-${targetDate.toISOString().split("T")[0]}-${birthDate || ""}-${insight.moonTransit.currentSign}`)
  const moon = insight.moonTransit.currentSign
  const nak = insight.moonTransit.nakshatra
  const house = insight.moonTransit.houseFromMoon
  const maha = insight.dashaContext.mahadasha
  const antar = insight.dashaContext.antardasha
  const trend = insight.overallTrend

  const templates = [
    `${insight.headline} Moon in ${moon} (${nak}) activates your ${house}${getOrdinal(house)} house — ${trendPhrase(trend)} during ${maha}–${antar} period.`,
    `${nak} Nakshatra lights up house ${house} from your natal Moon in ${moon}. ${maha} Dasha ${trendVerb(trend)} today's energy.`,
    `Your ${maha}–${antar} period meets Moon's transit through ${moon}. House ${house} is active — ${trendAction(trend)}.`,
    `Today's ${moon} Moon (${nak}) speaks to house ${house}. ${insight.headline} ${maha} Mahadasha ${trendColor(trend)}.`,
    `${insight.headline} ${nak} in ${moon} touches house ${house}, ${trendMeaning(trend)} as ${antar} sub-period unfolds within ${maha}.`,
  ]
  return templates[seed % templates.length]
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return (s[(v - 20) % 10] || s[v] || s[0])
}

function trendPhrase(trend: string): string {
  if (trend === "favorable") return "momentum builds"
  if (trend === "challenging") return "patience pays"
  return "balance is key"
}

function trendVerb(trend: string): string {
  if (trend === "favorable") return "amplifies"
  if (trend === "challenging") return "tempers"
  return "modulates"
}

function trendAction(trend: string): string {
  if (trend === "favorable") return "lean into opportunities"
  if (trend === "challenging") return "observe before acting"
  return "weigh each choice carefully"
}

function trendColor(trend: string): string {
  if (trend === "favorable") return "brings warmth and confidence"
  if (trend === "challenging") return "asks for deliberate pacing"
  return "invites thoughtful navigation"
}

function trendMeaning(trend: string): string {
  if (trend === "favorable") return "opening doors"
  if (trend === "challenging") return "calling for introspection"
  return "mixing opportunity with caution"
}

// ─── Chart-specific category text generators ─────────────
function generateWealthInsight(insight: DailyInsight, signName: string): string {
  const jupiterTransit = insight.keyTransits.find(t => t.planet === "Jupiter")
  const saturnTransit = insight.keyTransits.find(t => t.planet === "Saturn")
  const maha = insight.dashaContext.mahadasha
  const moon = insight.moonTransit.currentSign
  const house = insight.moonTransit.houseFromMoon

  if (jupiterTransit) {
    return softenTransitEffect(jupiterTransit.effect, "Jupiter",
      `Jupiter in house ${jupiterTransit.houseFromMoon} from your Moon shapes financial patterns.`)
  }

  // Wealth houses: 2nd (stored wealth), 11th (gains)
  const wealthHouses = [2, 5, 9, 11]
  if (wealthHouses.includes(house)) {
    return `Moon transiting your ${house}${getOrdinal(house)} house (a wealth house) during ${maha} Dasha — financial awareness is heightened. ${signName} energy supports material focus today.`
  }

  if (saturnTransit) {
    return `Saturn in house ${saturnTransit.houseFromMoon} from your Moon brings structured financial discipline. ${maha} Dasha favors long-term wealth building over quick gains.`
  }

  return `Your ${maha} Mahadasha with Moon in ${moon} shapes today's financial energy. House ${house} is active — ${insight.overallTrend === "favorable" ? "a good day for financial planning" : "review before committing to expenses"}.`
}

function generateRelationshipInsight(insight: DailyInsight): string {
  const venusTransit = insight.keyTransits.find(t => t.planet === "Venus")
  const moon = insight.moonTransit.currentSign
  const nak = insight.moonTransit.nakshatra
  const house = insight.moonTransit.houseFromMoon
  const maha = insight.dashaContext.mahadasha

  if (venusTransit) {
    return softenTransitEffect(venusTransit.effect, "Venus",
      `Venus in house ${venusTransit.houseFromMoon} from your Moon influences relationship dynamics.`)
  }

  // Relationship houses: 5th (romance), 7th (partnership), 11th (friendships)
  const relHouses = [3, 5, 7, 11]
  if (relHouses.includes(house)) {
    return `Moon in ${moon} (${nak}) transiting your ${house}${getOrdinal(house)} house activates relationship energy. ${maha} Dasha colors emotional connections — ${insight.overallTrend === "favorable" ? "openness brings warmth" : "communicate with patience"}.`
  }

  return `${nak} Nakshatra in ${moon} colors your emotional world today. During ${maha} Dasha, house ${house} from Moon asks you to ${insight.overallTrend === "challenging" ? "listen more than speak in close relationships" : "express your feelings with clarity"}.`
}

function generateCareerInsight(insight: DailyInsight): string {
  const saturnTransit = insight.keyTransits.find(t => t.planet === "Saturn")
  const moon = insight.moonTransit.currentSign
  const house = insight.moonTransit.houseFromMoon
  const maha = insight.dashaContext.mahadasha
  const antar = insight.dashaContext.antardasha

  if (saturnTransit) {
    return softenTransitEffect(saturnTransit.effect, "Saturn",
      `Saturn in house ${saturnTransit.houseFromMoon} from your Moon structures career direction.`)
  }

  // Career houses: 2nd (speech/income), 6th (work), 10th (profession), 11th (achievements)
  const careerHouses = [2, 6, 10, 11]
  if (careerHouses.includes(house)) {
    return `Moon activating your ${house}${getOrdinal(house)} house (a career house) during ${maha}–${antar} period — professional energy is ${insight.overallTrend === "favorable" ? "strong and directed" : "best used for planning, not launching"}.`
  }

  return `${maha} Mahadasha with ${antar} sub-period shapes your professional rhythm. Moon in ${moon} (house ${house}) — ${insight.overallTrend === "favorable" ? "take initiative on important projects" : "focus on refining existing work rather than starting new ventures"}.`
}

function generateSelfInsight(insight: DailyInsight): string {
  const moon = insight.moonTransit.currentSign
  const nak = insight.moonTransit.nakshatra
  const house = insight.moonTransit.houseFromMoon
  const maha = insight.dashaContext.mahadasha

  // More personal — combine moon transit effect with remedy
  const remedyHint = insight.dailyRemedy.reason
  const moonEffect = insight.moonTransit.effect

  // 1st house (body), 4th (mind/comfort), 8th (transformation), 12th (rest/spirituality)
  const selfHouses = [1, 4, 8, 12]
  if (selfHouses.includes(house)) {
    return `${moonEffect} ${nak} in your ${house}${getOrdinal(house)} house heightens inner awareness during ${maha} Dasha. ${remedyHint}`
  }

  return `${moonEffect} During ${maha} Dasha, ${nak} Nakshatra in ${moon} (house ${house}) invites self-reflection. ${remedyHint}`
}

// ─── Map per-user DailyInsight → legacy API response format ─
function mapInsightToResponse(
  insight: DailyInsight,
  targetDate: Date,
  dayOffset: number,
  signName: string,
  placeOfBirth?: string,
  birthDate?: string,
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
      title: generateThemeTitle(insight, targetDate, birthDate),
      headline: generatePersonalizedHeadline(insight, targetDate, birthDate),
      action: insight.activities.favorable.slice(0, 2).join(". ") || "Focus on your highest-priority task today.",
      caution: insight.activities.unfavorable.slice(0, 2).join(". ") || "Avoid impulsive decisions during Rahu Kaal.",
      whyActive: `Moon in ${insight.moonTransit.currentSign} (${insight.moonTransit.nakshatra}) transits your ${insight.moonTransit.houseFromMoon}${getOrdinal(insight.moonTransit.houseFromMoon)} house from natal Moon — ${insight.moonTransit.effect.split(". ")[0]}. You're in ${insight.dashaContext.mahadasha}–${insight.dashaContext.antardasha} Dasha: ${insight.dashaContext.interpretation.split(". ")[0]}.`,
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
      wealth: generateWealthInsight(insight, signName),
      relationship: generateRelationshipInsight(insight),
      career: generateCareerInsight(insight),
      self: generateSelfInsight(insight),
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
        insight, targetDate, dayOffset, sunSign.name, placeOfBirth, birthDate,
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
