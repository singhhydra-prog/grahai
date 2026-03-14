"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import BottomNav from "@/components/ui/BottomNav"
import type { TabType } from "@/types/app"

/* Lazy-load all tab components */
const HomeTab = dynamic(() => import("@/components/app/tabs/HomeTab"), { ssr: false })
const AskTab = dynamic(() => import("@/components/app/tabs/AskTab"), { ssr: false })
const MyChartTab = dynamic(() => import("@/components/app/tabs/MyChartTab"), { ssr: false })
const ReportsTab = dynamic(() => import("@/components/app/tabs/ReportsTab"), { ssr: false })
const ProfileTab = dynamic(() => import("@/components/app/tabs/ProfileTab"), { ssr: false })
const OnboardingFlow = dynamic(() => import("@/components/app/OnboardingFlow"), { ssr: false })
const PricingOverlay = dynamic(() => import("@/components/app/PricingOverlay"), { ssr: false })
const ReferralPage = dynamic(() => import("@/components/app/ReferralPage"), { ssr: false })

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [askQuestion, setAskQuestion] = useState<string | undefined>(undefined)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showReferral, setShowReferral] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const birthData = localStorage.getItem("grahai-onboarding-birthdata")
      if (!birthData) setShowOnboarding(true)
    } catch {}
    setIsLoaded(true)
  }, [])

  // Navigate to ask tab with an optional question
  const goToAsk = (question?: string) => {
    setAskQuestion(question)
    setActiveTab("ask")
  }

  // Navigate to profile tab
  const goToProfile = () => {
    setActiveTab("profile")
  }

  // Navigate to reports tab
  const goToReports = () => {
    setActiveTab("reports")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A054] to-[#A16E2A] animate-pulse
            flex items-center justify-center">
            <span className="text-[#0A0E1A] font-bold">G</span>
          </div>
          <p className="text-xs text-[#5A6478]">Loading your guidance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh relative">

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={(goToAsk, firstQuestion) => {
            setShowOnboarding(false)
            if (goToAsk && firstQuestion) {
              setAskQuestion(firstQuestion)
              setActiveTab("ask")
            }
          }} />
        )}
      </AnimatePresence>

      {/* Main app */}
      {!showOnboarding && (
        <>
          {/* Tab content — relative z-index above starfield */}
          <div className="relative z-10 min-h-dvh">
            {activeTab === "home" && (
              <HomeTab
                onAskQuestion={goToAsk}
                onProfileClick={goToProfile}
                onViewReports={goToReports}
              />
            )}

            {activeTab === "ask" && (
              <AskTab initialQuestion={askQuestion} />
            )}

            {activeTab === "chart" && (
              <MyChartTab
                onProfileClick={goToProfile}
                onAskQuestion={(q) => goToAsk(q)}
              />
            )}

            {activeTab === "reports" && (
              <ReportsTab
                onProfileClick={goToProfile}
                onPricingClick={() => setShowPricing(true)}
                onAskQuestion={(q) => goToAsk(q)}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab
                onPricingClick={() => setShowPricing(true)}
                onReferralClick={() => setShowReferral(true)}
                onAskQuestion={(q) => goToAsk(q)}
              />
            )}
          </div>

          {/* Bottom Nav */}
          <BottomNav activeTab={activeTab} onTabChange={(tab) => {
            if (tab === "ask") {
              setAskQuestion(undefined) // reset when tapping ask tab directly
            }
            setActiveTab(tab)
          }} />

          {/* Overlays */}
          <PricingOverlay
            isOpen={showPricing}
            onClose={() => setShowPricing(false)}
          />
          <AnimatePresence>
            {showReferral && (
              <ReferralPage
                isOpen={showReferral}
                onClose={() => setShowReferral(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
