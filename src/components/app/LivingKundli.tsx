"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, ChevronUp } from "lucide-react"

/* ═══════════════════════════════════════════════════
   LIVING KUNDLI — Birth chart as navigation
   The core innovation: tap any house to explore
   ═══════════════════════════════════════════════════ */

interface HouseData {
  number: number
  label: string
  labelHi: string
  planets: string[]
  sign: string
  signSymbol: string
  summary: string
  transitActive?: boolean
}

const HOUSES: HouseData[] = [
  { number: 1, label: "SELF", labelHi: "तनु", planets: ["Su", "Me"], sign: "Aries", signSymbol: "♈", summary: "Sun & Mercury in Lagna — sharp intellect, bold personality", transitActive: true },
  { number: 2, label: "WEALTH", labelHi: "धन", planets: [], sign: "Taurus", signSymbol: "♉", summary: "No planets — steady wealth through Venus aspects" },
  { number: 3, label: "COURAGE", labelHi: "सहज", planets: ["Ma"], sign: "Gemini", signSymbol: "♊", summary: "Mars here — courageous communicator, strong siblings", transitActive: true },
  { number: 4, label: "HOME", labelHi: "सुख", planets: ["Mo"], sign: "Cancer", signSymbol: "♋", summary: "Moon in own sign — deep emotional roots, strong mother bond" },
  { number: 5, label: "CHILDREN", labelHi: "सन्तान", planets: [], sign: "Leo", signSymbol: "♌", summary: "Empty — creative potential activates during Jupiter transit" },
  { number: 6, label: "ENEMIES", labelHi: "शत्रु", planets: [], sign: "Virgo", signSymbol: "♍", summary: "Empty 6th — generally good health, few obstacles" },
  { number: 7, label: "PARTNER", labelHi: "दारा", planets: ["Ve"], sign: "Libra", signSymbol: "♎", summary: "Venus in 7th — blessed partnerships, artistic spouse" },
  { number: 8, label: "TRANSFORM", labelHi: "आयु", planets: [], sign: "Scorpio", signSymbol: "♏", summary: "Empty 8th — transformations come through partnerships" },
  { number: 9, label: "DHARMA", labelHi: "भाग्य", planets: ["Ju"], sign: "Sagittarius", signSymbol: "♐", summary: "Jupiter in own sign — blessed fortune, spiritual wisdom", transitActive: true },
  { number: 10, label: "KARMA", labelHi: "कर्म", planets: ["Sa"], sign: "Capricorn", signSymbol: "♑", summary: "Saturn in 10th — disciplined rise, lasting career legacy" },
  { number: 11, label: "GAINS", labelHi: "लाभ", planets: [], sign: "Aquarius", signSymbol: "♒", summary: "Empty 11th — gains through Saturn's discipline in 10th" },
  { number: 12, label: "MOKSHA", labelHi: "व्यय", planets: ["Ra", "Ke"], sign: "Pisces", signSymbol: "♓", summary: "Rahu-Ketu axis — past-life karma, spiritual awakening" },
]

// North Indian chart house positions (SVG coordinates for diamond layout)
const HOUSE_POSITIONS: Record<number, { points: string; cx: number; cy: number }> = {
  1:  { points: "150,20 220,90 150,160 80,90", cx: 150, cy: 90 },
  2:  { points: "80,90 150,160 80,160 20,90", cx: 82, cy: 125 },
  3:  { points: "20,90 80,160 20,160 20,90", cx: 40, cy: 135 },
  4:  { points: "20,160 80,160 150,230 20,230", cx: 68, cy: 195 },
  5:  { points: "20,230 150,230 80,300 20,300", cx: 55, cy: 265 },
  6:  { points: "80,300 150,230 150,300 80,300", cx: 115, cy: 275 },
  7:  { points: "150,230 220,300 150,370 80,300", cx: 150, cy: 300 },
  8:  { points: "220,300 280,230 280,300 220,300", cx: 260, cy: 275 },
  9:  { points: "280,230 150,230 220,300 280,300", cx: 235, cy: 265 },
  10: { points: "280,160 150,230 280,230 280,160", cx: 235, cy: 195 },
  11: { points: "280,90 220,160 280,160 280,90", cx: 260, cy: 135 },
  12: { points: "150,20 280,90 220,160 150,160", cx: 220, cy: 125 },
}

const PLANET_ICONS: Record<string, { icon: string; color: string }> = {
  Su: { icon: "☀️", color: "#F59E0B" },
  Mo: { icon: "🌙", color: "#E0E7FF" },
  Ma: { icon: "🔴", color: "#EF4444" },
  Me: { icon: "💚", color: "#22C55E" },
  Ju: { icon: "💛", color: "#EAB308" },
  Ve: { icon: "💎", color: "#EC4899" },
  Sa: { icon: "🪐", color: "#6366F1" },
  Ra: { icon: "🐍", color: "#8B5CF6" },
  Ke: { icon: "🔥", color: "#F97316" },
}

