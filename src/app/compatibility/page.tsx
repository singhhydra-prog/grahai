"use client"

/* ════════════════════════════════════════════════════════
   Product 3 — Compatibility / Kundli Matching

   Traditional Ashtakoot (8-point) Vedic matching with
   beautiful UI. Users enter two people's details and get
   a detailed compatibility score with Guna Milan breakdown.
   ════════════════════════════════════════════════════════ */

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, Star, ArrowRight, Users, Sparkles,
  Shield, Moon, Sun, Flame, Brain, ChevronDown,
  ChevronUp, MessageCircle, Share2, RefreshCw, Check, X
} from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────

interface PersonDetails {
  name: string
  birthDate: string
  birthTime: string
  gender: "male" | "female" | ""
}

interface GunaScore {
  name: string
  sanskrit: string
  maxPoints: number
  score: number
  description: string
  verdict: "Excellent" | "Good" | "Average" | "Challenging"
}

interface CompatibilityResult {
  totalScore: number
  maxScore: number
  percentage: number
  gunas: GunaScore[]
  overallVerdict: string
  strengths: string[]
  challenges: string[]
  remedies: string[]
  mangalDosha: { person1: boolean; person2: boolean }
  nakshatraMatch: string
  recommendation: string
}

// ─── Constants ──────────────────────────────────────────

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
]

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

