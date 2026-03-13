"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { InsightCard, TimelineCard, SectionHeader, EmptyState } from "@/components/ui"
import type { OverlayType, TabType, AstroSource } from "@/types/app"

// ═══════════════════════════════════════════════════
// INTERNAL TYPES
// ═══════════════════════════════════════════════════

interface PlanetPlacement {
  planet: string
  sign: string
  house: number
  degree: string
  nakshatra: string
  isRetrograde?: boolean
}

interface ChartData {
  ascendant?: string
  moonSign?: string
  sunSign?: string
  nakshatra?: string
  currentDasha?: string
  dashaEnd?: string
  planets?: PlanetPlacement[]
}

// ═══════════════════════════════════════════════════
// MY CHART TAB
// ═══════════════════════════════════════════════════

export default function MyChartTab({
  onShowKundli,
  onShowOverlay,
  onTabChange,
}: {
  onShowKundli: () => void
  onShowOverlay: (o: OverlayType) => void
  onTabChange: (t: TabType) => void
}) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [sourceDrawerData, setSourceDrawerData] = useState<AstroSource[]>([])
  const [showPlanets, setShowPlanets] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-chart-data")
      if (stored) setChartData(JSON.parse(stored))
      else {
        const snap = localStorage.getItem("grahai-cosmic-snapshot")
        if (snap) {
          const parsed = JSON.parse(snap)
          setChartData({
            moonSign: parsed.moonSign,
            nakshatra: parsed.nakshatra,
            ascendant: parsed.ascendant,
            sunSign: parsed.sunSign,
          })
        }
      }
    } catch { /* ignore */ }
  }, [])

  void sourceDrawerData

  if (!chartData || (!chartData.moonSign && !chartData.ascendant)) {
    return (
      <div className="h-full flex items-center justify-center px-5">
        <EmptyState
          icon="🪐"
          title="Your birth chart"
          body="Enter your birth details to see your complete Vedic chart — planets, dashas, yogas, and personalized insights."
          cta={{ label: "Add birth details", action: () => onShowOverlay("onboarding") }}
        />
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full tab-content">

      {/* ─── Cosmic Identity ─── */}
      <section className="px-5 pt-6 pb-2">
        <div className="rounded-2xl border border-white/[0.04] bg-bg-card/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-text-dim/40 font-medium mb-1">Your Chart</p>
              <h2 className="text-base font-semibold text-text">Cosmic Identity</h2>
            </div>
            <button
              onClick={onShowKundli}
              className="text-[11px] text-gold/70 font-medium hover:text-gold transition-colors"
            >
              View Kundli
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Ascendant", value: chartData.ascendant, emoji: "⬆️" },
              { label: "Moon Sign", value: chartData.moonSign, emoji: "🌙" },
              { label: "Sun Sign", value: chartData.sunSign, emoji: "☀️" },
              { label: "Nakshatra", value: chartData.nakshatra, emoji: "✦" },
            ].filter(item => item.value).map((item) => (
              <div key={item.label} className="rounded-xl border border-white/[0.03] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-[9px] uppercase tracking-wider text-text-dim/40 font-medium">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-text">{item.value}</p>
              </div>
            ))}
          </div>

          {chartData.currentDasha && (
            <div className="mt-3 rounded-xl border border-saffron/10 bg-saffron/[0.03] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-saffron/50 font-medium mb-0.5">Active Dasha</p>
                  <p className="text-sm font-semibold text-text">{chartData.currentDasha}</p>
                </div>
                {chartData.dashaEnd && (
                  <span className="text-[10px] text-text-dim/40">until {chartData.dashaEnd}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Key Themes ─── */}
      <section className="px-5 pt-6">
        <SectionHeader label="Based on your chart" title="Key Themes" />
        <div className="space-y-3">
          <InsightCard
            title="Strengths in your chart"
            body="Your planetary placements suggest natural abilities in communication and analytical thinking. These strengths are particularly active during your current Dasha period."
            category="natal"
            sources={[
              { label: "Natal chart analysis", system: "Vedic · Parashari", reference: "BPHS Ch.24", confidence: "high" },
            ]}
            onSourceTap={(s) => setSourceDrawerData(s)}
            cta={{ label: "Ask about strengths", action: () => onTabChange("ask") }}
          />
          <InsightCard
            title="Areas to watch"
            body="Certain house placements indicate sensitivity around financial decisions and partnership dynamics. Awareness helps you navigate these areas consciously."
            category="natal"
            urgency="medium"
            sources={[
              { label: "House analysis", system: "Vedic · Parashari", reference: "BPHS Ch.12-14", confidence: "medium" },
            ]}
            onSourceTap={(s) => setSourceDrawerData(s)}
          />
        </div>
      </section>

      {/* ─── Active Transits Timeline ─── */}
      <section className="px-5 pt-8">
        <SectionHeader label="Happening now" title="Transit Timeline" />
        <div>
          <TimelineCard
            date="Mar 2026"
            title="Saturn continues through Aquarius"
            body="Restructuring energy in your career sector. Long-term commitments solidify."
            type="transit"
            sources={[{ label: "Saturn transit", system: "Vedic · Gochar", reference: "BPHS Ch.65" }]}
            onSourceTap={(s) => setSourceDrawerData(s)}
          />
          <TimelineCard
            date="Apr 2026"
            title="Jupiter enters Gemini"
            body="Expansion in communication, learning, and short travels. Good for new skills."
            type="transit"
            sources={[{ label: "Jupiter transit", system: "Vedic · Gochar", reference: "Phaladeepika Ch.26" }]}
            onSourceTap={(s) => setSourceDrawerData(s)}
          />
          <TimelineCard
            date="May 2026"
            title="Rahu-Ketu axis shift"
            body="Major nodal transit affecting your karmic direction. Review relationships and life goals."
            type="dasha-shift"
            sources={[{ label: "Rahu-Ketu transit", system: "Vedic · Parashari", reference: "BPHS Ch.47" }]}
            onSourceTap={(s) => setSourceDrawerData(s)}
            isLast
          />
        </div>
      </section>

      {/* ─── Planetary Placements (expandable) ─── */}
      {chartData.planets && chartData.planets.length > 0 && (
        <section className="px-5 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text">Planetary Placements</h3>
            <button
              onClick={() => setShowPlanets(!showPlanets)}
              className="text-[11px] text-gold/60 font-medium hover:text-gold transition-colors"
            >
              {showPlanets ? "Hide" : "Show all"}
            </button>
          </div>

          {showPlanets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {chartData.planets.map((planet) => (
                <div
                  key={planet.planet}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.03] bg-white/[0.01]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text w-16">{planet.planet}</span>
                    <span className="text-xs text-text-dim/60">{planet.sign}</span>
                    {planet.isRetrograde && (
                      <span className="text-[8px] text-saffron/60 font-bold uppercase">R</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-dim/40">House {planet.house}</span>
                    <span className="text-[10px] text-text-dim/30 ml-2">{planet.degree}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </section>
      )}

      {/* ─── Life Areas ─── */}
      <section className="px-5 pt-8 pb-8">
        <SectionHeader
          title="Life Areas"
          action={{ label: "Full reports", onTap: () => onTabChange("reports") }}
        />
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "💼", area: "Career", hint: "10th house analysis" },
            { icon: "💛", area: "Love", hint: "7th house & Venus" },
            { icon: "💰", area: "Wealth", hint: "2nd & 11th houses" },
            { icon: "🌿", area: "Health", hint: "6th house & rulers" },
          ].map((item) => (
            <button
              key={item.area}
              onClick={() => onTabChange("ask")}
              className="text-left p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-gold/10 transition-all active:scale-[0.98]"
            >
              <span className="text-lg mb-2 block">{item.icon}</span>
              <h4 className="text-xs font-semibold text-text mb-0.5">{item.area}</h4>
              <p className="text-[10px] text-text-dim/40">{item.hint}</p>
            </button>
          ))}
        </div>
      </section>

    </div>
  )
}
