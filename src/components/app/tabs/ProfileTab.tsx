"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User, Calendar, MapPin, Clock, LogOut, ChevronRight, Crown,
  Bell, Shield, HelpCircle, Star, CreditCard
} from "lucide-react"
import type { BirthData } from "@/types/app"

interface ProfileTabProps {
  onPricingClick: () => void
}

export default function ProfileTab({ onPricingClick }: ProfileTabProps) {
  const [name, setName] = useState("")
  const [initials, setInitials] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [tier] = useState<"free" | "plus" | "premium">("free")

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
    } catch {}
  }, [])

  const tierLabel = tier === "free" ? "Free" : tier === "plus" ? "Plus" : "Premium"
  const tierColor = tier === "free" ? "text-[#5A6478]" : "text-[#D4A054]"

  const menuSections = [
    {
      title: "Account",
      items: [
        { Icon: User, label: "Edit Profile", desc: "Name, birth details", action: () => {} },
        { Icon: CreditCard, label: "Subscription", desc: `${tierLabel} plan`, action: onPricingClick },
        { Icon: Bell, label: "Notifications", desc: "Daily insights, reminders", action: () => {} },
      ],
    },
    {
      title: "Support",
      items: [
        { Icon: HelpCircle, label: "Help & FAQ", desc: "Common questions answered", action: () => {} },
        { Icon: Shield, label: "Privacy & Data", desc: "How we protect your data", action: () => {} },
        { Icon: Star, label: "Rate GrahAI", desc: "Share your experience", action: () => {} },
      ],
    },
  ]

  return (
    <div className="min-h-full pb-24">
      {/* Profile header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A054]/20 to-[#A16E2A]/10
            border border-[#D4A054]/20 flex items-center justify-center">
            <span className="text-xl font-bold text-[#D4A054]">{initials || "?"}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#F1F0F5]">{name || "Guest"}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-medium ${tierColor}`}>
                {tierLabel} Plan
              </span>
              {tier === "free" && (
                <button
                  onClick={onPricingClick}
                  className="flex items-center gap-1 text-[10px] text-[#D4A054] font-medium
                    bg-[#D4A054]/10 px-2 py-0.5 rounded-full"
                >
                  <Crown className="w-3 h-3" />
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Birth details summary */}
      {birthData && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-5 bg-[#111827] border border-[#1E293B] rounded-xl p-4"
        >
          <h3 className="text-xs font-semibold text-[#5A6478] mb-3 uppercase tracking-wide">
            Birth Details
          </h3>
          <div className="space-y-2.5">
            {[
              { Icon: Calendar, label: "Date", value: birthData.dateOfBirth },
              { Icon: Clock, label: "Time", value: birthData.timeOfBirth || "Unknown" },
              { Icon: MapPin, label: "Place", value: birthData.placeOfBirth },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#5A6478]" />
                  <span className="text-xs text-[#5A6478]">{label}</span>
                </div>
                <span className="text-xs font-medium text-[#94A3B8]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.08 }}
          className="mx-5 mb-4"
        >
          <h3 className="text-xs font-semibold text-[#5A6478] mb-2 uppercase tracking-wide px-1">
            {section.title}
          </h3>
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                  hover:bg-[#1A2236] transition-colors ${
                  i < section.items.length - 1 ? "border-b border-[#1E293B]/60" : ""
                }`}
              >
                <item.Icon className="w-4 h-4 text-[#5A6478]" />
                <div className="flex-1">
                  <p className="text-sm text-[#F1F0F5]">{item.label}</p>
                  <p className="text-[11px] text-[#5A6478]">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5A6478]" />
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-5 mt-4"
      >
        <button className="w-full flex items-center justify-center gap-2 py-3 text-sm
          text-rose-400/70 hover:text-rose-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-8 pb-8">
        <p className="text-[10px] text-[#5A6478]/40">
          GrahAI v3.0 &middot; Made with care in India
        </p>
      </div>
    </div>
  )
}
