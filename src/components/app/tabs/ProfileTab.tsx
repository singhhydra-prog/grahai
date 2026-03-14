"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Calendar, MapPin, Clock, LogOut, ChevronRight, Crown,
  Bell, Shield, HelpCircle, Star, CreditCard, MessageCircle,
  FileText, Heart, History, Users, Share2, Moon, Sun, ArrowRight,
  X, ArrowLeft
} from "lucide-react"
import type { BirthData, AstroProfile } from "@/types/app"

interface ProfileTabProps {
  onPricingClick: () => void
  onReferralClick: () => void
  onAskQuestion: (q: string) => void
}

const DEFAULT_ASTRO: AstroProfile = {
  moonSign: "Cancer", risingSign: "Leo", sunSignVedic: "Virgo",
  sunSignWestern: "Libra", nakshatra: "Pushya",
}

type SubPage = null | "questions-history" | "reports-history" | "compatibility-history" | "family" | "help"

export default function ProfileTab({ onPricingClick, onReferralClick, onAskQuestion }: ProfileTabProps) {
  const [name, setName] = useState("")
  const [initials, setInitials] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [astro, setAstro] = useState<AstroProfile>(DEFAULT_ASTRO)
  const [tier] = useState<"free" | "plus" | "premium">("free")
  const [astroMode, setAstroMode] = useState<"vedic" | "western">("vedic")
  const [questionsLeft, setQuestionsLeft] = useState(0)
  const [reportsLeft, setReportsLeft] = useState(0)
  const [subPage, setSubPage] = useState<SubPage>(null)
  const [showSignOut, setShowSignOut] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setName(data.name || "Guest")
        const parts = (data.name || "G").split(" ")
        setInitials(parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : (data.name || "G").substring(0, 2).toUpperCase())
      }
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const s = JSON.parse(snap)
        if (s.snapshot) {
          const sn = s.snapshot
          setAstro(prev => ({
            ...prev,
            sunSignVedic: sn.vedicSign?.name || prev.sunSignVedic,
            nakshatra: sn.nakshatra?.name || prev.nakshatra,
          }))
        }
      }
      const q = localStorage.getItem("grahai-questions-left")
      if (q) setQuestionsLeft(parseInt(q))
      const r = localStorage.getItem("grahai-reports-left")
      if (r) setReportsLeft(parseInt(r))
    } catch {}
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("grahai-onboarding-birthdata")
    localStorage.removeItem("grahai-cosmic-snapshot")
    localStorage.removeItem("userNameForGreeting")
    localStorage.removeItem("grahai-user-intent")
    localStorage.removeItem("grahai-questions-left")
    localStorage.removeItem("grahai-reports-left")
    localStorage.removeItem("grahai-subscription-tier")
    window.location.reload()
  }

  const tierLabel = tier === "free" ? "Free" : tier === "plus" ? "Graha" : "Rishi"

  const signChips = astroMode === "vedic"
    ? [
        { icon: Moon, label: astro.moonSign, type: "Moon" },
        { icon: Sun, label: astro.sunSignVedic, type: "Sun" },
        { icon: Star, label: astro.risingSign, type: "Rising" },
      ]
    : [
        { icon: Moon, label: astro.moonSign, type: "Moon" },
        { icon: Sun, label: astro.sunSignWestern || astro.sunSignVedic, type: "Sun" },
        { icon: Star, label: astro.risingSign, type: "Rising" },
      ]

  const balanceCards = [
    { icon: MessageCircle, label: "Questions", count: questionsLeft, cta: "Buy Questions", color: "text-[#D4A054]" },
    { icon: FileText, label: "Reports", count: reportsLeft, cta: "Buy Reports", color: "text-[#D4A054]" },
    { icon: Heart, label: "Compatibility", count: 0, cta: "Buy Compatibility", color: "text-[#D4A054]" },
  ]

  const activityItems: { icon: typeof Share2; label: string; action: () => void }[] = [
    { icon: Share2, label: "Refer & Earn", action: onReferralClick },
    { icon: History, label: "Questions History", action: () => setSubPage("questions-history") },
    { icon: FileText, label: "Reports History", action: () => setSubPage("reports-history") },
    { icon: Heart, label: "Compatibility History", action: () => setSubPage("compatibility-history") },
    { icon: Users, label: "Family Members", action: () => setSubPage("family") },
  ]

  // Sub-page content renderer
  const subPageContent: Record<Exclude<SubPage, null>, { title: string; emptyMsg: string; emptyAction?: string }> = {
    "questions-history": { title: "Questions History", emptyMsg: "Your past questions and answers will appear here.", emptyAction: "Ask your first question" },
    "reports-history": { title: "Reports History", emptyMsg: "Reports you generate or purchase will appear here." },
    "compatibility-history": { title: "Compatibility History", emptyMsg: "Your compatibility checks will appear here." },
    "family": { title: "Family Members", emptyMsg: "Add family members to view their charts and get guidance for them." },
    "help": { title: "Help & Support", emptyMsg: "" },
  }

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-base font-semibold text-[#F1F0F5] text-3d">Profile</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#5A6478] bg-[#111827] border border-[#1E293B] rounded-full px-2.5 py-1">
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Profile card */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4A054]/20 to-[#A16E2A]/10
            border border-[#D4A054]/20 flex items-center justify-center">
            <span className="text-lg font-bold text-[#D4A054]">{initials || "?"}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#F1F0F5]">{name || "Guest"}</h2>
            <div className="flex items-center gap-2 text-xs text-[#5A6478]">
              {birthData?.dateOfBirth && (
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{birthData.dateOfBirth}</span>
              )}
              {birthData?.placeOfBirth && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{birthData.placeOfBirth.split(",")[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Vedic / Western toggle */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setAstroMode("vedic")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              astroMode === "vedic" ? "bg-[#D4A054]/15 text-[#D4A054] border border-[#D4A054]/30" : "bg-[#111827] text-[#5A6478] border border-[#1E293B]"
            }`}>Vedic</button>
          <button onClick={() => setAstroMode("western")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              astroMode === "western" ? "bg-[#D4A054]/15 text-[#D4A054] border border-[#D4A054]/30" : "bg-[#111827] text-[#5A6478] border border-[#1E293B]"
            }`}>Western</button>
        </div>

        {/* Sign chips */}
        <div className="flex gap-2 mb-5">
          {signChips.map((chip) => (
            <div key={chip.type}
              className="flex items-center gap-1.5 bg-[#111827] border border-[#1E293B] rounded-full px-3 py-1.5">
              <chip.icon className="w-3 h-3 text-[#5A6478]" />
              <span className="text-xs text-[#94A3B8]">{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Balance cards */}
      <div className="px-5 space-y-2.5 mb-5">
        {balanceCards.map((card) => (
          <div key={card.label}
            className="flex items-center justify-between glass-card px-4 py-3.5">
            <div className="flex items-center gap-3">
              <card.icon className="w-4 h-4 text-[#5A6478]" />
              <div>
                <p className="text-sm font-semibold text-[#F1F0F5]">{card.count} {card.label}</p>
                <p className="text-[10px] text-[#5A6478]">available</p>
              </div>
            </div>
            <button onClick={onPricingClick}
              className="text-xs font-medium text-[#0A0E1A] bg-[#D4A054] px-4 py-1.5 rounded-full">
              {card.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Help & Support */}
      <div className="mx-5 mb-5">
        <button onClick={() => setSubPage("help")}
          className="w-full glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <HelpCircle className="w-4 h-4 text-[#5A6478]" />
            <p className="text-sm font-semibold text-[#F1F0F5] text-visible">Help & Support</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6478]" />
        </button>
      </div>

      {/* Activity section */}
      <div className="mx-5 mb-5">
        <p className="text-xs font-semibold text-[#5A6478] mb-2 uppercase tracking-wide px-1">Activity</p>
        <div className="glass-card overflow-hidden">
          {activityItems.map((item, i) => (
            <button key={item.label} onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 ${
                i < activityItems.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}>
              <item.icon className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm text-[#F1F0F5] flex-1">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-[#5A6478]" />
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade banner */}
      {tier === "free" && (
        <div className="mx-5 mb-5">
          <button onClick={onPricingClick}
            className="w-full flex items-center gap-3 glass-card-hero gold-shimmer p-4">
            <Crown className="w-5 h-5 text-[#D4A054]" />
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-[#D4A054]">Upgrade to Premium</p>
              <p className="text-xs text-[#5A6478]">Unlimited questions, deeper insights, full reports</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D4A054]" />
          </button>
        </div>
      )}

      {/* Sign out */}
      <div className="mx-5 mb-4">
        <button onClick={() => setShowSignOut(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-rose-400/70 hover:text-rose-400 transition-colors">
          <LogOut className="w-4 h-4" />Sign out
        </button>
      </div>
      <div className="text-center pb-8">
        <p className="text-[10px] text-[#5A6478]/40">GrahAI v3.0 &middot; Made with care in India</p>
      </div>

      {/* ═══ Sign Out Confirmation ═══ */}
      <AnimatePresence>
        {showSignOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-8"
            onClick={() => setShowSignOut(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-base font-semibold text-[#F1F0F5] text-center mb-2">Sign out?</h3>
              <p className="text-sm text-[#5A6478] text-center mb-5">
                This will clear your birth data and chart from this device. You can always re-enter it later.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowSignOut(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-[#94A3B8] bg-[#1E2638] border border-[#1E293B]">
                  Cancel
                </button>
                <button onClick={handleSignOut}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-rose-500/80">
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Sub Pages ═══ */}
      <AnimatePresence>
        {subPage && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0E1A] overflow-y-auto"
          >
            <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-[#1E293B]">
              <button onClick={() => setSubPage(null)}
                className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B] flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-[#5A6478]" />
              </button>
              <h1 className="text-base font-semibold text-[#F1F0F5]">{subPageContent[subPage].title}</h1>
            </div>

            <div className="px-5 pt-8">
              {subPage === "help" ? (
                <div className="space-y-3">
                  {[
                    { label: "How does GrahAI work?", answer: "GrahAI uses your birth date, time, and place to compute your Vedic chart. Our AI then interprets classical Jyotish principles (from texts like BPHS) to provide personalized guidance." },
                    { label: "How accurate is it?", answer: "Accuracy depends on birth time precision. GrahAI uses the same sidereal calculations as traditional astrologers, enhanced by AI for more nuanced interpretation." },
                    { label: "Is my data safe?", answer: "Your birth data is stored locally on your device. We don't share your personal information with third parties." },
                    { label: "How do I get more questions?", answer: "You can upgrade to a Graha or Rishi plan for more daily questions, or buy question packs from the pricing page." },
                    { label: "Can I get a refund?", answer: "Yes, we offer a 7-day refund policy on all purchases. Contact support for assistance." },
                  ].map((faq, i) => (
                    <div key={i} className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#F1F0F5] mb-2">{faq.label}</p>
                      <p className="text-xs text-[#5A6478] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => { setSubPage(null); onAskQuestion("I need help with something") }}
                    className="w-full flex items-center gap-3 bg-[#111827] border border-[#D4A054]/15
                      rounded-xl px-4 py-3.5 mt-4">
                    <MessageCircle className="w-4 h-4 text-[#D4A054]" />
                    <span className="text-sm text-[#94A3B8] flex-1">Ask GrahAI for help</span>
                    <ArrowRight className="w-4 h-4 text-[#5A6478]" />
                  </button>
                </div>
              ) : subPage === "family" ? (
                <div className="text-center pt-8">
                  <Users className="w-12 h-12 text-[#5A6478]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#5A6478] mb-2">{subPageContent[subPage].emptyMsg}</p>
                  <button onClick={onPricingClick}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-[#D4A054] bg-[#D4A054]/10 border border-[#D4A054]/20">
                    Unlock with Rishi plan
                  </button>
                </div>
              ) : (
                <div className="text-center pt-8">
                  <History className="w-12 h-12 text-[#5A6478]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#5A6478] mb-2">{subPageContent[subPage].emptyMsg}</p>
                  {subPageContent[subPage].emptyAction && (
                    <button
                      onClick={() => { setSubPage(null); onAskQuestion("") }}
                      className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-[#D4A054] bg-[#D4A054]/10 border border-[#D4A054]/20">
                      {subPageContent[subPage].emptyAction}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
