"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ChevronDown, Sparkles, ShieldCheck, Loader2,
  BookOpen, Gem, AlertCircle, RefreshCw, Download
} from "lucide-react"

/* ══════════════════════════════════════════════════════
   Report Detail Page — Dynamic AI-Generated Reports

   Flow:
   1. User lands on /report?id=love-compat (from ReportsTab)
   2. Page reads birth data from localStorage
   3. Calls /api/reports/generate-typed with reportType + birthData
   4. Claude AI + Swiss Ephemeris generates personalized report
   5. Displays structured sections with highlights + remedies
   ══════════════════════════════════════════════════════ */

/* ── Types ── */
interface GeneratedSection {
  title: string
  content: string
  highlights?: string[]
}

interface GeneratedRemedy {
  type: string
  description: string
}

interface GeneratedReport {
  success: boolean
  reportType: string
  generatedAt: string
  name: string
  summary: string
  sections: GeneratedSection[]
  remedies?: GeneratedRemedy[]
  error?: string
}

interface ReportDetailPageProps {
  reportId: string
  onBack: () => void
}

/* ── Report Metadata (static info about each report type) ── */
interface ReportMeta {
  title: string
  subtitle: string
  icon: string
  description: string
  agent: string
}

const REPORT_META: Record<string, ReportMeta> = {
  "love-compat": {
    title: "Love & Compatibility",
    subtitle: "Your Emotional & Relationship Blueprint",
    icon: "💕",
    description: "Deep analysis of Venus, 7th house, Navamsa chart, and emotional tendencies. Reveals your love language, ideal partner traits, and relationship timing.",
    agent: "Jyotish Guru — Venus & 7th House Specialist",
  },
  "kundli-match": {
    title: "Kundli Matching",
    subtitle: "36 Guna Milan & Beyond",
    icon: "💍",
    description: "Traditional Ashtakoot matching with Mangal Dosha analysis, Dasha compatibility, and cross-chart planetary aspects.",
    agent: "Jyotish Guru — Compatibility Specialist",
  },
  "career-blueprint": {
    title: "Career Blueprint",
    subtitle: "Strategic Professional Direction",
    icon: "📊",
    description: "10th house analysis, Saturn placement, Dasamsa chart, and career timing windows from Dasha periods.",
    agent: "Jyotish Guru — Career & 10th House Specialist",
  },
  "marriage-timing": {
    title: "Marriage Timing",
    subtitle: "When & How Marriage Manifests",
    icon: "🗓️",
    description: "7th house yoga analysis, Dasha timing windows, delay factors, Mangal Dosha status, and transit triggers for marriage.",
    agent: "Jyotish Guru — Marriage Timing Specialist",
  },
  "annual-forecast": {
    title: "Annual Forecast 2026",
    subtitle: "Your Month-by-Month Cosmic Map",
    icon: "📅",
    description: "Quarter-by-quarter analysis combining Dasha context with transit effects. Best months, caution periods, and key dates.",
    agent: "Jyotish Guru — Transit & Gochar Specialist",
  },
  "wealth-growth": {
    title: "Wealth & Growth",
    subtitle: "Your Financial Destiny Map",
    icon: "💰",
    description: "Wealth yogas, Lakshmi Yoga analysis, 2nd/5th/9th/11th house triad, income timing, and investment alignment.",
    agent: "Jyotish Guru — Wealth & Dhan Yoga Specialist",
  },
  "dasha-deep-dive": {
    title: "Dasha Deep Dive",
    subtitle: "Your Planetary Period Life Map",
    icon: "🔮",
    description: "Full Vimshottari Dasha analysis — current Mahadasha, Antardasha, life themes, transition forecasts, and integration guidance.",
    agent: "Jyotish Guru — Dasha System Specialist",
  },
}

/* ── Fallback for unknown report IDs ── */
const DEFAULT_META: ReportMeta = {
  title: "Vedic Report",
  subtitle: "Personalized Astrological Analysis",
  icon: "🪐",
  description: "A comprehensive analysis based on your birth chart using classical Jyotish principles.",
  agent: "Jyotish Guru",
}

