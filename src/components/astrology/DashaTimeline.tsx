"use client"

/* ════════════════════════════════════════════════════════
   DashaTimeline — Visual Vimshottari Dasha Timeline

   Horizontal timeline showing Mahadasha periods with
   the current period highlighted, plus Antardasha detail.
   ════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

// ─── Types ──────────────────────────────────────────────

interface DashaPeriod {
  planet: string
  startDate: string  // ISO date
  endDate: string    // ISO date
  years: number
  isCurrent?: boolean
  antardashas?: {
    planet: string
    startDate: string
    endDate: string
    isCurrent?: boolean
  }[]
}

interface DashaTimelineProps {
  periods: DashaPeriod[]
  className?: string
}

// ─── Planet Colors ──────────────────────────────────────

const PLANET_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  Sun:     { bg: "rgba(226, 196, 116, 0.15)", text: "#E2C474", glow: "rgba(226, 196, 116, 0.3)" },
  Moon:    { bg: "rgba(200, 216, 228, 0.15)", text: "#C8D8E4", glow: "rgba(200, 216, 228, 0.3)" },
  Mars:    { bg: "rgba(232, 84, 84, 0.15)",   text: "#E85454", glow: "rgba(232, 84, 84, 0.3)" },
  Mercury: { bg: "rgba(74, 222, 128, 0.15)",  text: "#4ADE80", glow: "rgba(74, 222, 128, 0.3)" },
  Jupiter: { bg: "rgba(226, 153, 74, 0.15)",  text: "#E2994A", glow: "rgba(226, 153, 74, 0.3)" },
  Venus:   { bg: "rgba(240, 200, 224, 0.15)", text: "#F0C8E0", glow: "rgba(240, 200, 224, 0.3)" },
  Saturn:  { bg: "rgba(107, 125, 168, 0.15)", text: "#6B7DA8", glow: "rgba(107, 125, 168, 0.3)" },
  Rahu:    { bg: "rgba(139, 139, 205, 0.15)", text: "#8B8BCD", glow: "rgba(139, 139, 205, 0.3)" },
  Ketu:    { bg: "rgba(184, 134, 11, 0.15)",  text: "#B8860B", glow: "rgba(184, 134, 11, 0.3)" },
}

// ─── Planet Hindi Names ─────────────────────────────────

const PLANET_HINDI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
}

// ─── Helpers ────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
}

function getProgressPercent(start: string, end: string): number {
  const now = Date.now()
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (now <= s) return 0
  if (now >= e) return 100
  return Math.round(((now - s) / (e - s)) * 100)
}

// ─── Component ──────────────────────────────────────────

export default function DashaTimeline({ periods, className = "" }: DashaTimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    periods.findIndex((p) => p.isCurrent)
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gold" />
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
          Vimshottari Dasha Timeline
        </h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-indigo/20" />

        {periods.map((period, i) => {
          const colors = PLANET_COLORS[period.planet] || PLANET_COLORS.Sun
          const isExpanded = expandedIndex === i
          const progress = period.isCurrent ? getProgressPercent(period.startDate, period.endDate) : 0

          return (
            <motion.div
              key={`${period.planet}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-10 pb-4"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: colors.text,
                  backgroundColor: period.isCurrent ? colors.text : "transparent",
                  boxShadow: period.isCurrent ? `0 0 8px ${colors.glow}` : "none",
                }}
              />

              {/* Period card */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full text-left rounded-xl border transition-all duration-200 hover:border-opacity-40"
                style={{
                  backgroundColor: period.isCurrent ? colors.bg : "rgba(12, 18, 36, 0.5)",
                  borderColor: period.isCurrent ? colors.text + "33" : "rgba(48, 68, 160, 0.15)",
                }}
              >
                <div className="px-4 py-3">
                  {/* Planet name + dates */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: colors.text }}
                      >
                        {period.planet}
                      </span>
                      <span
                        className="text-xs opacity-60"
                        style={{ color: colors.text, fontFamily: "var(--font-devanagari)" }}
                      >
                        {PLANET_HINDI[period.planet]}
                      </span>
                      <span className="text-xs text-text-dim">
                        ({period.years}y)
                      </span>
                      {period.isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-saffron/20 text-saffron font-medium">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-dim">
                        {formatDate(period.startDate)} — {formatDate(period.endDate)}
                      </span>
                      {period.antardashas && period.antardashas.length > 0 && (
                        isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-text-dim" />
                          : <ChevronDown className="w-3.5 h-3.5 text-text-dim" />
                      )}
                    </div>
                  </div>

                  {/* Progress bar for current period */}
                  {period.isCurrent && (
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors.text }}
                      />
                    </div>
                  )}
                </div>

                {/* Expanded: Antardashas */}
                {isExpanded && period.antardashas && period.antardashas.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t px-4 py-2 space-y-1"
                    style={{ borderColor: "rgba(48, 68, 160, 0.1)" }}
                  >
                    <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">
                      Antardasha Periods
                    </p>
                    {period.antardashas.map((ad, ai) => {
                      const adColors = PLANET_COLORS[ad.planet] || PLANET_COLORS.Sun

                      return (
                        <div
                          key={`${ad.planet}-${ai}`}
                          className="flex items-center justify-between py-1 px-2 rounded-lg"
                          style={{
                            backgroundColor: ad.isCurrent ? adColors.bg : "transparent",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: adColors.text }}
                            />
                            <span className="text-xs" style={{ color: adColors.text }}>
                              {ad.planet}
                            </span>
                            {ad.isCurrent && (
                              <span className="text-[9px] px-1 py-0.5 rounded bg-saffron/10 text-saffron">
                                NOW
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-text-dim">
                            {formatDate(ad.startDate)} — {formatDate(ad.endDate)}
                          </span>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
