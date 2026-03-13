"use client"

import { motion } from "framer-motion"

// Planet data with symbols and colors
const PLANET_DATA: Record<string, { symbol: string; color: string; bgColor: string }> = {
  sun:     { symbol: "☉", color: "text-amber-400",   bgColor: "from-amber-500/15 to-orange-500/10" },
  moon:    { symbol: "☽", color: "text-slate-300",    bgColor: "from-slate-400/15 to-blue-400/10" },
  mars:    { symbol: "♂", color: "text-red-400",      bgColor: "from-red-500/15 to-rose-500/10" },
  mercury: { symbol: "☿", color: "text-emerald-400",  bgColor: "from-emerald-500/15 to-green-500/10" },
  jupiter: { symbol: "♃", color: "text-yellow-400",   bgColor: "from-yellow-500/15 to-amber-500/10" },
  venus:   { symbol: "♀", color: "text-pink-400",     bgColor: "from-pink-500/15 to-rose-500/10" },
  saturn:  { symbol: "♄", color: "text-blue-400",     bgColor: "from-blue-500/15 to-indigo-500/10" },
  rahu:    { symbol: "☊", color: "text-violet-400",   bgColor: "from-violet-500/15 to-purple-500/10" },
  ketu:    { symbol: "☋", color: "text-orange-400",   bgColor: "from-orange-500/15 to-red-500/10" },
}

interface PlanetPosition {
  planet: string
  sign: string
  house?: number | string
  degree?: string
  dignity?: string  // exalted, debilitated, own sign, etc.
  nakshatra?: string
}

interface PlanetCardProps {
  planets: PlanetPosition[]
  title?: string
}

function getDignityBadge(dignity?: string) {
  if (!dignity) return null
  const lower = dignity.toLowerCase()
  if (lower.includes("exalt"))      return { label: "Exalted", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" }
  if (lower.includes("debilit"))    return { label: "Debilitated", cls: "bg-red-500/15 text-red-400 border-red-500/20" }
  if (lower.includes("own"))        return { label: "Own Sign", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" }
  if (lower.includes("friend"))     return { label: "Friendly", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" }
  if (lower.includes("enemy"))      return { label: "Enemy", cls: "bg-orange-500/15 text-orange-400 border-orange-500/20" }
  return { label: dignity, cls: "bg-white/5 text-white/50 border-white/10" }
}

export default function PlanetCard({ planets, title = "Planetary Positions" }: PlanetCardProps) {
  if (!planets?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3 rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/[0.06]">
        <span className="text-sm">🪐</span>
        <span className="text-[11px] font-semibold text-white/70">{title}</span>
      </div>

      {/* Planet grid */}
      <div className="p-3 grid grid-cols-3 gap-2">
        {planets.map((p, i) => {
          const key = p.planet.toLowerCase().trim()
          const data = PLANET_DATA[key] || { symbol: "⊕", color: "text-white/60", bgColor: "from-white/5 to-white/[0.02]" }
          const dignity = getDignityBadge(p.dignity)

          return (
            <div
              key={i}
              className={`relative rounded-lg bg-gradient-to-br ${data.bgColor} border border-white/[0.06] p-2.5 text-center`}
            >
              {/* Planet symbol */}
              <div className={`text-lg ${data.color} mb-0.5`}>{data.symbol}</div>
              {/* Planet name */}
              <div className="text-[10px] font-bold text-white/80 uppercase tracking-wide">{p.planet}</div>
              {/* Sign */}
              <div className="text-[10px] text-white/50 mt-0.5">{p.sign}</div>
              {/* House */}
              {p.house && <div className="text-[9px] text-white/30">House {p.house}</div>}
              {/* Nakshatra */}
              {p.nakshatra && <div className="text-[9px] text-white/25 italic">{p.nakshatra}</div>}
              {/* Dignity badge */}
              {dignity && (
                <div className={`mt-1 inline-block px-1.5 py-0.5 rounded-full text-[8px] font-semibold border ${dignity.cls}`}>
                  {dignity.label}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
