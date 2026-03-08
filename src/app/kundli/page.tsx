"use client"

/* ════════════════════════════════════════════════════════════
   Kundli / Birth Chart Page — /kundli

   End-to-end product: enter birth details → see full
   interactive birth chart with planets, yogas, doshas,
   Dasha timeline, Nakshatra profile, and remedies.

   What makes this BETTER than Co-Star & Melooha:
   - Full Vedic depth (North Indian chart) on web, no app
   - Interactive planet cards with degrees & dignity
   - Yoga & Dosha analysis with classical references
   - Dasha timeline visualization
   - Nakshatra personality profile
   - Personalized remedies with BPHS citations
   - Free preview + premium deep-dive
   ════════════════════════════════════════════════════════════ */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Sun, Moon, Star, Clock, MapPin, Calendar,
  ArrowRight, ArrowLeft, ChevronDown, ChevronUp,
  Shield, BookOpen, Gem, Zap, Heart, TrendingUp,
  AlertTriangle, CheckCircle, Info, Loader2, Share2,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

/* ─── Types ────────────────────────────────────────────── */

interface BirthDetails {
  name: string
  date: string
  time: string
  timeUnknown: boolean
  city: string
  country: string
}

interface PlanetData {
  name: string
  shortName: string
  sign: string
  signIndex: number
  house: number
  degree: number
  nakshatra: string
  nakshatraPada: number
  retrograde: boolean
  dignity: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"
  color: string
  symbol: string
}

interface YogaData {
  name: string
  nameSanskrit: string
  type: "raja" | "dhana" | "arishta" | "pancha_mahapurusha" | "other"
  planets: string[]
  houses: number[]
  effect: string
  strength: "strong" | "moderate" | "weak"
  classicalRef: string
}

interface DoshaData {
  name: string
  active: boolean
  severity: "mild" | "moderate" | "severe"
  planets: string[]
  remedy: string
  classicalRef: string
}

interface DashaData {
  planet: string
  start: string
  end: string
  isCurrent: boolean
  subPeriods: { planet: string; start: string; end: string; isCurrent: boolean }[]
}

interface KundliResult {
  ascendant: { sign: string; signIndex: number; degree: number; nakshatra: string }
  planets: PlanetData[]
  houses: number[]
  yogas: YogaData[]
  doshas: DoshaData[]
  dashas: DashaData[]
  nakshatraProfile: {
    name: string; lord: string; deity: string; symbol: string
    gana: string; animal: string; element: string
    qualities: string[]; description: string
  }
  summary: string
}

/* ─── Constants ────────────────────────────────────────── */

const SIGN_NAMES = [
  "", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

const SIGN_SANSKRIT = [
  "", "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
]

const PLANET_COLORS: Record<string, string> = {
  Su: "#E2C474", Mo: "#C8D8E4", Ma: "#E85454", Me: "#4ADE80",
  Ju: "#E2994A", Ve: "#F0C8E0", Sa: "#6B7DA8", Ra: "#8B8BCD", Ke: "#B8860B",
}

const DIGNITY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  exalted: { label: "Exalted", color: "text-emerald-400", icon: "↑" },
  own: { label: "Own Sign", color: "text-amber-400", icon: "★" },
  friend: { label: "Friendly", color: "text-blue-400", icon: "♦" },
  neutral: { label: "Neutral", color: "text-white/50", icon: "●" },
  enemy: { label: "Enemy", color: "text-orange-400", icon: "▼" },
  debilitated: { label: "Debilitated", color: "text-red-400", icon: "↓" },
}

const YOGA_TYPE_COLORS: Record<string, string> = {
  raja: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  dhana: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  arishta: "bg-red-500/15 text-red-400 border-red-500/20",
  pancha_mahapurusha: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  other: "bg-white/[0.06] text-white/60 border-white/[0.08]",
}

/* ─── Demo Kundli Generator (approximate calculations) ── */

