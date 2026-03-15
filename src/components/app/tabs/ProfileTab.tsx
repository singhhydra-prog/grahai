"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Calendar, MapPin, Clock, LogOut, ChevronRight, Crown,
  Bell, Shield, HelpCircle, Star, CreditCard, MessageCircle,
  FileText, Heart, History, Users, Share2, Moon, Sun, ArrowRight,
  X, ArrowLeft, Globe, Edit3, AlertTriangle, ExternalLink, Bookmark
} from "lucide-react"
import KundliChart, { SAMPLE_PLANETS } from "@/components/ui/KundliChart"
import type { BirthData, AstroProfile } from "@/types/app"
import { useLanguage } from "@/lib/LanguageContext"
import { LANGUAGES, type Language } from "@/lib/i18n"
import LocationSearch, { type CityData } from "@/components/ui/LocationSearch"

interface ProfileTabProps {
  onPricingClick: () => void
  onReferralClick: () => void
  onAskQuestion: (q: string) => void
}

const DEFAULT_ASTRO: AstroProfile = {
  moonSign: "Cancer", risingSign: "Leo", sunSignVedic: "Virgo",
  sunSignWestern: "Libra", nakshatra: "Pushya",
}

type SubPage = null | "questions-history" | "reports-history" | "compatibility-history" | "family" | "help" | "edit-birth" | "change-language"