/* ── Markdown-like renderer for report content ── */
function RichContent({ text }: { text: string }) {
  // Simple markdown: **bold**, *italic*, headers with ###, bullet points
  const lines = text.split("\n")
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-2" />

        // H3 headers
        if (trimmed.startsWith("### ")) {
          return <h4 key={i} className="text-sm font-semibold text-[#D4A054] mt-3 mb-1">{trimmed.replace("### ", "")}</h4>
        }
        // H2 headers
        if (trimmed.startsWith("## ")) {
          return <h3 key={i} className="text-base font-bold text-[#F1F0F5] mt-4 mb-2">{trimmed.replace("## ", "")}</h3>
        }
        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A054] mt-1.5 shrink-0" />
              <span className="text-sm text-[#ACB8C4] leading-relaxed">{formatInline(trimmed.slice(2))}</span>
            </div>
          )
        }
        // Numbered points
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)?.[1]
          const rest = trimmed.replace(/^\d+\.\s*/, "")
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="text-xs font-bold text-[#D4A054] mt-0.5 w-5 shrink-0">{num}.</span>
              <span className="text-sm text-[#ACB8C4] leading-relaxed">{formatInline(rest)}</span>
            </div>
          )
        }
        // Regular paragraph
        return <p key={i} className="text-sm text-[#ACB8C4] leading-relaxed">{formatInline(trimmed)}</p>
      })}
    </div>
  )
}

function formatInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-[#F1F0F5] font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function ReportDetailPage({ reportId, onBack }: ReportDetailPageProps) {
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [autoGenerated, setAutoGenerated] = useState(false)

  const meta = REPORT_META[reportId] || DEFAULT_META

  const generateReport = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Get birth data from localStorage
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (!stored) {
        setError("Birth details not found. Please complete onboarding first.")
        setLoading(false)
        return
      }

      const birthData = JSON.parse(stored)

      const res = await fetch("/api/reports/generate-typed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: reportId,
          birthDetails: {
            date: birthData.dateOfBirth,
            time: birthData.timeOfBirth || "12:00",
            place: birthData.placeOfBirth || "Unknown",
            latitude: birthData.latitude || 28.6139,
            longitude: birthData.longitude || 77.209,
            timezone: birthData.timezone || 5.5,
          },
          name: birthData.name || "Native",
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to generate report. Please try again.")
        return
      }

      setReport(data)
      // Auto-expand first section
      setExpandedSections(new Set([0]))
    } catch (err) {
      console.error("Report generation error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [reportId])

  // Auto-generate on mount
  useEffect(() => {
    if (!autoGenerated) {
      setAutoGenerated(true)
      generateReport()
    }
  }, [autoGenerated, generateReport])

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#F1F0F5]">{meta.title}</h1>
            <p className="text-xs text-[#8892A3]">{meta.subtitle}</p>
          </div>
          <span className="text-xl">{meta.icon}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-28">

        {/* ── Loading State ── */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-5"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-[#D4A054]/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D4A054] animate-pulse" />
              </div>
              <Loader2 className="w-20 h-20 text-[#D4A054] animate-spin absolute inset-0" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-[#F1F0F5]">Generating Your Report</p>
              <p className="text-xs text-[#8892A3] max-w-[250px]">
                Our AI astrologer is analyzing your birth chart using Swiss Ephemeris calculations...
              </p>
              <div className="flex items-center gap-2 justify-center mt-3">
                <BookOpen className="w-3.5 h-3.5 text-[#D4A054]/60" />
                <p className="text-[10px] text-[#8892A3]">{meta.agent}</p>
              </div>
            </div>

            {/* Loading steps animation */}
            <div className="w-full max-w-[280px] space-y-2 mt-4">
              {["Computing planetary positions...", "Analyzing house placements...", "Detecting yogas & doshas...", "Generating personalized insights..."].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 2.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A054]" />
                  <span className="text-[11px] text-[#A0A5B2]">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-rose-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-[#F1F0F5]">Report Generation Failed</p>
              <p className="text-xs text-[#8892A3] max-w-[280px]">{error}</p>
            </div>
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                bg-[#D4A054]/10 text-[#D4A054] border border-[#D4A054]/20
                hover:bg-[#D4A054]/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* ── Generated Report Content ── */}
        {report && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Hero / Summary */}
            <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-5">
              <div className="text-center mb-4">
                <span className="text-3xl mb-2 block">{meta.icon}</span>
                <h2 className="text-lg font-bold text-[#F1F0F5] mb-1">{meta.title}</h2>
                <p className="text-xs text-[#8892A3]">
                  Generated for <span className="text-[#D4A054] font-medium">{report.name}</span> on {new Date(report.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <p className="text-sm text-[#ACB8C4] leading-relaxed">{report.summary}</p>
              </div>
            </div>

            {/* Report Sections */}
            <div>
              <h3 className="text-sm font-semibold text-[#A0A5B2] uppercase tracking-wider px-1 mb-3">Detailed Analysis</h3>
              <div className="space-y-2">
                {report.sections.map((section, i) => {
                  const isExpanded = expandedSections.has(i)
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(i)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-[#D4A054] w-5">{i + 1}</span>
                          <span className="text-sm font-medium text-[#F1F0F5]">{section.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[#8892A3] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-white/5 pt-3">
                              <RichContent text={section.content} />

                              {/* Highlights */}
                              {section.highlights && section.highlights.length > 0 && (
                                <div className="mt-4 p-3 rounded-lg bg-[#D4A054]/[0.04] border border-[#D4A054]/10">
                                  <p className="text-[10px] text-[#D4A054] font-semibold uppercase tracking-wider mb-2">Key Takeaways</p>
                                  <div className="space-y-1.5">
                                    {section.highlights.map((h, hi) => (
                                      <div key={hi} className="flex items-start gap-2">
                                        <Gem className="w-3 h-3 text-[#D4A054] mt-0.5 shrink-0" />
                                        <span className="text-xs text-[#ACB8C4] leading-relaxed">{h}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Remedies Section */}
            {report.remedies && report.remedies.length > 0 && (
              <div className="rounded-xl border border-[#D4A054]/15 bg-[#D4A054]/[0.03] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#D4A054]" />
                  <h3 className="text-sm font-semibold text-[#D4A054]">Vedic Remedies</h3>
                </div>
                <div className="space-y-3">
                  {report.remedies.map((remedy, ri) => (
                    <div key={ri} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#D4A054]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#D4A054]">{ri + 1}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#F1F0F5] mb-0.5">{remedy.type}</p>
                        <p className="text-xs text-[#ACB8C4] leading-relaxed">{remedy.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-[10px] text-[#A0A5B2] leading-relaxed">
                Generated uniquely for your birth chart using Swiss Ephemeris calculations. Based on classical Jyotish principles (Brihat Parashara Hora Shastra).
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Fixed Bottom Bar ── */}
      {report && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E1A]/95 backdrop-blur-md border-t border-white/5">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                bg-white/5 text-[#ACB8C4] border border-white/5
                hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={() => {
                // Future: generate PDF
                const bd = localStorage.getItem("grahai-onboarding-birthdata")
                if (!bd) return
                const birthData = JSON.parse(bd)
                fetch("/api/reports/generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    birthDetails: {
                      date: birthData.dateOfBirth,
                      time: birthData.timeOfBirth || "12:00",
                      place: birthData.placeOfBirth || "Unknown",
                      latitude: birthData.latitude || 28.6139,
                      longitude: birthData.longitude || 77.209,
                      timezone: birthData.timezone || 5.5,
                    },
                    name: birthData.name || "Native",
                  }),
                })
                  .then(r => r.json())
                  .then(data => {
                    if (data.downloadUrl) window.open(data.downloadUrl, "_blank")
                  })
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
                hover:shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
