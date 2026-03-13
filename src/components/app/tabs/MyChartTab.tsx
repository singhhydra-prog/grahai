"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  FileText,
  Loader2,
  Sparkles,
  Moon,
  Sun,
  Star,
  TrendingUp,
  Briefcase,
  Gem,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Zap,
  ArrowRight,
  BookOpen,
  Sunrise,
  Info,
} from "lucide-react"
import type { TabType, OverlayType } from "@/types/app"

// ═══════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════

export interface PlanetPlacement {
  name: string
  shortName: string
  sign: string
  signIndex: number
  house: number
  degree: number
  nakshatra: string
  nakshatraPada: number
  retrograde: boolean
  dignity: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"
  symbol: string
  color: string
}

export interface YogaInfo {
  name: string
  nameSanskrit: string
  type: "raja" | "dhana" | "arishta" | "pancha_mahapurusha" | "other"
  effect: string
  strength: "strong" | "moderate" | "weak"
  classicalRef: string
}

export interface DoshaInfo {
  name: string
  severity: "mild" | "moderate" | "severe"
  remedy: string
}

export interface DashaInfo {
  planet: string
  start: string
  end: string
  subPlanet: string | null
  subStart: string | null
  subEnd: string | null
}

export interface ChartData {
  moonSign: string
  sunSign: string
  lagna: string
  lagnaArabic: number
  nakshatra: string
  nakshatraLord: string
  nakshatraDeity: string
  nakshatraSymbol: string
  nakshatraGana: string
  nakshatraQualities: string[]
  nakshatraDescription: string
  planets: PlanetPlacement[]
  yogas: YogaInfo[]
  doshas: DoshaInfo[]
  currentDasha: DashaInfo | null
  summary: string
  computedAt: string
}

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════

const DIGNITY_BADGE_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  exalted: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "↑" },
  own: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "★" },
  friend: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "♦" },
  neutral: { bg: "bg-white/10", text: "text-white/40", icon: "●" },
  enemy: { bg: "bg-orange-500/20", text: "text-orange-400", icon: "▼" },
  debilitated: { bg: "bg-red-500/20", text: "text-red-400", icon: "↓" },
}

const YOGA_TYPE_COLORS: Record<string, { badge: string; icon: string }> = {
  raja: { badge: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "👑" },
  dhana: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: "💰" },
  arishta: { badge: "bg-red-500/20 text-red-400 border-red-500/30", icon: "⚠" },
  pancha_mahapurusha: {
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: "✨",
  },
  other: { badge: "bg-white/10 text-white/50 border-white/20", icon: "◆" },
}

const DOSHA_SEVERITY_COLORS: Record<string, string> = {
  mild: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  moderate: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  severe: "bg-red-500/15 text-red-400 border-red-500/30",
}

// ═══════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════

interface MyChartTabProps {
  onShowKundli: () => void
  onShowOverlay: (o: OverlayType) => void
  onTabChange: (t: TabType) => void
}

