"use client"

import { motion } from "framer-motion"
import { BookOpen, Quote } from "lucide-react"

interface ShlokaCardProps {
  source: string       // e.g. "Brihat Parashara Hora Shastra"
  reference: string    // e.g. "Ch. 34, Verse 8-12"
  sanskrit?: string    // Devanagari text
  translation?: string // English meaning
  insight?: string     // How it applies
}

export default function ShlokaCard({ source, reference, sanskrit, translation, insight }: ShlokaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3 rounded-xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.03] overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/[0.06] border-b border-amber-500/10">
        <BookOpen className="w-3.5 h-3.5 text-amber-400/70" />
        <span className="text-[11px] font-medium text-amber-400/80">{source}</span>
        <span className="text-[10px] text-amber-400/40 ml-auto">{reference}</span>
      </div>

      <div className="px-4 py-3 space-y-2.5">
        {/* Sanskrit verse */}
        {sanskrit && (
          <div className="relative pl-3 border-l-2 border-amber-500/20">
            <Quote className="absolute -left-1.5 -top-1 w-3 h-3 text-amber-500/30" />
            <p className="text-sm text-amber-200/90 leading-relaxed font-hindi italic">
              {sanskrit}
            </p>
          </div>
        )}

        {/* Translation */}
        {translation && (
          <p className="text-xs text-white/60 leading-relaxed">
            {translation}
          </p>
        )}

        {/* Insight */}
        {insight && (
          <p className="text-xs text-white/40 leading-relaxed pt-1 border-t border-white/[0.04]">
            {insight}
          </p>
        )}
      </div>
    </motion.div>
  )
}
