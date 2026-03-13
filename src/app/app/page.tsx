"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import {
  Heart, MessageCircle, FileText, Menu, X, Plus,
  Send, Loader2, Sparkles, Lock, ChevronRight,
  User, Star, Moon, Sun, LogOut, Settings,
  Crown, Gift, BookOpen, Mic, Share2,
  TrendingUp, Briefcase, GraduationCap, Building2,
  HeartHandshake, Stethoscope, Gem, Clock,
  ChevronDown, ChevronUp, Copy, Check, ArrowRight,
  Compass, ChevronLeft, Zap, Download,
  Bell, Eye, Flame, Award, ExternalLink, CalendarDays, Sunrise, Info, AlertTriangle, Mail, Calendar
} from "lucide-react"
import ChatResponseParser from "@/components/chat/ChatResponseParser"
import KundliView from "@/components/app/KundliView"
import DailyView from "@/components/app/DailyView"
import PricingModal from "@/components/app/PricingModal"
import CompatibilityView from "@/components/app/CompatibilityView"
import OnboardingView from "@/components/app/OnboardingView"
import DashboardView from "@/components/app/DashboardView"
import HoroscopeView from "@/components/app/HoroscopeView"
import ReportsDetailView from "@/components/app/ReportsDetailView"
import SettingsView from "@/components/app/SettingsView"
import BlogView from "@/components/app/BlogView"
import ChatView from "@/components/app/ChatView"
import AstrologerView from "@/components/app/AstrologerView"
import CheckoutView from "@/components/app/CheckoutView"
import AuthLoginView from "@/components/app/AuthLoginView"
import AboutView from "@/components/app/AboutView"
import ContactView from "@/components/app/ContactView"
import ProductView from "@/components/app/ProductView"
import PrivacyView from "@/components/app/PrivacyView"
import TermsView from "@/components/app/TermsView"
import BlogPostView from "@/components/app/BlogPostView"
import ReferEarnView from "@/components/app/ReferEarnView"
import HomeTab from "@/components/app/tabs/HomeTab"
import AskTab from "@/components/app/tabs/AskTab"
import MyChartTab from "@/components/app/tabs/MyChartTab"
import ReportsTab from "@/components/app/tabs/ReportsTab"
import ProfileTab from "@/components/app/tabs/ProfileTab"
import type { TabType, OverlayType } from "@/types/app"

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

// Type definitions imported from @/types/app

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const DAILY_VERSES = [
  { day: 0, sanskrit: "ॐ आदित्याय नमः", meaning: "Salutations to the Sun God — shine bright today.", lucky: { color: "Gold", number: 1 } },
  { day: 1, sanskrit: "ॐ सोमाय नमः", meaning: "Salutations to the Moon — trust your intuition.", lucky: { color: "White", number: 2 } },
  { day: 2, sanskrit: "ॐ अङ्गारकाय नमः", meaning: "Salutations to Mars — channel your energy wisely.", lucky: { color: "Red", number: 9 } },
  { day: 3, sanskrit: "ॐ बुधाय नमः", meaning: "Salutations to Mercury — communicate with clarity.", lucky: { color: "Green", number: 5 } },
  { day: 4, sanskrit: "ॐ बृहस्पतये नमः", meaning: "Salutations to Jupiter — expand your wisdom.", lucky: { color: "Yellow", number: 3 } },
  { day: 5, sanskrit: "ॐ शुक्राय नमः", meaning: "Salutations to Venus — embrace beauty and love.", lucky: { color: "Pink", number: 6 } },
  { day: 6, sanskrit: "ॐ शनैश्चराय नमः", meaning: "Salutations to Saturn — patience brings rewards.", lucky: { color: "Blue", number: 8 } },
]

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

function getTodaysVerse() {
  const day = new Date().getDay()
  return DAILY_VERSES[day] || DAILY_VERSES[0]
}

// ═══════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════

