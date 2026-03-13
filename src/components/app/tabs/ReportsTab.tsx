"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LifeAreaCard, SectionHeader, EmptyState, InsightCard } from "@/components/ui"
import type { OverlayType, TabType, AstroSource } from "@/types/app"

// ═══════════════════════════════════════════════════
// INTERNAL TYPES
// ═══════════════════════════════════════════════════

interface ReportItem {
  id: string
  title: string
  hook: string
  price: number
  isFree?: boolean
  sections: string[]
  source: AstroSource
}

interface LifeAreaCollection {
  icon: string
  area: string
  headline: string
  reports: ReportItem[]
}

// ═══════════════════════════════════════════════════
// REPORT COLLECTIONS — life-area guided
// ═══════════════════════════════════════════════════

const COLLECTIONS: LifeAreaCollection[] = [
  {
    icon: "💼",
    area: "Career",
    headline: "Your 10th house holds the key to professional direction",
    reports: [
      {
        id: "career-blueprint",
        title: "Career Blueprint",
        hook: "Ideal career path, promotion windows, and business timing",
        price: 299,
        sections: ["10th house deep dive", "Dasha career timeline", "Promotion windows", "Business launch timing"],
        source: { label: "10th house analysis", system: "Vedic · Parashari", reference: "BPHS Ch.24", confidence: "high" },
      },
      {
        id: "career-timing",
        title: "Job Change Timing",
        hook: "When to move — transit windows for career transitions",
        price: 199,
        sections: ["Saturn transit impact", "Jupiter opportunities", "Decision windows"],
        source: { label: "Transit analysis", system: "Vedic · Gochar", reference: "BPHS Ch.65" },
      },
    ],
  },
  {
    icon: "💛",
    area: "Love & Relationships",
    headline: "Venus and your 7th house reveal relationship patterns",
    reports: [
      {
        id: "love-compatibility",
        title: "Compatibility Analysis",
        hook: "36-point Guna matching with Mangal Dosha and Bhakoot check",
        price: 249,
        sections: ["Ashtakoot score", "Mangal Dosha check", "Nakshatra synergy", "Remedies if needed"],
        source: { label: "Ashtakoot matching", system: "Vedic · Parashari", reference: "Muhurta Chintamani", confidence: "high" },
      },
      {
        id: "marriage-timing",
        title: "Marriage Timing",
        hook: "Precise Dasha + transit windows for marriage with Muhurta guidance",
        price: 349,
        sections: ["7th house analysis", "Venus Dasha timing", "Transit windows", "Muhurta dates"],
        source: { label: "7th house analysis", system: "Vedic · Parashari", reference: "BPHS Ch.12", confidence: "high" },
      },
    ],
  },
  {
    icon: "💰",
    area: "Wealth & Finance",
    headline: "Your 2nd and 11th houses govern accumulation and gains",
    reports: [
      {
        id: "wealth-report",
        title: "Wealth Blueprint",
        hook: "Money patterns, investment timing, and wealth yogas in your chart",
        price: 299,
        sections: ["2nd & 11th house analysis", "Dhana yogas", "Investment windows", "Financial cautions"],
        source: { label: "Dhana yoga analysis", system: "Vedic · Parashari", reference: "BPHS Ch.41", confidence: "high" },
      },
    ],
  },
  {
    icon: "🌿",
    area: "Health & Wellbeing",
    headline: "The 6th house and planetary rulers influence vitality",
    reports: [
      {
        id: "health-report",
        title: "Health Overview",
        hook: "Vulnerable periods, strength windows, and preventive guidance",
        price: 199,
        sections: ["6th house analysis", "Planet-body mapping", "Vulnerable periods", "Remedies & practices"],
        source: { label: "6th house analysis", system: "Vedic · Parashari", reference: "BPHS Ch.14" },
      },
    ],
  },
  {
    icon: "📅",
    area: "Annual Forecast",
    headline: "Month-by-month guidance for 2026 based on your exact chart",
    reports: [
      {
        id: "annual-forecast",
        title: "Annual Forecast 2026",
        hook: "12-month predictions for career, health, love, and finance",
        price: 399,
        sections: ["12-month forecast", "Key decision windows", "Cautions & remedies", "Best months highlighted"],
        source: { label: "Dasha + Transit overlay", system: "Vedic · Gochar", reference: "Phaladeepika Ch.26", confidence: "high" },
      },
    ],
  },
  {
    icon: "🔮",
    area: "Dasha & Timing",
    headline: "Understanding your current planetary period changes everything",
    reports: [
      {
        id: "dasha-deep-dive",
        title: "Dasha Deep Dive",
        hook: "What your current period activates and how to navigate it",
        price: 199,
        sections: ["Mahadasha analysis", "Antardasha breakdown", "Practical guidance", "Next period preview"],
        source: { label: "Dasha analysis", system: "Vedic · Vimshottari", reference: "BPHS Ch.46" },
      },
      {
        id: "remedies-guide",
        title: "Personalized Remedies",
        hook: "Mantras, gemstones, donations, and daily practices for your chart",
        price: 149,
        isFree: true,
        sections: ["Dosha remedies", "Planet-specific mantras", "Gemstone recommendations", "Daily practices"],
        source: { label: "Remedial measures", system: "Vedic · Lal Kitab", reference: "BPHS Ch.83" },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════
// REPORTS TAB
// ═══════════════════════════════════════════════════

export default function ReportsTab({
  onShowOverlay,
  onTabChange,
}: {
  onShowOverlay: (o: OverlayType) => void
  onTabChange: (t: TabType) => void
}) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [hasChart, setHasChart] = useState(false)
  const [sourceDrawerData, setSourceDrawerData] = useState<AstroSource[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-chart-data") || localStorage.getItem("grahai-cosmic-snapshot")
      setHasChart(!!stored)
    } catch { /* ignore */ }
  }, [])

  void sourceDrawerData

  const selected = COLLECTIONS.find(c => c.area === selectedArea)

  // ─── No chart data ───
  if (!hasChart) {
    return (
      <div className="h-full flex items-center justify-center px-5">
        <EmptyState
          icon="📊"
          title="Personalized reports"
          body="Add your birth details first — every report is calculated from your exact chart, not generic sun-sign content."
          cta={{ label: "Add birth details", action: () => onShowOverlay("onboarding") }}
        />
      </div>
    )
  }

  // ─── Report detail view ───
  if (selected) {
    return (
      <div className="overflow-y-auto h-full tab-content">
        {/* Back + area header */}
        <section className="px-5 pt-6 pb-2">
          <button
            onClick={() => setSelectedArea(null)}
            className="text-[11px] text-text-dim/50 hover:text-gold transition-colors mb-4 flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All life areas
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{selected.icon}</span>
            <h2 className="text-lg font-semibold text-text">{selected.area}</h2>
          </div>
          <p className="text-xs text-text-dim/60 leading-relaxed mb-6">{selected.headline}</p>
        </section>

        {/* Reports list */}
        <section className="px-5 space-y-4 pb-8">
          {selected.reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/[0.04] bg-bg-card/50 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">{report.title}</h3>
                <div className="flex items-center gap-2">
                  {report.isFree && (
                    <span className="text-[9px] uppercase tracking-wider text-green/80 bg-green/10 px-2 py-0.5 rounded-full">
                      Free with Plus
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gold">₹{report.price}</span>
                </div>
              </div>

              <p className="text-xs text-text-dim leading-relaxed mb-4">{report.hook}</p>

              {/* What's included */}
              <div className="mb-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-text-dim/40 font-medium mb-2">Includes</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {report.sections.map((section) => (
                    <div key={section} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gold/40" />
                      <span className="text-[11px] text-text-dim/60">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <button
                  onClick={() => setSourceDrawerData([report.source])}
                  className="text-[10px] text-text-dim/50 hover:text-gold transition-colors flex items-center gap-1"
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-50">
                    <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {report.source.system}
                </button>
                <button
                  onClick={() => onShowOverlay("pricing")}
                  className="text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  Get this report →
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Ask about this area */}
        <section className="px-5 pb-8">
          <InsightCard
            title={`Have a ${selected.area.toLowerCase()} question?`}
            body="Ask anything specific — our AI astrologer can give you quick guidance based on your chart before you commit to a full report."
            category="natal"
            sources={[{ label: "AI guidance", system: "Vedic · Multi-system" }]}
            onSourceTap={(s) => setSourceDrawerData(s)}
            cta={{ label: "Ask now", action: () => onTabChange("ask") }}
            compact
          />
        </section>
      </div>
    )
  }

  // ─── Main reports index ───
  return (
    <div className="overflow-y-auto h-full tab-content">
      {/* Header */}
      <section className="px-5 pt-6 pb-2">
        <p className="text-[9px] uppercase tracking-[0.2em] text-text-dim/40 font-medium mb-1">Guidance</p>
        <h2 className="text-lg font-semibold text-text mb-1">Reports</h2>
        <p className="text-xs text-text-dim/60 leading-relaxed">
          Each report answers a specific life question — calculated from your exact birth chart, not generic content.
        </p>
      </section>

      {/* Featured report */}
      <section className="px-5 pt-4">
        <SectionHeader label="Most requested" title="Start Here" />
        <InsightCard
          title="Annual Forecast 2026"
          body="Month-by-month guidance for career, health, love, and finance — personalized to your Dasha period and active transits."
          category="transit"
          sources={[{ label: "Dasha + Transit overlay", system: "Vedic · Gochar", reference: "Phaladeepika Ch.26", confidence: "high" }]}
          onSourceTap={(s) => setSourceDrawerData(s)}
          cta={{ label: "From ₹399", action: () => { setSelectedArea("Annual Forecast") } }}
        />
      </section>

      {/* Life area collections */}
      <section className="px-5 pt-8 pb-8">
        <SectionHeader label="Explore by area" title="Life Areas" />
        <div className="space-y-3">
          {COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.area}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <LifeAreaCard
                icon={collection.icon}
                lifeArea={collection.area}
                headline={collection.headline}
                reportCount={collection.reports.length}
                priceFrom={Math.min(...collection.reports.map(r => r.price))}
                hasFreeReport={collection.reports.some(r => r.isFree)}
                onTap={() => setSelectedArea(collection.area)}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
