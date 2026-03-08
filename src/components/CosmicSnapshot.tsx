"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Sparkles, ArrowRight, Star, Loader2, ChevronDown } from "lucide-react"
import Link from "next/link"

/* ════════════════════════════════════════════════════════
   COSMIC SNAPSHOT — Zero-Signup Mini Reading
   Enter birthday → instant Vedic insight. No account needed.
   ════════════════════════════════════════════════════════ */

interface SnapshotResult {
  vedicSign: {
    name: string; sanskrit: string; degree: string;
    element: string; quality: string; lord: string;
    lordSanskrit: string; gender: string;
  }
  nakshatra: {
    name: string; sanskrit: string; lord: string;
    deity: string; pada: number; symbol: string;
    shakti: string; animal: string; gana: string;
  }
  lifePath: { number: number; meaning: string }
  element: { name: string; insight: string }
  rulingPlanet: { name: string; sanskrit: string; signifies: string }
  birthDay: { name: string; sanskrit: string; lord: string; lordSanskrit: string }
  todayTransit: { vibe: string; emoji: string; detail: string }
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "from-orange-500/20 to-red-500/20",
  Earth: "from-emerald-500/20 to-amber-600/20",
  Air: "from-cyan-400/20 to-blue-500/20",
  Water: "from-blue-500/20 to-purple-500/20",
}

const ELEMENT_BORDER: Record<string, string> = {
  Fire: "border-orange-500/20",
  Earth: "border-emerald-500/20",
  Air: "border-cyan-400/20",
  Water: "border-blue-500/20",
}

const ELEMENT_EMOJI: Record<string, string> = {
  Fire: "🔥", Earth: "🌍", Air: "🌬️", Water: "🌊",
}

const smooth = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }

