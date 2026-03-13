"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { InsightCard, SectionHeader, QuestionInput, EmptyState } from "@/components/ui"
import type { OverlayType, TabType, AstroSource } from "@/types/app"

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const DAILY_MANTRAS = [
  { day: 0, sanskrit: "ॐ आदित्याय नमः", meaning: "Salutations to the Sun — shine bright today.", planet: "Sun", color: "Gold" },
  { day: 1, sanskrit: "ॐ सोमाय नमः", meaning: "Salutations to the Moon — trust your intuition.", planet: "Moon", color: "White" },
  { day: 2, sanskrit: "ॐ अङ्गारकाय नमः", meaning: "Salutations to Mars — channel your energy wisely.", planet: "Mars", color: "Red" },
  { day: 3, sanskrit: "ॐ बुधाय नमः", meaning: "Salutations to Mercury — communicate with clarity.", planet: "Mercury", color: "Green" },
  { day: 4, sanskrit: "ॐ बृहस्पतये नमः", meaning: "Salutations to Jupiter — expand your wisdom.", planet: "Jupiter", color: "Yellow" },
  { day: 5, sanskrit: "ॐ शुक्राय नमः", meaning: "Salutations to Venus — embrace beauty and love.", planet: "Venus", color: "Pink" },
  { day: 6, sanskrit: "ॐ शनैश्चराय नमः", meaning: "Salutations to Saturn — patience brings rewards.", planet: "Saturn", color: "Blue" },
]

const GUIDANCE_LANES = [
  { id: "career", icon: "💼", label: "Career", question: "How is my career looking this week?" },
  { id: "love", icon: "💛", label: "Love", question: "What should I know about my love life right now?" },
  { id: "health", icon: "🌿", label: "Health", question: "What does my chart say about my health today?" },
  { id: "timing", icon: "⏳", label: "Timing", question: "Is this a good time to make a big decision?" },
]

// ═══════════════════════════════════════════════════
// HOME TAB
// ═══════════════════════════════════════════════════

