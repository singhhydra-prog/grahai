"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import BottomNav from "@/components/ui/BottomNav"
import type { TabType, OverlayType, BirthData } from "@/types/app"

/* Lazy-load tab contents for code splitting */
const HomeTab = dynamic(() => import("@/components/app/tabs/HomeTab"), { ssr: false })
const AskTab = dynamic(() => import("@/components/app/tabs/AskTab"), { ssr: false })
const ReportsTab = dynamic(() => import("@/components/app/tabs/ReportsTab"), { ssr: false })
const ProfileTab = dynamic(() => import("@/components/app/tabs/ProfileTab"), { ssr: false })
const OnboardingFlow = dynamic(() => import("@/components/app/OnboardingFlow"), { ssr: false })

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    try {
      const birthData = localStorage.getItem("grahai-onboarding-birthdata")
      if (!birthData) {
        setShowOnboarding(true)
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  const handleOnboardingComplete = (data: BirthData) => {
    setShowOnboarding(false)
  }

  const handleShowOverlay = (overlay: OverlayType) => {
    // Future: handle overlay display (pricing, settings, etc.)
    console.log("Show overlay:", overlay)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full cosmic-gradient animate-pulse" />
          <p className="text-sm text-text-dim">Loading your stars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg">
      {/* ═══ Onboarding ═══ */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {/* ═══ Main App ═══ */}
      {!showOnboarding && (
        <>
          <div className="h-dvh overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto pt-2"
                >
                  <HomeTab onTabChange={setActiveTab} />
                </motion.div>
              )}

              {activeTab === "ask" && (
                <motion.div
                  key="ask"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <AskTab />
                </motion.div>
              )}

              {activeTab === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto pt-2"
                >
                  <ReportsTab onTabChange={setActiveTab} />
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto pt-2"
                >
                  <ProfileTab onShowOverlay={handleShowOverlay} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}
