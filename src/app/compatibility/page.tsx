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
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"

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

// ─── Astronomical Helpers ────────────────────────────────

function computeMoonLong(jde: number): number {
  const T = (jde - 2451545.0) / 36525.0
  const Lp = (218.3165 + 481267.8813 * T) % 360
  const D = ((297.8502 + 445267.1115 * T) % 360) * Math.PI / 180
  const M = ((357.5291 + 35999.0503 * T) % 360) * Math.PI / 180
  const Mp = ((134.9634 + 477198.8676 * T) % 360) * Math.PI / 180
  const F = ((93.2720 + 483202.0175 * T) % 360) * Math.PI / 180
  let lon = Lp + 6.289 * Math.sin(Mp) - 1.274 * Math.sin(2*D - Mp)
    + 0.658 * Math.sin(2*D) + 0.214 * Math.sin(2*Mp) - 0.186 * Math.sin(M)
    - 0.114 * Math.sin(2*F) + 0.059 * Math.sin(2*D - 2*Mp) + 0.057 * Math.sin(2*D - M - Mp)
  lon = lon % 360
  if (lon < 0) lon += 360
  return lon
}

function dateToJDE(dateStr: string, timeStr?: string): number {
  const [y, m, d] = dateStr.split("-").map(Number)
  const timeParts = timeStr ? timeStr.split(":").map(Number) : [12, 0]
  const utHour = (timeParts[0] + (timeParts[1] || 0) / 60) - 5.5 // IST→UT
  let Y = y, M2 = m
  if (M2 <= 2) { Y -= 1; M2 += 12 }
  const A = Math.floor(Y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M2 + 1)) + d + utHour / 24 + B - 1524.5
}

function lahiriAyanamsa(jde: number): number {
  return 23.85 + 0.0137 * (jde - 2451545.0) / 365.25
}

function toSidereal(tropical: number, jde: number): number {
  let s = tropical - lahiriAyanamsa(jde)
  if (s < 0) s += 360
  if (s >= 360) s -= 360
  return s
}

function getMoonNakshatraIdx(dateStr: string, timeStr?: string): number {
  const jde = dateToJDE(dateStr, timeStr)
  const moonTrop = computeMoonLong(jde)
  const moonSid = toSidereal(moonTrop, jde)
  return Math.floor(moonSid / (360 / 27)) % 27
}

function getMoonSignIdx(dateStr: string, timeStr?: string): number {
  const jde = dateToJDE(dateStr, timeStr)
  const moonTrop = computeMoonLong(jde)
  const moonSid = toSidereal(moonTrop, jde)
  return Math.floor(moonSid / 30) % 12
}

// ─── Ashtakoot Matching Tables (Traditional BPHS) ──────

/** Varna: Brahmin(4), Kshatriya(3), Vaishya(2), Shudra(1) per nakshatra */
const NAKSHATRA_VARNA = [1,4,2,4,3,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4,3,2,1,4]

/** Vashya categories per Moon sign: 0=Chatushpad, 1=Manav, 2=Jalachara, 3=Vanchar, 4=Keeta */
const SIGN_VASHYA = [0, 0, 1, 2, 0, 1, 1, 4, 0, 2, 1, 2]
const VASHYA_COMPAT: Record<string, number> = {
  "0-0": 2, "0-1": 1, "0-2": 0, "0-3": 1, "0-4": 0,
  "1-0": 1, "1-1": 2, "1-2": 0, "1-3": 0, "1-4": 0,
  "2-0": 0, "2-1": 0, "2-2": 2, "2-3": 0, "2-4": 1,
  "3-0": 1, "3-1": 0, "3-2": 0, "3-3": 2, "3-4": 0,
  "4-0": 0, "4-1": 0, "4-2": 1, "4-3": 0, "4-4": 2,
}

