"use client"

/* ════════════════════════════════════════════════════════
   RemedyCard — Vedic Remedy Display Component

   Shows gemstone, mantra, fasting, charity, and dosha
   remedies with classical text references.
   ════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"
import { Gem, BookOpen, Moon, Heart, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

// ─── Types ──────────────────────────────────────────────

interface RemedyItem {
  type: "gemstone" | "mantra" | "fasting" | "charity" | "rudraksha" | "yantra" | "puja"
  planet: string
  name: string
  details: string
  whyItWorks?: string
  classicalRef?: string
  priority?: "high" | "medium" | "low"
}

interface DoshaRemedyGroup {
  doshaName: string
  severity: "high" | "medium" | "low"
  description: string
  remedies: RemedyItem[]
}

interface RemedyCardProps {
  title?: string
  planetRemedies?: RemedyItem[]
  doshaRemedies?: DoshaRemedyGroup[]
  className?: string
}

// ─── Icons by type ──────────────────────────────────────

const TYPE_CONFIG: Record<string, { icon: typeof Gem; label: string; color: string }> = {
  gemstone:  { icon: Gem,      label: "Gemstone",  color: "#E2C474" },
  mantra:    { icon: BookOpen,  label: "Mantra",    color: "#E2994A" },
  fasting:   { icon: Moon,      label: "Fasting",   color: "#6B7DA8" },
  charity:   { icon: Heart,     label: "Charity",   color: "#4ADE80" },
  rudraksha: { icon: Gem,       label: "Rudraksha", color: "#B8860B" },
  yantra:    { icon: Shield,    label: "Yantra",    color: "#8B8BCD" },
  puja:      { icon: BookOpen,  label: "Puja",      color: "#F0C8E0" },
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  high:   { bg: "bg-red/15", text: "text-red", label: "High Severity" },
  medium: { bg: "bg-saffron/15", text: "text-saffron", label: "Moderate" },
  low:    { bg: "bg-green/15", text: "text-green", label: "Mild" },
}

// ─── Single Remedy Item ─────────────────────────────────

function RemedyItemCard({ remedy, index }: { remedy: RemedyItem; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const config = TYPE_CONFIG[remedy.type] || TYPE_CONFIG.mantra
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-indigo/15 bg-bg-card/60 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
      >
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: config.color + "18" }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text">{remedy.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: config.color + "18", color: config.color }}
            >
              {config.label}
            </span>
            {remedy.priority === "high" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red/15 text-red font-medium">
                Recommended
              </span>
            )}
          </div>
          <p className="text-xs text-text-dim mt-1 line-clamp-2">{remedy.details}</p>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 mt-1">
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-text-dim" />
            : <ChevronDown className="w-3.5 h-3.5 text-text-dim" />
          }
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-indigo/10 px-4 py-3 space-y-2"
        >
          {remedy.whyItWorks && (
            <div>
              <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">
                Why It Works
              </p>
              <p className="text-xs text-text/80">{remedy.whyItWorks}</p>
            </div>
          )}
          {remedy.classicalRef && (
            <div className="flex items-start gap-1.5">
              <BookOpen className="w-3 h-3 text-gold/50 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-gold/70 italic">{remedy.classicalRef}</p>
            </div>
          )}
          <p className="text-[10px] text-text-dim">Planet: {remedy.planet}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Dosha Remedy Group ─────────────────────────────────

function DoshaGroup({ group, index }: { group: DoshaRemedyGroup; index: number }) {
  const [expanded, setExpanded] = useState(group.severity === "high")
  const severity = SEVERITY_STYLES[group.severity] || SEVERITY_STYLES.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-indigo/15 bg-bg-card/60 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-saffron" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">{group.doshaName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${severity.bg} ${severity.text}`}>
                {severity.label}
              </span>
            </div>
            <p className="text-xs text-text-dim mt-0.5">{group.description}</p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-text-dim" />
          : <ChevronDown className="w-4 h-4 text-text-dim" />
        }
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-indigo/10 px-4 py-3 space-y-2"
        >
          {group.remedies.map((r, ri) => (
            <RemedyItemCard key={ri} remedy={r} index={ri} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function RemedyCard({
  title = "Personalized Remedies",
  planetRemedies = [],
  doshaRemedies = [],
  className = "",
}: RemedyCardProps) {
  const [activeTab, setActiveTab] = useState<"planet" | "dosha">(
    doshaRemedies.length > 0 ? "dosha" : "planet"
  )

  const hasBoth = planetRemedies.length > 0 && doshaRemedies.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title + Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider flex items-center gap-2">
          <Gem className="w-4 h-4 text-gold" />
          {title}
        </h3>

        {hasBoth && (
          <div className="flex rounded-lg border border-indigo/20 overflow-hidden">
            <button
              onClick={() => setActiveTab("dosha")}
              className={`px-3 py-1 text-xs transition-colors ${
                activeTab === "dosha"
                  ? "bg-saffron/15 text-saffron"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Dosha
            </button>
            <button
              onClick={() => setActiveTab("planet")}
              className={`px-3 py-1 text-xs transition-colors ${
                activeTab === "planet"
                  ? "bg-saffron/15 text-saffron"
                  : "text-text-dim hover:text-text"
              }`}
            >
              Planetary
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "dosha" && doshaRemedies.length > 0 && (
        <div className="space-y-3">
          {doshaRemedies.map((group, i) => (
            <DoshaGroup key={i} group={group} index={i} />
          ))}
        </div>
      )}

      {activeTab === "planet" && planetRemedies.length > 0 && (
        <div className="space-y-2">
          {planetRemedies.map((remedy, i) => (
            <RemedyItemCard key={i} remedy={remedy} index={i} />
          ))}
        </div>
      )}

      {planetRemedies.length === 0 && doshaRemedies.length === 0 && (
        <div className="text-center py-8 text-text-dim text-sm">
          <Gem className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No remedies needed — your chart is well-placed!</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-text-dim/50 text-center mt-4">
        Remedies are based on classical Jyotish texts (BPHS Ch. 77-84). Consult a qualified Jyotishi for personalized guidance.
      </p>
    </div>
  )
}
