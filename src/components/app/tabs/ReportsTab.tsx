"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Lock, ChevronRight, Sparkles } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import SectionHeader from "@/components/ui/SectionHeader"
import ReportCard from "@/components/ui/ReportCard"
import type { LifeArea, Report, TabType } from "@/types/app"

/* ═══ Report Data ═══ */
const LIFE_AREAS: LifeArea[] = [
  {
    id: "general",
    label: "General Forecast",
    icon: "🌟",
    color: "magenta",
    reports: [
      {
        id: "yearly-forecast",
        title: "General Forecast Report",
        subtitle: "Embark on a journey of self-discovery with your personalized yearly forecast",
        description: "Comprehensive yearly overview based on your natal chart, current transits, and dasha periods.",
        icon: "🌟",
        isFree: true,
        validityDays: 365,
        sections: [
          { title: "Overall Theme", content: "" },
          { title: "Key Months", content: "" },
          { title: "Opportunities", content: "" },
          { title: "Challenges", content: "" },
        ],
      },
    ],
  },
  {
    id: "career",
    label: "Career & Work",
    icon: "💼",
    color: "cyan",
    reports: [
      {
        id: "career-forecast",
        title: "Career Report",
        subtitle: "Professional growth insights for the next 12 months",
        description: "Detailed career analysis based on your 10th house, Dashamsha chart, and current Mahadasha.",
        icon: "💼",
        isFree: false,
        price: 199,
        validityDays: 365,
      },
      {
        id: "business-muhurta",
        title: "Business Muhurta",
        subtitle: "Best times to launch or make key business decisions",
        description: "Auspicious timing analysis for business ventures.",
        icon: "📊",
        isFree: false,
        price: 149,
        validityDays: 90,
      },
    ],
  },
  {
    id: "love",
    label: "Love & Relationships",
    icon: "💜",
    color: "violet",
    reports: [
      {
        id: "relationship-forecast",
        title: "Relationship Report",
        subtitle: "Insights into love, marriage prospects, and compatibility",
        description: "Analysis of your 7th house, Venus placement, and Navamsha chart.",
        icon: "💜",
        isFree: false,
        price: 199,
        validityDays: 365,
      },
      {
        id: "compatibility",
        title: "Compatibility Analysis",
        subtitle: "Kundli matching with detailed Guna Milan",
        description: "36-point Guna matching and dosha analysis.",
        icon: "💕",
        isFree: false,
        price: 249,
      },
    ],
  },
  {
    id: "health",
    label: "Health",
    icon: "🧘",
    color: "success",
    reports: [
      {
        id: "health-report",
        title: "Health Report",
        subtitle: "Guidance for your wellbeing over the next year",
        description: "Health tendencies based on your 6th house, Ascendant, and planetary periods.",
        icon: "🧘",
        isFree: false,
        price: 149,
        validityDays: 365,
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: "📚",
    color: "gold",
    reports: [
      {
        id: "education-report",
        title: "Education Report",
        subtitle: "Academic guidance for the next 2 years",
        description: "Education prospects based on your 4th and 5th house analysis.",
        icon: "📚",
        isFree: false,
        price: 149,
        validityDays: 730,
      },
    ],
  },
  {
    id: "wealth",
    label: "Wealth & Finance",
    icon: "💰",
    color: "gold",
    reports: [
      {
        id: "wealth-report",
        title: "Wealth Report",
        subtitle: "Financial prospects and investment timing",
        description: "Analysis of your 2nd and 11th houses with Dhana yoga assessment.",
        icon: "💰",
        isFree: false,
        price: 199,
        validityDays: 365,
      },
    ],
  },
]

interface ReportsTabProps {
  onTabChange: (tab: TabType) => void
}

export default function ReportsTab({ onTabChange }: ReportsTabProps) {
  const [hasBirthData, setHasBirthData] = useState(false)
  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      setHasBirthData(!!stored)
    } catch {}
  }, [])

  const freeReports = LIFE_AREAS.flatMap((a) => a.reports).filter((r) => r.isFree)
  const lockedReports = LIFE_AREAS.flatMap((a) => a.reports).filter((r) => !r.isFree)

  if (!hasBirthData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-24">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-lg font-semibold text-text mb-2">Your reports await</h2>
        <p className="text-sm text-text-dim mb-6 max-w-xs">
          Add your birth details to unlock personalized astrological reports tailored to your chart.
        </p>
        <button onClick={() => onTabChange("profile")} className="btn-primary px-6 py-2.5 text-sm">
          Add Birth Details
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full px-4 pt-3 pb-24 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {selectedArea ? (
          /* ═══ Area Detail View ═══ */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSelectedArea(null)}
              className="flex items-center gap-1.5 text-sm text-text-dim mb-4 hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Reports
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center text-2xl">
                {selectedArea.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text">{selectedArea.label}</h2>
                <p className="text-xs text-text-dim">
                  {selectedArea.reports.length} report{selectedArea.reports.length > 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedArea.reports.map((report, i) => (
                <ReportCard
                  key={report.id}
                  title={report.title}
                  subtitle={report.subtitle}
                  icon={report.icon}
                  isFree={report.isFree}
                  validity={report.validityDays ? `${Math.round(report.validityDays / 365)} Year` : undefined}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* ═══ Main Reports View ═══ */
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-lg font-bold text-text mb-1">Your Reports</h1>
            <p className="text-xs text-text-dim mb-5">Personalized insights based on your birth chart</p>

            {/* Free reports */}
            <SectionHeader
              title={`Your Reports (${freeReports.length})`}
              subtitle="Available now"
            />
            <div className="space-y-3 mb-6">
              {freeReports.map((report, i) => (
                <ReportCard
                  key={report.id}
                  title={report.title}
                  subtitle={report.subtitle}
                  icon={report.icon}
                  isFree={report.isFree}
                  validity={report.validityDays ? `1 Year` : undefined}
                  delay={i * 0.08}
                />
              ))}
            </div>

            {/* Locked reports by area */}
            <SectionHeader
              title={`Locked Reports (${lockedReports.length})`}
              subtitle="Unlock with Plus or Premium plan"
            />
            <div className="space-y-2 mb-6">
              {LIFE_AREAS.filter((a) => a.reports.some((r) => !r.isFree)).map((area, i) => (
                <GlassCard
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  delay={0.1 + i * 0.06}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center text-xl">
                    {area.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text">{area.label}</h3>
                    <p className="text-xs text-text-dim">
                      {area.reports.filter((r) => !r.isFree).length} report{area.reports.filter((r) => !r.isFree).length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-dim" />
                </GlassCard>
              ))}
            </div>

            {/* Upgrade CTA */}
            <GlassCard glow="magenta" className="text-center">
              <Sparkles className="w-5 h-5 text-magenta mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-text mb-1">Unlock all reports</h3>
              <p className="text-xs text-text-dim mb-3">
                Get unlimited access to all {lockedReports.length} premium reports with Plus
              </p>
              <button className="btn-primary px-5 py-2 text-sm">
                Upgrade to Plus · ₹199/mo
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
