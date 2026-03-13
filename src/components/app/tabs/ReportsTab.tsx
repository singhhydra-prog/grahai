"use client"

import { motion } from "framer-motion"
import {
  Briefcase,
  Heart,
  Calendar,
  TrendingUp,
  BookOpen,
  Gem,
  Star,
  ArrowRight,
} from "lucide-react"
import type { OverlayType } from "@/types/app"

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface MarketplaceReport {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  whoFor: string
  includes: string[]
  price: string
  priceNote?: string
  color: string
  bgGradient: string
  isMostPopular?: boolean
  isFree?: boolean
}

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const REPORTS_MARKETPLACE: MarketplaceReport[] = [
  {
    id: "career-blueprint",
    icon: <Briefcase className="w-6 h-6" />,
    title: "Career Blueprint",
    subtitle: "₹299",
    description: "Find your ideal career path, promotion windows, and business timing based on your 10th house and Dasha periods",
    whoFor: "Career seekers",
    includes: ["10th house analysis", "Dasha career timeline", "Promotion windows"],
    price: "₹299",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "love-compatibility",
    icon: <Heart className="w-6 h-6" />,
    title: "Love Compatibility",
    subtitle: "₹249",
    description: "Deep Ashtakoot analysis plus Bhakoot, Nadi, and Mangal Dosha cross-check with remedies",
    whoFor: "Couples & seekers",
    includes: ["36-point Guna score", "Mangal Dosha check", "Nakshatra matching"],
    price: "₹249",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/10",
  },
  {
    id: "marriage-timing",
    icon: <Calendar className="w-6 h-6" />,
    title: "Marriage Timing",
    subtitle: "₹349",
    description: "When will you marry? Precise Dasha + transit windows for marriage, with Muhurta guidance",
    whoFor: "Couples planning",
    includes: ["7th house analysis", "Venus Dasha timing", "Transit windows"],
    price: "₹349",
    color: "text-rose-400",
    bgGradient: "from-rose-500/20 to-pink-500/10",
    isMostPopular: true,
  },
  {
    id: "annual-forecast",
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Annual Forecast 2026",
    subtitle: "₹399",
    description: "Month-by-month predictions for career, health, love, and finance based on your exact Dasha + transits",
    whoFor: "Annual planners",
    includes: ["12-month forecast", "Key decision windows", "Cautions & remedies"],
    price: "₹399",
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "dasha-deep-dive",
    icon: <BookOpen className="w-6 h-6" />,
    title: "Dasha Deep Dive",
    subtitle: "₹199",
    description: "Understand your current planetary period — what it activates, what to expect, and how to navigate it",
    whoFor: "Life transitions",
    includes: ["Mahadasha analysis", "Antardasha breakdown", "Practical guidance"],
    price: "₹199",
    color: "text-indigo-400",
    bgGradient: "from-indigo-500/20 to-blue-500/10",
  },
  {
    id: "remedies-guide",
    icon: <Gem className="w-6 h-6" />,
    title: "Remedies Guide",
    subtitle: "Free with Plus / ₹149",
    description: "Personalized remedies based on your chart — mantras, gemstones, donations, and daily practices",
    whoFor: "Solution seekers",
    includes: ["Dosha remedies", "Planet-specific mantras", "Gemstone recommendations"],
    price: "₹149",
    priceNote: "Free with Plus",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    isFree: true,
  },
]

// ═══════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════

export default function ReportsTab({
  onShowOverlay,
}: {
  onShowOverlay: (o: OverlayType) => void
}) {
  return (
    <div className="overflow-y-auto px-4 pt-6 pb-24">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Guidance Reports</h2>
        <p className="text-xs text-white/50 font-hindi mb-3">
          गहन मार्गदर्शन — Personalized insights backed by classical Jyotish
        </p>
        <p className="text-sm text-white/40 leading-relaxed max-w-2xl">
          Each report solves a specific life question with executive summary, key themes, decision windows, cautions, and remedies rooted in Vedic wisdom.
        </p>
      </div>

      {/* Report Cards - Full Width with Stagger */}
      <div className="space-y-4">
        {REPORTS_MARKETPLACE.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4, ease: "easeOut" }}
          >
            <ReportCard report={report} onShowOverlay={onShowOverlay} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// REPORT CARD COMPONENT
// ═══════════════════════════════════════════════════

function ReportCard({
  report,
  onShowOverlay,
}: {
  report: MarketplaceReport
  onShowOverlay: (o: OverlayType) => void
}) {
  return (
    <motion.button
      onClick={() => onShowOverlay("pricing")}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="block w-full text-left rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 transition-all hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.06] hover:to-white/[0.02] group"
      aria-label={`${report.title} report for ${report.whoFor}`}
    >
      {/* Top Section: Icon + Title + Badge Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${report.bgGradient} flex items-center justify-center flex-shrink-0 border border-white/10`}
          >
            <div className={report.color}>{report.icon}</div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-white transition-colors">
              {report.title}
            </h3>
            <p className="text-xs text-white/40 line-clamp-2">
              {report.description}
            </p>
          </div>
        </div>

        {/* Badges: Most Popular / Free */}
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          {report.isMostPopular && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-300">Most Popular</span>
            </div>
          )}
          {report.isFree && (
            <div className="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30">
              <span className="text-xs font-bold text-green-300">Free with Plus</span>
            </div>
          )}
        </div>
      </div>

      {/* Problem Solved Section */}
      <div className="mb-4 pb-4 border-b border-white/5">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
          Solves
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* What's Included - 3 Bullet Points */}
      <div className="mb-4">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5">
          Includes
        </p>
        <ul className="space-y-1.5">
          {report.includes.map((item, idx) => (
            <li
              key={idx}
              className="text-xs text-white/50 flex items-start gap-2.5"
            >
              <span className={`${report.color} font-bold mt-0.5 flex-shrink-0`}>
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best For Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-white/40 font-bold uppercase tracking-widest">
          Best for:
        </span>
        <span className="inline-block px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs text-white/70 font-medium">
          {report.whoFor}
        </span>
      </div>

      {/* Footer: Price + CTA Button */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${report.color}`}>
            {report.price}
          </span>
          {report.priceNote && (
            <span className="text-xs text-green-400/80 font-medium">
              {report.priceNote}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          whileHover={{ x: 4 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap
            ${
              report.isMostPopular
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0e1a] hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20"
                : "bg-gradient-to-r from-white/10 to-white/5 text-white/80 hover:from-white/15 hover:to-white/10 border border-white/10"
            }
          `}
        >
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      </div>
    </motion.button>
  )
}
