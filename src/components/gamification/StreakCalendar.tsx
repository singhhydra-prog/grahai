"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CalendarDay {
  date: string
  xp_earned: number
  readings_count: number
  verticals_used: string[]
}

export function StreakCalendar({ userId }: { userId?: string }) {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null)

  useEffect(() => {
    if (!userId || !supabase) return

    const fetchCalendar = async () => {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 3)

      const { data } = await supabase
        .from("streak_calendar")
        .select("date, xp_earned, readings_count, verticals_used")
        .eq("user_id", userId)
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true })

      if (data) setDays(data)
    }

    fetchCalendar()
  }, [userId])

  // Generate grid of last 91 days (13 weeks)
  const gridDays = []
  const today = new Date()
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const dayData = days.find(dd => dd.date === dateStr)
    gridDays.push({
      date: dateStr,
      xp: dayData?.xp_earned || 0,
      readings: dayData?.readings_count || 0,
      verticals: dayData?.verticals_used || [],
    })
  }

  const getIntensityClass = (xp: number) => {
    if (xp === 0) return "bg-deep-space/50"
    if (xp < 50) return "bg-saffron/20"
    if (xp < 100) return "bg-saffron/40"
    if (xp < 200) return "bg-saffron/60"
    return "bg-saffron/80"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-saffron" />
        <h3 className="text-lg font-semibold text-cosmic-white">Cosmic Activity</h3>
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-13 gap-1 relative">
        {gridDays.map((day, i) => (
          <div
            key={day.date}
            className={`w-full aspect-square rounded-sm ${getIntensityClass(day.xp)} border border-indigo/10 cursor-pointer transition-all duration-200 hover:border-saffron/50 hover:scale-125`}
            onMouseEnter={() => setHoveredDay(day.xp > 0 ? { date: day.date, xp_earned: day.xp, readings_count: day.readings, verticals_used: day.verticals } : null)}
            onMouseLeave={() => setHoveredDay(null)}
          />
        ))}
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="mt-3 p-3 rounded-xl bg-deep-space/80 border border-indigo/30 text-sm">
          <p className="text-cosmic-white font-medium">{new Date(hoveredDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          <p className="text-cosmic-white/60">{hoveredDay.xp_earned} XP earned · {hoveredDay.readings_count} readings</p>
          {hoveredDay.verticals_used.length > 0 && (
            <p className="text-cosmic-white/40 text-xs mt-1">{hoveredDay.verticals_used.join(", ")}</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-cosmic-white/40">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-deep-space/50 border border-indigo/10" />
        <div className="w-3 h-3 rounded-sm bg-saffron/20" />
        <div className="w-3 h-3 rounded-sm bg-saffron/40" />
        <div className="w-3 h-3 rounded-sm bg-saffron/60" />
        <div className="w-3 h-3 rounded-sm bg-saffron/80" />
        <span>More</span>
      </div>
    </motion.div>
  )
}