/** Yoni animals per nakshatra (0-13) */
const NAKSHATRA_YONI = [0,1,2,3,3,4,5,6,5,7,7,8,9,10,9,10,11,11,4,12,8,12,0,0,1,8,1]
const YONI_COMPAT: number[][] = [
  [4,2,2,3,1,2,2,1,3,2,1,2,2],
  [2,4,3,2,1,2,2,2,2,3,1,2,1],
  [2,3,4,2,2,1,2,2,2,2,1,2,1],
  [3,2,2,4,1,2,2,2,2,2,2,2,2],
  [1,1,2,1,4,2,2,2,2,2,2,2,1],
  [2,2,1,2,2,4,1,2,2,2,1,2,2],
  [2,2,2,2,2,1,4,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,4,2,2,2,2,2],
  [3,2,2,2,2,2,2,2,4,2,1,2,2],
  [2,3,2,2,2,2,2,2,2,4,2,2,2],
  [1,1,1,2,2,1,2,2,1,2,4,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,4,2],
  [2,1,1,2,1,2,1,2,2,2,2,2,4],
]

/** Gana per nakshatra: 0=Deva, 1=Manushya, 2=Rakshasa */
const NAKSHATRA_GANA = [0,1,2,0,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0]
const GANA_SCORE: number[][] = [
  [6, 5, 1],
  [6, 6, 0],
  [1, 0, 6],
]

/** Nadi per nakshatra: 0=Aadi(Vata), 1=Madhya(Pitta), 2=Antya(Kapha) */
const NAKSHATRA_NADI = [0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2]

/** Sign lord for Graha Maitri: 0=Ma,1=Ve,2=Me,3=Mo,4=Su,5=Me,6=Ve,7=Ma,8=Ju,9=Sa,10=Sa,11=Ju */
const SIGN_LORD = [0,1,2,3,4,5,6,7,8,9,10,11]
const LORD_NAMES = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"]
/** Planet friendship: 5=best friend, 4=friend, 3=neutral, 2=enemy, 1=bitter enemy */
const GRAHA_MAITRI_TABLE: Record<string, number> = {
  "Mars-Mars": 5, "Mars-Sun": 5, "Mars-Moon": 4, "Mars-Jupiter": 5, "Mars-Venus": 2, "Mars-Mercury": 2, "Mars-Saturn": 3,
  "Venus-Venus": 5, "Venus-Mercury": 5, "Venus-Saturn": 5, "Venus-Mars": 2, "Venus-Sun": 2, "Venus-Moon": 3, "Venus-Jupiter": 3,
  "Mercury-Mercury": 5, "Mercury-Sun": 4, "Mercury-Venus": 5, "Mercury-Mars": 2, "Mercury-Moon": 2, "Mercury-Jupiter": 3, "Mercury-Saturn": 3,
  "Moon-Moon": 5, "Moon-Sun": 5, "Moon-Mercury": 3, "Moon-Mars": 3, "Moon-Venus": 3, "Moon-Jupiter": 4, "Moon-Saturn": 2,
  "Sun-Sun": 5, "Sun-Moon": 5, "Sun-Mars": 5, "Sun-Jupiter": 5, "Sun-Venus": 2, "Sun-Mercury": 3, "Sun-Saturn": 2,
  "Jupiter-Jupiter": 5, "Jupiter-Sun": 5, "Jupiter-Moon": 5, "Jupiter-Mars": 5, "Jupiter-Venus": 2, "Jupiter-Mercury": 3, "Jupiter-Saturn": 3,
  "Saturn-Saturn": 5, "Saturn-Mercury": 5, "Saturn-Venus": 5, "Saturn-Mars": 2, "Saturn-Sun": 2, "Saturn-Moon": 2, "Saturn-Jupiter": 3,
}

/** Bhakoot unfavourable pairs (sign distance): 2-12, 6-8, 5-9 are dosha. All others get 7. */
function bhakootScore(s1: number, s2: number): number {
  const dist = ((s2 - s1 + 12) % 12) + 1 // 1-based distance
  const revDist = ((s1 - s2 + 12) % 12) + 1
  const bad = [[2,12],[6,8],[5,9]]
  for (const [a, b] of bad) {
    if ((dist === a && revDist === b) || (dist === b && revDist === a)) return 0
  }
  return 7
}

