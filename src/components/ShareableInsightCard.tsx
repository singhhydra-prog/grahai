"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Share2, ArrowRight } from "lucide-react"
import ShareCardGenerator from "./chat/ShareCardGenerator"

interface ShareableInsightCardProps {
  onAskAbout?: (insight: string) => void
}

const DEFAULT_INSIGHTS = [
  {
    text: "Your Moon sign brings heightened intuition today. Trust your inner voice when making important decisions.",
    vertical: "astrology",
  },
  {
    text: "The number 7 holds power in your numerology chart today. Focus on spiritual growth and reflection.",
    vertical: "numerology",
  },
  {
    text: "Mercury's position suggests clear communication flows today. Express yourself with confidence.",
    vertical: "astrology",
  },
  {
    text: "Your cosmic alignment favors new beginnings. Plant seeds for future success.",
    vertical: "general",
  },
  {
    text: "Venus energy brings harmony to relationships. Invest in meaningful connections.",
    vertical: "astrology",
  },
]

export default function ShareableInsightCard({
  onAskAbout,
}: ShareableInsightCardProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [insight, setInsight] = useState(DEFAULT_INSIGHTS[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage or use random default
    const stored = localStorage?.getItem("todayInsight")
    if (stored) {
      try {
        setInsight(JSON.parse(stored))
      } catch {
        // Use default
      }
    } else {
      // Use random insight
      setInsight(
        DEFAULT_INSIGHTS[Math.floor(Math.random() * DEFAULT_INSIGHTS.length)]
      )
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent overflow-hidden backdrop-blur-sm"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-amber-500/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="text-sm font-semibold text-amber-400">
              Today's Cosmic Insight
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-4">
          {/* Insight Text */}
          <div className="relative">
            <div className="absolute -left-2 -top-1 text-4xl text-amber-500/20 select-none">
              "
            </div>
            <p className="text-sm leading-relaxed text-white/80 pl-2">
              {insight.text}
            </p>
          </div>

          {/* Vertical Badge */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-white/40">
              {insight.vertical.charAt(0).toUpperCase() +
                insight.vertical.slice(1)}{" "}
              Reading
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors group"
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Share</span>
            </button>
            {onAskAbout && (
              <button
                onClick={() => onAskAbout(insight.text)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/5 border border-white/[0.06] text-white/60 hover:bg-white/10 transition-colors group"
              >
                <span className="text-xs font-medium">Learn More</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Share Card Generator Modal */}
      <ShareCardGenerator
        text={insight.text}
        vertical={insight.vertical}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  )
}
