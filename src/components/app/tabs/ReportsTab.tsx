"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Briefcase, Gem, TrendingUp, Calendar, BookOpen, Lock, ArrowRight, X, ChevronRight } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { ReportCategoryId } from "@/types/app"

interface ReportItem {
  id: string
  title: string
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
  reports: ReportItem[]
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "love-compatibility",
    title: "Love & Compatibility",
    Icon: Heart,
    color: "text-rose-400",
    reports: [
      {
        id: "love-compat",
        title: "Love & Compatibility",
        description: "Understand your relationship dynamics and compatibility patterns",
        whatItHelps: "Know your romantic strengths, challenges, and ideal partner qualities",
        whatsInside: ["Relationship style analysis", "Compatibility indicators", "Communication patterns", "Emotional needs mapping"],
        pricing: "premium",
        price: 299,
        icon: "💕",
        previewSnippet: "Your Venus placement suggests a deep need for emotional security in relationships. You value loyalty and consistency over excitement.",
      },
      {
        id: "kundli-match",
        title: "Kundli Matching",
        description: "Traditional 36 Guna Milan for marriage compatibility",
        whatItHelps: "Evaluate marriage compatibility with a specific partner",
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
    reports: [
      {
        id: "career-blueprint",
        title: "Career Blueprint",
        description: "See where your chart supports progress and when pressure peaks",
        whatItHelps: "Career direction, timing of promotions, industry alignment",
        whatsInside: ["Career strength analysis", "Industry recommendations", "Promotion windows", "Professional challenges"],
        pricing: "plus",
        icon: "📊",
        previewSnippet: "Your 10th house lord is strong, indicating natural leadership abilities. The current period favors strategic career moves over impulsive changes.",
      },
      {
        id: "job-vs-business",
        title: "Job vs Business",
        description: "Discover whether employment or entrepreneurship suits your chart",
        whatItHelps: "Decision clarity on career path direction",
        whatsInside: ["Entrepreneurial indicators", "Employment stability", "Risk assessment", "Timing recommendations"],
        pricing: "one-time",
        price: 199,
        icon: "⚖️",
      },
    ],
  },
  {
    id: "marriage-timing",
    title: "Marriage Timing",
    Icon: Gem,
    color: "text-purple-400",
    reports: [
      {
        id: "marriage-timing",
        title: "Marriage Timing",
        description: "Yogas, timing windows, and remedies for marriage",
        whatItHelps: "When to expect marriage, what may cause delays, how to improve prospects",
        whatsInside: ["Marriage yoga analysis", "Timing windows", "Delay factors", "Practical remedies"],
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
    reports: [
      {
        id: "annual-forecast",
        title: "Annual Forecast 2026",
        description: "Month-by-month guidance for the year ahead",
        whatItHelps: "Plan your year with chart-aligned timing for major decisions",
        whatsInside: ["Monthly breakdowns", "Key transit impacts", "Best periods for action", "Caution windows"],
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
    reports: [
      {
        id: "wealth-growth",
        title: "Wealth & Growth",
        description: "Your financial patterns and wealth-building windows",
        whatItHelps: "Investment timing, income peaks, financial risk periods",
        whatsInside: ["Wealth yogas", "Income growth periods", "Investment sectors", "Financial caution zones"],
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
    reports: [
      {
        id: "dasha-deep-dive",
        title: "Dasha Deep Dive",
        description: "Understand your current planetary period in detail",
        whatItHelps: "Why certain themes keep repeating and when they shift",
        whatsInside: ["Current Mahadasha analysis", "Antardasha breakdowns", "Life theme mapping", "Transition forecasts"],
        pricing: "premium",
        price: 499,
        icon: "🔮",
        previewSnippet: "You're in a Venus Mahadasha, which brings focus to relationships, creativity, and material comforts. This period emphasizes balance and beauty.",
      },
    ],
  },
]

interface ReportsTabProps {
  onProfileClick: () => void
}

export default function ReportsTab({ onProfileClick }: ReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle="Organized by life outcomes" />

      <div className="px-5 pt-4">
        {/* Report sections */}
        {REPORT_SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.06 }}
            className="mb-6"
          >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <section.Icon className={`w-4 h-4 ${section.color}`} />
              <h2 className="text-sm font-semibold text-[#F1F0F5]">{section.title}</h2>
            </div>

            {/* Report cards */}
            <div className="space-y-2.5">
              {section.reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left bg-[#111827] border border-[#1E293B] rounded-xl p-4
                    hover:border-[#D4A054]/15 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{report.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-[#F1F0F5]">{report.title}</h3>
                        {report.pricing === "free" ? (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                            FREE
                          </span>
                        ) : report.pricing === "one-time" ? (
                          <span className="text-[9px] bg-[#D4A054]/10 text-[#D4A054] px-1.5 py-0.5 rounded font-medium">
                            ₹{report.price}
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-[#5A6478]" />
                        )}
                      </div>
                      <p className="text-xs text-[#5A6478] leading-relaxed">{report.description}</p>
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
            {/* Close button */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B]
                  flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#5A6478]" />
              </button>
              {selectedReport.pricing !== "free" && (
                <span className="text-sm font-semibold text-[#D4A054]">
                  {selectedReport.pricing === "one-time" ? `₹${selectedReport.price}` : "Premium"}
                </span>
              )}
            </div>

            <div className="px-5 pt-4 pb-32">
              {/* Title */}
              <div className="text-center mb-6">
                <span className="text-4xl block mb-3">{selectedReport.icon}</span>
                <h1 className="text-xl font-bold text-[#F1F0F5] mb-2">{selectedReport.title}</h1>
                <p className="text-sm text-[#94A3B8]">{selectedReport.whatItHelps}</p>
              </div>

              {/* What's inside */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">What&apos;s inside</h3>
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
                <div className="bg-[#0D1220] border border-[#D4A054]/10 rounded-xl p-4 mb-4">
                  <p className="text-xs text-[#D4A054] font-medium mb-2">Preview</p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed italic">
                    &ldquo;{selectedReport.previewSnippet}&rdquo;
                  </p>
                </div>
              )}

              {/* FAQ */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">Common questions</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#94A3B8] mb-1">How accurate is this report?</p>
                    <p className="text-xs text-[#5A6478]">Based on classical Jyotish principles and your exact birth data. Accuracy increases with precise birth time.</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#94A3B8] mb-1">Can I get a refund?</p>
                    <p className="text-xs text-[#5A6478]">Yes, within 7 days if you&apos;re not satisfied with the insights.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky unlock button */}
            <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4
              bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/95 to-transparent">
              <button className="w-full py-4 rounded-2xl font-semibold text-sm btn-primary
                flex items-center justify-center gap-2">
                {selectedReport.pricing === "free" ? (
                  "View Report"
                ) : selectedReport.pricing === "one-time" ? (
                  <>Unlock for ₹{selectedReport.price}</>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Upgrade to {selectedReport.pricing === "plus" ? "Plus" : "Premium"}
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