/* ─── App Top Header ─── */
function AppTopHeader({
  userName,
  onMenuOpen,
  onAddMember,
}: {
  userName: string
  onMenuOpen: () => void
  onAddMember: () => void
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-white">
              Grah<span className="text-amber-400">AI</span>
            </span>
          </div>
        </div>

        {/* Right: Add Member + Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMember}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Member
          </button>
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 rounded-full border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center"
          >
            <span className="text-xs font-bold text-white">{getInitials(userName)}</span>
          </button>
        </div>
      </div>

      {/* Viewing profile banner */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <User className="w-3 h-3 text-white/40" />
          <span className="text-[11px] text-white/50">Viewing your profile</span>
          <ChevronDown className="w-3 h-3 text-white/30 ml-auto" />
        </div>
      </div>
    </header>
  )
}

/* ─── Bottom Tab Navigation ─── */
function BottomTabs({
  activeTab,
  onTabChange,
  freeReportsCount,
}: {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  freeReportsCount: number
}) {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; isCenter?: boolean; badge?: string }[] = [
    {
      id: "home",
      label: "Home",
      icon: <Sunrise className="w-5 h-5" />,
    },
    {
      id: "ask",
      label: "Ask",
      icon: <MessageCircle className="w-5 h-5" />,
      isCenter: true,
    },
    {
      id: "mychart",
      label: "My Chart",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="w-5 h-5" />,
      badge: freeReportsCount > 0 ? "FREE" : undefined,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0e1a]/98 backdrop-blur-xl border-t border-white/[0.08]" style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                isActive ? "text-amber-400" : "text-white/40"
              }`}
            >
              {/* Center tab highlight */}
              {tab.isCenter && isActive && (
                <div className="absolute -top-3 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/25 to-orange-500/15 border border-amber-500/30" />
              )}

              <div className="relative z-10">
                {tab.icon}
                {/* Badge */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1.5 py-0.5 rounded-full bg-green-500 text-[8px] font-bold text-white leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="relative z-10 text-[10px] font-medium mt-0.5">{tab.label}</span>

              {/* Active indicator dot */}
              {isActive && !tab.isCenter && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}


/* ─── Home Tab — 6-section layout ─── */
/* ─── Sample Preview Overlay (Interactive Demo) ─── */
function SamplePreviewOverlay({ onClose, onGetStarted }: { onClose: () => void; onGetStarted: () => void }) {
  const [typingIndex, setTypingIndex] = useState(0)
  const [demoComplete, setDemoComplete] = useState(false)

  const DEMO_LINES = [
    "Based on your birth chart, Saturn is currently transiting your 10th house of career.",
    "",
    "This is a period of hard work being recognized. Your Dashamsha chart shows Jupiter aspecting your 10th lord.",
    "",
    "**Key Timing:** April\u2013July 2026 looks especially favorable for career advancement.",
    "",
    "**Classical Reference:** Brihat Parashara Hora Shastra indicates professional elevation when Jupiter aspects the 10th lord during Saturn transit.",
    "",
    "**Practical Advice:** Focus on visibility in your current role. Avoid switching before May.",
  ]

  useEffect(() => {
    if (typingIndex < DEMO_LINES.length) {
      const timer = setTimeout(() => setTypingIndex((i) => i + 1), 350)
      return () => clearTimeout(timer)
    } else {
      setDemoComplete(true)
    }
  }, [typingIndex, DEMO_LINES.length])

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-white/[0.08] bg-[#0a0e1a] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Interactive Preview</p>
            <p className="text-sm font-semibold text-white">See how GrahAI works</p>
          </div>
        </div>

        {/* User profile badge */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <Moon className="w-3.5 h-3.5 text-blue-300" />
          <span className="text-xs text-white/50">Taurus Moon \u2022 Rohini Nakshatra</span>
        </div>

        {/* User question */}
        <div className="ml-8 mb-4 rounded-2xl rounded-tr-md bg-amber-400/10 border border-amber-400/20 px-4 py-3">
          <p className="text-sm text-white font-medium">Will I get a promotion this year?</p>
        </div>

        {/* AI answer */}
        <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.02] px-4 py-4 mr-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold">GrahAI</span>
          </div>
          <div className="space-y-1">
            {DEMO_LINES.slice(0, typingIndex).map((line, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed ${
                  line.startsWith("**") ? "text-amber-300/90 font-semibold" : "text-white/70"
                }`}
              >
                {line.replace(/\*\*/g, "")}
              </p>
            ))}
            {!demoComplete && (
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block w-2 h-4 bg-amber-400/50 rounded-sm"
              />
            )}
          </div>
        </div>

        {/* CTA after demo */}
        {demoComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <p className="text-center text-xs text-white/40 mb-3">
              This is a real example. Get answers personalized to YOUR chart.
            </p>
            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
            >
              Get my first insight
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors py-1"
            >
              Close
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

/* ─── Profile / Menu Drawer ─── */
function ProfileDrawer({
  isOpen,
  onClose,
  userName,
  onShowOverlay,
  onAddMember,
}: {
  isOpen: boolean
  onClose: () => void
  userName: string
  onShowOverlay: (o: OverlayType) => void
  onAddMember: () => void
}) {
  const verse = getTodaysVerse()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#0a0e1a] border-r border-white/[0.08] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile section */}
            <div className="px-6 pt-8 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{getInitials(userName)}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{userName}</h2>
                  <p className="text-xs text-white/40">Free Plan · 3 Questions/day</p>
                  <button
                    onClick={() => { onClose(); onShowOverlay("pricing") }}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium mt-1 hover:text-amber-300"
                  >
                    <Crown className="w-3 h-3" />
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>

            {/* Birth Details */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Birth Details</h3>
              <div className="space-y-2">
                {[
                  { label: "Date", value: "Not set", icon: <Sun className="w-3.5 h-3.5 text-amber-400/60" /> },
                  { label: "Time", value: "Not set", icon: <Clock className="w-3.5 h-3.5 text-blue-400/60" /> },
                  { label: "Place", value: "Not set", icon: <Star className="w-3.5 h-3.5 text-purple-400/60" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-xs text-white/50">{item.label}</span>
                    </div>
                    <span className="text-xs text-white/70">{item.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { onClose(); onAddMember() }}
                className="flex items-center justify-center gap-1.5 w-full mt-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Birth Details
              </button>
            </div>

            {/* Astrological Summary */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Your Cosmic Profile</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Sun Sign (Vedic)", value: "—", icon: "☀️" },
                  { label: "Moon Sign", value: "—", icon: "🌙" },
                  { label: "Ascendant", value: "—", icon: "⬆️" },
                  { label: "Nakshatra", value: "—", icon: "⭐" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-[10px] text-white/30 mt-1">{item.label}</p>
                    <p className="text-xs font-medium text-white/70">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Words of Wisdom */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Words of Wisdom</h3>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/15">
                <p className="text-center text-base font-hindi font-bold text-purple-300 mb-2">
                  {verse.sanskrit}
                </p>
                <p className="text-center text-xs text-white/50 italic leading-relaxed">
                  {verse.meaning}
                </p>
              </div>
            </div>

            {/* Lucky Elements */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Lucky Elements Today</h3>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-[10px] text-white/30">Color</p>
                  <p className="text-sm font-bold text-white mt-0.5">{verse.lucky.color}</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-[10px] text-white/30">Number</p>
                  <p className="text-sm font-bold text-white mt-0.5">{verse.lucky.number}</p>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              {[
                { icon: <Gift className="w-4 h-4 text-green-400" />, label: "Refer & Earn", action: "refer-earn" as OverlayType },
                { icon: <BookOpen className="w-4 h-4 text-blue-400" />, label: "Latest Blogs", action: "blog" as OverlayType },
                { icon: <Info className="w-4 h-4 text-cyan-400" />, label: "About GrahAI", action: "about" as OverlayType },
                { icon: <Compass className="w-4 h-4 text-emerald-400" />, label: "Our Product", action: "product" as OverlayType },
                { icon: <Mail className="w-4 h-4 text-orange-400" />, label: "Contact Us", action: "contact" as OverlayType },
                { icon: <Share2 className="w-4 h-4 text-purple-400" />, label: "Share App", action: null as OverlayType },
                { icon: <Settings className="w-4 h-4 text-white/40" />, label: "Settings", action: "settings" as OverlayType },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onClose()
                    if (item.action) {
                      onShowOverlay(item.action)
                    } else if (item.label === "Share App" && navigator.share) {
                      navigator.share({ title: "GrahAI", url: window.location.href }).catch(() => {})
                    }
                  }}
                  className="flex items-center gap-3 py-3 w-full text-left text-sm text-white/70 hover:text-white transition-colors"
                >
                  {item.icon}
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 text-center">
              {/* Social proof */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-amber-400">50,000+</p>
                <p className="text-xs text-white/40 mt-0.5">Kundlis Generated</p>
              </div>

              <p className="text-[11px] text-white/30 font-medium mb-1">
                No Fluff. Accurate Guidance.
              </p>
              <p className="text-[11px] text-white/20 mb-4">
                Clear Answers. Confident Decisions.
              </p>

              <p className="text-[10px] text-white/15">
                Made with ❤️ in India
              </p>

              {/* Logout */}
              <button
                onClick={async () => {
                  const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                  )
                  await supabase.auth.signOut()
                  window.location.href = "/"
                }}
                className="flex items-center justify-center gap-2 mx-auto mt-4 px-4 py-2 rounded-lg text-red-400/60 text-xs hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* (getAIResponse removed — QuestionsTab now uses real SSE streaming to /api/chat) */

// ═══════════════════════════════════════════════════
// MAIN APP PAGE
// ═══════════════════════════════════════════════════

export default function GrahAIApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState("Seeker")
  const [overlayView, setOverlayView] = useState<OverlayType>(null)
  const [blogPostSlug, setBlogPostSlug] = useState<string>("")
  const [checkoutPlanId, setCheckoutPlanId] = useState<"plus" | "premium">("plus")
  const [isNewUser, setIsNewUser] = useState(true)

  const showOverlay = useCallback((overlay: OverlayType) => setOverlayView(overlay), [])
  const closeOverlay = useCallback(() => setOverlayView(null), [])
  const showBlogPost = useCallback((slug: string) => { setBlogPostSlug(slug); setOverlayView("blog-post") }, [])
  const showCheckout = useCallback((plan: "plus" | "premium") => { setCheckoutPlanId(plan); setOverlayView("checkout") }, [])
  const handleAddMember = useCallback(() => setOverlayView("onboarding"), [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userNameForGreeting")
      if (stored) setUserName(stored)
      // Check if user has completed onboarding before
      const hasBirthData = localStorage.getItem("grahai-onboarding-birthdata")
      const hasCosmicSnap = localStorage.getItem("grahai-cosmic-snapshot")
      if (hasBirthData || hasCosmicSnap) setIsNewUser(false)
    } catch {
      // SSR or localStorage unavailable
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#060A14] text-white">
      {/* Top header */}
      <AppTopHeader
        userName={userName}
        onMenuOpen={() => setMenuOpen(true)}
        onAddMember={handleAddMember}
      />

      {/* Tab content — pb-20 prevents bottom nav overlap */}
      <div className="flex-1 overflow-hidden pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <HomeTab onShowOverlay={showOverlay} onTabChange={setActiveTab} isNewUser={isNewUser} />
            </motion.div>
          )}
          {activeTab === "ask" && (
            <motion.div
              key="ask"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <AskTab onUpgrade={() => showOverlay("pricing")} />
            </motion.div>
          )}
          {activeTab === "mychart" && (
            <motion.div
              key="mychart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <MyChartTab onShowKundli={() => showOverlay("kundli")} onShowOverlay={showOverlay} onTabChange={setActiveTab} />
            </motion.div>
          )}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <ReportsTab onShowOverlay={showOverlay} onTabChange={setActiveTab} />
            </motion.div>
          )}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <ProfileTab onShowOverlay={showOverlay} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tabs */}
      <BottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        freeReportsCount={1}
      />

      {/* Profile drawer */}
      <ProfileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        userName={userName}
        onShowOverlay={showOverlay}
        onAddMember={handleAddMember}
      />

      {/* Overlay Views */}
      <AnimatePresence>
        {overlayView === "kundli" && (
          <motion.div
            key="overlay-kundli"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <KundliView onBack={closeOverlay} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} />
          </motion.div>
        )}
        {overlayView === "daily" && (
          <motion.div
            key="overlay-daily"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <DailyView onBack={closeOverlay} onUpgrade={() => { setOverlayView("pricing") }} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} />
          </motion.div>
        )}
        {overlayView === "pricing" && (
          <motion.div
            key="overlay-pricing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70]"
          >
            <PricingModal onClose={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "compatibility" && (
          <motion.div
            key="overlay-compatibility"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <CompatibilityView onBack={closeOverlay} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} />
          </motion.div>
        )}
        {overlayView === "onboarding" && (
          <motion.div
            key="overlay-onboarding"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <OnboardingView onBack={closeOverlay} onComplete={() => { closeOverlay(); setIsNewUser(false); setActiveTab("home") }} />
          </motion.div>
        )}
        {overlayView === "dashboard" && (
          <motion.div
            key="overlay-dashboard"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <DashboardView onBack={closeOverlay} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "horoscope" && (
          <motion.div
            key="overlay-horoscope"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <HoroscopeView onBack={closeOverlay} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "reports-detail" && (
          <motion.div
            key="overlay-reports-detail"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <ReportsDetailView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} onAskAI={() => { closeOverlay(); setActiveTab("ask") }} />
          </motion.div>
        )}
        {overlayView === "settings" && (
          <motion.div
            key="overlay-settings"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <SettingsView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} onShowOverlay={showOverlay} />
          </motion.div>
        )}
        {overlayView === "blog" && (
          <motion.div
            key="overlay-blog"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <BlogView onBack={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "chat" && (
          <motion.div
            key="overlay-chat"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <ChatView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "astrologer" && (
          <motion.div
            key="overlay-astrologer"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <AstrologerView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "checkout" && (
          <motion.div
            key="overlay-checkout"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <CheckoutView onBack={closeOverlay} onSuccess={() => { closeOverlay(); setActiveTab("home") }} planId={checkoutPlanId} />
          </motion.div>
        )}
        {overlayView === "auth-login" && (
          <motion.div
            key="overlay-auth-login"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <AuthLoginView onBack={closeOverlay} onSuccess={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "about" && (
          <motion.div
            key="overlay-about"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <AboutView onBack={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "contact" && (
          <motion.div
            key="overlay-contact"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <ContactView onBack={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "product" && (
          <motion.div
            key="overlay-product"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <ProductView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "privacy" && (
          <motion.div
            key="overlay-privacy"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <PrivacyView onBack={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "terms" && (
          <motion.div
            key="overlay-terms"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <TermsView onBack={closeOverlay} />
          </motion.div>
        )}
        {overlayView === "blog-post" && blogPostSlug && (
          <motion.div
            key="overlay-blog-post"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <BlogPostView onBack={() => setOverlayView("blog")} slug={blogPostSlug} />
          </motion.div>
        )}
        {overlayView === "refer-earn" && (
          <motion.div
            key="overlay-refer-earn"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#060A14] overflow-y-auto"
          >
            <ReferEarnView onBack={closeOverlay} onUpgrade={() => setOverlayView("pricing")} />
          </motion.div>
        )}
        {overlayView === "sample-preview" && (
          <motion.div
            key="overlay-sample-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70]"
          >
            <SamplePreviewOverlay
              onClose={closeOverlay}
              onGetStarted={() => { closeOverlay(); setOverlayView("onboarding") }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
