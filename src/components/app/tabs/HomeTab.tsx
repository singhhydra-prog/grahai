"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Heart, Briefcase, Zap, ChevronRight } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { CosmicSnapshot } from "@/types/app"

interface HomeTabProps {
  onAskQuestion: (question?: string) => void
  onProfileClick: () => void
  onViewReports: () => void
}

export default function HomeTab({ onAskQuestion, onProfileClick, onViewReports }: HomeTabProps) {
  const [snapshot, setSnapshot] = useState<CosmicSnapshot | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    try {
      const name = localStorage.getItem("userNameForGreeting")
      if (name) setUserName(name)
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) setSnapshot(JSON.parse(snap))
    } catch {}
  }, [])

  // Defaults if no snapshot
  const theme = snapshot?.profile?.dominantTheme || "Patience Before Progress"
  const todayBody = snapshot?.todayInsight ||
    "Your chart points to a slower but more intelligent pace today. Focus on decisions that require judgment, not reaction."

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle="Your daily guidance" />

      <div className="px-5 pt-4">
        {/* ═══ Hero: Today for You ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1F30] to-[#111827]
            border border-[#D4A054]/10 p-5 mb-5"
        >
          {/* Subtle gold accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A054]/30 to-transparent" />

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#D4A054]" />
            <span className="text-xs font-semibold text-[#D4A054] tracking-wide uppercase">
              Today for you
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#F1F0F5] mb-2">{theme}</h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{todayBody}</p>

          {/* Do / Avoid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#0A0E1A]/50 rounded-xl p-3">
              <p className="text-[10px] text-emerald-400 font-semibold mb-1.5 uppercase tracking-wide">Do</p>
              <ul className="space-y-1">
                <li className="text-xs text-[#94A3B8]">Close pending loops</li>
                <li className="text-xs text-[#94A3B8]">Communicate clearly</li>
                <li className="text-xs text-[#94A3B8]">Plan before acting</li>
              </ul>
            </div>
            <div className="bg-[#0A0E1A]/50 rounded-xl p-3">
              <p className="text-[10px] text-rose-400 font-semibold mb-1.5 uppercase tracking-wide">Avoid</p>
              <ul className="space-y-1">
                <li className="text-xs text-[#94A3B8]">Emotional overcommitment</li>
                <li className="text-xs text-[#94A3B8]">Rushed conclusions</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onAskQuestion("Why is this showing up in my chart today?")}
              className="text-xs text-[#D4A054] font-medium flex items-center gap-1 hover:opacity-80"
            >
              Ask why <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* ═══ Quick Insight Cards ═══ */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Love", Icon: Heart, color: "text-rose-400", bgColor: "from-rose-500/10 to-rose-600/5",
              insight: "Calm connection today" },
            { label: "Career", Icon: Briefcase, color: "text-amber-400", bgColor: "from-amber-500/10 to-amber-600/5",
              insight: "Strategy over action" },
            { label: "Energy", Icon: Zap, color: "text-teal-400", bgColor: "from-teal-500/10 to-teal-600/5",
              insight: "Moderate, steady pace" },
          ].map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              onClick={() => onAskQuestion(`Tell me about my ${card.label.toLowerCase()} energy today`)}
              className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-3.5 text-left
                border border-[#1E293B] hover:border-[#D4A054]/15 transition-colors`}
            >
              <card.Icon className={`w-5 h-5 ${card.color} mb-2`} />
              <p className="text-[11px] font-semibold text-[#F1F0F5] mb-0.5">{card.label}</p>
              <p className="text-[10px] text-[#5A6478] leading-snug">{card.insight}</p>
            </motion.button>
          ))}
        </div>

        {/* ═══ Ask Shortcut ═══ */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => onAskQuestion()}
          className="w-full flex items-center gap-3 bg-[#111827] border border-[#1E293B]
            rounded-xl px-4 py-3.5 mb-6 hover:border-[#D4A054]/20 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-[#D4A054]/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#D4A054]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-[#F1F0F5]">Ask about anything</p>
            <p className="text-[11px] text-[#5A6478]">Love, work, timing, emotions...</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#5A6478]" />
        </motion.button>

        {/* ═══ Recent Guidance / Continuity ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#F1F0F5]">Recent guidance</h3>
            <button className="text-xs text-[#D4A054] font-medium">View all</button>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
            <p className="text-xs text-[#5A6478] mb-1">Yesterday</p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Your chart showed peak clarity energy — ideal for important conversations and career decisions.
            </p>
          </div>
        </motion.div>

        {/* ═══ Premium Depth Tease ═══ */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onViewReports}
          className="w-full bg-gradient-to-r from-[#D4A054]/5 to-transparent
            border border-[#D4A054]/10 rounded-xl p-4 text-left
            hover:border-[#D4A054]/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#D4A054] mb-0.5">Unlock deeper insights</p>
              <p className="text-xs text-[#5A6478]">Career blueprints, timing reports, compatibility readings</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D4A054]" />
          </div>
        </motion.button>
      </div>
    </div>
  )
}
