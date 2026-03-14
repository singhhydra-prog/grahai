"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface ProfileSelectorProps {
  className?: string
}

export default function ProfileSelector({ className = "" }: ProfileSelectorProps) {
  const [name, setName] = useState("Guest")
  const [initial, setInitial] = useState("G")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored)
        const n = data.name || "Guest"
        setName(n.split(" ")[0])
        setInitial(n.charAt(0).toUpperCase())
      }
      const nameOverride = localStorage.getItem("userNameForGreeting")
      if (nameOverride) {
        setName(nameOverride)
        setInitial(nameOverride.charAt(0).toUpperCase())
      }
    } catch {}
  }, [])

  return (
    <button
      className={`flex items-center gap-2 rounded-full bg-[#1E1E3A] px-3 py-1.5
        border border-[#2A2A4A] hover:border-[#3A3A5A] transition-colors ${className}`}
    >
      {/* Avatar */}
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600
        flex items-center justify-center text-[10px] font-bold text-white">
        {initial}
      </div>
      <span className="text-xs text-white/80 font-medium max-w-[80px] truncate">{name}</span>
      <ChevronDown className="w-3 h-3 text-white/40" />
    </button>
  )
}
