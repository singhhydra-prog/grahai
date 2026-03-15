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
  NAKSHATRAS,
  NAKSHATRA_SPAN,
  DAY_LORDS,
  PLANET_SANSKRIT,
} from "@/lib/ephemeris/constants"
import { generateDailyInsight, type DailyInsight } from "@/lib/daily-insights/insight-generator"
import type { BirthDetails } from "@/lib/ephemeris/types"

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

function getApproxMoonLongitude(date: Date): number {
  const j2000 = new Date("2000-01-01T12:00:00Z")
  const days = (date.getTime() - j2000.getTime()) / 86400000
  const L = (218.316 + 13.176396 * days) % 360
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397
  return ((L - ayanamsa) % 360 + 360) % 360
}

// ─── Rahu Kaal ─────────────────────────────────────────
const RAHU_KAAL_SLOTS: Record<number, number> = {
  0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3,
}

function calculateRahuKaal(date: Date, sunrise = 6, sunset = 18) {
  const slot = RAHU_KAAL_SLOTS[date.getDay()]
  const duration = (sunset - sunrise) / 8
  const start = sunrise + (slot - 1) * duration
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

// ─── Today's Theme generation ─────────────────────────
function generateTodayTheme(
  moonSign: string,
  sunSign: string,
  dayLord: string,
  moonLong: number,
  sunLong: number,
  nakshatra: string,
  date: Date,
) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const hash = (s: number, offset: number) => ((s * 31 + offset) % 100) / 100
  const moonInSign = SIGNS[Math.floor(moonLong / 30)]?.name || moonSign

  const themes = [
    {
      title: "Clarity Over Reaction",
      headline: `Moon in ${moonInSign} favors thoughtful decisions. Today rewards patience and careful judgment over impulsive action.`,
      action: "Take 10 minutes before any major decision. Write down your real priorities — the clearest path will reveal itself.",
      caution: "Avoid reactive emails, confrontations, or commitments made in frustration. Your judgment improves with space.",
      whyActive: `The Moon is transiting ${moonInSign}, creating a reflective mental quality. ${dayLord} as the day lord adds a layer of ${dayLord === "Saturn" ? "discipline and depth" : dayLord === "Jupiter" ? "wisdom and expansion" : dayLord === "Mars" ? "drive but also impatience" : dayLord === "Venus" ? "harmony-seeking" : dayLord === "Mercury" ? "mental agility" : dayLord === "Sun" ? "confidence and visibility" : "intuitive processing"}.`,
      source: { principle: `Moon in ${moonInSign} (Chandra Rashi Gochara)`, text: `Classical Jyotish holds that the Moon's transit through ${moonInSign} colors the emotional and mental landscape. ${moonInSign} as a Moon-sign transit activates themes of ${moonInSign === "Aries" ? "initiative and courage" : moonInSign === "Taurus" ? "stability and comfort" : moonInSign === "Gemini" ? "communication and curiosity" : moonInSign === "Cancer" ? "nurturing and emotional depth" : moonInSign === "Leo" ? "creativity and self-expression" : moonInSign === "Virgo" ? "analysis and service" : moonInSign === "Libra" ? "balance and partnership" : moonInSign === "Scorpio" ? "transformation and intensity" : moonInSign === "Sagittarius" ? "expansion and philosophy" : moonInSign === "Capricorn" ? "structure and ambition" : moonInSign === "Aquarius" ? "innovation and detachment" : "intuition and surrender"}.`, reference: "Brihat Parashara Hora Shastra — Transit of Chandra" },
    },
    {
      title: "Momentum Building",
      headline: `${dayLord}'s energy combines with Moon in ${moonInSign} to create forward thrust. Act on what you've been planning.`,
      action: "Take one concrete step on a stalled project or goal. The energy supports initiation — even a small move creates compounding momentum.",
      caution: "Don't start multiple things at once. Channel the available energy into your highest-priority item only.",
      whyActive: `${dayLord} is the ruling planet of today (Vara Lord), and its energy harmonizes with the Moon's transit through ${moonInSign}. This creates a window of aligned action.`,
      source: { principle: `Vara Lord (${dayLord}) + Chandra in ${moonInSign}`, text: `The Vara Lord determines the day's overarching energy signature. When ${dayLord}'s influence aligns with the Moon's emotional tone in ${moonInSign}, it creates a supportive window for decisive action.`, reference: "Muhurta Chintamani — Vara Phala" },
    },
    {
      title: "Inner Work Day",
      headline: `Today's chart favors reflection and self-understanding. Go inward before pushing outward.`,
      action: "Journal, meditate, or have a meaningful conversation. Insights that emerge today will guide better decisions this week.",
      caution: "Avoid overcommitting to social plans or taking on new obligations. Protect your energy for what truly matters.",
      whyActive: `The Moon's placement in ${moonInSign} activates the more introspective houses of your chart today. ${nakshatra} nakshatra adds a contemplative quality.`,
      source: { principle: `Moon Nakshatra: ${nakshatra}`, text: `The Moon's nakshatra transit influences subtle emotional and spiritual undertones. ${nakshatra} brings themes that favor inner processing and meaning-making over external activity.`, reference: "Jataka Parijata — Nakshatra Phala" },
    },
    {
      title: "Communication Sharpens",
      headline: `Words carry extra weight today. Use this for important conversations, writing, or negotiations.`,
      action: "Have the conversation you've been putting off. Express something you've been holding back — clarity serves you now.",
      caution: "Be precise with your language. Casual remarks may be taken more seriously than intended today.",
      whyActive: `Mercury-influenced energy is prominent today through ${dayLord}'s lordship and Moon in ${moonInSign}. This sharpens mental acuity and verbal expression.`,
      source: { principle: `Budha (Mercury) influence via Vara and Rashi`, text: `When Mercury's energy is prominent — through day lordship, transit, or rashi affinity — communication, trade, and intellectual activities receive a boost. This is recognized in Muhurta Shastra as favorable for Vidya (learning) and Vak (speech).`, reference: "Muhurta Chintamani — Budha Phala" },
    },
    {
      title: "Steady Persistence Wins",
      headline: `No breakthroughs today — and that's perfect. Focus on consistency and small progress.`,
      action: "Do the boring-but-important work. Pay bills, organize, follow up. Today rewards discipline, not inspiration.",
      caution: "Don't chase excitement or make dramatic changes. The chart favors stability and reliability right now.",
      whyActive: `Saturn's influence through the day's energy pattern creates a grounding, serious tone. Moon in ${moonInSign} supports methodical work.`,
      source: { principle: `Shani (Saturn) influence pattern`, text: `Saturn's influence in daily Muhurta encourages patience, duty, and long-term thinking. Results from Shani periods are delayed but durable — the classical texts call this "fruits that ripen slowly."`, reference: "Phaladeepika — Shani Gochara Phala" },
    },
  ]

  const idx = Math.floor(hash(seed, 7) * themes.length)
  return themes[idx]
}