export default function CosmicSnapshot() {
  const [birthDate, setBirthDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SnapshotResult | null>(null)
  const [error, setError] = useState("")
  const resultRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-60px" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!birthDate) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/cosmic-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.snapshot)
        // Scroll to results after a brief delay
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 300)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch {
      setError("Failed to connect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="cosmic-snapshot" ref={sectionRef} className="relative py-28 lg:py-40">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-gold/[0.03] blur-[180px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={smooth}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/15" />
            <div className="h-1 w-1 rounded-full bg-gold/20" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/15" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/10 bg-gold/[0.02] px-4 py-1.5 mb-6">
            <Sparkles className="h-3 w-3 text-gold/60" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/60">
              No signup needed
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mb-4 tracking-tight">
            Your <span className="bg-gradient-to-r from-[#C9A24D] to-[#E2C474] bg-clip-text text-transparent">Cosmic Snapshot</span>
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-md mx-auto leading-relaxed">
            Enter just your birthday — see your Vedic zodiac sign, birth star,
            life path number, and today&apos;s cosmic vibe. Instantly.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...smooth, delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <input
                type="date"
                value={birthDate}
                onChange={e => { setBirthDate(e.target.value); setError("") }}
                required
                max={new Date().toISOString().split("T")[0]}
                min="1920-01-01"
                className="h-13 w-full rounded-xl border border-white/[0.06] bg-[#111128]/80 px-5 text-sm text-white/80 backdrop-blur transition-all focus:border-gold/25 focus:outline-none focus:ring-1 focus:ring-gold/10 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                placeholder="Your birth date"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !birthDate}
              className="group flex h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#E2C474] px-8 text-sm font-semibold text-[#0B0E1A] transition-all hover:shadow-xl hover:shadow-[#C9A24D]/20 active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Reveal My Stars
                  <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                </>
              )}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-xs text-red-400/80 text-center">{error}</p>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14"
            >
              {/* Vedic Sign — Hero Card */}
              <div className={`rounded-2xl border ${ELEMENT_BORDER[result.element.name] || "border-white/[0.06]"} bg-gradient-to-br ${ELEMENT_COLORS[result.element.name] || ""} bg-[#111128]/50 backdrop-blur p-8 lg:p-10 mb-6`}>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Sign Symbol */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/10 flex items-center justify-center">
                      <span className="text-4xl">{ELEMENT_EMOJI[result.element.name] || "✨"}</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-gold/50 mb-2">Your Vedic Sun Sign</p>
                    <h3 className="text-3xl font-bold text-white/90 mb-1">
                      {result.vedicSign.name}
                      <span className="font-hindi text-xl text-gold/40 ml-3">
                        ({result.vedicSign.sanskrit})
                      </span>
                    </h3>
                    <p className="text-sm text-white/45 mb-4">
                      {result.vedicSign.element} · {result.vedicSign.quality} · {result.vedicSign.degree}° in {result.vedicSign.name}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                      {result.element.insight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {/* Nakshatra */}
                <div className="rounded-xl border border-white/[0.04] bg-[#111128]/50 backdrop-blur p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="h-4 w-4 text-gold/60" />
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50">Birth Star (Nakshatra)</p>
                  </div>
                  <h4 className="text-xl font-semibold text-white/85 mb-1">
                    {result.nakshatra.name}
                    <span className="font-hindi text-sm text-gold/30 ml-2">
                      {result.nakshatra.sanskrit}
                    </span>
                  </h4>
                  <p className="text-xs text-white/40 mb-3">
                    Pada {result.nakshatra.pada} · Deity: {result.nakshatra.deity}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/45">
                      {result.nakshatra.symbol}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/45">
                      Shakti: {result.nakshatra.shakti}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/45">
                      {result.nakshatra.gana} Gana
                    </span>
                  </div>
                </div>

                {/* Life Path Number */}
                <div className="rounded-xl border border-white/[0.04] bg-[#111128]/50 backdrop-blur p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60 text-sm font-bold">#</span>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50">Life Path Number</p>
                  </div>
                  <h4 className="text-4xl font-bold text-white/85 mb-2">
                    {result.lifePath.number}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {result.lifePath.meaning}
                  </p>
                </div>

                {/* Ruling Planet */}
                <div className="rounded-xl border border-white/[0.04] bg-[#111128]/50 backdrop-blur p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60">☿</span>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50">Ruling Planet</p>
                  </div>
                  <h4 className="text-xl font-semibold text-white/85 mb-1">
                    {result.rulingPlanet.name}
                    <span className="font-hindi text-sm text-gold/30 ml-2">
                      {result.rulingPlanet.sanskrit}
                    </span>
                  </h4>
                  <p className="text-xs text-white/40 mb-2">
                    Born on {result.birthDay.name}
                    <span className="font-hindi text-gold/25 ml-1">({result.birthDay.sanskrit})</span>
                  </p>
                  <p className="text-xs text-white/50">
                    Signifies: {result.rulingPlanet.signifies}
                  </p>
                </div>
              </div>

              {/* Today's Transit */}
              <div className="rounded-xl border border-gold/[0.08] bg-gradient-to-r from-gold/[0.03] to-transparent backdrop-blur p-6 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{result.todayTransit.emoji}</span>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50 mb-1">Today&apos;s Cosmic Vibe</p>
                    <h4 className="text-lg font-semibold text-white/85 mb-2">{result.todayTransit.vibe}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{result.todayTransit.detail}</p>
                  </div>
                </div>
              </div>

              {/* CTA — Unlock Full Reading */}
              <div className="text-center">
                <p className="text-xs text-white/35 mb-4">
                  This is just a glimpse. Your full Kundli reading includes planetary positions,
                  Dasha timelines, Yogas, Doshas, and personalized predictions.
                </p>
                <Link
                  href="/chat"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#E2C474] px-10 py-4 text-base font-semibold text-[#0B0E1A] transition-all hover:shadow-xl hover:shadow-[#C9A24D]/20 active:scale-[0.98]"
                >
                  Get Your Full Reading
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll hint when no result yet */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
          >
            <p className="text-[10px] text-white/25 tracking-wider uppercase">
              Instant • Free • No account needed
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
