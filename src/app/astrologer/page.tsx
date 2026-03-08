"use client"

/* ════════════════════════════════════════════════════════
   Product 4 — AI Astrologer (Consumer-Facing)

   Beautiful, standalone "Ask the AI Astrologer" experience.
   No login required for first 3 questions (freemium).
   Features pre-built question cards, voice-like typing
   animation, and rich response formatting.
   ════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Sparkles, Star, Moon, Sun, Heart,
  Briefcase, Brain, ArrowRight, ChevronRight,
  MessageCircle, Mic, Zap, Eye, RefreshCw,
  ArrowUp, User, Bot, Loader2
} from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickQuestion {
  icon: React.ElementType
  label: string
  question: string
  category: string
  color: string
}

// ─── Astronomical Helpers (Meeus-style client-side) ─────

const PI2 = Math.PI * 2
const DEG = Math.PI / 180
function norm360(a: number) { return ((a % 360) + 360) % 360 }

function dateToJDE(d: Date): number {
  let y = d.getUTCFullYear(), m = d.getUTCMonth() + 1
  const day = d.getUTCDate() + d.getUTCHours() / 24 + d.getUTCMinutes() / 1440
  if (m <= 2) { y--; m += 12 }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5
}

function computeSunLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mr = M * DEG
  const C = (1.914602 - 0.004817 * T) * Math.sin(Mr) + 0.019993 * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr)
  return norm360(L0 + C)
}

function computeMoonLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const Lp = norm360(218.3165 + 481267.8813 * T)
  const D = norm360(297.8502 + 445267.1115 * T) * DEG
  const M = norm360(357.5291 + 35999.0503 * T) * DEG
  const Mp = norm360(134.9634 + 477198.8676 * T) * DEG
  const F = norm360(93.2720 + 483202.0175 * T) * DEG
  const dL = 6.289 * Math.sin(Mp)
    - 1.274 * Math.sin(2 * D - Mp) + 0.658 * Math.sin(2 * D)
    + 0.214 * Math.sin(2 * Mp) - 0.186 * Math.sin(M)
    - 0.114 * Math.sin(2 * F) + 0.059 * Math.sin(2 * D - 2 * Mp)
    + 0.057 * Math.sin(2 * D - M - Mp) + 0.053 * Math.sin(2 * D + Mp)
    + 0.046 * Math.sin(2 * D - M) - 0.041 * Math.sin(M - Mp)
  return norm360(Lp + dL)
}

/** Approximate Mars tropical longitude */
function computeMarsLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L = norm360(355.433 + 19140.2993 * T)
  const M = norm360(319.513 + 19139.8585 * T) * DEG
  const C = 10.691 * Math.sin(M) + 0.623 * Math.sin(2 * M) + 0.050 * Math.sin(3 * M)
  return norm360(L + C)
}

/** Approximate Mercury tropical longitude */
function computeMercuryLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L = norm360(252.251 + 149472.6746 * T)
  const M = norm360(174.795 + 149472.5153 * T) * DEG
  const C = 23.440 * Math.sin(M) + 2.9818 * Math.sin(2 * M)
  return norm360(L + C)
}

/** Approximate Jupiter tropical longitude */
function computeJupiterLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L = norm360(34.351 + 3034.9057 * T)
  const M = norm360(20.020 + 3034.6888 * T) * DEG
  const C = 5.555 * Math.sin(M) + 0.168 * Math.sin(2 * M)
  return norm360(L + C)
}

/** Approximate Venus tropical longitude */
function computeVenusLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L = norm360(181.979 + 58517.8156 * T)
  const M = norm360(50.416 + 58517.4939 * T) * DEG
  const C = 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2 * M)
  return norm360(L + C)
}

/** Approximate Saturn tropical longitude */
function computeSaturnLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L = norm360(50.077 + 1222.1138 * T)
  const M = norm360(316.967 + 1221.5515 * T) * DEG
  const C = 6.406 * Math.sin(M) + 0.318 * Math.sin(2 * M)
  return norm360(L + C)
}

/** Approximate Rahu (mean node) tropical longitude */
function computeRahuLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  return norm360(125.0446 - 1934.1363 * T + 0.0021 * T * T)
}

function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  return 23.856 + 0.01397 * (jd - 2451545.0) / 365.25
}

function toSid(tropical: number, jd: number): number {
  return norm360(tropical - lahiriAyanamsa(jd))
}

// ─── Transit Snapshot ──────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]
const SIGN_LORDS = [
  "Mars","Venus","Mercury","Moon","Sun","Mercury",
  "Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"
]
const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","P.Phalguni","U.Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","P.Ashadha","U.Ashadha","Shravana","Dhanishta","Shatabhisha",
  "P.Bhadrapada","U.Bhadrapada","Revati"
]
const NAK_LORDS = [
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"
]
const TITHI_NAMES = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami",
  "Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi",
  "Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi",
  "Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi",
  "Chaturdashi","Amavasya"
]

