"use client"

import { motion } from "framer-motion"
import { Shield, Gem, Flame } from "lucide-react"

interface RemedyCardProps {
  type: string        // "Mantra" | "Gemstone" | "Ritual" | "Donation" etc.
  planet: string      // Which planet it remedies
  name: string        // Name of the remedy
  details: string     // How to perform
  classicalRef?: string // Source reference
}

const REMEDY_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  mantra:   { icon: <span className="text-base">🕉️</span>, color: "from-amber-500/15 to-orange-500/10 border-amber-500/15" },
  gemstone: { icon: <Gem className="w-4 h-4 text-violet-400" />, color: "from-violet-500/15 to-purple-500/10 border-violet-500/15" },
  ritual:   { icon: <Flame className="w-4 h-4 text-orange-400" />, color: "from-orange-500/15 to-red-500/10 border-orange-500/15" },
  donation: { icon: <span className="text-base">🙏</span>, color: "from-emerald-500/15 to-green-500/10 border-emerald-500/15" },
  yantra:   { icon: <span className="text-base">⚛</span>, color: "from-blue-500/15 to-indigo-500/10 border-blue-500/15" },
  default:  { icon: <Shield className="w-4 h-4 text-amber-400" />, color: "from-amber-500/15 to-orange-500/10 border-amber-500/15" },
}

export default function RemedyCard({ type, planet, name, details, classicalRef }: RemedyCardProps) {
  const remedy = REMEDY_ICONS[type.toLowerCase()] || REMEDY_ICONS.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`my-3 rounded-xl border bg-gradient-to-br ${remedy.color} overflow-hidden`}
    >
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
            {remedy.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white/80">{name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[9px] text-white/40 border border-white/[0.06]">
                {type} · {planet}
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">{details}</p>
            {classicalRef && (
              <p className="text-[10px] text-white/25 mt-1.5 italic">📖 {classicalRef}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
