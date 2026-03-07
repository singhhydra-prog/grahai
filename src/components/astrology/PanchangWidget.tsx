"use client"

/* ════════════════════════════════════════════════════════
   PanchangWidget — Daily Panchang Display

   Shows the five limbs of the Hindu calendar (Panchang):
   Tithi, Nakshatra, Yoga, Karana, Vara + auspicious timings.
   ════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"
import { Calendar, Sun, Moon, Star, Clock, AlertTriangle } from "lucide-react"

// ─── Types ──────────────────────────────────────────────

interface PanchangData {
  vara: string            // Day name (e.g. "Monday — Somavar")
  tithi: string           // Lunar day
  tithiLord: string
  nakshatra: string       // Lunar mansion
  nakshatraLord: string
  yoga: string            // Yoga name
  yogaType?: string       // "auspicious" | "inauspicious" | "neutral"
  karana: string          // Half-tithi
  karanaType?: string
  sunriseTime?: string    // e.g. "06:34 AM"
  sunsetTime?: string
  rahuKaal?: string       // e.g. "07:30 - 09:00"
  gulikaKaal?: string
  abhijitMuhurta?: string
  specialDay?: string     // e.g. "Ekadashi", "Amavasya"
}

interface PanchangWidgetProps {
  panchang: PanchangData
  date?: string           // Display date
  compact?: boolean       // Smaller version for dashboard
  className?: string
}

// ─── Helpers ────────────────────────────────────────────

function getVaraEmoji(vara: string): string {
  const day = vara.toLowerCase()
  if (day.includes("sun") || day.includes("ravi")) return "☀️"
  if (day.includes("mon") || day.includes("som")) return "🌙"
  if (day.includes("tue") || day.includes("mangal")) return "🔴"
  if (day.includes("wed") || day.includes("budh")) return "💚"
  if (day.includes("thu") || day.includes("guru")) return "🟡"
  if (day.includes("fri") || day.includes("shukr")) return "💗"
  if (day.includes("sat") || day.includes("shani")) return "🔵"
  return "📅"
}

// ─── Component ──────────────────────────────────────────

export default function PanchangWidget({
  panchang,
  date,
  compact = false,
  className = "",
}: PanchangWidgetProps) {
  const varaEmoji = getVaraEmoji(panchang.vara)

  // Compact version for dashboard cards
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border border-indigo/15 bg-bg-card/60 p-4 ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold text-text uppercase tracking-wider">
              Panchang
            </span>
          </div>
          {date && <span className="text-[10px] text-text-dim">{date}</span>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{varaEmoji}</span>
            <span className="text-sm font-medium text-text">{panchang.vara}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-dim">Tithi: </span>
              <span className="text-gold-light">{panchang.tithi}</span>
            </div>
            <div>
              <span className="text-text-dim">Nakshatra: </span>
              <span className="text-gold-light">{panchang.nakshatra}</span>
            </div>
          </div>

          {panchang.specialDay && (
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3 h-3 text-saffron" />
              <span className="text-xs text-saffron font-medium">{panchang.specialDay}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Full version
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-indigo/15 bg-bg-card/60 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-indigo/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          <div>
            <h3 className="text-sm font-semibold text-text">
              Today&apos;s Panchang{" "}
              <span className="font-normal opacity-60" style={{ fontFamily: "var(--font-devanagari)" }}>
                पंचांग
              </span>
            </h3>
            {date && <p className="text-[10px] text-text-dim mt-0.5">{date}</p>}
          </div>
        </div>
        <span className="text-2xl">{varaEmoji}</span>
      </div>

      {/* Vara (Day) */}
      <div className="px-5 py-3 bg-gold/5 border-b border-indigo/10">
        <p className="text-sm font-medium text-gold-light">{panchang.vara}</p>
        {panchang.specialDay && (
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-3 h-3 text-saffron animate-pulse" />
            <span className="text-xs text-saffron font-medium">{panchang.specialDay}</span>
          </div>
        )}
      </div>

      {/* Five Limbs Grid */}
      <div className="px-5 py-4 space-y-3">
        {/* Tithi */}
        <PanchangRow
          icon={<Moon className="w-3.5 h-3.5" />}
          label="Tithi"
          hindiLabel="तिथि"
          value={panchang.tithi}
          sublabel={panchang.tithiLord ? `Lord: ${panchang.tithiLord}` : undefined}
          color="#C8D8E4"
        />

        {/* Nakshatra */}
        <PanchangRow
          icon={<Star className="w-3.5 h-3.5" />}
          label="Nakshatra"
          hindiLabel="नक्षत्र"
          value={panchang.nakshatra}
          sublabel={panchang.nakshatraLord ? `Lord: ${panchang.nakshatraLord}` : undefined}
          color="#E2C474"
        />

        {/* Yoga */}
        <PanchangRow
          icon={<Sun className="w-3.5 h-3.5" />}
          label="Yoga"
          hindiLabel="योग"
          value={panchang.yoga}
          badge={panchang.yogaType}
          color="#E2994A"
        />

        {/* Karana */}
        <PanchangRow
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Karana"
          hindiLabel="करण"
          value={panchang.karana}
          badge={panchang.karanaType}
          color="#4ADE80"
        />
      </div>

      {/* Timings */}
      {(panchang.sunriseTime || panchang.rahuKaal) && (
        <div className="px-5 py-3 border-t border-indigo/10 space-y-2">
          <p className="text-[10px] text-text-dim uppercase tracking-wider">Timings</p>

          <div className="grid grid-cols-2 gap-3">
            {panchang.sunriseTime && (
              <TimingBadge label="Sunrise" value={panchang.sunriseTime} color="#E2C474" />
            )}
            {panchang.sunsetTime && (
              <TimingBadge label="Sunset" value={panchang.sunsetTime} color="#E2994A" />
            )}
            {panchang.rahuKaal && (
              <TimingBadge label="Rahu Kaal" value={panchang.rahuKaal} color="#E85454" warn />
            )}
            {panchang.gulikaKaal && (
              <TimingBadge label="Gulika Kaal" value={panchang.gulikaKaal} color="#6B7DA8" warn />
            )}
            {panchang.abhijitMuhurta && (
              <TimingBadge label="Abhijit Muhurta" value={panchang.abhijitMuhurta} color="#4ADE80" />
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Sub-components ─────────────────────────────────────

function PanchangRow({
  icon,
  label,
  hindiLabel,
  value,
  sublabel,
  badge,
  color,
}: {
  icon: React.ReactNode
  label: string
  hindiLabel: string
  value: string
  sublabel?: string
  badge?: string
  color: string
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-2.5">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center mt-0.5"
          style={{ backgroundColor: color + "15", color }}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-dim">{label}</span>
            <span
              className="text-[10px] opacity-40"
              style={{ fontFamily: "var(--font-devanagari)" }}
            >
              {hindiLabel}
            </span>
          </div>
          <p className="text-sm font-medium text-text mt-0.5">{value}</p>
          {sublabel && (
            <p className="text-[10px] text-text-dim mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>

      {badge && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 ${
            badge === "auspicious"
              ? "bg-green/15 text-green"
              : badge === "inauspicious"
              ? "bg-red/15 text-red"
              : "bg-indigo/15 text-text-dim"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

function TimingBadge({
  label,
  value,
  color,
  warn = false,
}: {
  label: string
  value: string
  color: string
  warn?: boolean
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02]">
      {warn ? (
        <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color }} />
      ) : (
        <Clock className="w-3 h-3 flex-shrink-0" style={{ color }} />
      )}
      <div>
        <p className="text-[10px] text-text-dim">{label}</p>
        <p className="text-xs font-medium text-text">{value}</p>
      </div>
    </div>
  )
}
