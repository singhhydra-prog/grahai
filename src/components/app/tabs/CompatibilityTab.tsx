"use client"

import { motion } from "framer-motion"
import { Heart, Users } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"

interface CompatibilityTabProps {
  onProfileClick: () => void
}

export default function CompatibilityTab({ onProfileClick }: CompatibilityTabProps) {
  return (
    <div className="min-h-full pb-20">
      <AppHeader onProfileClick={onProfileClick} />

      {/* Subheader */}
      <div className="px-4 py-2 bg-[#0E0E25] text-center">
        <span className="text-xs text-white/40">Viewing your profile</span>
      </div>

      {/* Coming soon state */}
      <div className="flex flex-col items-center justify-center px-8 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-24 h-24 rounded-full bg-[#1A1A35] flex items-center justify-center mb-6 mx-auto">
            <Heart className="w-10 h-10 text-pink-500/40" />
          </div>

          <h2 className="text-xl font-bold text-white/80 mb-2">Compatibility</h2>
          <p className="text-sm text-white/40 mb-8 max-w-xs">
            Discover your cosmic compatibility with partner, friends, and family members.
            Coming soon with detailed Kundli matching.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {[
              { title: "Kundli Match", sub: "36 Guna Milan", icon: "💍" },
              { title: "Love Score", sub: "Relationship insights", icon: "💜" },
              { title: "Family Bond", sub: "Parent-child dynamics", icon: "👨‍👩‍👧" },
              { title: "Friend Check", sub: "Friendship compatibility", icon: "🤝" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-[#12122A] border border-[#1E1E45] rounded-2xl p-4 text-left"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="text-xs font-bold text-white/70">{item.title}</h3>
                <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
