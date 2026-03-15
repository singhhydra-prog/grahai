"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Briefcase, Gem, TrendingUp, Calendar, BookOpen, Lock, ArrowRight, X, ChevronRight, Download, Loader2, Sparkles } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import { useLanguage } from "@/lib/LanguageContext"
import type { ReportCategoryId } from "@/types/app"

interface ReportItem {
  id: string
  title: string
  outcome: string          // what life outcome it addresses
  description: string
  whatItHelps: string
  whatsInside: string[]
  pricing: "free" | "plus" | "premium" | "one-time"
  price?: number
  previewSnippet?: string
  icon: string
}

interface ReportSection {
  id: ReportCategoryId
  title: string
  Icon: typeof Heart
  color: string
  bgColor: string
  reports: ReportItem[]
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "love-compatibility",
    title: "Love & Compatibility",
    Icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    reports: [
      {
        id: "love-compat",
        title: "Love & Compatibility",
        outcome: "Understand your relationship dynamics",
        description: "Why certain patterns keep showing up in your relationships, what creates closeness, and what creates strain.",
        whatItHelps: "Know your romantic strengths, challenges, and ideal partner qualities",
        whatsInside: ["Relationship style from Venus & 7th house", "Compatibility indicators", "Communication patterns", "What creates closeness vs strain"],
        pricing: "premium",
        price: 299,
        icon: "💕",
        previewSnippet: "Your Venus placement suggests a deep need for emotional security. You value loyalty and consistency over excitement — and your chart shows why.",
      },
      {
        id: "kundli-match",
        title: "Kundli Matching",
        outcome: "Evaluate marriage compatibility",
        description: "Traditional 36 Guna Milan with dosha analysis and remedies for a specific partner.",
        whatItHelps: "Marriage compatibility score with detailed breakdowns",
        whatsInside: ["36 Guna score", "Manglik analysis", "Dasha compatibility", "Remedies for doshas"],
        pricing: "one-time",
        price: 499,
        icon: "💍",
      },
    ],
  },
  {
    id: "career-blueprint",
    title: "Career Blueprint",
    Icon: Briefcase,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    reports: [
      {
        id: "career-blueprint",
        title: "Career Blueprint",
        outcome: "Find your professional direction",
        description: "Where your chart supports progress, when pressure peaks, and what industries align with your planetary strengths.",
        whatItHelps: "Career direction, promotion timing, industry alignment",
        whatsInside: ["10th house & Dasamsa analysis", "Industry recommendations", "Promotion windows", "Best timing for career moves"],
        pricing: "plus",
        icon: "📊",
        previewSnippet: "Your 10th house lord is strong, indicating natural leadership. The current dasha favors strategic career moves over impulsive changes.",
      },
    ],
  },
  {
    id: "marriage-timing",
    title: "Marriage Timing",
    Icon: Gem,
    color: "text-[#D4A054]",
    bgColor: "bg-[#D4A054]/10",
    reports: [
      {
        id: "marriage-timing",
        title: "Marriage Timing",
        outcome: "Know when you're ready",
        description: "Readiness indicators, timing windows, what may cause delays, and practical remedies.",
        whatItHelps: "When to expect marriage, blockers, quality of the timing window",
        whatsInside: ["7th house yoga analysis", "Timing windows from Dasha", "Delay factors & doshas", "Practical remedies"],
        pricing: "premium",
        price: 399,
        icon: "🗓️",
        previewSnippet: "Your 7th house analysis shows a favorable period approaching. Key transits in the next 18 months create strong marriage indications.",
      },
    ],
  },
  {
    id: "annual-forecast",
    title: "Annual Forecast",
    Icon: Calendar,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    reports: [
      {
        id: "annual-forecast",
        title: "Annual Forecast 2026",
        outcome: "Plan your year with confidence",
        description: "Month-by-month guidance so you know when to push, when to pause, and when big shifts are likely.",
        whatItHelps: "Plan your year with chart-aligned timing",
        whatsInside: ["Monthly transit impacts", "Best periods for major decisions", "Caution windows", "Key planetary shifts"],
        pricing: "premium",
        price: 599,
        icon: "📅",
      },
    ],
  },
  {
    id: "wealth-growth",
    title: "Wealth & Growth Cycle",
    Icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    reports: [
      {
        id: "wealth-growth",
        title: "Wealth & Growth",
        outcome: "Understand your financial patterns",
        description: "Your natural wealth-building strengths, when income peaks, and which financial risks your chart supports.",
        whatItHelps: "Investment timing, income peaks, financial risk periods",
        whatsInside: ["Wealth yogas (Dhan yoga, Lakshmi yoga)", "Income growth periods", "Investment sectors", "Financial caution zones"],
        pricing: "plus",
        icon: "💰",
      },
    ],
  },
  {
    id: "dasha-deep-dive",
    title: "Dasha Deep Dive",
    Icon: BookOpen,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    reports: [
      {
        id: "dasha-deep-dive",
        title: "Dasha Deep Dive",
        outcome: "Why certain themes keep repeating",
        description: "Understand your current planetary period in detail — what it's activating, when it shifts, and how to work with it.",
        whatItHelps: "Clarity on recurring life themes and when they change",
        whatsInside: ["Current Mahadasha analysis", "Antardasha breakdowns", "Life theme mapping", "Transition forecasts"],
        pricing: "premium",
        price: 499,
        icon: "🔮",
        previewSnippet: "You're in a Venus Mahadasha, bringing focus to relationships, creativity, and material comfort. This period rewards patience over force.",
      },
    ],
  },
]