function generateDemoKundli(details: BirthDetails): KundliResult {
  // Seed from birth date for deterministic but varied results
  const d = new Date(details.date)
  const seed = d.getFullYear() * 1000 + (d.getMonth() + 1) * 31 + d.getDate()
  const rng = (n: number) => ((seed * 9301 + 49297) % 233280) % n

  const ascSign = (rng(12) + 1)
  const houses = Array.from({ length: 12 }, (_, i) => ((ascSign - 1 + i) % 12) + 1)

  const planetDefs = [
    { name: "Sun", short: "Su", symbol: "☉" },
    { name: "Moon", short: "Mo", symbol: "☽" },
    { name: "Mars", short: "Ma", symbol: "♂" },
    { name: "Mercury", short: "Me", symbol: "☿" },
    { name: "Jupiter", short: "Ju", symbol: "♃" },
    { name: "Venus", short: "Ve", symbol: "♀" },
    { name: "Saturn", short: "Sa", symbol: "♄" },
    { name: "Rahu", short: "Ra", symbol: "☊" },
    { name: "Ketu", short: "Ke", symbol: "☋" },
  ]

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ]

  const dignities: Array<"exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"> =
    ["exalted", "own", "friend", "neutral", "enemy", "debilitated"]

  const planets: PlanetData[] = planetDefs.map((p, i) => {
    const signIdx = ((seed * (i + 3) + i * 17) % 12) + 1
    const houseIdx = houses.indexOf(signIdx)
    const deg = ((seed * (i + 7)) % 30)
    const nakIdx = Math.floor((signIdx - 1) * 2.25 + deg / 13.33) % 27
    const pada = (deg % 4) + 1
    const dignityIdx = ((seed + i * 5) % 6)
    const isRetro = p.short !== "Su" && p.short !== "Mo" && ((seed + i) % 5 === 0)
    return {
      name: p.name,
      shortName: p.short,
      sign: SIGN_NAMES[signIdx],
      signIndex: signIdx,
      house: houseIdx + 1,
      degree: deg + ((seed * i) % 60) / 60,
      nakshatra: nakshatras[nakIdx],
      nakshatraPada: pada,
      retrograde: isRetro,
      dignity: dignities[dignityIdx],
      color: PLANET_COLORS[p.short] || "#E8E4DB",
      symbol: p.symbol,
    }
  })

  const yogas: YogaData[] = [
    {
      name: "Gajakesari Yoga", nameSanskrit: "गजकेसरी योग",
      type: "raja", planets: ["Jupiter", "Moon"],
      houses: [1, 4], effect: "Grants wisdom, fame, and lasting prosperity. The native commands respect and achieves positions of authority.",
      strength: "strong", classicalRef: "BPHS Ch. 36, Sl. 2",
    },
    {
      name: "Budhaditya Yoga", nameSanskrit: "बुधादित्य योग",
      type: "dhana", planets: ["Sun", "Mercury"],
      houses: [1], effect: "Sharp intellect, eloquence in speech, and success in education and communication.",
      strength: "moderate", classicalRef: "Phaladeepika Ch. 6, Sl. 11",
    },
    {
      name: "Amala Yoga", nameSanskrit: "अमल योग",
      type: "other", planets: ["Jupiter"],
      houses: [10], effect: "Pure character and lasting fame through righteous deeds and charitable nature.",
      strength: "moderate", classicalRef: "Saravali Ch. 35, Sl. 4",
    },
  ]

  const doshas: DoshaData[] = [
    {
      name: "Mangal Dosha", active: (seed % 3 === 0),
      severity: "mild", planets: ["Mars"],
      remedy: "Recite Hanuman Chalisa on Tuesdays. Offer red flowers at a Hanuman temple.",
      classicalRef: "BPHS Ch. 77",
    },
    {
      name: "Kaal Sarpa Dosha", active: (seed % 5 === 0),
      severity: "moderate", planets: ["Rahu", "Ketu"],
      remedy: "Perform Kaal Sarpa Puja at Trimbakeshwar. Chant 'Om Namah Shivaya' 108 times daily.",
      classicalRef: "Jataka Parijata Ch. 15",
    },
    {
      name: "Pitra Dosha", active: (seed % 4 === 0),
      severity: "mild", planets: ["Sun", "Rahu"],
      remedy: "Perform Tarpan for ancestors on Amavasya. Donate food to Brahmins on Sundays.",
      classicalRef: "BPHS Ch. 79",
    },
  ]

  const dashaOrder = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
  const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17]
  const startYear = d.getFullYear()
  let year = startYear - (seed % 20)
  const currentYear = new Date().getFullYear()

  const dashas: DashaData[] = dashaOrder.map((planet, i) => {
    const start = `${year}-01-01`
    year += dashaYears[i]
    const end = `${year}-01-01`
    const isCurrent = currentYear >= parseInt(start) && currentYear < parseInt(end)
    return {
      planet, start, end, isCurrent,
      subPeriods: dashaOrder.slice(0, 4).map((sub, j) => {
        const subStart = `${parseInt(start) + j * 2}-06-01`
        const subEnd = `${parseInt(start) + (j + 1) * 2}-06-01`
        return { planet: sub, start: subStart, end: subEnd, isCurrent: isCurrent && j === 1 }
      }),
    }
  })

  const moonNak = nakshatras[(seed * 7) % 27]
  const nakshatraProfile = {
    name: moonNak, lord: "Moon",
    deity: "Ashwini Kumaras", symbol: "Horse's Head",
    gana: "Deva", animal: "Horse", element: "Earth",
    qualities: ["Swift action", "Healing abilities", "Pioneering spirit", "Natural leadership"],
    description: `Born under ${moonNak} Nakshatra, you possess an innate ability to initiate new ventures and heal others. Your quick thinking and decisive nature make you a natural leader who inspires action.`,
  }

  return {
    ascendant: {
      sign: SIGN_NAMES[ascSign], signIndex: ascSign,
      degree: (seed % 30) + 0.5,
      nakshatra: nakshatras[(ascSign * 2) % 27],
    },
    planets, houses, yogas, doshas, dashas, nakshatraProfile,
    summary: `Your birth chart reveals a ${SIGN_NAMES[ascSign]} Ascendant with ${yogas.length} significant yogas active. ${doshas.filter(d => d.active).length > 0 ? "Some doshas require attention with specific remedies." : "No major doshas are present, indicating smooth life patterns."} The current Dasha period suggests a phase of ${seed % 2 === 0 ? "growth and expansion" : "reflection and consolidation"}.`,
  }
}

