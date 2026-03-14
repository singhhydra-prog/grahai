"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import BottomNav from "@/components/ui/BottomNav"
import type { TabType } from "@/types/app"

/* Lazy-load tabs */
const QuestionsHome = dynamic(() => import("@/components/app/tabs/QuestionsHome"), { ssr: false })
const QuestionsChat = dynamic(() => import("@/components/app/tabs/QuestionsChat"), { ssr: false })
const ReportsTab = dynamic(() => import("@/components/app/tabs/ReportsTab"), { ssr: false })
const CompatibilityTab = dynamic(() => import("@/components/app/tabs/CompatibilityTab"), { ssr: false })
const ProfileView = dynamic(() => import("@/components/app/ProfileView"), { ssr: false })
const OnboardingFlow = dynamic(() => import("@/components/app/OnboardingFlow"), { ssr: false })

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabType>("questions")
  const [showChat, setShowChat] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const birthData = localStorage.getItem("grahai-onboarding-birthdata")
      if (!birthData) setShowOnboarding(true)
    } catch {}
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#080818]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-800 animate-pulse" />
          <p className="text-xs text-white/30">Loading your stars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#080818]">
      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Main app */}
      {!showOnboarding && (
        <>
          {/* Tab content */}
          <div className="min-h-dvh">
            {activeTab === "questions" && !showChat && (
              <QuestionsHome
                onAskQuestion={() => setShowChat(true)}
                onProfileClick={() => setShowProfile(true)}
              />
            )}

            {activeTab === "reports" && (
              <ReportsTab onProfileClick={() => setShowProfile(true)} />
            )}

            {activeTab === "compatibility" && (
              <CompatibilityTab onProfileClick={() => setShowProfile(true)} />
            )}
          </div>

          {/* Bottom Nav */}
          {!showChat && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}

          {/* Questions Chat overlay */}
          <AnimatePresence>
            {showChat && (
              <QuestionsChat onClose={() => setShowChat(false)} />
            )}
          </AnimatePresence>

          {/* Profile overlay */}
          <AnimatePresence>
            {showProfile && (
              <ProfileView onClose={() => setShowProfile(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