interface LivingKundliProps {
  onTalkToPlanet?: (planet: string) => void
}

export default function LivingKundli({ onTalkToPlanet }: LivingKundliProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const house = selectedHouse !== null ? HOUSES[selectedHouse - 1] : null

  return (
    <section className="relative mx-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/10" />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/30">
          Your Living Kundli · जन्म कुंडली
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/10" />
      </div>

      {/* SVG Chart */}
      <motion.div
        className="relative mx-auto"
        style={{ maxWidth: 300 }}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
      >
        <svg viewBox="0 0 300 390" className="w-full">
          {/* Outer border */}
          <rect x="18" y="18" width="264" height="354" rx="4"
            fill="none" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />

          {/* Diamond cross lines */}
          <line x1="150" y1="20" x2="20" y2="160" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="150" y1="20" x2="280" y2="160" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="150" y1="370" x2="20" y2="230" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="150" y1="370" x2="280" y2="230" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="20" y1="160" x2="280" y2="160" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="20" y1="230" x2="280" y2="230" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
          <line x1="150" y1="160" x2="150" y2="230" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />

          {/* House zones */}
          {HOUSES.map((h) => {
            const pos = HOUSE_POSITIONS[h.number]
            if (!pos) return null
            const isActive = selectedHouse === h.number
            const hasTransit = h.transitActive

            return (
              <g key={h.number} onClick={() => setSelectedHouse(h.number)} className="cursor-pointer">
                <polygon
                  points={pos.points}
                  fill={isActive ? "rgba(212,168,83,0.12)" : hasTransit ? "rgba(74,222,128,0.04)" : "transparent"}
                  stroke={isActive ? "rgba(212,168,83,0.4)" : hasTransit ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)"}
                  strokeWidth={isActive ? 1.5 : 0.5}
                  className="transition-all duration-300"
                />
                {/* House number */}
                <text x={pos.cx} y={pos.cy - 8} textAnchor="middle"
                  fill={isActive ? "rgba(212,168,83,0.8)" : "rgba(255,255,255,0.2)"}
                  fontSize="9" fontWeight="600">{h.number}</text>
                {/* Label */}
                <text x={pos.cx} y={pos.cy + 3} textAnchor="middle"
                  fill={isActive ? "rgba(212,168,83,0.6)" : "rgba(255,255,255,0.12)"}
                  fontSize="6" fontWeight="500" letterSpacing="0.08em">{h.label}</text>
                {/* Planets */}
                {h.planets.length > 0 && (
                  <text x={pos.cx} y={pos.cy + 16} textAnchor="middle"
                    fill="rgba(212,168,83,0.5)" fontSize="10">
                    {h.planets.map(p => PLANET_ICONS[p]?.icon || p).join(" ")}
                  </text>
                )}
              </g>
            )
          })}

          {/* Center Lagna */}
          <text x="150" y="200" textAnchor="middle" fill="rgba(212,168,83,0.6)" fontSize="18">♈</text>
          <text x="150" y="215" textAnchor="middle" fill="rgba(212,168,83,0.3)" fontSize="7" fontWeight="600" letterSpacing="0.15em">LAGNA</text>
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gold/5 blur-[40px]" />
        </div>
      </motion.div>

      {/* House detail panel */}
      <AnimatePresence>
        {house && (
          <motion.div
            className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, y: 30, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-white">
                      House {house.number} · {house.label}
                    </h3>
                    <span className="font-hindi text-xs text-gold/40">{house.labelHi}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {house.signSymbol} {house.sign}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedHouse(null)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-white/40" />
                </button>
              </div>

              {/* Summary */}
              <p className="text-sm text-white/70 leading-relaxed mb-4">{house.summary}</p>

              {/* Planets in house */}
              {house.planets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {house.planets.map((p) => {
                    const planet = PLANET_ICONS[p]
                    return (
                      <button
                        key={p}
                        onClick={() => onTalkToPlanet?.(p)}
                        className="inline-flex items-center gap-2 rounded-full bg-gold/5 border border-gold/10 px-3 py-1.5 text-xs font-medium text-gold/60 hover:bg-gold/10 transition-all active:scale-95"
                      >
                        <span>{planet?.icon}</span>
                        <span>Talk to {p === "Su" ? "Surya" : p === "Mo" ? "Chandra" : p === "Ma" ? "Mangal" : p === "Me" ? "Budh" : p === "Ju" ? "Guru" : p === "Ve" ? "Shukra" : p === "Sa" ? "Shani" : p === "Ra" ? "Rahu" : "Ketu"}</span>
                        <MessageCircle className="h-3 w-3" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
