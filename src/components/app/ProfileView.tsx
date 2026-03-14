"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MapPin, Clock, User, Sun, Moon, ArrowUp } from "lucide-react"
import type { BirthData, AstroProfile } from "@/types/app"

interface ProfileViewProps {
  onClose: () => void
}

const PLACEHOLDER_ASTRO: AstroProfile = {
  sunSignVedic: "Virgo",
  sunSignWestern: "Libra",
  moonSign: "Cancer",
  ascendant: "Leo",
  birthNakshatra: "Pushya",
  nakshatraCharan: 1,
}

export default function ProfileView({ onClose }: ProfileViewProps) {
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [name, setName] = useState("")
  const [initials, setInitials] = useState("G")
  const [astro, setAstro] = useState<AstroProfile>(PLACEHOLDER_ASTRO)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setName(data.name || "Guest")
        const parts = (data.name || "G").split(" ")
        setInitials(
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : (data.name || "G").substring(0, 2).toUpperCase()
        )
      }
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const s = JSON.parse(snap)
        if (s.moonSign) setAstro((prev) => ({ ...prev, moonSign: s.moonSign }))
      }
    } catch {}
  }, [])

  const birthDetails = [
    { icon: User, label: "Gender", value: birthData?.gender || "Male" },
    { icon: Calendar, label: "Date of Birth", value: birthData?.dateOfBirth || "—" },
    { icon: MapPin, label: "Place of Birth", value: birthData?.placeOfBirth || "—" },
    { icon: Clock, label: "Time of Birth", value: birthData?.timeOfBirth || "—" },
  ]

  const astroDetails = [
    { icon: "☀️", label: "Sun Sign (Vedic)", value: astro.sunSignVedic },
    { icon: "🔴", label: "Sun Sign (Western)", value: astro.sunSignWestern },
    { icon: "🌙", label: "Moon Sign", value: astro.moonSign },
    { icon: "⬆️", label: "Ascendant", value: astro.ascendant },
    { icon: "🔮", label: "Birth Nakshatra", value: astro.birthNakshatra },
    { icon: "✨", label: "Nakshatra Charan", value: `${astro.nakshatraCharan}` },
  ]

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#080818] overflow-y-auto"
    >
      {/* Back button + ornament */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-[#2A2A40] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Ornamental divider */}
      <div className="flex justify-center py-2 opacity-20">
        <div className="w-48 h-4 border-t border-white/20" />
      </div>

      {/* Large Avatar */}
      <div className="flex flex-col items-center py-6">
        <div className="w-28 h-28 rounded-full border-2 border-pink-500/40 flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-600 to-pink-800
            flex items-center justify-center text-3xl font-bold text-white">
            {initials}
          </div>
        </div>
        <h1 className="text-xl font-bold text-white/90">{name}</h1>
      </div>

      {/* Birth Details */}
      <div className="px-6 mb-6">
        {birthDetails.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3.5 border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-white/25" />
              <span className="text-sm text-white/50">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-white/80 text-right max-w-[55%] truncate">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-pink-500/10 mb-6" />

      {/* Astrological Data */}
      <div className="px-6 mb-8">
        {astroDetails.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3.5 border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm text-white/50">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-pink-300/80">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Ornamental divider */}
      <div className="flex justify-center py-6 opacity-20">
        <div className="w-48 h-4 border-t border-white/20" />
      </div>

      {/* Scroll to top */}
      <div className="flex justify-end px-6 pb-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-[#2A2A40] flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5 text-pink-400/60" />
        </button>
      </div>
    </motion.div>
  )
}
