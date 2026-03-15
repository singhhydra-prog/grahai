"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import BottomNav from "@/components/ui/BottomNav"
import { LanguageProvider } from "@/lib/LanguageContext"
import type { TabType } from "@/types/app"

/* Lazy-load all tab components */
const HomeTab = dynamic(() => import("@/components/app/tabs/HomeTab"), { ssr: false })
const AskTab = dynamic(() => import("@/components/app/tabs/AskTab"), { ssr: false })
const CompatibilityTab = dynamic(() => import("@/components/app/tabs/CompatibilityTab"), { ssr: false })
const ReportsTab = dynamic(() => import("@/components/app/tabs/ReportsTab"), { ssr: false })
const ProfileTab = dynamic(() => import("@/components/app/tabs/ProfileTab"), { ssr: false })
const OnboardingFlow = dynamic(() => import("@/components/app/OnboardingFlow"), { ssr: false })
const PricingOverlay = dynamic(() => import("@/components/app/PricingOverlay"), { ssr: false })
const ReferralPage = dynamic(() => import("@/components/app/ReferralPage"), { ssr: false })
const PurchaseSuccess = dynamic(() => import("@/components/ui/PurchaseSuccess"), { ssr: false })
const GlobalFooter = dynamic(() => import("@/components/ui/GlobalFooter"), { ssr: false })

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [askQuestion, setAskQuestion] = useState<string | undefined>(undefined)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showReferral, setShowReferral] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState<{
    type: "subscription" | "report"
    planName?: string
    reportTitle?: string
    downloadUrl?: string
  } | null>(null)
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
      <div className="min-h-dvh flex items-center justify-center bg-[#0A0E1A]">
        <div className="flex flex-col items-center gap-5">
          <div className="app-loading-logo w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A054] via-[#E8C278] to-[#A16E2A]
            flex items-center justify-center shadow-lg">
            <span className="text-[#0A0E1A] font-bold text-xl tracking-tight">G</span>
          </div>
          <p className="app-loading-text text-[10px] text-[#8892A3] uppercase tracking-[0.12em] font-medium">
            Reading your stars
          </p>
          <div className="app-loading-bar">
            <div className="app-loading-bar-fill" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
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
              <AnimatePresence mode="wait">
                {activeTab === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <HomeTab
                      onAskQuestion={goToAsk}
                      onProfileClick={goToProfile}
                      onViewReports={goToReports}
                    />
                  </motion.div>
                )}

                {activeTab === "ask" && (
                  <motion.div
                    key="ask"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <AskTab initialQuestion={askQuestion} />
                  </motion.div>
                )}

                {activeTab === "compatibility" && (
                  <motion.div
                    key="compatibility"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <CompatibilityTab
                      onProfileClick={goToProfile}
                      onAskQuestion={(q) => goToAsk(q)}
                      onPricingClick={() => setShowPricing(true)}
                    />
                  </motion.div>
                )}

                {activeTab === "reports" && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <ReportsTab
                      onProfileClick={goToProfile}
                      onPricingClick={() => setShowPricing(true)}
                      onAskQuestion={(q) => goToAsk(q)}
                    />
                  </motion.div>
                )}

                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <ProfileTab
                      onPricingClick={() => setShowPricing(true)}
                      onReferralClick={() => setShowReferral(true)}
                      onAskQuestion={(q) => goToAsk(q)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Global Footer */}
            <GlobalFooter />

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

            {/* Purchase Success Overlay */}
            <PurchaseSuccess
              isOpen={!!purchaseSuccess}
              onClose={() => setPurchaseSuccess(null)}
              type={purchaseSuccess?.type || "subscription"}
              planName={purchaseSuccess?.planName}
              reportTitle={purchaseSuccess?.reportTitle}
              downloadUrl={purchaseSuccess?.downloadUrl}
            />
          </>
        )}
      </div>
    </LanguageProvider>
  )
}