interface ReportsTabProps {
  onProfileClick: () => void
  onPricingClick: () => void
  onAskQuestion: (q: string) => void
}

export default function ReportsTab({ onProfileClick, onPricingClick, onAskQuestion }: ReportsTabProps) {
  const { t } = useLanguage()
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [generating, setGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)

  const handleUnlock = async (report: ReportItem) => {
    if (report.pricing === "free") {
      await handleGenerate()
      return
    }
    onPricingClick()
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError(null)
    setDownloadUrl(null)

    try {
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (!bd) {
        setGenError(t.reports.completeFirst)
        setGenerating(false)
        return
      }

      const birthData = JSON.parse(bd)
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDetails: {
            date: birthData.dateOfBirth,
            time: birthData.timeOfBirth || "12:00",
            place: birthData.placeOfBirth || "Unknown",
            latitude: 28.6139,
            longitude: 77.209,
            timezone: 5.5,
          },
          name: birthData.name || "Native",
        }),
      })

      const data = await res.json()
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl)
      } else {
        setGenError(data.error || t.reports.tryAgain)
      }
    } catch {
      setGenError(t.reports.tryAgain)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle={t.reports.subtitle} />

      <div className="px-5 pt-4">
        {/* Intro text */}
        <p className="text-xs text-[#5A6478] mb-5 leading-relaxed">
          {t.reports.intro}
        </p>

        {/* Report sections */}
        {REPORT_SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.05 }}
            className="mb-5"
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-7 h-7 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                <section.Icon className={`w-3.5 h-3.5 ${section.color}`} />
              </div>
              <h2 className="text-sm font-semibold text-[#F1F0F5]">{section.title}</h2>
            </div>

            {/* Report cards */}
            <div className="space-y-2.5">
              {section.reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => {
                    // Open dedicated report detail page
                    window.open(`/report?id=${report.id}`, "_blank")
                  }}
                  className="w-full text-left glass-card card-lift p-4 hover:border-[#D4A054]/15 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{report.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-[#F1F0F5]">{report.title}</h3>
                        {report.pricing === "free" ? (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">{t.reports.free}</span>
                        ) : report.pricing === "one-time" ? (
                          <span className="text-[9px] bg-[#D4A054]/10 text-[#D4A054] px-1.5 py-0.5 rounded font-medium">₹{report.price}</span>
                        ) : (
                          <Lock className="w-3 h-3 text-[#5A6478]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#D4A054]/70 font-medium mb-1">{report.outcome}</p>
                      <p className="text-xs text-[#5A6478] leading-relaxed line-clamp-2">{report.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5A6478] shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Report Detail Overlay ═══ */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0E1A] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#5A6478]" />
              </button>
              {selectedReport.pricing !== "free" && (
                <span className="text-sm font-semibold text-[#D4A054]">
                  {selectedReport.pricing === "one-time" ? `₹${selectedReport.price}` : selectedReport.pricing === "plus" ? t.reports.plus : t.reports.premium}
                </span>
              )}
            </div>

            <div className="px-5 pt-4 pb-32">
              <div className="text-center mb-6">
                <span className="text-4xl block mb-3">{selectedReport.icon}</span>
                <h1 className="text-xl font-bold text-[#F1F0F5] mb-1">{selectedReport.title}</h1>
                <p className="text-sm text-[#D4A054]/80 font-medium mb-2">{selectedReport.outcome}</p>
                <p className="text-sm text-[#94A3B8]">{selectedReport.whatItHelps}</p>
              </div>

              {/* What's inside */}
              <div className="glass-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">{t.reports.whatsInside}</h3>
                <div className="space-y-2">
                  {selectedReport.whatsInside.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A054]" />
                      <span className="text-sm text-[#94A3B8]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview snippet */}
              {selectedReport.previewSnippet && (
                <div className="glass-inner border border-[#D4A054]/10 rounded-xl p-4 mb-4">
                  <p className="text-xs text-[#D4A054] font-medium mb-2">{t.reports.preview || "Preview"}</p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed italic">
                    &ldquo;{selectedReport.previewSnippet}&rdquo;
                  </p>
                </div>
              )}

              {/* Ask AI shortcut */}
              <button
                onClick={() => { onAskQuestion(`Tell me about my ${selectedReport.title.toLowerCase()} based on my birth chart`); setSelectedReport(null) }}
                className="w-full flex items-center gap-3 glass-card-hero px-4 py-3.5 mb-4 hover:border-[#D4A054]/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#D4A054]" />
                <span className="text-sm text-[#94A3B8] flex-1">{t.reports.askAboutTopic}</span>
                <ArrowRight className="w-4 h-4 text-[#5A6478]" />
              </button>

              {downloadUrl && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4 text-center">
                  <p className="text-sm text-emerald-400 font-medium mb-2">{t.reports.ready}</p>
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg text-sm text-emerald-400 font-medium">
                    <Download className="w-4 h-4" />{t.reports.downloadPdf}
                  </a>
                </motion.div>
              )}

              {genError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-4 text-center">
                  <p className="text-sm text-rose-400">{t.common.error || genError}</p>
                </div>
              )}
            </div>

            {/* Sticky unlock button */}
            <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4
              bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/95 to-transparent">
              <button
                onClick={() => handleUnlock(selectedReport)}
                disabled={generating}
                className="w-full py-4 rounded-2xl font-semibold text-sm btn-primary
                  flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{t.reports.generating}</>
                ) : downloadUrl ? (
                  <><Download className="w-4 h-4" />{t.reports.downloadReport}</>
                ) : selectedReport.pricing === "free" ? (
                  <>{t.reports.generateReport}<ArrowRight className="w-4 h-4" /></>
                ) : selectedReport.pricing === "one-time" ? (
                  <>{t.reports.unlockFor} ₹{selectedReport.price}<ArrowRight className="w-4 h-4" /></>
                ) : (
                  <><Lock className="w-4 h-4" />{t.reports.upgradeTo} {selectedReport.pricing === "plus" ? t.reports.plus : t.reports.premium}<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