interface TransitSnapshot {
  sunSign: string; sunSignIdx: number; sunDeg: number
  moonSign: string; moonSignIdx: number; moonDeg: number; moonNak: string; moonNakIdx: number; moonNakLord: string
  marsSign: string; jupiterSign: string; venusSign: string; saturnSign: string; mercurySign: string
  rahuSign: string; ketuSign: string
  tithi: string; tithiNum: number; paksha: string
  dayOfWeek: string; dayLord: string
}

function getTransitSnapshot(): TransitSnapshot {
  const now = new Date()
  const jd = dateToJDE(now)
  const sunTrop = computeSunLong(jd)
  const moonTrop = computeMoonLong(jd)
  const marsTrop = computeMarsLong(jd)
  const jupTrop = computeJupiterLong(jd)
  const venTrop = computeVenusLong(jd)
  const satTrop = computeSaturnLong(jd)
  const merTrop = computeMercuryLong(jd)
  const rahuTrop = computeRahuLong(jd)

  const sunSid = toSid(sunTrop, jd)
  const moonSid = toSid(moonTrop, jd)
  const marsSid = toSid(marsTrop, jd)
  const jupSid = toSid(jupTrop, jd)
  const venSid = toSid(venTrop, jd)
  const satSid = toSid(satTrop, jd)
  const merSid = toSid(merTrop, jd)
  const rahuSid = toSid(rahuTrop, jd)
  const ketuSid = norm360(rahuSid + 180)

  const signOf = (lon: number) => SIGNS[Math.floor(lon / 30)]
  const signIdx = (lon: number) => Math.floor(lon / 30)

  const moonNakIdx = Math.floor(moonSid / (360 / 27))
  const sunMoonAngle = norm360(moonSid - sunSid)
  const tithiNum = Math.floor(sunMoonAngle / 12)

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const dayLords = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"]
  const dow = now.getDay()

  return {
    sunSign: signOf(sunSid), sunSignIdx: signIdx(sunSid), sunDeg: sunSid % 30,
    moonSign: signOf(moonSid), moonSignIdx: signIdx(moonSid), moonDeg: moonSid % 30,
    moonNak: NAKSHATRAS[moonNakIdx], moonNakIdx, moonNakLord: NAK_LORDS[moonNakIdx],
    marsSign: signOf(marsSid), jupiterSign: signOf(jupSid), venusSign: signOf(venSid),
    saturnSign: signOf(satSid), mercurySign: signOf(merSid),
    rahuSign: signOf(rahuSid), ketuSign: signOf(ketuSid),
    tithi: TITHI_NAMES[Math.min(tithiNum, 29)], tithiNum,
    paksha: tithiNum < 15 ? "Shukla" : "Krishna",
    dayOfWeek: days[dow], dayLord: dayLords[dow],
  }
}

