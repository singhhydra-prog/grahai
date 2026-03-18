/* ════════════════════════════════════════════════════════
   GrahAI — Push Notification Content Templates

   Generates personalized push content for daily, weekly,
   and monthly retention notifications.
   ════════════════════════════════════════════════════════ */

import type { DailyInsight } from "../daily-insights/insight-generator"

export interface PushContent {
  title: string
  body: string
  url: string
  icon?: string
  badge?: string
  tag?: string
}

// ─── Sign & Element Mapping ─────────────────────────────

const SIGN_NAMES_HINDI: Record<string, string> = {
  Aries: "मेष", Taurus: "वृष", Gemini: "मिथुन", Cancer: "कर्क",
  Leo: "सिंह", Virgo: "कन्या", Libra: "तुला", Scorpio: "वृश्चिक",
  Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुंभ", Pisces: "मीन",
}

const ACTIVITY_EMOJI: Record<string, string> = {
  career: "💼", relationships: "❤️", health: "🏥", finance: "💰",
  spiritual: "🕉️", creative: "🎨", learning: "📚", travel: "✈️",
  meeting: "🤝", home: "🏠",
}

// ─── Generic Fallback Templates ──────────────────────────

export function getGenericDailyContent(
  userName: string,
  dashaLord?: string,
  moonSign?: string,
): PushContent {
  // If we have chart data, personalize the message
  if (dashaLord && moonSign) {
    const moonHindi = SIGN_NAMES_HINDI[moonSign] || moonSign
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const messages = [
      {
        title: `🌅 शुभ प्रभात, ${userName}`,
        body: `${moonHindi} में चंद्र — आपका ${dashaLord} दशा काल सक्रिय है। आज का राशिफल देखें।`,
      },
      {
        title: `✨ ${dashaLord} Dasha Active`,
        body: `Your ${dashaLord} period meets today's Moon in ${moonSign}. Tap for personalized guidance.`,
      },
      {
        title: `🪐 ${moonSign} Moon Today`,
        body: `During your ${dashaLord} Dasha, today's ${moonSign} transit shapes your energy. Check your horoscope.`,
      },
    ]
    return {
      title: messages[dayOfYear % messages.length].title,
      body: messages[dayOfYear % messages.length].body,
      url: "/daily",
      tag: "daily",
    }
  }

  // Fallback without chart data
  return {
    title: `🌅 शुभ प्रभात, ${userName}`,
    body: "Your personalized Vedic horoscope is ready. Tap to see today's cosmic guidance.",
    url: "/daily",
    tag: "daily",
  }
}

// ─── Daily Push (Morning Cosmic Weather) ────────────────

export function createDailyPushContent(
  insight: DailyInsight,
  userName: string
): PushContent {
  try {
    const { moonTransit, overallTrend, panchang, headline } = insight

    // Extract moon sign (simplified; real implementation would use fuller data)
    const moonSign = moonTransit?.currentSign || "Unknown"
    const moonSignHindi = SIGN_NAMES_HINDI[moonSign] || moonSign
    const trend = overallTrend?.toLowerCase().includes("favorable")
      ? "शुभ"
      : overallTrend?.toLowerCase().includes("challenging")
        ? "चुनौतीपूर्ण"
        : "मिश्र"

    // Get primary activity from activities array
    const primaryActivity = insight.activities?.favorable?.[0] || "meditation"
    const emoji = ACTIVITY_EMOJI[primaryActivity.toLowerCase()] || "✨"

    // Hindi subtitle (moon sign + trend)
    const subtitle = `${moonSignHindi} में चंद्र — ${trend}`

    // Create title with emoji and personalization
    const title = `🌅 शुभ प्रभात, ${userName}`

    // Body: Hindi subtitle + activity suggestion + call-to-action
    const body = `${subtitle}\nआज ${primaryActivity} में सफलता मिलेगी। विस्तृत राशिफल देखें।`

    return {
      title,
      body,
      url: "/daily",
      tag: "daily",
    }
  } catch (err) {
    console.error("Error generating daily push content:", err)
    return getGenericDailyContent(userName)
  }
}

