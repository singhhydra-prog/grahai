"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Sparkles, Hash, ArrowRight, RotateCcw, Share2 } from "lucide-react"
import Link from "next/link"

/* ─── Pythagorean letter→number map ─── */
const PYTH: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
}
const VOWELS = new Set("aeiou")

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, d) => a + parseInt(d), 0)
  }
  return n
}

function computeNameNumbers(name: string) {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "")
  let total = 0, vowelSum = 0, consonantSum = 0
  for (const ch of clean) {
    const val = PYTH[ch] || 0
    total += val
    if (VOWELS.has(ch)) vowelSum += val
    else consonantSum += val
  }
  return {
    destiny: reduceToSingle(total),
    soul: reduceToSingle(vowelSum),
    personality: reduceToSingle(consonantSum),
  }
}

/* ─── Number interpretations ─── */
const MEANINGS: Record<number, { keyword: string; desc: string; color: string }> = {
  1: { keyword: "The Pioneer", desc: "Natural-born leader with independent spirit and creative vision. You forge new paths.", color: "from-amber-400 to-orange-500" },
  2: { keyword: "The Diplomat", desc: "Harmonizer and peacemaker with deep intuition. Your sensitivity is your strength.", color: "from-blue-400 to-cyan-500" },
  3: { keyword: "The Creator", desc: "Expressive communicator with artistic brilliance. Joy and creativity flow through you.", color: "from-yellow-400 to-amber-500" },
  4: { keyword: "The Builder", desc: "Methodical architect of lasting foundations. You bring order from chaos.", color: "from-emerald-400 to-green-500" },
  5: { keyword: "The Explorer", desc: "Freedom-seeking adventurer with magnetic charm. Change is your catalyst.", color: "from-purple-400 to-violet-500" },
  6: { keyword: "The Nurturer", desc: "Devoted guardian of love and beauty. Family and harmony define your path.", color: "from-pink-400 to-rose-500" },
  7: { keyword: "The Seeker", desc: "Philosophical mystic drawn to hidden truths. Spiritual wisdom is your inheritance.", color: "from-indigo-400 to-blue-500" },
  8: { keyword: "The Powerhouse", desc: "Material mastery with karmic understanding. Abundance follows your discipline.", color: "from-gold to-amber-600" },
  9: { keyword: "The Sage", desc: "Humanitarian visionary with universal compassion. You serve the greater good.", color: "from-red-400 to-rose-500" },
  11: { keyword: "Master Illuminator", desc: "Spiritual messenger with heightened intuition. You inspire through divine connection.", color: "from-violet-400 to-purple-600" },
  22: { keyword: "Master Builder", desc: "Architect of grand visions. You transform spiritual insight into material reality.", color: "from-gold to-yellow-600" },
  33: { keyword: "Master Teacher", desc: "Selfless healer and cosmic guide. You embody unconditional love.", color: "from-emerald-400 to-teal-600" },
}

function NumberCard({ label, num, delay }: { label: string; num: number; delay: number }) {
  const m = MEANINGS[num] || MEANINGS[9]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-colors"
    >
      <p className="text-[10px] tracking-[0.2em] uppercase text-text-dim/40 mb-2">{label}</p>
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-3xl font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
          {num}
        </span>
        <span className="text-sm font-semibold text-white/80">{m.keyword}</span>
      </div>
      <p className="text-xs text-text-dim/60 leading-relaxed">{m.desc}</p>
    </motion.div>
  )
}

export default function DecodeYourName() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [name, setName] = useState("")
  const [result, setResult] = useState<ReturnType<typeof computeNameNumbers> | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleDecode = () => {
    if (!name.trim()) return
    const nums = computeNameNumbers(name)
    setResult(nums)
    setShowResult(true)
  }

  const handleReset = () => {
    setName("")
    setResult(null)
    setShowResult(false)
  }

  const handleShare = () => {
    if (!result) return
    const m = MEANINGS[result.destiny] || MEANINGS[9]
    const text = `My name numerology: Destiny ${result.destiny} — ${m.keyword}! Decode yours at GrahAI.`
    if (navigator.share) {
      navigator.share({ title: "My Name Numerology — GrahAI", text, url: window.location.origin })
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text + " " + window.location.origin)}`
      window.open(url, "_blank")
    }
  }

  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-gold/60" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold/50">
              Name Numerology
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Decode Your Name.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-gold to-purple-400 bg-clip-text text-transparent">
              Reveal Your Numbers.
            </span>
          </h2>
          <p className="text-text-dim/60 text-sm max-w-lg mx-auto">
            Every letter in your name carries a vibrational frequency.
            Discover your Destiny, Soul Urge, and Personality numbers instantly.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
                <label className="block text-xs font-medium text-text-dim/50 mb-2">
                  Enter your full name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDecode()}
                    placeholder="e.g., Arjun Sharma"
                    className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim/30 focus:outline-none focus:border-gold/30 transition-colors"
                  />
                  <button
                    onClick={handleDecode}
                    disabled={!name.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-gold to-amber-500 text-black hover:from-amber-400 hover:to-gold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    Decode
                  </button>
                </div>
                <p className="text-center text-[10px] text-text-dim/30 mt-3">
                  Pythagorean numerology system • Master numbers preserved
                </p>
              </div>
            </motion.div>
          ) : result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Name display */}
              <div className="text-center mb-2">
                <p className="text-xs text-text-dim/40">Numerology for</p>
                <p className="text-lg font-bold text-white">{name}</p>
              </div>

              {/* Three number cards */}
              <NumberCard label="Destiny Number" num={result.destiny} delay={0.1} />
              <NumberCard label="Soul Urge Number" num={result.soul} delay={0.2} />
              <NumberCard label="Personality Number" num={result.personality} delay={0.3} />

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between pt-4"
              >
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-text-dim/40 hover:text-text-dim/60 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try another name
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs text-purple-400/70 hover:text-purple-400 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>
                <Link
                  href="/chat"
                  className="flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  Get Deep Numerology Reading
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