// ─── Transit-Aware Response Generator ──────────────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateResponse(question: string): string {
  const seed = question.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + new Date().getDate()
  const rand = seedRandom(seed)
  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)]
  const t = getTransitSnapshot()
  const q = question.toLowerCase()

  // ─── Love & Relationships ──────────────
  if (q.includes("love") || q.includes("relationship") || q.includes("marriage") || q.includes("partner")) {
    const venusStrength = (["Taurus","Libra","Pisces"].includes(t.venusSign)) ? "exalted/own-sign"
      : (["Virgo","Aries","Scorpio"].includes(t.venusSign)) ? "challenging" : "moderate"
    const venusVerdict = venusStrength === "exalted/own-sign"
      ? "Venus is exceptionally strong right now — relationships blossom with genuine warmth and attraction."
      : venusStrength === "challenging"
      ? "Venus is under strain — miscommunications or unrealistic expectations may arise in relationships."
      : "Venus is in a stable transit — steady, reliable energy for partnerships."

    const moonMsg = t.moonNakLord === "Venus"
      ? "The Moon is in a Venus-ruled nakshatra, doubling the romantic energy today."
      : t.moonNakLord === "Moon"
      ? "The Moon in its own nakshatra heightens emotional sensitivity — express feelings gently."
      : `The Moon in ${t.moonNak} (ruled by ${t.moonNakLord}) colors today's emotional landscape.`

    const remedy = pick([
      `Offer white flowers at a sacred space this Friday to honour Shukra.`,
      `Chant *Om Shukraya Namah* 108 times on Friday morning.`,
      `Wear light pastels or white on Fridays to activate Venus energy.`,
      `Fast on Fridays and donate sweets to strengthen Venus.`,
    ])

    return `🌹 **Love & Relationships — Live Transit Reading**\n\n**Venus (Shukra)** is currently transiting **${t.venusSign}**. ${venusVerdict}\n\n**Today's Lunar Influence:**\n${moonMsg}\n\n**Key Observations:**\n\n• Venus in ${t.venusSign} ${venusStrength === "exalted/own-sign" ? "amplifies charm and attraction — ideal for date nights or heartfelt conversations" : "asks for patience — avoid making major relationship decisions impulsively"}\n• Jupiter in ${t.jupiterSign} ${["Cancer","Sagittarius","Pisces"].includes(t.jupiterSign) ? "brings expansion and blessings to partnerships" : "encourages growth through honest communication"}\n• The ${t.paksha} Paksha ${t.tithi} indicates a ${t.tithiNum < 15 ? "waxing/growing" : "waning/reflective"} phase — ${t.tithiNum < 15 ? "ideal for starting new connections" : "better for deepening existing bonds"}\n\n**Guidance for Today (${t.dayOfWeek}):**\n${t.dayLord === "Venus" ? "Friday is Venus's own day — the most auspicious day of the week for romantic matters!" : t.dayLord === "Moon" ? "Monday amplifies emotional awareness — a good day for heart-to-heart conversations." : `${t.dayOfWeek} is ruled by ${t.dayLord}. Channel this energy by focusing on ${t.dayLord === "Jupiter" ? "growth and shared wisdom" : t.dayLord === "Mars" ? "passion and courage in expressing feelings" : "practical aspects of your relationship"}.`}\n\n**Remedy:** ${remedy}\n\n*For a personalized love analysis based on your exact birth chart, generate your [Kundli](/kundli) or try [Compatibility Matching](/compatibility).*`
  }

  // ─── Career & Finance ──────────────────
  if (q.includes("career") || q.includes("job") || q.includes("work") || q.includes("business") || q.includes("money") || q.includes("finance")) {
    const satStrength = ["Capricorn","Aquarius","Libra"].includes(t.saturnSign) ? "strong" : ["Aries","Cancer","Leo"].includes(t.saturnSign) ? "challenged" : "moderate"
    const jupStrength = ["Sagittarius","Pisces","Cancer"].includes(t.jupiterSign) ? "strong" : ["Capricorn","Gemini","Virgo"].includes(t.jupiterSign) ? "weakened" : "moderate"

    const satMsg = satStrength === "strong"
      ? "Saturn is in a position of power — long-term career strategies, discipline, and perseverance will be richly rewarded."
      : satStrength === "challenged"
      ? "Saturn is under pressure — expect delays and obstacles, but these are lessons building your resilience."
      : "Saturn is steady — consistent effort will yield reliable results."

    const jupMsg = jupStrength === "strong"
      ? "Jupiter blesses finances and growth — opportunities for expansion, promotions, and wise investments are heightened."
      : jupStrength === "weakened"
      ? "Jupiter's wisdom is turned inward — focus on learning and upskilling rather than aggressive expansion."
      : "Jupiter supports gradual professional growth through knowledge and ethical conduct."

    const bestDay = pick([
      `Thursday (Guru-vara) is ideal for important meetings and negotiations.`,
      `Saturday (Shani-vara) rewards completing pending tasks and following up on applications.`,
      `Wednesday (Budha-vara) is perfect for signing contracts and networking.`,
    ])

    return `📊 **Career & Finance — Live Transit Analysis**\n\n**Saturn (Shani)** transits **${t.saturnSign}**: ${satMsg}\n\n**Jupiter (Guru)** transits **${t.jupiterSign}**: ${jupMsg}\n\n**Mercury in ${t.mercurySign}:**\n${["Gemini","Virgo"].includes(t.mercurySign) ? "Mercury is in its element — communication, negotiations, and presentations are highly favored." : "Mercury's analytical edge helps with documentation and planning, though double-check contracts carefully."}\n\n**Today's Panchang Influence:**\n• ${t.paksha} Paksha ${t.tithi} — ${t.tithiNum < 15 ? "A waxing phase supporting new initiatives and job applications" : "A waning phase better for consolidation, reviews, and internal restructuring"}\n• Moon in ${t.moonNak} (${t.moonNakLord}) — ${t.moonNakLord === "Saturn" ? "Focus on long-term planning and patience" : t.moonNakLord === "Mercury" ? "Ideal for analytical work, writing, and communication" : t.moonNakLord === "Jupiter" ? "Favourable for big-picture thinking and mentorship" : `Channel ${t.moonNakLord}'s energy into your professional goals`}\n\n**Timing Advice:**\n• ${bestDay}\n• Avoid launching new ventures during Rahu Kaal. Check today's [Panchang](/horoscope) for exact timings.\n• The next Pushya Nakshatra day is especially auspicious for investments.\n\n**Career Mantra:** *Om Shanaishcharaya Namah* — Recite 11 times before important work decisions.\n\n*For precise career timing based on your Dasha periods, create your [Birth Chart](/kundli).*`
  }

  // ─── Health & Wellness ─────────────────
  if (q.includes("health") || q.includes("wellness") || q.includes("energy") || q.includes("stress") || q.includes("sleep")) {
    const sunMsg = ["Leo","Aries"].includes(t.sunSign)
      ? "The Sun is strong — your core vitality and immunity are elevated."
      : ["Libra","Aquarius"].includes(t.sunSign)
      ? "The Sun is not at full strength — prioritise rest, Vitamin D, and warm foods."
      : "Solar energy is moderate — maintain a balanced routine for steady health."

    const marsMsg = ["Aries","Capricorn","Scorpio"].includes(t.marsSign)
      ? "Mars is powerful — physical energy is high. Channel it through vigorous exercise to avoid restlessness."
      : ["Cancer","Taurus","Libra"].includes(t.marsSign)
      ? "Mars energy is subdued — opt for gentle yoga or walking over intense workouts."
      : "Mars gives moderate drive — structured routines work best right now."

    const moonHealth = t.moonNakLord === "Saturn" ? "emotional heaviness or fatigue — practice grounding exercises"
      : t.moonNakLord === "Mars" ? "heightened agitation — avoid spicy foods and arguments"
      : t.moonNakLord === "Moon" ? "emotional sensitivity — prioritise restful sleep and hydration"
      : t.moonNakLord === "Mercury" ? "mental overactivity — meditation and digital detox help"
      : `${t.moonNakLord}'s influence on mood — stay mindful of emotional eating patterns`

    return `🌿 **Health & Wellness — Transit Guidance**\n\n**Sun in ${t.sunSign}:** ${sunMsg}\n\n**Mars in ${t.marsSign}:** ${marsMsg}\n\n**Moon in ${t.moonSign} (${t.moonNak}):**\nToday's lunar energy tends toward ${moonHealth}.\n\n**Ayurvedic Timing for Today:**\n\n• **Best meal time:** 12–2 PM when digestive fire (Agni) peaks\n• **Morning practice:** ${pick(["Surya Namaskar at sunrise strengthens Surya's positive effects", "10 minutes of Nadi Shodhana (alternate nostril breathing) balances energy channels", "Oil pulling with sesame oil supports detoxification during this transit"])}\n• **Evening wind-down:** ${t.paksha === "Shukla" ? "Moon-gazing during Shukla Paksha is calming for the nervous system" : "Warm milk with turmeric before bed supports sleep during Krishna Paksha"}\n\n**Herbal Recommendation:**\n${pick(["Ashwagandha to calm Vata and support restful sleep", "Brahmi for mental clarity and focus", "Tulsi tea to boost immunity and reduce stress", "Triphala before bed for digestive health"])}\n\n**Healing Mantra:** *Om Dhanvantaraye Namah* — The mantra of the celestial physician.\n\n*Check your [Daily Horoscope](/horoscope) for today's specific Rahu Kaal and auspicious timings.*`
  }

  // ─── Spiritual / Nakshatra ─────────────
  if (q.includes("spiritual") || q.includes("meditation") || q.includes("nakshatra") || q.includes("mantra") || q.includes("karma") || q.includes("dharma")) {
    const nakEnergy = t.moonNakIdx < 9 ? "Dharma-oriented" : t.moonNakIdx < 18 ? "Artha/Kama-oriented" : "Moksha-oriented"

    return `🙏 **Spiritual Guidance — Cosmic Insight**\n\nThe Moon currently graces **${t.moonNak}** in ${t.moonSign}, a ${nakEnergy} nakshatra ruled by **${t.moonNakLord}**.\n\n**Today's Spiritual Landscape:**\n\n${t.paksha} Paksha ${t.tithi} carries ${t.tithiNum < 15 ? "building, creative energy — ideal for setting spiritual intentions and starting new practices" : "dissolving, reflective energy — perfect for letting go, forgiveness practices, and deep meditation"}.\n\n**Nakshatra Meditation:**\n${t.moonNak === "Ashwini" ? "Swift healing energy — meditate on rejuvenation and new beginnings"
  : t.moonNak === "Rohini" ? "Creative, nurturing energy — connect with nature and artistic expression"
  : t.moonNak === "Pushya" ? "The most auspicious nakshatra for spiritual growth — all practices are amplified today"
  : t.moonNak === "Mula" ? "Root transformation energy — powerful for shadow work and deep introspection"
  : t.moonNak === "Revati" ? "Compassionate, transcendent energy — ideal for seva (selfless service) and devotion"
  : `${t.moonNak}'s energy supports ${t.moonNakLord === "Jupiter" ? "expansion of consciousness and wisdom" : t.moonNakLord === "Saturn" ? "disciplined practice and patience" : t.moonNakLord === "Mercury" ? "intellectual inquiry and mantra japa" : t.moonNakLord === "Venus" ? "devotional practices and beauty-focused meditation" : "focused, intentional spiritual work"}`}\n\n**Recommended Practice for ${t.dayOfWeek}:**\n${t.dayLord === "Sun" ? "Surya meditation at sunrise — chant *Om Suryaya Namah* 12 times facing east"
  : t.dayLord === "Moon" ? "Chandra meditation — *Om Chandraya Namah* 108 times. Best done under moonlight."
  : t.dayLord === "Mars" ? "Hanuman Chalisa or *Om Mangalaya Namah* — channel Mars energy into courage and discipline"
  : t.dayLord === "Mercury" ? "Vishnu Sahasranama or *Om Budhaya Namah* — ideal for intellectual spiritual study"
  : t.dayLord === "Jupiter" ? "Guru Puja — honour a teacher or mentor. *Om Gurave Namah* — the most auspicious day for spiritual learning"
  : t.dayLord === "Venus" ? "Lakshmi or Saraswati meditation — *Om Shukraya Namah*. Devotional music and arts are blessed."
  : "Shani meditation — *Om Shanaishcharaya Namah*. Service to the elderly or underprivileged earns Saturn's blessings."}\n\n**Rahu in ${t.rahuSign} / Ketu in ${t.ketuSign}:**\nThe nodal axis asks you to ${pick(["release attachment to outcomes and trust the cosmic plan", "embrace change as a vehicle for spiritual evolution", "balance material ambition with inner peace", "explore past-life patterns through meditation and journaling"])}.\n\n*Explore your full spiritual blueprint with your [Birth Chart](/kundli).*`
  }

  // ─── Remedies ──────────────────────────
  if (q.includes("remedy") || q.includes("remedies") || q.includes("solution") || q.includes("gemstone") || q.includes("pooja")) {
    return `💎 **Vedic Remedies — Current Transit Prescriptions**\n\nBased on today's planetary positions, here are targeted remedies:\n\n**1. ${t.dayLord} Remedy (Today is ${t.dayOfWeek}):**\n${t.dayLord === "Sun" ? "Offer water (Arghya) to the rising sun. Wear ruby or garnet. Donate wheat." : t.dayLord === "Moon" ? "Offer milk to a Shiva lingam. Wear pearl or moonstone. Maintain emotional equanimity." : t.dayLord === "Mars" ? "Recite Hanuman Chalisa. Wear red coral. Donate red lentils (masoor dal)." : t.dayLord === "Mercury" ? "Chant *Om Budhaya Namah*. Wear emerald. Feed green vegetables to a cow." : t.dayLord === "Jupiter" ? "Visit a temple and offer yellow sweets. Wear yellow sapphire. Respect elders and teachers." : t.dayLord === "Venus" ? "Offer white flowers to Lakshmi. Wear diamond or opal. Donate white items." : "Light a sesame oil lamp at a Shani temple. Wear blue sapphire (only if advised by astrologer). Serve the underprivileged."}\n\n**2. Moon Nakshatra Remedy (${t.moonNak}):**\n${t.moonNakLord === "Ketu" ? "Chant *Om Ketave Namah* — meditate in silence for at least 10 minutes" : t.moonNakLord === "Venus" ? "Offer fragrant flowers — donate cosmetics or sweets to those in need" : t.moonNakLord === "Sun" ? "Perform Surya Namaskar — offer red flowers at a temple" : t.moonNakLord === "Moon" ? "Offer milk and rice — practice gratitude and forgiveness meditation" : t.moonNakLord === "Mars" ? "Recite *Om Mangalaya Namah* 108 times — donate red items" : t.moonNakLord === "Rahu" ? "Chant Durga mantra — donate to charity, avoid alcohol" : t.moonNakLord === "Jupiter" ? "Read sacred texts — offer bananas and yellow flowers at a temple" : t.moonNakLord === "Saturn" ? "Feed black sesame to birds — practice patience and service" : "Recite *Om Budhaya Namah* — donate green vegetables and books"}\n\n**3. General Transit Remedy:**\n• Jupiter in ${t.jupiterSign}: ${["Sagittarius","Pisces","Cancer"].includes(t.jupiterSign) ? "Jupiter is strong — make offerings of gratitude to amplify blessings" : "Strengthen Jupiter by wearing yellow, donating educational materials, and respecting teachers"}\n• Saturn in ${t.saturnSign}: ${["Capricorn","Aquarius","Libra"].includes(t.saturnSign) ? "Saturn is well-placed — continue disciplined effort" : "Pacify Saturn with sesame oil lamps on Saturdays and acts of service"}\n\n**Universal Remedy:** Light a ghee lamp at dusk (Sandhya Kaal) facing east. State your intention clearly — the transition between day and night amplifies prayers.\n\n*For remedies specific to YOUR birth chart, create your [Kundli](/kundli).*`
  }

  // ─── Planet Influence ──────────────────
  if (q.includes("planet") || q.includes("transit") || q.includes("rahu") || q.includes("ketu") || q.includes("saturn") || q.includes("jupiter") || q.includes("venus") || q.includes("mars") || q.includes("mercury")) {
    return `🪐 **Current Planetary Positions — Live Transit Map**\n\n**Graha Gochar (Planetary Transits) Right Now:**\n\n• **☀️ Sun (Surya):** ${t.sunSign} at ${t.sunDeg.toFixed(1)}° — ${["Leo","Aries"].includes(t.sunSign) ? "Strong and authoritative" : ["Libra"].includes(t.sunSign) ? "Debilitated — may feel low energy" : "Steady solar influence"}\n• **🌙 Moon (Chandra):** ${t.moonSign} at ${t.moonDeg.toFixed(1)}° in ${t.moonNak} — ${t.moonNakLord === "Jupiter" ? "Wisdom and expansive emotions" : t.moonNakLord === "Venus" ? "Artistic and romantic feelings" : `Ruled by ${t.moonNakLord}`}\n• **♂ Mars (Mangal):** ${t.marsSign} — ${["Aries","Capricorn","Scorpio"].includes(t.marsSign) ? "Powerful and action-oriented" : "Moderate energy"}\n• **☿ Mercury (Budha):** ${t.mercurySign} — ${["Gemini","Virgo"].includes(t.mercurySign) ? "Brilliant for communication" : "Steady intellectual energy"}\n• **♃ Jupiter (Guru):** ${t.jupiterSign} — ${["Sagittarius","Pisces","Cancer"].includes(t.jupiterSign) ? "Bestowing wisdom and growth" : "Teaching through challenges"}\n• **♀ Venus (Shukra):** ${t.venusSign} — ${["Taurus","Libra","Pisces"].includes(t.venusSign) ? "Radiant and graceful" : "Practical love energy"}\n• **♄ Saturn (Shani):** ${t.saturnSign} — ${["Capricorn","Aquarius","Libra"].includes(t.saturnSign) ? "Disciplined and powerful" : "Testing patience and resolve"}\n• **☊ Rahu:** ${t.rahuSign} — Amplifying ${t.rahuSign} themes with intensity\n• **☋ Ketu:** ${t.ketuSign} — Spiritual detachment and past-life lessons in ${t.ketuSign} matters\n\n**Panchang Snapshot:**\n• Tithi: ${t.paksha} ${t.tithi}\n• Day: ${t.dayOfWeek} (ruled by ${t.dayLord})\n• Nakshatra: ${t.moonNak}\n\n**What This Means:**\nThe current sky emphasises ${["Jupiter","Venus"].includes(t.dayLord) ? "growth, learning, and beauty" : ["Saturn","Mars"].includes(t.dayLord) ? "discipline, courage, and perseverance" : "communication, adaptability, and emotional awareness"}. ${t.tithiNum < 15 ? "The waxing Moon supports new beginnings." : "The waning Moon favours reflection and completion."}\n\n*For how these transits affect YOUR specific chart, generate your [Kundli](/kundli).*`
  }

  // ─── General / Default ─────────────────
  const generalIntro = pick([
    `✨ **Cosmic Guidance — ${t.dayOfWeek}'s Reading**`,
    `🔮 **Vedic Insight for Today**`,
    `🌟 **Celestial Wisdom — Live Reading**`,
  ])

  const jupiterMsg = ["Sagittarius","Pisces","Cancer"].includes(t.jupiterSign)
    ? "Jupiter's strength in " + t.jupiterSign + " brings expansion and blessings — stay open to unexpected opportunities."
    : "Jupiter in " + t.jupiterSign + " teaches growth through patience and honest self-assessment."

  const rahuKetuMsg = pick([
    `Rahu in ${t.rahuSign} pushes you beyond comfort zones — embrace calculated risks.`,
    `Ketu in ${t.ketuSign} asks you to release outdated identities and trust your spiritual evolution.`,
    `The Rahu-Ketu axis across ${t.rahuSign}/${t.ketuSign} creates a powerful pull between worldly ambition and inner liberation.`,
  ])

  return `${generalIntro}\n\nThe Moon graces **${t.moonNak}** nakshatra in ${t.moonSign}, ruled by **${t.moonNakLord}**. Today is ${t.paksha} Paksha ${t.tithi}.\n\n**Key Planetary Messages:**\n\n• **Jupiter (Guru) in ${t.jupiterSign}:** ${jupiterMsg}\n• **Saturn (Shani) in ${t.saturnSign}:** ${["Capricorn","Aquarius","Libra"].includes(t.saturnSign) ? "Discipline is your superpower right now — what feels slow is building something lasting." : "Saturn asks for patience and perseverance. The fruits of your effort will manifest in time."}\n• **${rahuKetuMsg}**\n• **Moon (Chandra):** Your intuition peaks during ${t.moonNak} — ${t.moonNakLord === "Jupiter" ? "trust your inner wisdom" : t.moonNakLord === "Venus" ? "follow what brings beauty and harmony" : t.moonNakLord === "Saturn" ? "embrace solitude for clarity" : "listen to your heart's quiet voice"}.\n\n**Spiritual Guidance:**\nThe ${t.tithi} tithi carries ${t.tithiNum < 5 ? "fresh, creative energy — ideal for beginning new practices" : t.tithiNum < 10 ? "building momentum — stay consistent with ongoing efforts" : t.tithiNum < 15 ? "full, powerful energy approaching Purnima — your prayers carry extra weight" : t.tithiNum < 20 ? "reflective energy — journal, meditate, and review your path" : t.tithiNum < 25 ? "dissolving energy — let go of what no longer serves you" : "deep introspective energy approaching Amavasya — powerful for shadow work and release"}.\n\n**Today's Practice (${t.dayOfWeek}):**\n${t.dayLord === "Sun" ? "1. Offer water to the rising sun\n2. Chant *Om Suryaya Namah* 12 times" : t.dayLord === "Moon" ? "1. Practice Chandra Namaskar (Moon salutations)\n2. Chant *Om Chandraya Namah* 108 times" : t.dayLord === "Jupiter" ? "1. Visit a temple or sacred space\n2. Chant *Om Gurave Namah* — honour a teacher or mentor" : t.dayLord === "Venus" ? "1. Engage in creative expression\n2. Chant *Om Shukraya Namah* with devotional intent" : t.dayLord === "Saturn" ? "1. Serve someone in need\n2. Chant *Om Shanaishcharaya Namah* 11 times" : t.dayLord === "Mars" ? "1. Practice physical discipline (exercise, martial arts)\n2. Chant *Om Mangalaya Namah* with courage" : "1. Study sacred texts or learn something new\n2. Chant *Om Budhaya Namah* for mental clarity"}\n\n*For personalised insights based on your exact birth details, explore your [Kundli](/kundli) or check today's [Horoscope](/horoscope).*`
}