export default function ProfileTab({ onPricingClick, onReferralClick, onAskQuestion }: ProfileTabProps) {
  const { lang, t, setLanguage } = useLanguage()
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

  // Edit birth details state
  const [editBirthName, setEditBirthName] = useState("")
  const [editBirthDate, setEditBirthDate] = useState("")
  const [editBirthTime, setEditBirthTime] = useState("")
  const [editBirthTimeUnknown, setEditBirthTimeUnknown] = useState(false)
  const [editBirthPlaceText, setEditBirthPlaceText] = useState("")
  const [editBirthCity, setEditBirthCity] = useState<CityData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

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

  // Populate edit birth form when opening that subpage
  useEffect(() => {
    if (subPage === "edit-birth" && birthData) {
      setEditBirthName(birthData.name || "")
      setEditBirthDate(birthData.dateOfBirth || "")
      setEditBirthTime(birthData.timeOfBirth || "")
      setEditBirthTimeUnknown(birthData.timeOfBirth === "Unknown" || !birthData.timeOfBirth)
      setEditBirthPlaceText(birthData.placeOfBirth || "")
      if (birthData.placeOfBirth) {
        setEditBirthCity({
          name: birthData.placeOfBirth.split(",")[0],
          country: "",
          lat: birthData.latitude || 0,
          lng: birthData.longitude || 0,
          tz: birthData.timezone || "Asia/Kolkata",
        })
      }
    }
  }, [subPage, birthData])

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

  const handleSaveBirthDetails = async () => {
    setIsSaving(true)
    try {
      const updatedBirthData: BirthData = {
        name: editBirthName,
        dateOfBirth: editBirthDate,
        timeOfBirth: editBirthTimeUnknown ? "Unknown" : editBirthTime,
        placeOfBirth: editBirthPlaceText || editBirthCity?.name || "",
        latitude: editBirthCity?.lat || 0,
        longitude: editBirthCity?.lng || 0,
      }
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(updatedBirthData))
      setBirthData(updatedBirthData)
      setName(updatedBirthData.name || "Guest")
      const parts = (updatedBirthData.name || "G").split(" ")
      setInitials(parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : (updatedBirthData.name || "G").substring(0, 2).toUpperCase())
      // Close the subpage after brief delay
      setTimeout(() => setSubPage(null), 300)
    } catch (err) {
      console.error("Error saving birth details:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangeLanguage = (newLang: Language) => {
    setLanguage(newLang)
    setTimeout(() => setSubPage(null), 300)
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
    { icon: MessageCircle, label: t.profile.questions, count: questionsLeft, cta: t.profile.buyQuestions, color: "text-[#D4A054]" },
    { icon: FileText, label: t.profile.reportsLabel, count: reportsLeft, cta: t.profile.buyReports, color: "text-[#D4A054]" },
    { icon: Heart, label: t.profile.compatibility, count: 0, cta: t.profile.buyCompatibility, color: "text-[#D4A054]" },
  ]

  const activityItems: { icon: typeof Share2; label: string; action: () => void; external?: boolean }[] = [
    { icon: Share2, label: t.profile.referEarn, action: onReferralClick },
    { icon: History, label: t.profile.questionsHistory, action: () => setSubPage("questions-history") },
    { icon: FileText, label: t.profile.reportsHistory, action: () => setSubPage("reports-history") },
    { icon: Heart, label: t.profile.compatHistory, action: () => setSubPage("compatibility-history") },
    { icon: Bookmark, label: "Your Library", action: () => window.open("/library", "_blank"), external: true },
    { icon: CreditCard, label: "Billing & Payments", action: () => window.open("/billing", "_blank"), external: true },
    { icon: Users, label: t.profile.familyMembers, action: () => setSubPage("family") },
  ]

  // Sub-page content renderer
  const subPageContent: Record<Exclude<SubPage, null>, { title: string; emptyMsg: string; emptyAction?: string }> = {
    "questions-history": { title: t.profile.questionsHistory, emptyMsg: "Your past questions and answers will appear here.", emptyAction: "Ask your first question" },
    "reports-history": { title: t.profile.reportsHistory, emptyMsg: "Reports you generate or purchase will appear here." },
    "compatibility-history": { title: t.profile.compatHistory, emptyMsg: "Your compatibility checks will appear here." },
    "family": { title: t.profile.familyMembers, emptyMsg: "Add family members to view their charts and get guidance for them." },
    "help": { title: t.profile.helpSupport, emptyMsg: "" },
    "edit-birth": { title: t.profile.editBirthTitle, emptyMsg: "" },
    "change-language": { title: t.profile.changeLanguage, emptyMsg: "" },
  }

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-base font-semibold text-[#F1F0F5] text-3d">{t.profile.title}</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8892A3] bg-[#111827] border border-[#1E293B] rounded-full px-2.5 py-1">
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
            <div className="flex items-center gap-2 text-xs text-[#8892A3]">
              {birthData?.dateOfBirth && (
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{birthData.dateOfBirth}</span>
              )}
              {birthData?.placeOfBirth && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{birthData.placeOfBirth.split(",")[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Birth Details and Change Language buttons */}
        <div className="px-0 space-y-2 mb-4">
          <button onClick={() => setSubPage("edit-birth")}
            className="w-full flex items-center gap-3 glass-card px-4 py-3 press-scale">
            <Edit3 className="w-4 h-4 text-[#D4A054]" />
            <span className="text-sm text-[#F1F0F5] flex-1">{t.profile.editBirthDetails}</span>
            <ChevronRight className="w-4 h-4 text-[#8892A3]" />
          </button>
          <button onClick={() => setSubPage("change-language")}
            className="w-full flex items-center gap-3 glass-card px-4 py-3 press-scale">
            <Globe className="w-4 h-4 text-[#D4A054]" />
            <div className="flex-1 text-left">
              <span className="text-sm text-[#F1F0F5]">{t.profile.changeLanguage}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8892A3]" />
          </button>
        </div>
        <div className="section-divider" />

        {/* Vedic / Western toggle */}
        <div className="flex gap-2 mb-3 glass-inner rounded-2xl p-1">
          <button onClick={() => setAstroMode("vedic")}
            className={`flex-1 py-2 text-xs font-medium tab-pill ${
              astroMode === "vedic" ? "tab-pill-active" : "text-[#8892A3]"
            }`}>{t.profile.vedic}</button>
          <button onClick={() => setAstroMode("western")}
            className={`flex-1 py-2 text-xs font-medium tab-pill ${
              astroMode === "western" ? "tab-pill-active" : "text-[#8892A3]"
            }`}>{t.profile.western}</button>
        </div>

        {/* Sign chips */}
        <div className="flex gap-2 mb-5">
          {signChips.map((chip) => (
            <div key={chip.type}
              className="flex items-center gap-1.5 glass-inner rounded-full px-3 py-1.5 zodiac-badge">
              <chip.icon className="w-3 h-3 text-[#8892A3]" />
              <span className="text-xs text-[#ACB8C4]">{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Birth Chart (Kundli) */}
        {astroMode === "vedic" && (
          <div className="glass-card p-4 mb-5">
            <KundliChart
              planets={SAMPLE_PLANETS}
              ascendantSign={5}
              chartType="birth"
              size={280}
              showLabels
            />
          </div>
        )}
      </div>

      <div className="section-divider mx-5" />

      {/* Balance cards */}
      <div className="px-5 space-y-2.5 mb-5">
        {balanceCards.map((card) => (
          <div key={card.label}
            className="flex items-center justify-between glass-card px-4 py-3.5">
            <div className="flex items-center gap-3">
              <card.icon className="w-4 h-4 text-[#8892A3]" />
              <div>
                <p className="text-sm font-semibold text-[#F1F0F5]">{card.count} {card.label}</p>
                <p className="text-[10px] text-[#8892A3]">{t.profile.available}</p>
              </div>
            </div>
            <button onClick={onPricingClick}
              className="text-xs font-medium text-[#0A0E1A] bg-[#D4A054] px-4 py-1.5 rounded-full">
              {card.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="section-divider mx-5" />

      {/* Help & Support */}
      <div className="mx-5 mb-5">
        <p className="text-xs font-semibold text-[#8892A3] mb-2 uppercase tracking-wide px-1">{t.profile.helpSupport}</p>
        <div className="glass-card overflow-hidden">
          <button onClick={() => window.open("/faq", "_blank")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 border-b border-white/[0.04] press-scale">
            <HelpCircle className="w-4 h-4 text-[#8892A3]" />
            <span className="text-sm text-[#F1F0F5] flex-1">FAQ</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8892A3]" />
          </button>
          <button onClick={() => window.open("/support", "_blank")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 border-b border-white/[0.04] press-scale">
            <MessageCircle className="w-4 h-4 text-[#8892A3]" />
            <span className="text-sm text-[#F1F0F5] flex-1">Contact Support</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8892A3]" />
          </button>
          <button onClick={() => setSubPage("help")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 press-scale">
            <Star className="w-4 h-4 text-[#8892A3]" />
            <span className="text-sm text-[#F1F0F5] flex-1">Quick Help</span>
            <ChevronRight className="w-4 h-4 text-[#8892A3]" />
          </button>
        </div>
      </div>

      <div className="section-divider mx-5" />

      {/* Activity section */}
      <div className="mx-5 mb-5">
        <p className="text-xs font-semibold text-[#8892A3] mb-2 uppercase tracking-wide px-1">{t.profile.activity}</p>
        <div className="glass-card overflow-hidden">
          {activityItems.map((item, i) => (
            <button key={item.label} onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 press-scale ${
                i < activityItems.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}>
              <item.icon className="w-4 h-4 text-[#8892A3]" />
              <span className="text-sm text-[#F1F0F5] flex-1">{item.label}</span>
              {item.external ? <ExternalLink className="w-3.5 h-3.5 text-[#8892A3]" /> : <ChevronRight className="w-4 h-4 text-[#8892A3]" />}
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
              <p className="text-sm font-semibold text-[#D4A054]">{t.profile.upgradePremium}</p>
              <p className="text-xs text-[#8892A3]">{t.profile.upgradeDesc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D4A054]" />
          </button>
        </div>
      )}

      {/* Legal section */}
      <div className="mx-5 mb-5">
        <p className="text-xs font-semibold text-[#8892A3] mb-2 uppercase tracking-wide px-1">Legal</p>
        <div className="glass-card overflow-hidden">
          {([
            { icon: AlertTriangle, label: "Disclaimer", href: "/disclaimer" },
            { icon: FileText, label: "Terms & Conditions", href: "/terms" },
            { icon: Shield, label: "Privacy Policy", href: "/privacy-policy" },
            { icon: CreditCard, label: "Cancellation & Refund", href: "/refund-policy" },
          ]).map((item, i, arr) => (
            <button key={item.label} onClick={() => window.open(item.href, "_blank")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors relative z-10 ${
                i < arr.length - 1 ? "border-b border-white/[0.04]" : ""
              }`}>
              <item.icon className="w-4 h-4 text-[#8892A3]" />
              <span className="text-sm text-[#F1F0F5] flex-1">{item.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8892A3]" />
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="mx-5 mb-4">
        <button onClick={() => setShowSignOut(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-rose-400/70 hover:text-rose-400 transition-colors">
          <LogOut className="w-4 h-4" />{t.profile.signOut}
        </button>
      </div>
      <div className="text-center pb-8">
        <p className="text-[10px] text-[#8892A3]/40">{t.profile.version}</p>
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
              <h3 className="text-base font-semibold text-[#F1F0F5] text-center mb-2">{t.profile.signOut}?</h3>
              <p className="text-sm text-[#8892A3] text-center mb-5">
                {t.profile.signOutDesc}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowSignOut(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-[#ACB8C4] bg-[#1E2638] border border-[#1E293B]">
                  {t.profile.cancel}
                </button>
                <button onClick={handleSignOut}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-rose-500/80">
                  {t.profile.signOut}
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
                <ArrowLeft className="w-4 h-4 text-[#8892A3]" />
              </button>
              <h1 className="text-base font-semibold text-[#F1F0F5]">{subPageContent[subPage].title}</h1>
            </div>

            <div className="px-5 pt-8">
              {subPage === "edit-birth" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F1F0F5] mb-2">
                      {t.onboarding.fullName}
                    </label>
                    <input
                      type="text"
                      value={editBirthName}
                      onChange={(e) => setEditBirthName(e.target.value)}
                      placeholder={t.onboarding.fullNamePlaceholder}
                      className="w-full bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 text-[#F1F0F5] placeholder-[#8892A3] focus:outline-none focus:border-[#D4A054]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F1F0F5] mb-2">
                      {t.onboarding.dateOfBirth}
                    </label>
                    <input
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className="w-full bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 text-[#F1F0F5] focus:outline-none focus:border-[#D4A054]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F1F0F5] mb-2">
                      {t.onboarding.timeOfBirth}
                    </label>
                    <input
                      type="time"
                      value={editBirthTime}
                      onChange={(e) => setEditBirthTime(e.target.value)}
                      disabled={editBirthTimeUnknown}
                      className="w-full bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 text-[#F1F0F5] focus:outline-none focus:border-[#D4A054] disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 mt-2 text-sm text-[#8892A3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editBirthTimeUnknown}
                        onChange={(e) => setEditBirthTimeUnknown(e.target.checked)}
                        className="rounded"
                      />
                      {t.onboarding.dontKnowTime}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F1F0F5] mb-2">
                      {t.onboarding.placeOfBirth}
                    </label>
                    <LocationSearch
                      value={editBirthPlaceText}
                      onChange={(value, city) => {
                        setEditBirthPlaceText(value)
                        if (city) setEditBirthCity(city)
                      }}
                      placeholder={t.onboarding.placePlaceholder}
                    />
                  </div>

                  <button
                    onClick={handleSaveBirthDetails}
                    disabled={isSaving}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-medium text-[#0A0E1A] bg-[#D4A054] hover:bg-[#C99240] disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? t.profile.saving : t.profile.saveChanges}
                  </button>
                </div>
              ) : subPage === "change-language" ? (
                <div className="grid grid-cols-3 gap-3 pb-8">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleChangeLanguage(language.code)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        lang === language.code
                          ? "border-[#D4A054] bg-[#D4A054]/10"
                          : "border-[#1E293B] bg-[#111827] hover:border-[#D4A054]/50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[#F1F0F5]">{language.label}</p>
                      <p className="text-xs text-[#8892A3] mt-1">{language.labelEn}</p>
                    </button>
                  ))}
                </div>
              ) : subPage === "help" ? (
                <div className="space-y-3">
                  {[
                    { label: t.profile.faq1Q, answer: t.profile.faq1A },
                    { label: t.profile.faq2Q, answer: t.profile.faq2A },
                    { label: t.profile.faq3Q, answer: t.profile.faq3A },
                    { label: t.profile.faq4Q, answer: t.profile.faq4A },
                    { label: t.profile.faq5Q, answer: t.profile.faq5A },
                  ].map((faq, i) => (
                    <div key={i} className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#F1F0F5] mb-2">{faq.label}</p>
                      <p className="text-xs text-[#8892A3] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => { setSubPage(null); onAskQuestion("I need help with something") }}
                    className="w-full flex items-center gap-3 bg-[#111827] border border-[#D4A054]/15
                      rounded-xl px-4 py-3.5 mt-4">
                    <MessageCircle className="w-4 h-4 text-[#D4A054]" />
                    <span className="text-sm text-[#ACB8C4] flex-1">{t.profile.askForHelp}</span>
                    <ArrowRight className="w-4 h-4 text-[#8892A3]" />
                  </button>
                </div>
              ) : subPage === "family" ? (
                <div className="text-center pt-8">
                  <Users className="w-12 h-12 text-[#8892A3]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#8892A3] mb-2">{subPageContent[subPage].emptyMsg}</p>
                  <button onClick={onPricingClick}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-[#D4A054] bg-[#D4A054]/10 border border-[#D4A054]/20">
                    Unlock with Rishi plan
                  </button>
                </div>
              ) : (
                <div className="text-center pt-8">
                  <History className="w-12 h-12 text-[#8892A3]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#8892A3] mb-2">{subPageContent[subPage].emptyMsg}</p>
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
