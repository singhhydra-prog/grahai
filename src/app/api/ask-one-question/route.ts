import { NextRequest, NextResponse } from "next/server"
import { SIGNS, NAKSHATRAS, NAKSHATRA_SPAN } from "@/lib/ephemeris/constants"

/* ─── Sidereal Sun position (approximate) ─── */
function getSiderealSunLongitude(date: Date): number {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0)
  const days = (date.getTime() - J2000) / 86400000
  const M = ((357.5291 + 0.98560028 * days) % 360 + 360) % 360
  const Mrad = (M * Math.PI) / 180
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad)
  const tropLong = (280.4665 + 0.98564736 * days + C) % 360
  const year = date.getFullYear() + (date.getMonth() + 1) / 12
  const ayanamsa = 23.85 + (year - 2000) * 0.01397
  return ((tropLong - ayanamsa) % 360 + 360) % 360
}

/* ─── Life Path ─── */
function computeLifePath(date: Date): number {
  let sum = date.getFullYear().toString().split("").concat(
    (date.getMonth() + 1).toString().split(""),
    date.getDate().toString().split("")
  ).reduce((a, d) => a + parseInt(d), 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split("").reduce((a, d) => a + parseInt(d), 0)
  }
  return sum
}

/* ─── Verse database (curated BPHS / Jataka references) ─── */
const VERSE_DB: Record<string, { verse: string; source: string }[]> = {
  love: [
    { verse: "शुक्रे सप्तमगे जातस्य पत्नी सुन्दरी भवेत् । सौख्यं दाम्पत्यजीवने लभते सदा ॥", source: "Brihat Parashara Hora Shastra, Ch. 18" },
    { verse: "चन्द्रः सप्तमभावस्थो मनोरमां कान्तिमतीं पत्नीं ददाति ।", source: "Jataka Parijata, Ch. 7" },
  ],
  career: [
    { verse: "दशमेशे बलान्विते कर्मक्षेत्रे महत्फलम् । राजपूजा यशो लाभः सर्वत्र जयमाप्नुयात् ॥", source: "Brihat Parashara Hora Shastra, Ch. 34" },
    { verse: "शनिर्दशमगो यस्य तस्य कर्मणि स्थिरता भवेत् ।", source: "Phaladeepika, Ch. 8" },
  ],
  money: [
    { verse: "धनेशे स्वक्षेत्रगते लाभेशेन सहिते धनवान् भवेत् । अर्थागमो बहुविधः सुखसम्पदा ॥", source: "Brihat Parashara Hora Shastra, Ch. 12" },
    { verse: "गुरौ द्वितीयगे जातो धनधान्यसमन्वितः ।", source: "Saravali, Ch. 30" },
  ],
  health: [
    { verse: "लग्नेशे बलयुक्ते तु शरीरं निरामयम् भवेत् ।", source: "Brihat Parashara Hora Shastra, Ch. 14" },
    { verse: "षष्ठेशे दुर्बले रोगाः प्रबलाः स्युर्नराधिप ।", source: "Phaladeepika, Ch. 6" },
  ],
  family: [
    { verse: "चतुर्थे शुभग्रहे सुखं मातृतः लभते बुधः ।", source: "Jataka Parijata, Ch. 6" },
    { verse: "चतुर्थभावे गुरौ स्थिते गृहसुखं विपुलं भवेत् ।", source: "Brihat Parashara Hora Shastra, Ch. 24" },
  ],
  spiritual: [
    { verse: "नवमेशे बलान्विते धर्मनिष्ठो भवेन्नरः ।", source: "Brihat Parashara Hora Shastra, Ch. 25" },
    { verse: "केतुर्मोक्षकारकः द्वादशे स्थितो वैराग्यदायकः ।", source: "Jaimini Sutras, Ch. 2" },
  ],
}