// ─── Weekly Push (Week-Ahead Summary) ────────────────────

export interface WeeklyPushData {
  userName: string
  dominantPlanet?: string
  dominantSign?: string
  weekTheme?: string
  keyRecommendation?: string
  dashaPhase?: string
}

export function createWeeklyPushContent(data: WeeklyPushData): PushContent {
  const {
    userName,
    dominantPlanet,
    weekTheme,
    keyRecommendation,
  } = data

  if (!dominantPlanet || !weekTheme) {
    return {
      title: "🌙 Your Week Ahead",
      body: `${userName}, your weekly Vedic forecast is ready. Tap for personalized guidance.`,
      url: "/app",
      tag: "weekly",
    }
  }

  const emoji =
    dominantPlanet.toLowerCase().includes("venus") ||
    dominantPlanet.toLowerCase().includes("mercury")
      ? "✨"
      : dominantPlanet.toLowerCase().includes("mars")
        ? "⚡"
        : dominantPlanet.toLowerCase().includes("saturn")
          ? "🪐"
          : "🌙"

  return {
    title: `${emoji} Your Week Ahead`,
    body: `${weekTheme} week ahead\n${keyRecommendation}\n\nTap for full weekly forecast.`,
    url: "/app",
    tag: "weekly",
  }
}

// ─── Monthly Push (Month Overview & Dasha Context) ───────

export interface MonthlyPushData {
  userName: string
  monthName: string
  dominantDasha?: string
  majorTransit?: string
  monthTheme?: string
  keyAdvice?: string
}

export function createMonthlyPushContent(data: MonthlyPushData): PushContent {
  const {
    userName,
    monthName,
    dominantDasha,
    monthTheme,
    keyAdvice,
  } = data

  if (!dominantDasha || !monthTheme) {
    return {
      title: `📅 ${monthName || "Monthly"} Overview`,
      body: `${userName}, your monthly Vedic forecast is ready. Tap for personalized guidance.`,
      url: "/app",
      tag: "monthly",
    }
  }

  const emoji = monthTheme.toLowerCase().includes("transform") ? "🔄" : monthTheme.toLowerCase().includes("growth") ? "🌱" : "📅"

  return {
    title: `${emoji} ${monthName} Overview`,
    body: `${monthTheme} month ahead\n${dominantDasha}\n${keyAdvice}`,
    url: "/app",
    tag: "monthly",
  }
}

// ─── Seasonal Win-Back Push ─────────────────────────────

export interface WinBackPushData {
  userName: string
  reason?: "new_content" | "special_offer" | "returning" | "custom"
  customMessage?: string
}

export function createWinBackPushContent(data: WinBackPushData): PushContent {
  const { userName, reason = "new_content", customMessage } = data

  const contentByReason: Record<string, { title: string; body: string }> = {
    new_content: {
      title: "✨ New Insights Unlocked",
      body: `${userName}, check out new features in your GrahAI dashboard!`,
    },
    special_offer: {
      title: "🎉 Special Offer Inside",
      body: `${userName}, we have a special offer just for you. Explore now!`,
    },
    returning: {
      title: "🌟 We Miss You!",
      body: `Your personalized cosmic insights are waiting, ${userName}. Come back to GrahAI!`,
    },
    custom: {
      title: "📬 A Message From GrahAI",
      body: customMessage || `${userName}, there's something new waiting for you!`,
    },
  }

  const content = contentByReason[reason]

  return {
    title: content.title,
    body: content.body,
    url: "/app",
    tag: "winback",
  }
}

// ─── Helper: Determine Activity Emoji ────────────────────

export function getActivityEmoji(activity: string): string {
  const lower = activity.toLowerCase()
  for (const [key, emoji] of Object.entries(ACTIVITY_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return "✨"
}

// ─── Helper: Get Hindi Sign Name ─────────────────────────

export function getHindiSignName(sign: string): string {
  return SIGN_NAMES_HINDI[sign] || sign
}