export default function MyChartTab({
  onShowKundli,
  onShowOverlay,
  onTabChange,
}: MyChartTabProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [cosmicSnapshot, setCosmicSnapshot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("grahai-chart-data")
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (saved) {
        setChartData(JSON.parse(saved) as ChartData)
      }
      if (snap) {
        setCosmicSnapshot(JSON.parse(snap))
      }
    } catch (e) {
      console.error("Failed to load chart data:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    )
  }

  // Empty state
  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center"
        >
          <Moon className="w-10 h-10 text-amber-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white/90 mb-2">
            Your cosmic blueprint awaits
          </h2>
          <p className="text-sm text-white/60 max-w-xs">
            Generate your Kundli to discover your Moon sign, Nakshatra, planetary placements,
            and the themes shaping your life.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onShowKundli}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-[#0a0e1a] hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg hover:shadow-amber-500/20"
        >
          <Sparkles className="w-4 h-4" />
          Generate My Kundli
        </motion.button>
      </div>
    )
  }

  // Mock strengths and sensitivities
  const strengths = [
    "Intuitive decision-making",
    "Natural charisma and influence",
    "Quick learning ability",
  ]
  const sensitivities = [
    "Tendency to overthink",
    "Emotional sensitivity in relationships",
    "Need for external validation",
  ]

  // Mock transit info
  const transitInfo =
    cosmicSnapshot?.currentTransits ||
    "Your planets are moving through favorable phases. Focus on areas where positive shifts are occurring."

  // Mock life patterns
  const lifePatterns = {
    relationships: "Venus influence suggests deep emotional connections and loyalty.",
    career: "Mercury and Jupiter combination indicates communication skills and opportunity.",
    money: "Financial growth potential with strategic planning and patience.",
    emotional: "Moon position shows emotional depth and need for security.",
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  return (
    <motion.div
      className="overflow-y-auto h-full px-4 pt-4 pb-6 bg-[#050810]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">My Chart</h1>
        <p className="text-xs text-white/40 font-hindi mt-0.5">मेरी कुंडली</p>
      </motion.div>

      {/* 1. Top Summary Card - Hero Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 backdrop-blur-sm">
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-6">
            Your Cosmic Identity
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Moon Sign",
                value: chartData.moonSign,
                icon: <Moon className="w-5 h-5 text-blue-300" />,
              },
              {
                label: "Lagna",
                value: chartData.lagna,
                icon: <Sunrise className="w-5 h-5 text-amber-400" />,
              },
              {
                label: "Nakshatra",
                value: chartData.nakshatra,
                icon: <Star className="w-5 h-5 text-purple-300" />,
              },
              {
                label: "Dasha",
                value: chartData.currentDasha?.planet || "—",
                icon: <Clock className="w-5 h-5 text-indigo-400" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="text-lg font-bold text-white/90 mb-0.5">{item.value}</p>
                <p className="text-xs text-white/60">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 2. Your Recurring Themes - Strengths & Sensitivities */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-6 px-1">
          Your Recurring Themes
        </h2>

        {/* Strengths */}
        <div className="mb-6">
          <p className="text-xs text-white/60 font-semibold mb-3 px-1">Strengths</p>
          <div className="space-y-2">
            {strengths.map((strength, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] p-4 hover:bg-emerald-500/[0.08] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">{strength}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sensitivities */}
        <div>
          <p className="text-xs text-white/60 font-semibold mb-3 px-1">Sensitivities</p>
          <div className="space-y-2">
            {sensitivities.map((sensitivity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-lg border border-amber-500/15 bg-amber-500/[0.05] p-4 hover:bg-amber-500/[0.08] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">{sensitivity}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Current Active Energies */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Current Active Energies
            </h2>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">{transitInfo}</p>
          {chartData.currentDasha && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2 font-semibold">Active Dasha Period</p>
              <p className="text-sm font-semibold text-white/90">
                {chartData.currentDasha.planet}
                {chartData.currentDasha.subPlanet && ` (in ${chartData.currentDasha.subPlanet})`}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Life Map - 2x2 Grid Cards */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 px-1">
          Life Map
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: "Relationships",
              pattern: lifePatterns.relationships,
              icon: <Heart className="w-5 h-5" />,
            },
            {
              title: "Career",
              pattern: lifePatterns.career,
              icon: <Briefcase className="w-5 h-5" />,
            },
            {
              title: "Money",
              pattern: lifePatterns.money,
              icon: <TrendingUp className="w-5 h-5" />,
            },
            {
              title: "Emotional",
              pattern: lifePatterns.emotional,
              icon: <Gem className="w-5 h-5" />,
            },
          ].map((card, i) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              onClick={() => onTabChange("ask")}
              role="button"
              aria-label={`Ask about ${card.title}`}
              className="rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/15 p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-amber-400">{card.icon}</span>
                <p className="text-sm font-bold text-white/90 flex-1">{card.title}</p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-3">{card.pattern}</p>
              <div className="flex items-center text-amber-400/60 group-hover:text-amber-400 transition-colors">
                <span className="text-xs font-semibold">Ask about this</span>
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 5. Learn Your Chart - with Advanced Toggle */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Learn Your Chart
              </h2>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              aria-expanded={showAdvanced}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-all border border-white/10 hover:border-white/20"
            >
              {showAdvanced ? "Hide" : "Show"}
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Simple Mode - Always Show */}
          <div className="space-y-4 pb-4 border-b border-white/10">
            <div>
              <p className="text-xs text-white/50 font-semibold mb-2">Your Moon Sign</p>
              <p className="text-sm text-white/80 leading-relaxed">
                {chartData.moonSign} is your emotional nature. This sign governs your inner world,
                needs, and how you process feelings.
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-semibold mb-2">Your Lagna (Ascendant)</p>
              <p className="text-sm text-white/80 leading-relaxed">
                {chartData.lagna} is how the world sees you. It shapes your appearance, demeanor,
                and first impressions.
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-semibold mb-2">Your Nakshatra</p>
              <p className="text-sm text-white/80 leading-relaxed">
                Born under {chartData.nakshatra}, ruled by {chartData.nakshatraDeity}. Your lunar
                mansion defines your core nature.
              </p>
            </div>
          </div>

          {/* Advanced Mode - Conditional */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 space-y-4"
              >
                {/* Planet Placements */}
                {chartData.planets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                      Planet Placements
                    </p>
                    <div className="space-y-2">
                      {chartData.planets.map((planet) => {
                        const badge = DIGNITY_BADGE_COLORS[planet.dignity]
                        return (
                          <div
                            key={planet.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-lg" style={{ color: planet.color }}>
                                {planet.symbol}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white/90 truncate">
                                  {planet.name}
                                </p>
                                <p className="text-[10px] text-white/50">
                                  {planet.sign} {planet.house}H • {planet.nakshatra}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-0.5 rounded text-[9px] font-semibold ${badge.bg} ${badge.text} flex-shrink-0 whitespace-nowrap`}
                            >
                              {badge.icon} {planet.dignity}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Yogas */}
                {chartData.yogas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                      Yogas Found
                    </p>
                    <div className="space-y-2">
                      {chartData.yogas.map((yoga) => {
                        const colorScheme = YOGA_TYPE_COLORS[yoga.type]
                        return (
                          <div
                            key={yoga.name}
                            className="p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-xs font-semibold text-white/90">{yoga.name}</p>
                              <span
                                className={`px-2 py-0.5 rounded text-[8px] font-semibold border ${colorScheme.badge} flex-shrink-0 whitespace-nowrap`}
                              >
                                {colorScheme.icon} {yoga.type.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{yoga.effect}</p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Doshas */}
                {chartData.doshas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                      Active Doshas
                    </p>
                    <div className="space-y-2">
                      {chartData.doshas.map((dosha) => {
                        const colorClass =
                          DOSHA_SEVERITY_COLORS[dosha.severity] || DOSHA_SEVERITY_COLORS.mild
                        return (
                          <div
                            key={dosha.name}
                            className={`p-3 rounded-lg border ${colorClass} hover:opacity-90 transition-opacity`}
                          >
                            <p className="text-xs font-semibold mb-1 text-white/90">{dosha.name}</p>
                            <p className="text-[10px] text-white/80 leading-relaxed">
                              {dosha.remedy}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Nakshatra Qualities */}
                {chartData.nakshatraQualities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                      Nakshatra Qualities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {chartData.nakshatraQualities.map((q, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer / Attribution */}
      <motion.div variants={itemVariants} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
        <p className="text-xs text-white/50 leading-relaxed">
          GrahAI uses Swiss Ephemeris with Lahiri Ayanamsa. All interpretations trace to classical
          Vedic sources.
        </p>
      </motion.div>
    </motion.div>
  )
}