export default function HomeTab({
  onShowOverlay,
  onTabChange,
  isNewUser,
}: {
  onShowOverlay: (o: OverlayType) => void
  onTabChange: (t: TabType) => void
  isNewUser?: boolean
}) {
  const today = new Date()
  const mantra = DAILY_MANTRAS[today.getDay()] || DAILY_MANTRAS[0]
  const [userName, setUserName] = useState("")
  const [moonSign, setMoonSign] = useState("")
  const [nakshatra, setNakshatra] = useState("")
  const [sourceDrawerData, setSourceDrawerData] = useState<AstroSource[]>([])

  useEffect(() => {
    try {
      const name = localStorage.getItem("userNameForGreeting")
      if (name) setUserName(name)
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const parsed = JSON.parse(snap)
        if (parsed.moonSign) setMoonSign(parsed.moonSign)
        if (parsed.nakshatra) setNakshatra(parsed.nakshatra)
      }
    } catch { /* ignore */ }
  }, [])

  const timeGreeting = today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"
  const greeting = userName ? `Good ${timeGreeting}, ${userName.split(" ")[0]}` : `Good ${timeGreeting}`

  const handleAsk = (question: string) => {
    // Store question and switch to Ask tab
    try {
      const existing = JSON.parse(localStorage.getItem("grahai-saved-questions") || "[]")
      localStorage.setItem("grahai-saved-questions", JSON.stringify([question, ...existing].slice(0, 20)))
      // Store pending question for AskTab to pick up
      localStorage.setItem("grahai-pending-question", question)
    } catch { /* ignore */ }
    onTabChange("ask")
  }

  void sourceDrawerData // will wire up later

  return (
    <div className="overflow-y-auto h-full tab-content">

      {/* ─── New User Hero ─── */}
      {isNewUser && (
        <section className="px-5 pt-10 pb-8">
          <div className="relative">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-gold/[0.04] blur-[80px]" />
            <div className="relative z-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 font-medium mb-3">
                Vedic Astrology, Personally Interpreted
              </p>
              <h1 className="text-2xl font-bold text-text leading-tight max-w-[280px] mx-auto mb-3">
                Clarity for the questions that actually matter to you.
              </h1>
              <p className="text-sm text-text-dim/60 max-w-[300px] mx-auto leading-relaxed mb-6">
                Chart-based guidance grounded in classical texts. Every insight shows its sources.
              </p>
              <div className="space-y-2.5 max-w-[280px] mx-auto">
                <button
                  onClick={() => onShowOverlay("onboarding")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-bg text-sm font-semibold transition-transform active:scale-[0.98]"
                >
                  Enter your birth details
                </button>
                <button
                  onClick={() => onShowOverlay("sample-preview")}
                  className="w-full py-2.5 rounded-xl border border-white/[0.06] text-sm text-text-dim/70 hover:text-text transition-colors"
                >
                  See how it works
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        </section>
      )}

      {/* ─── Personal Greeting ─── */}
      <section className="px-5 pt-6 pb-2">
        <p className="text-xs text-text-dim/50 mb-1">{greeting}</p>
        {moonSign && (
          <p className="text-[11px] text-text-dim/40">
            {moonSign}{nakshatra ? ` · ${nakshatra}` : ""}
          </p>
        )}
      </section>

      {/* ─── Today's Guidance ─── */}
      <section className="px-5 pt-4 pb-2">
        <InsightCard
          title={`${mantra.planet} day — ${mantra.meaning.split("—")[0]?.trim() || mantra.planet}`}
          body={mantra.meaning}
          category="transit"
          sources={[
            { label: `${mantra.planet} Planetary Ruler`, system: "Vedic · Vara System", reference: "Traditional day-planet correspondence" },
          ]}
          onSourceTap={(s) => setSourceDrawerData(s)}
          cta={{ label: "Ask about today", action: () => onTabChange("ask") }}
        />
      </section>

      {/* ─── Guidance Lanes ─── */}
      <section className="px-5 pt-6">
        <SectionHeader title="What's on your mind?" />
        <div className="grid grid-cols-2 gap-2.5">
          {GUIDANCE_LANES.map((lane, i) => (
            <motion.button
              key={lane.id}
              onClick={() => handleAsk(lane.question)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-gold/10 transition-all active:scale-[0.98]"
            >
              <span className="text-lg">{lane.icon}</span>
              <span className="text-xs font-medium text-text/80">{lane.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ─── Ask Input ─── */}
      <section className="px-5 pt-6">
        <QuestionInput
          onSubmit={handleAsk}
          placeholder="Ask anything about your chart..."
        />
        <div className="flex gap-2 mt-3 flex-wrap">
          {["Saturn transit", "Career timing", "Relationship outlook"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleAsk(chip)}
              className="px-3 py-1.5 rounded-full border border-white/[0.04] text-[10px] text-text-dim/40 hover:text-text-dim/70 hover:border-white/[0.08] transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Active Transits (personalized insights) ─── */}
      <section className="px-5 pt-8">
        <SectionHeader
          label="Happening now"
          title="Active Transits"
          action={{ label: "View chart", onTap: () => onTabChange("mychart") }}
        />
        {moonSign ? (
          <div className="space-y-3">
            <InsightCard
              title="Saturn transiting through Aquarius"
              body="Saturn in its own sign brings a period of focused restructuring. Commitments made now carry long-term weight. Discipline is rewarded."
              category="transit"
              sources={[
                { label: "Saturn in Aquarius", system: "Vedic · Gochar", reference: "BPHS Ch.65", confidence: "high" },
              ]}
              onSourceTap={(s) => setSourceDrawerData(s)}
              compact
            />
            <InsightCard
              title="Jupiter aspects your natal Moon"
              body="This is one of the most favorable transits for emotional growth and wisdom. Inner clarity increases. Good period for learning."
              category="transit"
              urgency="low"
              sources={[
                { label: "Jupiter-Moon aspect", system: "Vedic · Gochar", reference: "Phaladeepika Ch.26", confidence: "high" },
              ]}
              onSourceTap={(s) => setSourceDrawerData(s)}
              compact
            />
          </div>
        ) : (
          <EmptyState
            icon="🪐"
            title="Your transits will appear here"
            body="Enter your birth details to see personalized planetary transits."
            cta={{ label: "Add birth details", action: () => onShowOverlay("onboarding") }}
          />
        )}
      </section>

      {/* ─── Explore Reports ─── */}
      <section className="px-5 pt-8">
        <SectionHeader
          title="Go deeper"
          action={{ label: "All reports", onTap: () => onTabChange("reports") }}
        />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {[
            { icon: "📊", title: "Career Blueprint", price: "₹299", desc: "10-year career map based on your Dasha" },
            { icon: "💛", title: "Love Compatibility", price: "₹249", desc: "Beyond Ashtakoot — real compatibility" },
            { icon: "📅", title: "Annual Forecast", price: "₹399", desc: "Month-by-month guidance for 2026" },
          ].map((report) => (
            <button
              key={report.title}
              onClick={() => onTabChange("reports")}
              className="flex-shrink-0 w-[200px] text-left p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-gold/10 transition-all"
            >
              <span className="text-xl mb-2 block">{report.icon}</span>
              <h4 className="text-xs font-semibold text-text mb-1">{report.title}</h4>
              <p className="text-[10px] text-text-dim/50 leading-relaxed mb-2 line-clamp-2">{report.desc}</p>
              <span className="text-xs font-bold text-gold">{report.price}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Daily Mantra ─── */}
      <section className="px-5 pt-8 pb-8">
        <div className="rounded-2xl border border-gold/10 bg-gold/[0.02] p-5 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gold/40 font-medium mb-3">
            Today&apos;s Mantra · {mantra.planet}
          </p>
          <p className="text-base font-hindi font-semibold text-gold-light/80 leading-relaxed mb-2">
            {mantra.sanskrit}
          </p>
          <p className="text-[11px] text-text-dim/50 italic">{mantra.meaning}</p>
        </div>
      </section>

    </div>
  )
}