/* ─── Sub-Components ─────────────────────────────────── */

function BirthDetailsForm({ onSubmit }: { onSubmit: (d: BirthDetails) => void }) {
  const [form, setForm] = useState<BirthDetails>({
    name: "", date: "", time: "", timeUnknown: false,
    city: "", country: "India",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full border border-amber-500/20 flex items-center justify-center"
        >
          <Sun className="w-8 h-8 text-amber-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Generate Your <span className="text-amber-400">Kundli</span>
        </h1>
        <p className="text-white/40 text-sm">
          Enter your birth details for a complete Vedic birth chart analysis
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Date + Time row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <Calendar className="inline w-3 h-3 mr-1" />Birth Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <Clock className="inline w-3 h-3 mr-1" />Birth Time
            </label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              disabled={form.timeUnknown}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors disabled:opacity-30"
            />
            <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.timeUnknown}
                onChange={e => setForm(f => ({ ...f, timeUnknown: e.target.checked, time: "" }))}
                className="rounded border-white/20 bg-white/[0.05] text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-[11px] text-white/30">Time unknown (Surya Kundli)</span>
            </label>
          </div>
        </div>

        {/* City + Country */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <MapPin className="inline w-3 h-3 mr-1" />Birth City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Mumbai, Delhi"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Country</label>
            <select
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { if (form.name && form.date && (form.time || form.timeUnknown) && form.city) onSubmit(form) }}
          disabled={!form.name || !form.date || (!form.time && !form.timeUnknown) || !form.city}
          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#050810] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(201,162,77,0.3)] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate Kundli
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-center text-[10px] text-white/20 mt-3">
          Free analysis with chart, planets, yogas & doshas. Premium unlocks full Dasha timeline & remedies.
        </p>
      </div>
    </motion.div>
  )
}

/* ─── Chart SVG (North Indian) ─────────────────────── */

