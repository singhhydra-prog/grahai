"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, CalendarDays, CalendarRange, ArrowRight, Gift, BookOpen } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { BirthData } from "@/types/app"

interface QuestionsHomeProps {
  onAskQuestion: () => void
  onProfileClick: () => void
}

export default function QuestionsHome({ onAskQuestion, onProfileClick }: QuestionsHomeProps) {
  const [questionsLeft, setQuestionsLeft] = useState(0)
  const [input, setInput] = useState("")

  useEffect(() => {
    try {
      const q = localStorage.getItem("grahai-questions-left")
      if (q) setQuestionsLeft(parseInt(q))
    } catch {}
  }, [])

  const handleSubmit = () => {
    if (!input.trim()) return
    localStorage.setItem("grahai-pending-question", input.trim())
    onAskQuestion()
  }

  return (
    <div className="min-h-full pb-20">
      {/* Header: Hamburger + Avatar + Add Member */}
      <AppHeader onProfileClick={onProfileClick} />

      {/* Viewing your profile strip */}
      <div className="px-4 py-2 bg-[#0E0E25] text-center">
        <span className="text-xs text-white/40">Viewing your profile</span>
      </div>

      {/* Gradient hero section */}
      <div className="bg-gradient-to-b from-pink-900/30 via-[#0E0E25] to-[#080818] px-4 pt-6 pb-4">
        {/* Question balance */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-pink-500/30 flex items-center justify-center">
              <span className="text-xs font-bold text-white/60">{questionsLeft}</span>
            </div>
            <span className="text-sm text-white/50">Question left</span>
          </div>
          <button className="text-sm text-white/50 flex items-center gap-1 hover:text-white/70 transition-colors">
            Buy More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Question input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask your question here..."
            className="w-full bg-white rounded-full px-5 py-3.5 pr-14 text-sm text-gray-800
              placeholder:text-gray-400 outline-none shadow-lg"
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
              bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center
              shadow-md transition-transform active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Horoscope cards row */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Daily\nHoroscope", sub: "TODAY", Icon: Calendar },
            { label: "Weekly\nHoroscope", sub: "", Icon: CalendarDays },
            { label: "Monthly\nHoroscope", sub: "", Icon: CalendarRange },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-[#1A1A35] rounded-xl p-4 text-left hover:bg-[#222245] transition-colors"
            >
              {item.sub && (
                <span className="text-[9px] uppercase tracking-wider text-white/30 font-semibold">
                  {item.sub}
                </span>
              )}
              <item.Icon className="w-6 h-6 text-white/25 mb-2 mt-1" />
              <p className="text-xs font-semibold text-white/70 whitespace-pre-line leading-tight">
                {item.label}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats counter */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-4xl font-bold text-white/80 mb-1">
            2,621,596{" "}
            <span className="inline-block w-16 h-0.5 bg-gradient-to-r from-pink-500 to-blue-400 align-middle" />
          </p>
          <p className="text-sm text-white/30 italic">Clear Answers. Confident Decisions.</p>
        </motion.div>
      </div>

      {/* Refer & Earn + Latest Blogs */}
      <div className="px-4 mb-8">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-medium">Refer &amp; Earn</span>
          </button>
          <button className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Latest Blogs</span>
          </button>
        </div>
      </div>

      {/* Tagline */}
      <div className="px-4 mb-8">
        <p className="text-3xl font-bold text-white/10 leading-tight italic">
          No Fluff.
          <br />
          Accurate Guidance.
        </p>
      </div>

      {/* Made in India */}
      <div className="px-4 pb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">G</span>
        </div>
        <span className="text-sm text-white/40">
          Made with <span className="text-red-400">❤</span> in India
        </span>
      </div>
    </div>
  )
}
