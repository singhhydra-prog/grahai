"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Heart, Briefcase, Gem, TrendingUp, Calendar, BookOpen,
  Lock, ArrowRight, ChevronRight, Crown, Sparkles,
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import { useLanguage } from "@/lib/LanguageContext"
import type { ReportCategoryId } from "@/types/app"

/* ── Types ────────────────────────────────────────── */
interface ReportCard {
  id: string
  title: string
  subtitle: string
  icon: string
  pricing: "free" | "plus" | "premium"
}

interface ReportCategory {
  id: ReportCategoryId
  heading: string
  accentColor: string
  cards: ReportCard[]
}

/* ── Report catalog (Melooha-style grouped grid) ── */
const REPORT_CATALOG: ReportCategory[] = [
  {
    id: "love-compatibility",
    heading: "The Story of Love",
    accentColor: "bg-rose-500",
    cards: [
      { id: "love-compat", title: "Love Navigator", subtitle: "Your style and strengths in romance", icon: "💕", pricing: "free" },
      { id: "kundli-match", title: "Kundli Match", subtitle: "36 Guna Milan & dosha analysis", icon: "💍", pricing: "free" },
    ],
  },
  {
    id: "career-blueprint",
    heading: "Plan Your Professional Roadmap",
    accentColor: "bg-amber-500",
    cards: [
      { id: "career-blueprint", title: "Career Blueprint", subtitle: "Career growth for your chart", icon: "📊", pricing: "free" },
    ],
  },
  {
    id: "marriage-timing",
    heading: "Everything About Your Marriage",
    accentColor: "bg-[#D4A054]",
    cards: [
      { id: "marriage-timing", title: "Marriage Timing", subtitle: "When & how marriage manifests", icon: "🗓️", pricing: "free" },
    ],
  },
  {
    id: "annual-forecast",
    heading: "Understand Yourself",
    accentColor: "bg-teal-500",
    cards: [
      { id: "annual-forecast", title: "Annual 2026", subtitle: "Month-by-month cosmic map", icon: "📅", pricing: "free" },
      { id: "dasha-deep-dive", title: "Dasha Deep Dive", subtitle: "Your planetary period life map", icon: "🔮", pricing: "free" },
    ],
  },
  {
    id: "wealth-growth",
    heading: "Get Rich and Prosper",
    accentColor: "bg-emerald-500",
    cards: [
      { id: "wealth-growth", title: "Wealth & Growth", subtitle: "Quick wealth creation insights", icon: "💰", pricing: "free" },
    ],
  },
]

/* ── Component ─────────────────────────────────────── */
interface ReportsTabProps {
  onProfileClick: () => void
  onPricingClick: () => void
  onAskQuestion: (q: string) => void
}

export default function ReportsTab({ onProfileClick, onPricingClick }: ReportsTabProps) {
  const { t } = useLanguage()
  const [reportsLeft, setReportsLeft] = useState(0)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    try {
      const r = localStorage.getItem("grahai-reports-left")
      if (r) setReportsLeft(parseInt(r))
      const n = localStorage.getItem("userNameForGreeting")
      if (n) setUserName(n)
    } catch {}
  }, [])

  return (
    <div className="min-h-full pb-32">
      <AppHeader onProfileClick={onProfileClick} subtitle={t.reports.subtitle} />

      <div className="px-5 pt-2">
        {/* User header strip */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#D4A054]/10 border border-[#D4A054]/30 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#D4A054]">
              {userName ? userName.substring(0, 2).toUpperCase() : "U"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#F1F0F5]">{userName || "Your"} Reports</p>
            <p className="text-[10px] text-[#A0AAB8]">Personalized Vedic analysis</p>
          </div>
          <button
            onClick={onPricingClick}
            className="flex items-center gap-1.5 text-[10px] text-[#A0AAB8] bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
          >
            <BookOpen className="w-3 h-3" />
            All reports
          </button>
        </div>

        {/* Category sections with 2-column card grid */}
        {REPORT_CATALOG.map((cat, ci) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.06 }}
            className="mb-6"
          >
            {/* Category heading with accent line */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-1 h-5 rounded-full ${cat.accentColor}`} />
              <h2 className="text-sm font-bold text-[#F1F0F5]">{cat.heading}</h2>
            </div>

            {/* 2-column card grid */}
            <div className="grid grid-cols-2 gap-3">
              {cat.cards.map((card, cardi) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: ci * 0.06 + cardi * 0.04 }}
                  onClick={() => window.open(`/report?id=${card.id}`, "_blank")}
                  className="relative text-left rounded-xl border border-white/5 bg-white/[0.02]
                    p-4 flex flex-col justify-between min-h-[180px]
                    hover:border-[#D4A054]/20 transition-all press-scale"
                >
                  {/* Title + subtitle */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#F1F0F5] mb-1 leading-tight">{card.title}</h3>
                    <p className="text-[10px] text-[#A0AAB8] leading-relaxed">{card.subtitle}</p>
                  </div>

                  {/* Large icon centered */}
                  <div className="flex items-center justify-center py-4">
                    <span className="text-4xl opacity-30">{card.icon}</span>
                  </div>

                  {/* Bottom: pricing badge + arrow */}
                  <div className="flex items-center justify-between">
                    {card.pricing === "free" ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Free
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#A0AAB8]" />
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-[#A0AAB8]" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Vedic decorative divider */}
        <div className="flex items-center justify-center gap-3 my-4 opacity-30">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A054]/30" />
          <Sparkles className="w-4 h-4 text-[#D4A054]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A054]/30" />
        </div>

        {/* Bottom placeholder for spacing above sticky bar */}
        <div className="h-4" />
      </div>

      {/* ── Sticky bottom bar: reports balance + buy CTA ── */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#0A0E1A]/95 backdrop-blur-md border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[#A0AAB8]" />
            </div>
            <span className="text-xs text-[#A0AAB8]">{reportsLeft} Report{reportsLeft !== 1 ? "s" : ""} left</span>
          </div>
          <button
            onClick={onPricingClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
              bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
              hover:shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            Buy Reports
          </button>
        </div>
      </div>
    </div>
  )
}