function NorthIndianChart({ planets, houses, ascendantSign, size = 320 }: {
  planets: PlanetData[]; houses: number[]; ascendantSign: number; size?: number
}) {
  const m = size / 2

  const houseLayout = [
    { path: `M${m},${m} L0,0 L${size},0 Z`, tx: m, ty: size * 0.15 },
    { path: `M0,0 L${m},0 L0,${m} Z`, tx: size * 0.12, ty: size * 0.2 },
    { path: `M0,0 L0,${m} L${m},${m} Z`, tx: size * 0.2, ty: size * 0.38 },
    { path: `M0,0 L${m},${m} L0,${size} Z`, tx: size * 0.15, ty: m },
    { path: `M0,${size} L${m},${m} L0,${m} Z`, tx: size * 0.2, ty: size * 0.62 },
    { path: `M0,${size} L${m},${size} L${m},${m} Z`, tx: size * 0.12, ty: size * 0.8 },
    { path: `M0,${size} L${m},${m} L${size},${size} Z`, tx: m, ty: size * 0.85 },
    { path: `M${size},${size} L${m},${size} L${m},${m} Z`, tx: size * 0.88, ty: size * 0.8 },
    { path: `M${size},${size} L${m},${m} L${size},${m} Z`, tx: size * 0.8, ty: size * 0.62 },
    { path: `M${size},${size} L${m},${m} L${size},0 Z`, tx: size * 0.85, ty: m },
    { path: `M${size},0 L${m},${m} L${size},${m} Z`, tx: size * 0.8, ty: size * 0.38 },
    { path: `M${size},0 L${m},0 L${m},${m} Z`, tx: size * 0.88, ty: size * 0.2 },
  ]

  const planetsByHouse = new Map<number, PlanetData[]>()
  for (let i = 0; i < 12; i++) planetsByHouse.set(i, [])
  for (const p of planets) {
    const hIdx = houses.indexOf(p.signIndex)
    if (hIdx >= 0) planetsByHouse.get(hIdx)?.push(p)
  }

  const SIGN_SHORT = ["", "Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <rect x={0} y={0} width={size} height={size} fill="rgba(12,18,36,0.9)" stroke="rgba(192,162,77,0.3)" strokeWidth={1.5} rx={8} />
      <line x1={0} y1={0} x2={size} y2={size} stroke="rgba(192,162,77,0.2)" strokeWidth={1} />
      <line x1={size} y1={0} x2={0} y2={size} stroke="rgba(192,162,77,0.2)" strokeWidth={1} />
      <line x1={m} y1={0} x2={m} y2={size} stroke="rgba(192,162,77,0.1)" strokeWidth={0.5} />
      <line x1={0} y1={m} x2={size} y2={m} stroke="rgba(192,162,77,0.1)" strokeWidth={0.5} />

      {houseLayout.map((h, i) => {
        const signIdx = houses[i] || 1
        const isLagna = i === 0
        const housePlanets = planetsByHouse.get(i) || []

        return (
          <g key={i}>
            <path d={h.path} fill={isLagna ? "rgba(226,153,74,0.08)" : "transparent"} stroke="rgba(192,162,77,0.25)" strokeWidth={0.8} />
            <text x={h.tx} y={h.ty - 8} textAnchor="middle" fill={isLagna ? "#E2994A" : "rgba(138,134,144,0.5)"} fontSize={9}>
              {SIGN_SHORT[signIdx]}{isLagna ? " ↑" : ""}
            </text>
            {housePlanets.map((p, pi) => (
              <text key={p.shortName} x={h.tx} y={h.ty + 5 + pi * 13} textAnchor="middle"
                fill={p.color} fontSize={11} fontWeight={600}>
                {p.shortName}{p.retrograde ? "ᴿ" : ""}
              </text>
            ))}
          </g>
        )
      })}

      <text x={m} y={m - 3} textAnchor="middle" fill="rgba(192,162,77,0.35)" fontSize={10} fontFamily="var(--font-devanagari)">ग्रह</text>
      <text x={m} y={m + 10} textAnchor="middle" fill="rgba(192,162,77,0.25)" fontSize={8}>GrahAI</text>
    </svg>
  )
}

/* ─── Planet Card ───────────────────────────────────── */

