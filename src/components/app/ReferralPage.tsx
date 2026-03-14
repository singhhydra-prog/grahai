"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  X, Gift, Copy, Check, Share2, Users, Star, ArrowRight,
  MessageCircle, Crown
} from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

interface ReferralPageProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReferralPage({ isOpen, onClose }: ReferralPageProps) {
  const { t } = useLanguage()
  const [referralCode, setReferralCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [userName, setUserName] = useState("")
  const [referralCount] = useState(0)

  const REWARDS = [
    { milestone: 1, reward: t.referral.freeQuestions || "5 free questions", icon: MessageCircle },
    { milestone: 3, reward: t.referral.freeReport || "1 free report", icon: Star },
    { milestone: 5, reward: t.referral.monthGraha || "1 month Graha plan", icon: Crown },
    { milestone: 10, reward: t.referral.monthRishi || "1 month Rishi plan", icon: Gift },
  ]

  const HOW_IT_WORKS = [
    { step: "1", text: t.referral.step1 || "Share your unique referral code with friends" },
    { step: "2", text: t.referral.step2 || "They sign up and complete onboarding with your code" },
    { step: "3", text: t.referral.step3 || "You both get 3 bonus questions instantly" },
    { step: "4", text: t.referral.step4 || "Unlock bigger rewards as more friends join" },
  ]

  useEffect(() => {
    try {
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (bd) {
        const data = JSON.parse(bd)
        setUserName(data.name || "")
        // Generate a referral code from name
        const code = (data.name || "GRAHAI")
          .replace(/\s+/g, "")
          .substring(0, 6)
          .toUpperCase() + Math.floor(Math.random() * 900 + 100)
        setReferralCode(code)
      } else {
        setReferralCode("GRAHAI" + Math.floor(Math.random() * 9000 + 1000))
      }
    } catch {
      setReferralCode("GRAHAI" + Math.floor(Math.random() * 9000 + 1000))
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t.referral.shareText || `Join GrahAI for personalized Vedic astrology insights! Use my code: ${referralCode}\n\nhttps://grahai-app.vercel.app?ref=${referralCode}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GrahAI — Vedic Astrology",
          text: t.referral.shareText || `Join GrahAI for personalized Vedic astrology insights! Use my code: ${referralCode}`,
          url: `https://grahai-app.vercel.app?ref=${referralCode}`,
        })
      } catch {}
    } else {
      handleCopy()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#0A0E1A] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B] flex items-center justify-center">
          <X className="w-4 h-4 text-[#5A6478]" />
        </button>
        <h1 className="text-base font-semibold text-[#F1F0F5]">{t.referral.title || "Refer & Earn"}</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 pt-4 pb-32">
        {/* Hero */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-3">
            <Gift className="w-8 h-8 text-[#D4A054]" />
          </div>
          <h2 className="text-xl font-bold text-[#F1F0F5] mb-1">
            {t.referral.invite || "Share GrahAI"}{userName ? `, ${userName}` : ""}
          </h2>
          <p className="text-sm text-[#94A3B8]">
            {t.referral.subtitle || "Earn free questions, reports, and premium access for every friend who joins"}
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-[#111827] border border-[#D4A054]/20 rounded-2xl p-5 mb-5">
          <p className="text-xs text-[#5A6478] mb-2 text-center">{t.referral.yourCode || "Your referral code"}</p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl font-bold tracking-wider text-[#D4A054]">{referralCode}</span>
            <button onClick={handleCopy}
              className="w-9 h-9 rounded-lg bg-[#1E2638] border border-[#1E293B] flex items-center justify-center">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#5A6478]" />}
            </button>
          </div>
          <button onClick={handleShare}
            className="w-full py-3 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            {t.referral.invite || "Share with friends"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-[#5A6478] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#F1F0F5]">{referralCount}</p>
            <p className="text-[10px] text-[#5A6478]">{t.referral.friendsJoined || "Friends joined"}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 text-center">
            <Gift className="w-5 h-5 text-[#D4A054] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#F1F0F5]">0</p>
            <p className="text-[10px] text-[#5A6478]">{t.referral.rewardsEarned || "Rewards earned"}</p>
          </div>
        </div>

        {/* Rewards ladder */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 mb-5">
          <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">{t.referral.rewardMilestones || "Reward Milestones"}</h3>
          <div className="space-y-3">
            {REWARDS.map((r, i) => (
              <div key={r.milestone}
                className={`flex items-center gap-3 ${referralCount >= r.milestone ? "opacity-100" : "opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  referralCount >= r.milestone ? "bg-[#D4A054]/15" : "bg-[#1E2638]"
                }`}>
                  <r.icon className={`w-4 h-4 ${referralCount >= r.milestone ? "text-[#D4A054]" : "text-[#5A6478]"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#F1F0F5] font-medium">{r.reward}</p>
                  <p className="text-[10px] text-[#5A6478]">{t.referral.invite || "Invite"} {r.milestone} {r.milestone > 1 ? (t.referral.friends || "friends") : (t.referral.friend || "friend")}</p>
                </div>
                {referralCount >= r.milestone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-xs text-[#5A6478]">{r.milestone - referralCount} more</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">{t.referral.howItWorks || "How it works"}</h3>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#D4A054]">{s.step}</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