// ─── Constants ──────────────────────────────────────────

const QUICK_QUESTIONS: QuickQuestion[] = [
  { icon: Heart, label: "Love", question: "What do the stars say about my love life this week?", category: "Relationships", color: "#F0C8E0" },
  { icon: Briefcase, label: "Career", question: "What career opportunities are the planets indicating for me?", category: "Career", color: "#4ADE80" },
  { icon: Moon, label: "Today", question: "What should I focus on today according to my horoscope?", category: "Daily", color: "#C8D8E4" },
  { icon: Brain, label: "Spiritual", question: "What spiritual practices would benefit me right now?", category: "Spiritual", color: "#8B8BCD" },
  { icon: Sun, label: "Health", question: "What does Vedic astrology suggest for my health and energy this month?", category: "Health", color: "#E2994A" },
  { icon: Star, label: "General", question: "Give me a general Vedic astrology reading for the current period.", category: "General", color: "#E2C474" },
]

const SUGGESTED_FOLLOWUPS = [
  "What remedies can improve my situation?",
  "Which planet is most influential for me right now?",
  "What does my Nakshatra say about this?",
  "Is there an auspicious time for important decisions?",
]

// ─── Typing Animation Hook ──────────────────────────────

function useTypingAnimation(text: string, speed: number = 12) {
  const [displayed, setDisplayed] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setIsComplete(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, isComplete }
}