function PlanetCard({ planet }: { planet: PlanetData }) {
  const [expanded, setExpanded] = useState(false)
  const dg = DIGNITY_LABELS[planet.dignity]

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/15 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg" style={{ color: planet.color }}>{planet.symbol}</span>
          <div>
            <span className="text-sm font-medium text-white/90">{planet.name}</span>
            {planet.retrograde && <span className="ml-1.5 text-[10px] text-red-400 font-medium">R</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{planet.sign}</p>
          <p className="text-[10px] text-white/30">{planet.degree.toFixed(1)}°</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-white/30">House</span>
                <p className="text-white/70">House {planet.house}</p>
              </div>
              <div>
                <span className="text-white/30">Nakshatra</span>
                <p className="text-white/70">{planet.nakshatra} (Pada {planet.nakshatraPada})</p>
              </div>
              <div>
                <span className="text-white/30">Dignity</span>
                <p className={dg.color}>{dg.icon} {dg.label}</p>
              </div>
              <div>
                <span className="text-white/30">Degree</span>
                <p className="text-white/70">{planet.degree.toFixed(2)}° {planet.sign}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Yoga Card ────────────────────────────────────── */

function YogaCard({ yoga }: { yoga: YogaData }) {
  const colors = YOGA_TYPE_COLORS[yoga.type] || YOGA_TYPE_COLORS.other
  return (
    <div className={`rounded-xl border p-4 ${colors}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold">{yoga.name}</h4>
          <p className="text-[10px] opacity-60" style={{ fontFamily: "var(--font-devanagari)" }}>{yoga.nameSanskrit}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
          yoga.strength === "strong" ? "border-emerald-500/30 text-emerald-400" :
          yoga.strength === "moderate" ? "border-amber-500/30 text-amber-400" :
          "border-white/10 text-white/40"
        }`}>{yoga.strength}</span>
      </div>
      <p className="text-xs opacity-80 leading-relaxed">{yoga.effect}</p>
      <div className="mt-2 flex items-center gap-2 text-[10px] opacity-50">
        <BookOpen className="w-3 h-3" />
        {yoga.classicalRef}
      </div>
    </div>
  )
}

/* ─── Dosha Card ───────────────────────────────────── */

function DoshaCard({ dosha }: { dosha: DoshaData }) {
  if (!dosha.active) return null
  return (
    <div className={`rounded-xl border p-4 ${
      dosha.severity === "severe" ? "border-red-500/20 bg-red-500/[0.06]" :
      dosha.severity === "moderate" ? "border-orange-500/20 bg-orange-500/[0.06]" :
      "border-amber-500/20 bg-amber-500/[0.06]"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className={`w-4 h-4 ${
          dosha.severity === "severe" ? "text-red-400" :
          dosha.severity === "moderate" ? "text-orange-400" : "text-amber-400"
        }`} />
        <h4 className="text-sm font-semibold text-white/90">{dosha.name}</h4>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{dosha.severity}</span>
      </div>
      <div className="mt-2 rounded-lg bg-white/[0.03] p-3">
        <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Remedy</p>
        <p className="text-xs text-white/70">{dosha.remedy}</p>
      </div>
      <p className="mt-2 text-[10px] text-white/30 flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> {dosha.classicalRef}
      </p>
    </div>
  )
}

/* ─── Dasha Timeline ───────────────────────────────── */

function DashaTimeline({ dashas }: { dashas: DashaData[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {dashas.map((d, i) => {
        const startYear = d.start.split("-")[0]
        const endYear = d.end.split("-")[0]
        return (
          <div key={i}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`w-full flex items-center justify-between rounded-xl border p-3 transition-all ${
                d.isCurrent
                  ? "border-amber-500/30 bg-amber-500/[0.08]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.isCurrent ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
                <span className={`text-sm font-medium ${d.isCurrent ? "text-amber-400" : "text-white/60"}`}>
                  {d.planet} Mahadasha
                </span>
                {d.isCurrent && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Current</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">{startYear} – {endYear}</span>
                {expanded === i ? <ChevronUp className="w-3 h-3 text-white/30" /> : <ChevronDown className="w-3 h-3 text-white/30" />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-1 space-y-1 border-l border-white/[0.06] pl-4 py-2">
                    {d.subPeriods.map((sp, j) => (
                      <div key={j} className={`flex items-center justify-between text-xs py-1 ${sp.isCurrent ? "text-amber-400" : "text-white/40"}`}>
                        <span>{sp.planet} Antardasha</span>
                        <span className="text-white/20">{sp.start.split("-")[0]} – {sp.end.split("-")[0]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Nakshatra Profile ────────────────────────────── */

function NakshatraProfile({ profile }: { profile: KundliResult["nakshatraProfile"] }) {
  return (
    <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-semibold text-white/90">Moon Nakshatra Profile</h3>
      </div>
      <h4 className="text-lg font-bold text-violet-300 mb-1">{profile.name}</h4>
      <p className="text-xs text-white/50 mb-4">{profile.description}</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Lord", value: profile.lord },
          { label: "Deity", value: profile.deity },
          { label: "Gana", value: profile.gana },
          { label: "Symbol", value: profile.symbol },
          { label: "Animal", value: profile.animal },
          { label: "Element", value: profile.element },
        ].map(item => (
          <div key={item.label} className="text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</p>
            <p className="text-xs text-white/70 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {profile.qualities.map(q => (
          <span key={q} className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/20 text-violet-300/80">{q}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Results View ────────────────────────────────── */

type Tab = "chart" | "planets" | "yogas" | "doshas" | "dasha" | "nakshatra"

function KundliResults({ result, details }: { result: KundliResult; details: BirthDetails }) {
  const [activeTab, setActiveTab] = useState<Tab>("chart")

  const tabs: { id: Tab; label: string; icon: typeof Sun; count?: number }[] = [
    { id: "chart", label: "Chart", icon: Star },
    { id: "planets", label: "Planets", icon: Sun, count: result.planets.length },
    { id: "yogas", label: "Yogas", icon: Zap, count: result.yogas.length },
    { id: "doshas", label: "Doshas", icon: Shield, count: result.doshas.filter(d => d.active).length },
    { id: "dasha", label: "Dasha", icon: Clock },
    { id: "nakshatra", label: "Nakshatra", icon: Moon },
  ]

  const activeDoshas = result.doshas.filter(d => d.active)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          {details.name}&apos;s <span className="text-amber-400">Kundli</span>
        </h1>
        <p className="text-sm text-white/40">
          {SIGN_NAMES[result.ascendant.signIndex]} Ascendant ({SIGN_SANSKRIT[result.ascendant.signIndex]}) · {result.ascendant.degree.toFixed(1)}°
        </p>
        <p className="text-xs text-white/25 mt-1">
          {details.date} · {details.time || "Time unknown"} · {details.city}, {details.country}
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4 mb-6">
        <p className="text-sm text-white/70 leading-relaxed">{result.summary}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "chart" && (
            <div className="flex flex-col items-center">
              <NorthIndianChart
                planets={result.planets}
                houses={result.houses}
                ascendantSign={result.ascendant.signIndex}
                size={340}
              />
              <p className="mt-3 text-[10px] text-white/20">North Indian Style · Lagna Chart (D1)</p>
            </div>
          )}

          {activeTab === "planets" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {result.planets.map(p => <PlanetCard key={p.shortName} planet={p} />)}
            </div>
          )}

          {activeTab === "yogas" && (
            <div className="space-y-3">
              {result.yogas.length === 0 ? (
                <p className="text-center text-sm text-white/30 py-8">No significant yogas detected</p>
              ) : (
                result.yogas.map((y, i) => <YogaCard key={i} yoga={y} />)
              )}
            </div>
          )}

          {activeTab === "doshas" && (
            <div className="space-y-3">
              {activeDoshas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-400">No active doshas</p>
                  <p className="text-xs text-white/30 mt-1">Your chart shows no major dosha afflictions</p>
                </div>
              ) : (
                activeDoshas.map((d, i) => <DoshaCard key={i} dosha={d} />)
              )}
            </div>
          )}

          {activeTab === "dasha" && <DashaTimeline dashas={result.dashas} />}

          {activeTab === "nakshatra" && <NakshatraProfile profile={result.nakshatraProfile} />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTAs */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/chat?v=astrology"
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-sm font-medium text-amber-400 hover:bg-amber-500/15 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask AI About My Chart
        </Link>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `${details.name}'s Kundli - GrahAI`, url: window.location.href })
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/50 hover:text-white/70 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Kundli
        </button>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════ */

export default function KundliPage() {
  const [stage, setStage] = useState<"form" | "loading" | "result">("form")
  const [details, setDetails] = useState<BirthDetails | null>(null)
  const [result, setResult] = useState<KundliResult | null>(null)

  function handleSubmit(d: BirthDetails) {
    setDetails(d)
    setStage("loading")

    // Simulate API call (replace with real ephemeris API)
    setTimeout(() => {
      const kundli = generateDemoKundli(d)
      setResult(kundli)
      setStage("result")
    }, 2500)
  }

  return (
    <main className="min-h-screen bg-[#050810]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#050810]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-white/30" />
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white/90">Grah<span className="text-amber-400">AI</span></span>
          </Link>
          <span className="text-xs text-white/20">Free Kundli Generator</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Form State */}
        {stage === "form" && <BirthDetailsForm onSubmit={handleSubmit} />}

        {/* Loading State */}
        {stage === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border border-amber-500/20 flex items-center justify-center mb-6"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border border-amber-500/10 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </motion.div>
            </motion.div>
            <p className="text-sm text-white/50 mb-2">Calculating planetary positions...</p>
            <p className="text-xs text-white/25">Analyzing yogas, doshas & Dasha periods</p>
          </motion.div>
        )}

        {/* Results State */}
        {stage === "result" && result && details && (
          <KundliResults result={result} details={details} />
        )}
      </div>
    </main>
  )
}