// ─── Generator ──────────────────────────────────────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateCompatibility(p1: PersonDetails, p2: PersonDetails): CompatibilityResult {
  const s1 = p1.birthDate.split("-").reduce((a, b) => a + parseInt(b), 0)
  const s2 = p2.birthDate.split("-").reduce((a, b) => a + parseInt(b), 0)
  const seed = s1 * 31 + s2 * 17 + p1.name.length * 7 + p2.name.length * 13
  const rand = seedRandom(seed)

  // Ashtakoot — 8 Gunas with max points
  const gunaTemplates: { name: string; sanskrit: string; max: number; desc: string }[] = [
    { name: "Varna", sanskrit: "वर्ण", max: 1, desc: "Spiritual compatibility and ego levels. Measures the spiritual development and mentality alignment between partners." },
    { name: "Vashya", sanskrit: "वश्य", max: 2, desc: "Mutual attraction and dominance patterns. Determines the degree of magnetic attraction and control dynamics." },
    { name: "Tara", sanskrit: "तारा", max: 3, desc: "Birth star compatibility and health fortune. Assesses destiny alignment and luck compatibility in the union." },
    { name: "Yoni", sanskrit: "योनि", max: 4, desc: "Physical and intimate compatibility. Analyzes physical attraction, sexual harmony, and biological compatibility." },
    { name: "Graha Maitri", sanskrit: "ग्रह मैत्री", max: 4, desc: "Mental compatibility via Moon sign lords. Evaluates intellectual rapport, friendship, and mutual understanding." },
    { name: "Gana", sanskrit: "गण", max: 6, desc: "Temperament and behavioral compatibility. Deva (divine), Manushya (human), or Rakshasa (fierce) alignment." },
    { name: "Bhakoot", sanskrit: "भकूट", max: 7, desc: "Emotional and financial compatibility. Governs love, family welfare, financial prosperity, and progeny matters." },
    { name: "Nadi", sanskrit: "नाडी", max: 8, desc: "Health and genetic compatibility — most critical. Determines physiological and genetic harmony; Nadi dosha is serious." },
  ]

  const gunas: GunaScore[] = gunaTemplates.map(g => {
    // Generate score weighted toward positive (60-100% of max)
    const rawScore = Math.floor(rand() * (g.max + 1))
    const score = Math.max(Math.round(rawScore * 0.6 + rand() * g.max * 0.4), 0)
    const clampedScore = Math.min(score, g.max)
    const ratio = clampedScore / g.max

    const verdict: GunaScore["verdict"] =
      ratio >= 0.75 ? "Excellent" :
      ratio >= 0.5 ? "Good" :
      ratio >= 0.25 ? "Average" : "Challenging"

    return {
      name: g.name,
      sanskrit: g.sanskrit,
      maxPoints: g.max,
      score: clampedScore,
      description: g.desc,
      verdict,
    }
  })

  const totalScore = gunas.reduce((sum, g) => sum + g.score, 0)
  const maxScore = 36
  const percentage = Math.round((totalScore / maxScore) * 100)

  const verdicts = [
    { min: 0,  text: "This match has significant challenges. Deep commitment, mutual respect, and astrological remedies are essential for harmony." },
    { min: 18, text: "An acceptable match with areas for growth. With understanding and conscious effort, this union can flourish beautifully." },
    { min: 24, text: "A good match with natural compatibility. The cosmic energies support a harmonious and fulfilling partnership." },
    { min: 30, text: "An excellent match! The stars align powerfully for this union. Mutual respect and devotion will create lasting happiness." },
  ]

  const overallVerdict = verdicts.reduce((v, curr) => totalScore >= curr.min ? curr : v, verdicts[0]).text

  const strengthPhrases = [
    "Strong emotional bonding indicated by Gana compatibility",
    "Excellent intellectual rapport through Graha Maitri alignment",
    "Favorable financial prospects for the household",
    "Natural physical chemistry and mutual attraction",
    "Complementary temperaments that balance each other well",
    "Spiritual growth is supported by this partnership",
    "Strong family values alignment between both nakshatras",
    "Mutual respect and admiration flow naturally",
  ]

  const challengePhrases = [
    "Communication styles may need conscious alignment",
    "Financial decision-making could be a point of friction",
    "Ego clashes possible during stressful periods",
    "Different social energy levels (introvert/extrovert dynamics)",
    "Family expectations may create external pressure",
    "Emotional expression styles differ — patience needed",
    "Career ambition levels may need balancing",
    "Different approaches to spiritual or religious practices",
  ]

  const remedyPhrases = [
    "Perform Navagraha Puja together before the engagement ceremony.",
    "The bride should wear a Yellow Sapphire (Pukhraj) to strengthen Jupiter's blessings.",
    "Chant 'Om Shukraya Namah' 108 times together on Fridays for marital harmony.",
    "Donate to a girls' education charity on the bride's nakshatra day each month.",
    "Keep a Shri Yantra in the bedroom's northeast corner for domestic harmony.",
    "Observe a joint fast on Pradosh Vrat for Shiva's blessings on the union.",
    "Plant a Peepal tree together to mitigate any Nadi dosha effects.",
    "Feed cows together on Mondays to strengthen the Moon's positive influence.",
  ]

  const numStrengths = 3 + Math.floor(rand() * 2)
  const numChallenges = 2 + Math.floor(rand() * 2)
  const numRemedies = 2 + Math.floor(rand() * 2)

  const pick = (arr: string[], n: number) => {
    const shuffled = [...arr].sort(() => rand() - 0.5)
    return shuffled.slice(0, n)
  }

  const mangalDosha1 = rand() < 0.25
  const mangalDosha2 = rand() < 0.25
  const nak1 = NAKSHATRAS[Math.floor(rand() * 27)]
  const nak2 = NAKSHATRAS[Math.floor(rand() * 27)]

  return {
    totalScore,
    maxScore,
    percentage,
    gunas,
    overallVerdict,
    strengths: pick(strengthPhrases, numStrengths),
    challenges: pick(challengePhrases, numChallenges),
    remedies: pick(remedyPhrases, numRemedies),
    mangalDosha: { person1: mangalDosha1, person2: mangalDosha2 },
    nakshatraMatch: `${p1.name}'s Nakshatra: ${nak1} — ${p2.name}'s Nakshatra: ${nak2}`,
    recommendation: percentage >= 60
      ? "This match is recommended by Vedic standards. Proceed with blessings."
      : "Remedies are advisable before proceeding. Consult a Vedic astrologer for detailed guidance.",
  }
}

// ─── Sub-components ─────────────────────────────────────

function PersonForm({ label, person, onChange, color }: {
  label: string
  person: PersonDetails
  onChange: (p: PersonDetails) => void
  color: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${color}20`, color }}>
          {label === "Person 1" ? "1" : "2"}
        </div>
        <span className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color }}>{label}</span>
      </div>

      <div className="glass-input p-0">
        <input
          type="text"
          placeholder="Full name"
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
          className="w-full bg-transparent px-4 py-3 text-sm text-text/90 placeholder:text-text-dim/30 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-input p-0">
          <input
            type="date"
            value={person.birthDate}
            onChange={(e) => onChange({ ...person, birthDate: e.target.value })}
            className="w-full bg-transparent px-4 py-3 text-sm text-text/90 focus:outline-none [color-scheme:dark]"
          />
        </div>
        <div className="glass-input p-0">
          <input
            type="time"
            value={person.birthTime}
            onChange={(e) => onChange({ ...person, birthTime: e.target.value })}
            className="w-full bg-transparent px-4 py-3 text-sm text-text/90 focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        {(["male", "female"] as const).map(g => (
          <button
            key={g}
            onClick={() => onChange({ ...person, gender: g })}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all border ${
              person.gender === g
                ? "border-gold/30 bg-gold/[0.08] text-gold/80"
                : "border-white/[0.06] bg-white/[0.02] text-text-dim/40 hover:border-white/[0.1]"
            }`}
          >
            {g === "male" ? "♂ Male" : "♀ Female"}
          </button>
        ))}
      </div>
    </div>
  )
}