// ─── Category insight generation ───────────────────────
function generateCategoryInsights(
  moonSign: string,
  sunSign: string,
  dayLord: string,
  moonLong: number,
  date: Date,
) {
  // Seed based on date for consistency within the day
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const hash = (s: number, offset: number) => ((s * 31 + offset) % 100) / 100

  const moonHouse = Math.floor(moonLong / 30)
  const moonInSign = SIGNS[moonHouse]?.name || moonSign

  // Wealth insights
  const wealthPool = [
    `Financial clarity is strong today with Moon in ${moonInSign}. Trust your instincts on investment decisions but verify the numbers before committing.`,
    `Your 2nd house energies are activated. Focus on saving rather than spending today — small disciplined actions compound into significant wealth.`,
    `${dayLord}'s influence supports calculated financial risks. A new income opportunity may present itself through an unexpected conversation.`,
    `Material abundance flows more freely when you release scarcity thinking. Today's chart supports generous giving as a path to receiving.`,
    `Your financial planets are in a holding pattern. Avoid major purchases or investments today — wait for clearer signals next week.`,
  ]

  // Relationship insights
  const relationshipPool = [
    `Emotional depth is available today. Listen more than you speak in close relationships — your partner needs understanding, not solutions.`,
    `Venus energies are active. Express appreciation to someone you've been taking for granted. Small gestures create lasting bonds today.`,
    `Communication in relationships may feel strained. Avoid assumptions — ask direct questions and give others the benefit of the doubt.`,
    `Your chart shows a pull toward deeper connection. Vulnerability is your strength today — share what you've been holding back.`,
    `Social interactions are best kept light today. Don't force heavy conversations — the right moment for depth will come naturally.`,
  ]

  // Career insights
  const careerPool = [
    `Professional momentum builds today. Focus on one key deliverable rather than spreading energy thin. Quality over quantity wins.`,
    `Leadership opportunities arise naturally. Step up where others hesitate — your chart supports confident decision-making in work matters.`,
    `Behind-the-scenes work yields the strongest results today. Don't seek recognition — let your output speak for itself.`,
    `Collaboration over competition today. A colleague holds a missing piece of information that could significantly advance your project.`,
    `Clarity returns after a foggy period. Use this mental sharpness to tackle the complex problem you've been avoiding.`,
  ]

  // Self insights
  const selfPool = [
    `Your emotional energy is high but needs direction. Channel intensity into creative expression or physical activity — not overthinking.`,
    `Self-care isn't optional today. Your chart shows accumulated mental fatigue — take breaks, hydrate, and step away from screens.`,
    `Your intuition is unusually sharp. Pay attention to gut feelings about people and situations — your subconscious is processing faster than your logic.`,
    `Today rewards discipline over inspiration. Stick to your routine even when motivation dips — consistency is the real power move.`,
    `Creative energy peaks today. Start that project you've been thinking about — the first step is all that matters.`,
  ]

  return {
    wealth: wealthPool[Math.floor(hash(seed, 1) * wealthPool.length)],
    relationship: relationshipPool[Math.floor(hash(seed, 2) * relationshipPool.length)],
    career: careerPool[Math.floor(hash(seed, 3) * careerPool.length)],
    self: selfPool[Math.floor(hash(seed, 4) * selfPool.length)],
  }
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
      whyActive: `${insight.moonTransit.effect} ${insight.dashaContext.interpretation.split(". ").slice(0, 1).join(".")}`,
      source: {
        principle: `Moon in ${insight.moonTransit.currentSign} (${insight.moonTransit.nakshatra})`,
        text: `${insight.overallTrend}. ${insight.dashaContext.mahadasha} Mahadasha with ${insight.dashaContext.antardasha} Antardasha active.`,
        reference: insight.bphsVerse.source,
      },
    },
    panchang: {
      tithi: insight.panchang.tithi,
      paksha: insight.panchang.tithi.includes("Purnima") ? "Shukla Paksha" : insight.panchang.tithi.includes("Amavasya") ? "Krishna Paksha" : "Shukla Paksha",
      nakshatra: insight.panchang.nakshatra,
      vara: insight.panchang.vara,
      varaLord: insight.panchang.vara,
    },
    timing: {
      auspiciousTime: { start: insight.panchang.auspicious[0] || "06:00 AM", end: insight.panchang.auspicious[1] || "07:30 AM" },
      rahuKaal: { start: insight.panchang.rahuKaal.split(" - ")[0] || "Unknown", end: insight.panchang.rahuKaal.split(" - ")[1] || "Unknown" },
    },
    lucky: {
      colour: colours[seed % colours.length],
      number: numbers[seed % numbers.length],
    },
    categories: {
      wealth: insight.keyTransits.find(t => t.planet === "Jupiter")?.effect || `${insight.dashaContext.mahadasha} period influences your financial growth. ${insight.overallTrend}.`,
      relationship: insight.keyTransits.find(t => t.planet === "Venus")?.effect || `Moon in ${insight.moonTransit.currentSign} colors your emotional connections today. ${insight.moonTransit.effect}.`,
      career: insight.keyTransits.find(t => t.planet === "Saturn")?.effect || `${insight.dashaContext.mahadasha} Mahadasha shapes your professional direction. Focus on long-term goals.`,
      self: `${insight.moonTransit.effect} ${insight.dailyRemedy.reason}`,
    },
    moonSign: insight.moonTransit.currentSign,
    sunSign: signName,
    place: placeOfBirth || "India",
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

    // offset: 0 = today, 1 = tomorrow
    const dayOffset = offset === 1 ? 1 : 0
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + dayOffset)

    if (!birthDate) {
      return NextResponse.json({ error: "Birth date required" }, { status: 400 })
    }

    const dob = new Date(birthDate)
    if (isNaN(dob.getTime())) {
      return NextResponse.json({ error: "Invalid birth date" }, { status: 400 })
    }

    // ─── Try per-user chart-based generation first ───────
    const hasFullBirthData = latitude && longitude && timezone !== undefined
    if (hasFullBirthData) {
      try {
        const birthDetails: BirthDetails = {
          date: birthDate,
          time: birthTime || "12:00",
          place: placeOfBirth || "Unknown",
          latitude: Number(latitude),
          longitude: Number(longitude),
          timezone: Number(timezone),
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
        const signName = sunSign?.name || "Aries"

        return NextResponse.json(mapInsightToResponse(
          insight, targetDate, dayOffset, signName, placeOfBirth,
        ))
      } catch (genErr) {
        console.warn("Per-user insight generation failed, falling back to templates:", genErr)
        // Fall through to template-based generation
      }
    }

    // ─── Fallback: template-based generation ─────────────
    // Calculate birth chart basics
    const birthSunLong = getSiderealSunLongitude(dob)
    const sunSign = SIGNS[Math.floor(birthSunLong / 30)]

    // Today's transit positions
    const todaySunLong = getSiderealSunLongitude(targetDate)
    const todayMoonLong = getApproxMoonLongitude(targetDate)
    const moonSign = SIGNS[Math.floor(todayMoonLong / 30)]
    const dayLord = DAY_LORDS[targetDate.getDay()]

    // Nakshatra from Moon
    const nakshatraIndex = Math.floor(todayMoonLong / NAKSHATRA_SPAN)
    const nakshatra = NAKSHATRAS[nakshatraIndex]

    // Tithi (simplified)
    const tithiDiff = ((todayMoonLong - todaySunLong) % 360 + 360) % 360
    const tithiNumber = Math.floor(tithiDiff / 12)
    const paksha = tithiNumber < 15 ? "Shukla Paksha" : "Krishna Paksha"
    const TITHI_NAMES = [
      "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
      "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
      "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
      "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
      "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
      "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
    ]

    // Timing
    const rahuKaal = calculateRahuKaal(targetDate)
    const auspiciousTime = calculateAuspiciousTime(targetDate)

    // Lucky elements based on birth sun sign
    const signName = sunSign?.name || "Aries"
    const colours = LUCKY_COLOURS[signName] || ["White"]
    const numbers = LUCKY_NUMBERS[signName] || [7]
    const seed = targetDate.getFullYear() * 10000 + (targetDate.getMonth() + 1) * 100 + targetDate.getDate()
    const luckyColour = colours[seed % colours.length]
    const luckyNumber = numbers[seed % numbers.length]

    // Today's theme (hero section)
    const todayTheme = generateTodayTheme(
      moonSign?.name || "Cancer",
      signName,
      dayLord?.lord || "Sun",
      todayMoonLong,
      todaySunLong,
      nakshatra?.name || "Unknown",
      targetDate,
    )

    // Category insights
    const categories = generateCategoryInsights(
      moonSign?.name || "Cancer",
      signName,
      dayLord?.lord || "Sun",
      todayMoonLong,
      targetDate,
    )

    // Date formatting
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dateLabel = `${months[targetDate.getMonth()]} ${targetDate.getDate()}`

    return NextResponse.json({
      success: true,
      date: dateLabel,
      dayOffset,
      personalized: false,
      theme: todayTheme,
      panchang: {
        tithi: TITHI_NAMES[tithiNumber] || "Unknown",
        paksha,
        nakshatra: nakshatra?.name || "Unknown",
        vara: dayLord?.name || "Unknown",
        varaLord: dayLord?.lord || "Sun",
      },
      timing: {
        auspiciousTime,
        rahuKaal,
      },
      lucky: {
        colour: luckyColour,
        number: luckyNumber,
      },
      categories,
      moonSign: moonSign?.name || "Unknown",
      sunSign: signName,
      place: placeOfBirth || "India",
    })
  } catch (err) {
    console.error("Daily horoscope error:", err)
    return NextResponse.json({ error: "Failed to generate horoscope" }, { status: 500 })
  }
}
