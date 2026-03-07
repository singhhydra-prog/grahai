"use client"

import { motion } from "framer-motion"
import { useGamification } from "@/contexts/GamificationContext"
import { getLevelTitle } from "@/lib/gamification/engine"

const MILESTONES = [
  { level: 1, label: "Novice", emoji: "🌱" },
  { level: 5, label: "Rising Star", emoji: "⭐" },
  { level: 10, label: "Cosmic Adept", emoji: "🌙" },
  { level: 20, label: "Stellar Master", emoji: "✨" },
  { level: 30, label: "Celestial Sage", emoji: "🪐" },
  { level: 50, label: "Cosmic Guru", emoji: "👑" },
]

export function CosmicJourneyBar() {
  const { level } = useGamification()

  // Find current milestone position (0-1 scale)
  const currentMilestoneIdx = MILESTONES.findLastIndex(m => level >= m.level)
  const nextMilestoneIdx = Math.min(currentMilestoneIdx + 1, MILESTONES.length - 1)

  const currentMilestone = MILESTONES[currentMilestoneIdx] || MILESTONES[0]
  const nextMilestone = MILESTONES[nextMilestoneIdx]

  const progressInSegment = currentMilestoneIdx === nextMilestoneIdx
    ? 1
    : (level - currentMilestone.level) / (nextMilestone.level - currentMilestone.level)

  const overallProgress = (currentMilestoneIdx + progressInSegment) / (MILESTONES.length - 1)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm p-4"
    >
      <h3 className="text-sm font-semibold text-cosmic-white mb-4">Cosmic Journey</h3>

      {/* Vertical milestone bar */}
      <div className="relative flex flex-col gap-1">
        {MILESTONES.map((milestone, i) => {
          const isReached = level >= milestone.level
          const isCurrent = i === currentMilestoneIdx

          return (
            <div key={milestone.level} className="flex items-center gap-3">
              {/* Dot + line */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    isReached
                      ? "bg-saffron/20 border-saffron text-saffron"
                      : "bg-deep-space/50 border-indigo/30 text-cosmic-white/30"
                  } ${isCurrent ? "ring-2 ring-saffron/30 ring-offset-2 ring-offset-navy-light" : ""}`}
                >
                  {milestone.emoji}
                </div>
                {i < MILESTONES.length - 1 && (
                  <div className={`w-0.5 h-6 ${isReached ? "bg-saffron/40" : "bg-indigo/20"}`} />
                )}
              </div>

              {/* Label */}
              <div>
                <p className={`text-xs font-medium ${isReached ? "text-cosmic-white" : "text-cosmic-white/30"}`}>
                  {milestone.label}
                </p>
                <p className={`text-xs ${isReached ? "text-cosmic-white/40" : "text-cosmic-white/20"}`}>
                  Level {milestone.level}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