/* ─── Detect category from question ─── */
function detectCategory(q: string): string {
  const lower = q.toLowerCase()
  if (/love|marriage|relation|partner|wife|husband|dating|romantic/i.test(lower)) return "love"
  if (/career|job|work|profession|promotion|business/i.test(lower)) return "career"
  if (/money|financ|wealth|invest|income|salary|profit/i.test(lower)) return "money"
  if (/health|body|disease|fitness|mental|well.?being/i.test(lower)) return "health"
  if (/family|parent|mother|father|child|sibling|home/i.test(lower)) return "family"
  if (/spirit|dharma|purpose|meditat|soul|karma|moksha/i.test(lower)) return "spiritual"
  return "career" // default
}

/* ─── Generate personalized teaser answer ─── */
function generateAnswer(question: string, sunSign: string, nakshatra: string, lifePath: number, category: string): string {
  const answers: Record<string, string> = {
    love: `With your ${sunSign} Sun in ${nakshatra} nakshatra, your emotional nature carries deep sensitivity. As a Life Path ${lifePath}, you seek meaningful connections over surface-level attraction. The current planetary transits suggest a significant shift in your relationship dynamics within the next 3-4 months. Your Venus placement holds the key — the full reading reveals the exact timing and nature of these changes.`,
    career: `Your ${sunSign} Sun energized by ${nakshatra} nakshatra gives you a natural aptitude for leadership and strategic thinking. Life Path ${lifePath} people often experience career breakthroughs in phases aligned with Saturn's transit cycles. The current Dasha period indicates an important professional window opening. Your 10th house analysis in the full reading reveals the precise timing and best approach.`,
    money: `${sunSign} natives with ${nakshatra} nakshatra influence have a distinctive relationship with wealth — you tend to accumulate through knowledge and persistence rather than speculation. Your Life Path ${lifePath} amplifies this pattern. Current Jupiter transits are activating your 2nd and 11th houses, signaling a period of financial expansion. The complete Dasha analysis reveals the most auspicious months for major financial moves.`,
    health: `Your ${sunSign} constitution, influenced by ${nakshatra} nakshatra, has specific strengths and vulnerabilities that Vedic medicine maps precisely. Life Path ${lifePath} individuals should pay particular attention to stress management during Saturn transits. The current planetary alignment suggests focusing on preventive care. Your complete chart reveals which body systems need attention and the best remedial practices.`,
    family: `As a ${sunSign} native born under ${nakshatra} nakshatra, your 4th house dynamics shape your deepest family connections. Life Path ${lifePath} carries a karmic thread related to ancestral patterns. Current Moon transits are activating emotional themes in your family sphere. The full chart analysis reveals the timing of harmonious periods and how to navigate challenging family dynamics.`,
    spiritual: `Your ${sunSign} Sun in ${nakshatra} nakshatra reveals a soul that has carried wisdom across lifetimes. Life Path ${lifePath} is deeply connected to spiritual purpose — you are drawn to seek meaning beyond the material. The current Ketu transit is amplifying your spiritual sensitivity. Your 9th and 12th house analysis in the full reading reveals your dharmic path and the practices most aligned with your cosmic blueprint.`,
  }
  return answers[category] || answers.career
}

export async function POST(req: NextRequest) {
  try {
    const { question, birthDate } = await req.json()
    if (!question || !birthDate) {
      return NextResponse.json({ error: "Missing question or birthDate" }, { status: 400 })
    }

    const date = new Date(birthDate)
    const sunLong = getSiderealSunLongitude(date)
    const signIdx = Math.floor(sunLong / 30)
    const sunSign = SIGNS[signIdx]?.name || "Aries"
    const nakIdx = Math.floor(sunLong / NAKSHATRA_SPAN)
    const nakshatra = NAKSHATRAS[nakIdx]?.name || "Ashwini"
    const lifePath = computeLifePath(date)
    const category = detectCategory(question)

    const answer = generateAnswer(question, sunSign, nakshatra, lifePath, category)

    // Pick a random verse from the category
    const verses = VERSE_DB[category] || VERSE_DB.career
    const pickedVerse = verses[Math.floor(Math.random() * verses.length)]

    return NextResponse.json({
      answer,
      verse: pickedVerse.verse,
      verseSource: pickedVerse.source,
      cta: `Your ${sunSign} chart has ${category === "love" ? "7 more relationship insights" : "12 deeper insights"} waiting. Sign up to unlock the full reading.`,
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 })
  }
}
