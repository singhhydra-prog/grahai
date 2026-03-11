"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CosmicStarField from "@/components/app/CosmicStarField"
import ScrollOfDestiny from "@/components/app/ScrollOfDestiny"
import LivingKundli from "@/components/app/LivingKundli"
import PlanetChat from "@/components/app/PlanetChat"
import CosmicRibbon from "@/components/app/CosmicRibbon"
import QuickActions from "@/components/app/QuickActions"
import BottomNav from "@/components/app/BottomNav"

/* ════════════════════════════════════════════════════════
   JYOTISH DARPAN · ज्योतिष दर्पण
   The Living Birth Chart App Experience

   Your Kundli IS the app. Tap any house. Talk to planets.
   Swipe through time. Share your cosmic insights.
   ════════════════════════════════════════════════════════ */

export default function JyotishDarpanApp() {
  const [chatPlanet, setChatPlanet] = useState<string | null>(null)
  const [showShareToast, setShowShareToast] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "GrahAI · My Cosmic Reading",
        text: "Jupiter is in your 10th house today. Recognition is coming your way! ✨",
        url: "https://grahai.vercel.app",
      }).catch(() => {})
    } else {
      // WhatsApp fallback
      const msg = encodeURIComponent(
        "🪐 My cosmic reading from GrahAI:\n\nJupiter is in your 10th house today.\nRecognition and authority are coming your way.\n\nGet your free reading: https://grahai.vercel.app"
      )
      window.open(`https://wa.me/?text=${msg}`, "_blank")
    }
  }

  return (
    <main className="relative min-h-screen pb-24">
      {/* Living star field background */}
      <CosmicStarField />

      {/* Content */}
      <div className="relative z-10">
        {/* App header */}
        <motion.header
          className="flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <h1 className="text-lg font-bold text-white">
              Graha<span className="text-gold">AI</span>
            </h1>
            <p className="text-[10px] font-hindi text-gold/30">ज्योतिष दर्पण</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm">🔔</span>
            </motion.div>
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-xs font-bold text-gold"
              whileTap={{ scale: 0.9 }}
            >
              H
            </motion.div>
          </div>
        </motion.header>

        {/* Scroll of Destiny — daily reading */}
        <div className="mt-2">
          <ScrollOfDestiny onShare={handleShare} />
        </div>

        {/* Living Kundli — interactive chart */}
        <div className="mt-8">
          <LivingKundli onTalkToPlanet={(p) => setChatPlanet(p)} />
        </div>

        {/* Cosmic Ribbon — timeline */}
        <CosmicRibbon />

        {/* Quick Actions grid */}
        <QuickActions />

        {/* Bottom spacer for nav */}
        <div className="h-8" />
      </div>

      {/* Planet Chat overlay */}
      <AnimatePresence>
        {chatPlanet && (
          <PlanetChat
            planetKey={chatPlanet}
            onClose={() => setChatPlanet(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <BottomNav />
    </main>
  )
}