// ─── Markdown-lite renderer ─────────────────────────────

function RenderContent({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return <h2 key={i} className="text-lg font-bold text-text/90 mt-3">{line.slice(2)}</h2>
        }
        if (line.startsWith("## ") || line.startsWith("**") && line.endsWith("**")) {
          const clean = line.replace(/^\*\*|\*\*$/g, "").replace(/^## /, "")
          return <h3 key={i} className="text-sm font-bold text-gold/80 mt-2">{clean}</h3>
        }
        if (line.startsWith("• ") || line.startsWith("- ")) {
          return (
            <p key={i} className="text-sm text-text/70 leading-relaxed pl-3 flex gap-2">
              <span className="text-gold/40 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
            </p>
          )
        }
        if (/^\d+\./.test(line)) {
          return (
            <p key={i} className="text-sm text-text/70 leading-relaxed pl-3">
              <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            </p>
          )
        }
        if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
          return <p key={i} className="text-xs text-text-dim/50 italic leading-relaxed">{line.replace(/^\*|\*$/g, "")}</p>
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-sm text-text/70 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text/90 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gold/70">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold/70 underline underline-offset-2 hover:text-gold transition-colors">$1</a>')
}

// ─── Message Bubble ─────────────────────────────────────

function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-gold/[0.1] border border-gold/[0.15]">
          <p className="text-sm text-text/90">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="h-3.5 w-3.5 text-gold/70" />
      </div>
      <div className="flex-1 max-w-[90%]">
        <div className="chat-bubble-assistant rounded-2xl rounded-tl-md bg-bg-card/80 border border-white/[0.04] px-5 py-4">
          {isLatest ? (
            <TypingResponse content={message.content} />
          ) : (
            <RenderContent content={message.content} />
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TypingResponse({ content }: { content: string }) {
  const { displayed, isComplete } = useTypingAnimation(content, 8)
  return (
    <>
      <RenderContent content={displayed} />
      {!isComplete && (
        <span className="inline-block w-1.5 h-4 bg-gold/50 animate-pulse ml-0.5 align-middle" />
      )}
    </>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function AstrologerPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const FREE_LIMIT = 3

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return
    if (questionsAsked >= FREE_LIMIT) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsThinking(true)
    setQuestionsAsked(prev => prev + 1)

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(text)
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsThinking(false)
    }, 1500 + Math.random() * 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const isAtLimit = questionsAsked >= FREE_LIMIT

  // ─── Empty State ────────────────────────────────────

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gold/[0.015] blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/[0.06] border border-gold/[0.15] flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-gold/70" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Ask the <span className="gold-text">AI Astrologer</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto mb-2">
              Get instant Vedic astrology guidance powered by ancient wisdom and modern AI
            </p>
            <p className="text-[10px] text-gold/40 tracking-wider">
              {FREE_LIMIT - questionsAsked} free questions remaining • Unlimited with GrahAI Pro
            </p>
          </motion.div>

          {/* Quick Questions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-xs text-text-dim/40 text-center mb-4 tracking-wide">Choose a topic or ask anything</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_QUESTIONS.map((q, i) => (
                <motion.button
                  key={q.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(q.question)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${q.color}10` }}>
                    <q.icon className="h-5 w-5" style={{ color: q.color }} />
                  </div>
                  <span className="text-xs font-semibold text-text/70">{q.label}</span>
                  <span className="text-[9px] text-text-dim/30">{q.category}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Input Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="glass-input flex items-center gap-3 pr-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about love, career, health, spirituality..."
                className="flex-1 bg-transparent px-5 py-4 text-sm text-text/90 placeholder:text-text-dim/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-gold/20 text-gold hover:bg-gold/30"
                    : "bg-white/[0.03] text-text-dim/20"
                }`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </motion.form>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            {[
              "Based on BPHS",
              "Panchang-Aware",
              "Vedic Traditions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gold/30" />
                <span className="text-[9px] text-text-dim/30 tracking-wider">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── Chat View ──────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header Bar */}
      <div className="fixed top-0 z-40 w-full glass-nav border-b border-white/[0.04]">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-gold/70" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text/80">AI Astrologer</span>
              <span className="text-[9px] text-green/50 ml-2">● Online</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-dim/30">
              {isAtLimit ? "Limit reached" : `${FREE_LIMIT - questionsAsked} questions left`}
            </span>
            <Link href="/horoscope" className="text-[10px] text-gold/50 hover:text-gold/70 transition-colors">
              Daily Horoscope →
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 pt-20 pb-32 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 space-y-6 py-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLatest={msg.role === "assistant" && i === messages.length - 1}
            />
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-gold/70" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-bg-card/80 border border-white/[0.04] px-5 py-4">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested follow-ups after AI response */}
          {messages.length > 0 &&
           messages[messages.length - 1].role === "assistant" &&
           !isThinking &&
           !isAtLimit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 pl-11"
            >
              {SUGGESTED_FOLLOWUPS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gold/10 bg-gold/[0.03] text-gold/60 hover:bg-gold/[0.06] hover:border-gold/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          {/* Free limit reached */}
          {isAtLimit && !isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center space-y-4 mx-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gold/[0.08] flex items-center justify-center">
                <Zap className="h-5 w-5 text-gold/70" />
              </div>
              <h3 className="text-sm font-semibold text-text/80">You&apos;ve used your {FREE_LIMIT} free questions</h3>
              <p className="text-xs text-text-dim/50 max-w-sm mx-auto">
                Unlock unlimited AI astrology consultations, personalized daily readings, and deep chart analysis with GrahAI Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/pricing"
                  className="glow-btn text-sm py-2.5 px-6 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
                <Link
                  href="/chat"
                  className="rounded-xl border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-sm font-semibold text-gold/70 hover:border-gold/30 transition-all flex items-center justify-center gap-2"
                >
                  Sign in for more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar (fixed bottom) */}
      <div className="fixed bottom-0 w-full bg-gradient-to-t from-bg via-bg/95 to-transparent pt-6 pb-6">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className={`glass-input flex items-center gap-3 pr-2 ${isAtLimit ? "opacity-50 pointer-events-none" : ""}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAtLimit ? "Upgrade to continue asking..." : "Ask a follow-up question..."}
                disabled={isAtLimit || isThinking}
                className="flex-1 bg-transparent px-5 py-3.5 text-sm text-text/90 placeholder:text-text-dim/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking || isAtLimit}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isThinking
                    ? "bg-gold/20 text-gold hover:bg-gold/30"
                    : "bg-white/[0.03] text-text-dim/20"
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick nav */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {[
              { href: "/horoscope", label: "Daily Horoscope" },
              { href: "/kundli", label: "Birth Chart" },
              { href: "/compatibility", label: "Matching" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-[9px] text-text-dim/30 hover:text-gold/40 transition-colors tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