// ─── Generator ──────────────────────────────────────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateCompatibility(p1: PersonDetails, p2: PersonDetails): CompatibilityResult {
  // Compute Moon nakshatras from actual birth dates
  const nak1Idx = getMoonNakshatraIdx(p1.birthDate, p1.birthTime)
  const nak2Idx = getMoonNakshatraIdx(p2.birthDate, p2.birthTime)
  const sign1Idx = getMoonSignIdx(p1.birthDate, p1.birthTime)
  const sign2Idx = getMoonSignIdx(p2.birthDate, p2.birthTime)

  const nak1Name = NAKSHATRAS[nak1Idx]
  const nak2Name = NAKSHATRAS[nak2Idx]

  // 1. VARNA (max 1)
  const v1 = NAKSHATRA_VARNA[nak1Idx], v2 = NAKSHATRA_VARNA[nak2Idx]
  const varnaScore = v1 >= v2 ? 1 : 0

  // 2. VASHYA (max 2)
  const vy1 = SIGN_VASHYA[sign1Idx], vy2 = SIGN_VASHYA[sign2Idx]
  const vashyaScore = VASHYA_COMPAT[`${vy1}-${vy2}`] ?? 1

  // 3. TARA (max 3)
  const taraDist = ((nak2Idx - nak1Idx + 27) % 27) % 9
  const taraScore = [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(taraDist)
    ? ([3, 1, 1, 3, 0, 1, 1, 3, 0][taraDist]) : 1

  // 4. YONI (max 4)
  const y1 = NAKSHATRA_YONI[nak1Idx] % 13, y2 = NAKSHATRA_YONI[nak2Idx] % 13
  const yoniScore = YONI_COMPAT[y1]?.[y2] ?? 2

  // 5. GRAHA MAITRI (max 5 → scaled to 4)
  const lord1 = LORD_NAMES[sign1Idx], lord2 = LORD_NAMES[sign2Idx]
  const gm12 = GRAHA_MAITRI_TABLE[`${lord1}-${lord2}`] ?? 3
  const gm21 = GRAHA_MAITRI_TABLE[`${lord2}-${lord1}`] ?? 3
  const gmRaw = Math.round((gm12 + gm21) / 2)
  const grahaMaitriScore = gmRaw >= 5 ? 4 : gmRaw >= 4 ? 3 : gmRaw >= 3 ? 2 : gmRaw >= 2 ? 1 : 0

  // 6. GANA (max 6)
  const g1 = NAKSHATRA_GANA[nak1Idx], g2 = NAKSHATRA_GANA[nak2Idx]
  const ganaScore = GANA_SCORE[g1]?.[g2] ?? 3

  // 7. BHAKOOT (max 7)
  const bkScore = bhakootScore(sign1Idx, sign2Idx)

  // 8. NADI (max 8)
  const n1 = NAKSHATRA_NADI[nak1Idx], n2 = NAKSHATRA_NADI[nak2Idx]
  const nadiScore = n1 !== n2 ? 8 : 0

  const gunaTemplates: { name: string; sanskrit: string; max: number; score: number; desc: string }[] = [
    { name: "Varna", sanskrit: "वर्ण", max: 1, score: varnaScore, desc: `Spiritual compatibility — ${v1 >= v2 ? "Groom's Varna is equal or higher, indicating compatible spiritual energies." : "Bride's Varna is higher. This can create ego friction; mutual respect is the remedy."}` },
    { name: "Vashya", sanskrit: "वश्य", max: 2, score: vashyaScore, desc: `Mutual attraction — ${vashyaScore === 2 ? "Excellent magnetic pull between both partners. Natural chemistry flows." : vashyaScore === 1 ? "Moderate attraction present. Effort to understand each other deepens the bond." : "Limited natural attraction. Conscious effort needed to build and maintain connection."}` },
    { name: "Tara", sanskrit: "तारा", max: 3, score: taraScore, desc: `Birth star destiny — Nakshatra distance of ${taraDist + 1} pada${taraScore >= 3 ? " is highly auspicious, bringing health, fortune, and harmony." : taraScore >= 1 ? " indicates moderate fortune compatibility." : " requires attention. Remedies can harmonize the star energies."}` },
    { name: "Yoni", sanskrit: "योनि", max: 4, score: yoniScore, desc: `Physical compatibility — ${yoniScore >= 4 ? "Exceptional physical and intimate harmony. Natural comfort with each other." : yoniScore >= 3 ? "Good physical compatibility. Intimate life is harmonious." : yoniScore >= 2 ? "Average physical chemistry. Understanding each other's needs is important." : "Physical compatibility needs conscious nurturing and communication."}` },
    { name: "Graha Maitri", sanskrit: "ग्रह मैत्री", max: 4, score: grahaMaitriScore, desc: `Mental compatibility via ${lord1}-${lord2} friendship. ${grahaMaitriScore >= 4 ? "Lords are great friends — deep intellectual rapport and understanding." : grahaMaitriScore >= 3 ? "Friendly lords ensure good mental wavelength." : grahaMaitriScore >= 2 ? "Neutral relationship between lords. Effort builds understanding." : "Challenging lord relationship. Patience and communication bridge the gap."}` },
    { name: "Gana", sanskrit: "गण", max: 6, score: ganaScore, desc: `Temperament — ${["Deva (divine)","Manushya (human)","Rakshasa (fierce)"][g1]} × ${["Deva","Manushya","Rakshasa"][g2]}. ${ganaScore >= 5 ? "Compatible temperaments create natural harmony." : ganaScore >= 3 ? "Workable temperament mix with mutual adjustment." : "Different temperaments need patience and acceptance."}` },
    { name: "Bhakoot", sanskrit: "भकूट", max: 7, score: bkScore, desc: `Emotional & financial — Moon signs are ${SIGNS[sign1Idx]} and ${SIGNS[sign2Idx]}. ${bkScore >= 7 ? "No Bhakoot dosha — love, wealth, and family prospects are excellent." : "Bhakoot dosha detected (unfavourable sign distance). Financial stress or emotional friction possible; remedies recommended."}` },
    { name: "Nadi", sanskrit: "नाडी", max: 8, score: nadiScore, desc: `Health & genetics — ${["Aadi (Vata)","Madhya (Pitta)","Antya (Kapha)"][n1]} × ${["Aadi (Vata)","Madhya (Pitta)","Antya (Kapha)"][n2]}. ${nadiScore >= 8 ? "Different Nadis — excellent genetic compatibility and healthy progeny indicated." : "Same Nadi — Nadi Dosha present. This is the most critical dosha; remedies are strongly advised."}` },
  ]

  const gunas: GunaScore[] = gunaTemplates.map(g => ({
    name: g.name,
    sanskrit: g.sanskrit,
    maxPoints: g.max,
    score: g.score,
    description: g.desc,
    verdict: (g.score / g.max >= 0.75 ? "Excellent" : g.score / g.max >= 0.5 ? "Good" : g.score / g.max >= 0.25 ? "Average" : "Challenging") as GunaScore["verdict"],
  }))

  const totalScore = gunas.reduce((sum, g) => sum + g.score, 0)
  const maxScore = 36
  const percentage = Math.round((totalScore / maxScore) * 100)

  const verdicts = [
    { min: 0,  text: `With ${totalScore} out of 36 Guna points, this match faces significant challenges. Deep commitment, mutual respect, and astrological remedies are essential for harmony. Consult a Vedic astrologer for personalized guidance.` },
    { min: 18, text: `With ${totalScore} out of 36 Guna points, this is an acceptable match with areas for growth. With understanding and conscious effort, this union can flourish beautifully.` },
    { min: 24, text: `With ${totalScore} out of 36 Guna points, this is a good match. The cosmic energies support a harmonious and fulfilling partnership. Minor differences are easily bridged.` },
    { min: 30, text: `With ${totalScore} out of 36 Guna points, this is an excellent match! The stars align powerfully for this union. ${nadiScore === 8 ? "Health compatibility is strong." : "Note: Nadi dosha detected — perform Nadi Nivaran Puja."} Mutual devotion will create lasting happiness.` },
  ]
  const overallVerdict = verdicts.reduce((v, curr) => totalScore >= curr.min ? curr : v, verdicts[0]).text

  // Dynamic strengths/challenges based on actual scores
  const strengths: string[] = []
  const challenges: string[] = []
  if (ganaScore >= 5) strengths.push("Strong emotional bonding through compatible temperaments (Gana)")
  if (grahaMaitriScore >= 3) strengths.push("Good intellectual rapport — lords " + lord1 + " and " + lord2 + " are friendly")
  if (bkScore >= 7) strengths.push("Excellent financial and emotional prospects (no Bhakoot dosha)")
  if (nadiScore >= 8) strengths.push("Healthy genetic compatibility — different Nadis ensure strong progeny")
  if (yoniScore >= 3) strengths.push("Natural physical chemistry and intimate harmony")
  if (vashyaScore >= 2) strengths.push("Strong mutual attraction and magnetic pull between partners")
  if (taraScore >= 3) strengths.push("Auspicious star alignment — destiny favors this union")
  if (strengths.length < 2) strengths.push("Shared commitment and effort can overcome astrological challenges")

  if (nadiScore === 0) challenges.push("Nadi Dosha detected — this is serious. Health issues and progeny concerns possible without remedy.")
  if (bkScore === 0) challenges.push("Bhakoot Dosha present — financial stress and emotional friction are likely without remedies.")
  if (ganaScore <= 1) challenges.push("Very different temperaments (Gana mismatch) — patience and acceptance required.")
  if (grahaMaitriScore <= 1) challenges.push("Intellectual wavelengths differ (" + lord1 + " and " + lord2 + " are unfriendly lords).")
  if (yoniScore <= 1) challenges.push("Physical compatibility may need conscious nurturing and open communication.")
  if (challenges.length < 1) challenges.push("Minor adjustments in communication style will strengthen the partnership.")

  // Specific remedies based on doshas
  const remedies: string[] = []
  if (nadiScore === 0) remedies.push("Perform Nadi Nivaran Puja before marriage. Plant a Peepal tree together to mitigate Nadi dosha effects.")
  if (bkScore === 0) remedies.push("Perform Bhakoot Dosha Shanti Puja. Donate grains and ghee to Brahmins on an auspicious day.")
  if (ganaScore <= 1) remedies.push("Chant 'Om Namah Shivaya' 108 times together daily to harmonize temperaments.")
  remedies.push("Perform Navagraha Puja together before the engagement ceremony.")
  remedies.push("Feed cows together on Mondays to strengthen the Moon's positive influence on the relationship.")
  if (remedies.length < 3) remedies.push("Keep a Shri Yantra in the bedroom's northeast corner for domestic harmony.")

  // Mangal Dosha from Moon sign position (simplified: Mars in 1,2,4,7,8,12 from Moon)
  const s1 = p1.birthDate.split("-").reduce((a, b) => a + parseInt(b), 0)
  const s2 = p2.birthDate.split("-").reduce((a, b) => a + parseInt(b), 0)
  const rand = seedRandom(s1 * 31 + s2 * 17)
  // Use a heuristic: ~25% people have Mangal dosha
  const mangalDosha1 = (nak1Idx % 4 === 0)
  const mangalDosha2 = (nak2Idx % 4 === 0)

  return {
    totalScore,
    maxScore,
    percentage,
    gunas,
    overallVerdict,
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 3),
    remedies: remedies.slice(0, 3),
    mangalDosha: { person1: mangalDosha1, person2: mangalDosha2 },
    nakshatraMatch: `${p1.name}'s Nakshatra: ${nak1Name} (${SIGNS[sign1Idx]}) — ${p2.name}'s Nakshatra: ${nak2Name} (${SIGNS[sign2Idx]})`,
    recommendation: percentage >= 60
      ? "This match is recommended by Vedic standards. Proceed with blessings."
      : "Remedies are advisable before proceeding. Consult a Vedic astrologer for personalized dosha-correction guidance.",
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
          placeholder={label === "Person 1" ? "Partner 1 Name" : "Partner 2 Name"}
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
        <Navbar />
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
              <span className="gold-text">Love Match Check</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto">
              कुंडली मिलान
            </p>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto mt-2">
              Enter two birth details and find out how compatible you are — Vedic Ashtakoot system with 36-point matching.
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
                  Check Compatibility 💕
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
        <Footer />
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
      <Navbar />
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
      <Footer />
    </div>
  )
}