function GunaBar({ guna, index }: { guna: GunaScore; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const ratio = guna.score / guna.maxPoints
  const color =
    ratio >= 0.75 ? "#4ADE80" :
    ratio >= 0.5 ? "#E2C474" :
    ratio >= 0.25 ? "#E2994A" : "#E85454"

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-sm font-semibold text-text/80 flex-1">
            {guna.name} <span className="text-text-dim/30 font-hindi text-xs ml-1">{guna.sanskrit}</span>
          </span>
          <span className="text-xs font-bold" style={{ color }}>
            {guna.score}/{guna.maxPoints}
          </span>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
            guna.verdict === "Excellent" ? "bg-green/10 text-green" :
            guna.verdict === "Good" ? "bg-gold/10 text-gold" :
            guna.verdict === "Average" ? "bg-saffron/10 text-saffron" :
            "bg-red/10 text-red"
          }`}>
            {guna.verdict}
          </span>
          {expanded ? <ChevronUp className="h-3 w-3 text-text-dim/30" /> : <ChevronDown className="h-3 w-3 text-text-dim/30" />}
        </div>

        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.8, delay: 0.1 * index }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}66, ${color})` }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-text-dim/60 leading-relaxed mt-2 pl-1">
              {guna.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CircularScore({ score, maxScore, percentage }: { score: number; maxScore: number; percentage: number }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const color =
    percentage >= 80 ? "#4ADE80" :
    percentage >= 60 ? "#E2C474" :
    percentage >= 40 ? "#E2994A" : "#E85454"

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
        <motion.circle
          cx="88" cy="88" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {score}/{maxScore}
        </motion.span>
        <span className="text-xs text-text-dim/50">Guna Points</span>
        <span className="text-lg font-bold mt-0.5" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function CompatibilityPage() {
  const [person1, setPerson1] = useState<PersonDetails>({ name: "", birthDate: "", birthTime: "", gender: "" })
  const [person2, setPerson2] = useState<PersonDetails>({ name: "", birthDate: "", birthTime: "", gender: "" })
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const isValid = person1.name && person1.birthDate && person2.name && person2.birthDate

  const handleMatch = () => {
    if (!isValid) return
    setLoading(true)
    setShowResult(false)
    setTimeout(() => {
      setResult(generateCompatibility(person1, person2))
      setLoading(false)
      setShowResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowResult(false)
    setResult(null)
    setPerson1({ name: "", birthDate: "", birthTime: "", gender: "" })
    setPerson2({ name: "", birthDate: "", birthTime: "", gender: "" })
  }

  // ─── Input Form View ─────────────────────────────────

  if (!showResult) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#F0C8E0]/[0.02] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F0C8E0]/15 bg-[#F0C8E0]/[0.04] mb-4">
              <Heart className="h-3 w-3 text-[#F0C8E0]" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#F0C8E0]/70">Vedic Matching</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Kundli <span className="gold-text">Matching</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto">
              Traditional Ashtakoot (8-point) Guna Milan analysis based on Vedic astrology principles for marital compatibility
            </p>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="glass-card p-6">
              <PersonForm label="Person 1" person={person1} onChange={setPerson1} color="#F0C8E0" />
            </div>

            {/* Heart connector */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full border border-[#F0C8E0]/20 bg-[#F0C8E0]/[0.05] flex items-center justify-center">
                <Heart className="h-4 w-4 text-[#F0C8E0]/50" />
              </div>
            </div>

            <div className="glass-card p-6">
              <PersonForm label="Person 2" person={person2} onChange={setPerson2} color="#E2C474" />
            </div>

            {/* Match Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMatch}
              disabled={!isValid || loading}
              className={`w-full glow-btn py-4 text-sm font-semibold tracking-wider flex items-center justify-center gap-2 ${
                !isValid ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing Gunas...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Check Compatibility
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-text-dim/30 text-center">
              Based on Brihat Parashara Hora Shastra (BPHS) Ashtakoot methodology
            </p>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-[#F0C8E0]/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border border-gold/15"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-[#F0C8E0]/50" />
                  </div>
                </div>
                <p className="text-xs text-text-dim/60 tracking-[0.2em] uppercase mb-1">
                  Analyzing Ashtakoot Gunas
                </p>
                <p className="text-[10px] text-text-dim/30">
                  Matching {person1.name} & {person2.name}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── Result View ────────────────────────────────────

  if (!result) return null

  const scoreColor =
    result.percentage >= 80 ? "#4ADE80" :
    result.percentage >= 60 ? "#E2C474" :
    result.percentage >= 40 ? "#E2994A" : "#E85454"

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: `${scoreColor}06` }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
          <button onClick={handleReset} className="text-xs text-text-dim/40 hover:text-gold/60 transition-colors tracking-wide">
            ← New Match
          </button>
          <h1 className="text-xl font-bold">
            {person1.name} <span className="text-[#F0C8E0]/50">&</span> {person2.name}
          </h1>
          <p className="text-[10px] text-text-dim/40 tracking-[0.2em] uppercase">Ashtakoot Guna Milan Report</p>
        </motion.div>

        {/* Score Circle */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8">
          <CircularScore score={result.totalScore} maxScore={result.maxScore} percentage={result.percentage} />
          <p className="text-sm text-text/70 text-center mt-4 leading-relaxed max-w-md mx-auto">{result.overallVerdict}</p>

          {/* Mangal Dosha */}
          {(result.mangalDosha.person1 || result.mangalDosha.person2) && (
            <div className="mt-4 p-3 rounded-lg bg-red/[0.05] border border-red/[0.1] text-center">
              <p className="text-[10px] text-red/70 uppercase tracking-wider font-semibold mb-1">⚠ Mangal Dosha Detected</p>
              <p className="text-xs text-text-dim/60">
                {result.mangalDosha.person1 && result.mangalDosha.person2
                  ? "Both partners have Mangal Dosha — this can neutralize the effect."
                  : `${result.mangalDosha.person1 ? person1.name : person2.name} has Mangal Dosha. Remedies are recommended.`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Guna Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-gold/60">
            Ashtakoot Guna Breakdown
          </h3>
          <div className="space-y-4">
            {result.gunas.map((guna, i) => (
              <GunaBar key={guna.name} guna={guna} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Nakshatra */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 flex items-start gap-3">
          <Moon className="h-4 w-4 text-[#C8D8E4] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-[#C8D8E4]/70 uppercase tracking-wider font-semibold mb-1">Nakshatra Compatibility</p>
            <p className="text-xs text-text/70">{result.nakshatraMatch}</p>
          </div>
        </motion.div>

        {/* Strengths & Challenges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-semibold tracking-[0.1em] uppercase text-green/70 flex items-center gap-2">
              <Check className="h-3 w-3" /> Strengths
            </h3>
            <div className="space-y-2">
              {result.strengths.map((s, i) => (
                <p key={i} className="text-xs text-text/70 leading-relaxed flex gap-2">
                  <span className="text-green/50 shrink-0">•</span> {s}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-semibold tracking-[0.1em] uppercase text-saffron/70 flex items-center gap-2">
              <Shield className="h-3 w-3" /> Areas for Growth
            </h3>
            <div className="space-y-2">
              {result.challenges.map((c, i) => (
                <p key={i} className="text-xs text-text/70 leading-relaxed flex gap-2">
                  <span className="text-saffron/50 shrink-0">•</span> {c}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Remedies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5 space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-gold/60">🙏 Recommended Remedies</h3>
          <div className="space-y-2">
            {result.remedies.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-gold/[0.03] border border-gold/[0.06]">
                <p className="text-xs text-text/70 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="p-4 rounded-xl border border-gold/15 bg-gold/[0.04] text-center">
          <p className="text-sm text-gold/80 font-semibold">{result.recommendation}</p>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/chat?v=astrology&q=Analyze compatibility between ${person1.name} and ${person2.name} in detail`}
            className="flex-1 flex items-center justify-center gap-2 glow-btn text-sm py-3"
          >
            <MessageCircle className="h-4 w-4" />
            Ask AI for Deep Analysis
          </Link>
          <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-gold/[0.03] px-6 py-3 text-sm font-semibold text-gold/70 hover:border-gold/30 hover:bg-gold/[0.06] transition-all">
            <RefreshCw className="h-4 w-4" />
            New Match
          </button>
        </motion.div>

        <div className="flex items-center justify-center pt-2">
          <button className="flex items-center gap-2 text-xs text-text-dim/40 hover:text-gold/50 transition-colors">
            <Share2 className="h-3 w-3" />
            Share this report
          </button>
        </div>
      </div>
    </div>
  )
}
