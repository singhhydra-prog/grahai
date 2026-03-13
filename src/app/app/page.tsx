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

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

type TabType = "home" | "ask" | "mychart" | "reports"
type OverlayType = "kundli" | "daily" | "pricing" | "compatibility" | "onboarding" | "dashboard" | "horoscope" | "reports-detail" | "settings" | "blog" | "chat" | "astrologer" | "checkout" | "auth-login" | "about" | "contact" | "product" | "privacy" | "terms" | "blog-post" | "refer-earn" | "sample-preview" | null

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface ReportCard {
  id: string
  icon: React.ReactNode
  title: string
  titleHi: string
  description: string
  category: string
  duration: string
  isFree: boolean
  color: string
  bgGradient: string
}

interface MarketplaceReport {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  whoFor: string
  includes: string[]
  price: string
  priceNote?: string
  color: string
  bgGradient: string
}

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

const SUGGESTED_QUESTIONS = [
  "Will I get a promotion this year?",
  "Is this the right time to invest?",
  "When will I find true love?",
  "Should I change my career?",
  "What does my birth chart say about health?",
  "Is this person right for me?",
]

const REPORTS_MARKETPLACE: MarketplaceReport[] = [
  {
    id: "career-blueprint",
    icon: <Briefcase className="w-6 h-6" />,
    title: "Career Blueprint",
    subtitle: "₹299",
    description: "Find your ideal career path, promotion windows, and business timing based on your 10th house and Dasha periods",
    whoFor: "Anyone at a career crossroads",
    includes: ["10th house analysis", "Dasha career timeline", "Promotion windows", "Job change timing"],
    price: "₹299",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "love-compatibility",
    icon: <Heart className="w-6 h-6" />,
    title: "Love Compatibility",
    subtitle: "₹249",
    description: "Deep Ashtakoot analysis plus Bhakoot, Nadi, and Mangal Dosha cross-check with remedies",
    whoFor: "Couples or those seeking a partner",
    includes: ["36-point Guna score", "Mangal Dosha check", "Nakshatra matching", "Remedies"],
    price: "₹249",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/10",
  },
  {
    id: "marriage-timing",
    icon: <Calendar className="w-6 h-6" />,
    title: "Marriage Timing",
    subtitle: "₹349",
    description: "When will you marry? Precise Dasha + transit windows for marriage, with Muhurta guidance",
    whoFor: "Those planning marriage",
    includes: ["7th house analysis", "Venus Dasha timing", "Transit windows", "Auspicious dates"],
    price: "₹349",
    color: "text-rose-400",
    bgGradient: "from-rose-500/20 to-pink-500/10",
  },
  {
    id: "annual-forecast",
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Annual Forecast 2026",
    subtitle: "₹399",
    description: "Month-by-month predictions for career, health, love, and finance based on your exact Dasha + transits",
    whoFor: "Anyone planning their year",
    includes: ["12-month forecast", "Key decision windows", "Cautions", "Remedies"],
    price: "₹399",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
  },
  {
    id: "dasha-deep-dive",
    icon: <BookOpen className="w-6 h-6" />,
    title: "Dasha Deep Dive",
    subtitle: "₹199",
    description: "Understand your current planetary period — what it activates, what to expect, and how to navigate it",
    whoFor: "Those in a life transition",
    includes: ["Mahadasha analysis", "Antardasha breakdown", "Key themes", "Practical guidance"],
    price: "₹199",
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "remedies-guide",
    icon: <Gem className="w-6 h-6" />,
    title: "Remedies Guide",
    subtitle: "Free with Plus / ₹149",
    description: "Personalized remedies based on your chart — mantras, gemstones, donations, and daily practices",
    whoFor: "Anyone seeking solutions",
    includes: ["Dosha remedies", "Planet-specific mantras", "Gemstone recommendations", "Daily practices"],
    price: "₹149",
    priceNote: "Free with Plus",
    color: "text-teal-400",
    bgGradient: "from-teal-500/20 to-cyan-500/10",
  },
]

// ═══════════════════════════════════════════════════
// COSMIC STORIES DATA (EliteEdge-inspired "Insight Stories")
// ═══════════════════════════════════════════════════

interface CosmicStory {
  id: string
  emoji: string
  tag: string
  tagColor: string
  title: string
  titleHi: string
  body: string
  source: string
  sourceRef: string
  cta: { label: string; action: string }
  gradient: string
}

const COSMIC_STORIES: CosmicStory[] = [
  {
    id: "story-saturn-return",
    emoji: "🪐",
    tag: "Transit Alert",
    tagColor: "text-blue-400 bg-blue-500/15 border-blue-500/20",
    title: "Saturn's Return — Your Karmic Reset",
    titleHi: "शनि की वापसी",
    body: "Every 29.5 years, Saturn returns to its natal position in your chart. This isn't punishment — it's a cosmic audit. Those who built solid foundations thrive; those who took shortcuts face restructuring. Saturn rewards discipline, always.",
    source: "Brihat Parashara Hora Shastra",
    sourceRef: "Ch. 34, Verse 8-12",
    cta: { label: "Check Your Saturn Return", action: "kundli" },
    gradient: "from-blue-600/30 via-indigo-600/20 to-purple-600/10",
  },
  {
    id: "story-rahu-ketu",
    emoji: "🐍",
    tag: "Shadow Planets",
    tagColor: "text-violet-400 bg-violet-500/15 border-violet-500/20",
    title: "Rahu-Ketu: The Obsession & Liberation Axis",
    titleHi: "राहु-केतु अक्ष",
    body: "Rahu shows where you're obsessively drawn — material desires, worldly ambitions. Ketu reveals where you must let go — past life attachments. Together, they define your soul's evolutionary path in this lifetime.",
    source: "Brihat Jataka by Varahamihira",
    sourceRef: "Ch. 25, Verse 1-4",
    cta: { label: "Discover Your Rahu-Ketu Axis", action: "kundli" },
    gradient: "from-violet-600/30 via-purple-600/20 to-fuchsia-600/10",
  },
  {
    id: "story-venus-wealth",
    emoji: "💎",
    tag: "Wealth Yoga",
    tagColor: "text-amber-400 bg-amber-500/15 border-amber-500/20",
    title: "Venus + Jupiter = Dhana Yoga",
    titleHi: "धन योग",
    body: "When Jupiter aspects Venus or they conjoin in angular houses, a powerful wealth combination activates. This yoga brings not just money, but abundance in relationships, creativity, and life pleasures. Check if you have it.",
    source: "Phaladeepika by Mantreshwara",
    sourceRef: "Ch. 6, Verse 21-24",
    cta: { label: "Check Your Dhana Yogas", action: "reports" },
    gradient: "from-amber-600/30 via-orange-600/20 to-yellow-600/10",
  },
  {
    id: "story-mangal-dosha",
    emoji: "🔥",
    tag: "Marriage Alert",
    tagColor: "text-rose-400 bg-rose-500/15 border-rose-500/20",
    title: "Mangal Dosha — Myth vs Reality",
    titleHi: "मंगल दोष",
    body: "40% of people have Mangal Dosha — it's common, not a death sentence for love. Mars in 1st, 4th, 7th, 8th, or 12th house creates it. But dozens of cancellation rules exist. A proper analysis reveals the truth.",
    source: "Brihat Parashara Hora Shastra",
    sourceRef: "Ch. 81, Verse 47-52",
    cta: { label: "Check Mangal Dosha Free", action: "compatibility" },
    gradient: "from-rose-600/30 via-pink-600/20 to-red-600/10",
  },
  {
    id: "story-mahadasha",
    emoji: "⏳",
    tag: "Timing Secrets",
    tagColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
    title: "Why Dasha Timing Changes Everything",
    titleHi: "दशा का समय",
    body: "The same planet gives opposite results in different Dashas. A well-placed Jupiter brings fortune during its Mahadasha. But even an exalted planet underperforms in a hostile sub-period. Timing is everything in Jyotish.",
    source: "Vimshottari Dasha System — BPHS",
    sourceRef: "Ch. 46, Verse 1-8",
    cta: { label: "Know Your Current Dasha", action: "kundli" },
    gradient: "from-emerald-600/30 via-green-600/20 to-teal-600/10",
  },
]

interface TopUpModule {
  id: string
  icon: React.ReactNode
  title: string
  titleHi: string
  price: string
  priceLabel: string
  description: string
  tag?: string
  action: string
  gradient: string
}

const TOP_UP_MODULES: TopUpModule[] = [
  {
    id: "pdf-kundli",
    icon: <Download className="w-5 h-5" />,
    title: "Kundli PDF Export",
    titleHi: "कुंडली PDF",
    price: "₹149",
    priceLabel: "one-time",
    description: "Download your complete birth chart as a beautifully formatted PDF with all 12 houses, Dashas, and Yogas",
    tag: "Popular",
    action: "pricing",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "transit-alerts",
    icon: <Bell className="w-5 h-5" />,
    title: "Transit Alerts",
    titleHi: "गोचर सूचना",
    price: "₹199",
    priceLabel: "/month",
    description: "Get notified when major planets change signs or aspect your key houses — never miss an opportunity window",
    action: "pricing",
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "compatibility-deep",
    icon: <Heart className="w-5 h-5" />,
    title: "Compatibility Deep-Dive",
    titleHi: "सामंजस्य विस्तृत",
    price: "₹249",
    priceLabel: "one-time",
    description: "Beyond Ashtakoot — includes Bhakoot, Nadi analysis, Mangal Dosha cross-check with remedies",
    action: "compatibility",
    gradient: "from-pink-500/20 to-rose-500/10",
  },
  {
    id: "annual-forecast",
    icon: <Eye className="w-5 h-5" />,
    title: "Annual Forecast 2026",
    titleHi: "वार्षिक भविष्यफल",
    price: "₹399",
    priceLabel: "one-time",
    description: "Month-by-month predictions for career, health, love, and finance based on your exact Dasha + transits",
    tag: "Best Value",
    action: "pricing",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
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

/* ─── Cosmic Stories (Swipeable Insight Cards) ─── */
function CosmicStories({ onAction }: { onAction: (action: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [readStories, setReadStories] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const story = COSMIC_STORIES[currentIndex]

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, COSMIC_STORIES.length - 1))
    setCurrentIndex(clamped)
    setReadStories(prev => new Set(prev).add(COSMIC_STORIES[clamped].id))
  }, [])

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Touch swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
  }, [goNext, goPrev])

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Daily Cosmic Stories</h3>
          <span className="text-[10px] text-white/30 font-hindi">दैनिक कथा</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/30">{currentIndex + 1}/{COSMIC_STORIES.length}</span>
          {readStories.size >= 3 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">
              <Award className="w-2.5 h-2.5 inline mr-0.5" />Streak
            </span>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-3">
        {COSMIC_STORIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i < currentIndex
                ? "rgba(201,162,77,0.7)"
                : i === currentIndex
                  ? "linear-gradient(90deg, #C9A24D, #E2C474)"
                  : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>

      {/* Story card */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative rounded-2xl border border-white/[0.08] bg-gradient-to-br ${story.gradient} overflow-hidden`}
          >
            {/* Card content */}
            <div className="p-5">
              {/* Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${story.tagColor}`}>
                  {story.emoji} {story.tag}
                </span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: story.title || "GrahAI Insight", url: window.location.href }).catch(() => {})
                    } else {
                      navigator.clipboard?.writeText(window.location.href)
                    }
                  }}
                  className="text-white/20 hover:text-white/50 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-lg font-bold text-white leading-tight mb-0.5">
                {story.title}
              </h4>
              <p className="text-[11px] text-white/30 font-hindi mb-3">{story.titleHi}</p>

              {/* Body — the "5-line engaging narrative" */}
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {story.body}
              </p>

              {/* Source (credibility anchor) */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/[0.05] mb-4">
                <BookOpen className="w-3.5 h-3.5 text-amber-400/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-amber-400/80 font-medium">{story.source}</p>
                  <p className="text-[9px] text-white/25">{story.sourceRef}</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => onAction(story.cta.action)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.1] text-sm font-medium text-white/80 hover:bg-white/[0.12] hover:text-white transition-all active:scale-[0.98]"
              >
                {story.cta.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Left/Right tap zones for desktop */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
                aria-label="Previous story"
              />
            )}
            {currentIndex < COSMIC_STORIES.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
                aria-label="Next story"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (visible on hover / desktop) */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all z-20 opacity-0 hover:opacity-100 sm:opacity-60"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {currentIndex < COSMIC_STORIES.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all z-20 opacity-0 hover:opacity-100 sm:opacity-60"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Top-Up Micro Modules ─── */
function TopUpModules({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="px-4 pt-2 pb-3">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white">Power-Ups</h3>
        <span className="text-[10px] text-white/30 font-hindi">विशेष सेवाएँ</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOP_UP_MODULES.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <button
              onClick={() => onAction(mod.action)}
              className={`block w-full text-left relative rounded-xl border border-white/[0.08] bg-gradient-to-br ${mod.gradient} p-4 hover:border-amber-500/20 transition-all active:scale-[0.97] h-full`}
            >
              {/* Tag badge */}
              {mod.tag && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[8px] font-bold border border-amber-500/20">
                  {mod.tag}
                </span>
              )}

              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-amber-400 mb-2.5">
                {mod.icon}
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-white leading-tight mb-0.5">{mod.title}</h4>
              <p className="text-[9px] text-white/25 font-hindi mb-1.5">{mod.titleHi}</p>

              {/* Description */}
              <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 mb-3">{mod.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-amber-400">{mod.price}</span>
                <span className="text-[9px] text-white/30">{mod.priceLabel}</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Home Tab — 6-section layout ─── */
function HomeTab({ onShowOverlay, onTabChange, isNewUser }: { onShowOverlay: (o: OverlayType) => void; onTabChange: (t: TabType) => void; isNewUser?: boolean }) {
  const verse = getTodaysVerse()
  const today = new Date()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const [askInput, setAskInput] = useState("")
  const [cosmicSnap, setCosmicSnap] = useState<{ moonSign?: string; nakshatra?: string; transitVibe?: string; lifeTheme?: string } | null>(null)
  const [savedQuestions, setSavedQuestions] = useState<string[]>([])
  const [userName, setUserName] = useState("")

  useEffect(() => {
    try {
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) setCosmicSnap(JSON.parse(snap))
      const name = localStorage.getItem("userNameForGreeting")
      if (name) setUserName(name)
      const qs = localStorage.getItem("grahai-saved-questions")
      if (qs) setSavedQuestions(JSON.parse(qs).slice(0, 3))
    } catch { /* ignore */ }
  }, [])

  const todayTheme = cosmicSnap?.transitVibe || verse.meaning
  const greeting = userName ? `Good ${today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, ${userName.split(" ")[0]}` : `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}`

  return (
    <div className="overflow-y-auto h-full">
      {/* ─── Acquisition Hero (new users only) ─── */}
      {isNewUser && (
        <div className="relative px-4 pt-8 pb-6 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-400/[0.06] blur-[100px]" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-white">Grah<span className="text-amber-400">AI</span></span>
            </div>
            <h1 className="text-[22px] leading-tight font-bold text-white max-w-xs mx-auto">
              Get chart-based clarity for love, career, timing, and life decisions.
            </h1>
            <p className="mt-3 text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
              AI Jyotish guidance, personalized from your birth chart, with source-backed explanations.
            </p>
            <div className="mt-6 space-y-3 max-w-xs mx-auto">
              <button onClick={() => onShowOverlay("onboarding")} className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]">
                Get my first insight <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onShowOverlay("sample-preview")} className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-amber-400/30 hover:text-white active:scale-[0.98]">
                See a sample answer
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              {["Personalized", "Classical sources", "Real decisions"].map((badge) => (
                <span key={badge} className="flex items-center gap-1 text-[10px] text-white/30">
                  <span className="w-1 h-1 rounded-full bg-amber-400/50" />{badge}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
        </div>
      )}

      {/* ═══ SECTION 1: "Today for You" Hero Card ═══ */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-white/40 mb-1">{greeting}</p>
        <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.03] p-5 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/[0.05] blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-wider">Today&apos;s Theme</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug mb-2">{todayTheme}</h2>
            <p className="text-xs text-white/50 leading-relaxed mb-3">{verse.meaning}</p>

            {/* Summary row */}
            <div className="flex gap-3 mb-3">
              {cosmicSnap?.moonSign && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/15 text-[10px] text-blue-300 font-medium">
                  <Moon className="w-3 h-3" /> {cosmicSnap.moonSign}
                </span>
              )}
              {cosmicSnap?.nakshatra && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/15 text-[10px] text-purple-300 font-medium">
                  <Star className="w-3 h-3" /> {cosmicSnap.nakshatra}
                </span>
              )}
            </div>

            {/* Action & Caution */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="px-3 py-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10">
                <p className="text-[9px] uppercase tracking-wider text-emerald-400/60 font-bold mb-0.5">Action</p>
                <p className="text-[11px] text-white/60">Focus on {dayNames[today.getDay()] === "Monday" ? "emotional clarity" : dayNames[today.getDay()] === "Tuesday" ? "decisive action" : dayNames[today.getDay()] === "Wednesday" ? "clear communication" : dayNames[today.getDay()] === "Thursday" ? "wisdom & learning" : dayNames[today.getDay()] === "Friday" ? "relationships & beauty" : dayNames[today.getDay()] === "Saturday" ? "discipline & patience" : "self-expression"}</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                <p className="text-[9px] uppercase tracking-wider text-red-400/60 font-bold mb-0.5">Caution</p>
                <p className="text-[11px] text-white/60">Avoid {dayNames[today.getDay()] === "Tuesday" ? "impulsive decisions" : dayNames[today.getDay()] === "Saturday" ? "shortcuts" : "overthinking"}</p>
              </div>
            </div>

            <button
              onClick={() => onTabChange("ask")}
              className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Ask about this <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: "Why this is active" ═══ */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Why this is active today</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-xs text-white/50 leading-relaxed">
            {cosmicSnap?.moonSign
              ? `The Moon is transiting through influences related to your ${cosmicSnap.moonSign} Moon sign. Current planetary positions are creating a unique energy pattern for your chart today.`
              : `Today is ruled by ${verse.lucky.color === "Gold" ? "the Sun" : verse.lucky.color === "White" ? "the Moon" : verse.lucky.color === "Red" ? "Mars" : verse.lucky.color === "Green" ? "Mercury" : verse.lucky.color === "Yellow" ? "Jupiter" : verse.lucky.color === "Pink" ? "Venus" : "Saturn"}. The planetary hour aligns with ${dayNames[today.getDay()]}&apos;s natural rhythms.`
            }
          </p>
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: verse.lucky.color.toLowerCase() === "gold" ? "#D4A853" : verse.lucky.color.toLowerCase() }} />
              <span className="text-[10px] text-white/35">Lucky: {verse.lucky.color}</span>
            </div>
            <span className="text-[10px] text-white/35">Number: {verse.lucky.number}</span>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 3: Quick Guidance Lanes ═══ */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex items-center gap-2 mb-2.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-white">Quick Guidance</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Heart className="w-4 h-4 text-pink-400" />, label: "Love", sublabel: "Today", question: "How is my love life looking today?", bg: "from-pink-500/10 to-rose-500/5", border: "border-pink-500/15" },
            { icon: <Briefcase className="w-4 h-4 text-blue-400" />, label: "Career", sublabel: "Today", question: "Any career opportunities today?", bg: "from-blue-500/10 to-indigo-500/5", border: "border-blue-500/15" },
            { icon: <Flame className="w-4 h-4 text-orange-400" />, label: "Energy", sublabel: "Today", question: "What is my energy level like today?", bg: "from-orange-500/10 to-amber-500/5", border: "border-orange-500/15" },
          ].map((lane) => (
            <button
              key={lane.label}
              onClick={() => onTabChange("ask")}
              className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border ${lane.border} bg-gradient-to-br ${lane.bg} hover:scale-[1.02] transition-all active:scale-[0.97]`}
            >
              {lane.icon}
              <span className="text-[11px] font-semibold text-white">{lane.label}</span>
              <span className="text-[9px] text-white/30">{lane.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 4: Ask GrahAI ═══ */}
      <div className="px-4 pt-3 pb-2">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-white">Ask GrahAI</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && askInput.trim()) { onTabChange("ask") } }}
              placeholder="What's on your mind?"
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/30"
            />
            <button
              onClick={() => onTabChange("ask")}
              className="px-3 py-2.5 rounded-lg bg-amber-400 text-[#050810] font-semibold text-sm hover:bg-amber-300 transition-colors active:scale-[0.97]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {/* Topic chips */}
          <div className="flex flex-wrap gap-1.5">
            {["Career timing", "Love match", "Health today", "Money flow", "Auspicious dates"].map((chip) => (
              <button
                key={chip}
                onClick={() => onTabChange("ask")}
                className="px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] text-white/50 hover:border-amber-400/20 hover:text-white/70 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 5: Saved Momentum ═══ */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2.5">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-white">Your Momentum</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          {/* Streak */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.04]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">1 day streak</p>
              <p className="text-[10px] text-white/40">Keep asking daily for deeper insights</p>
            </div>
          </div>

          {/* Last questions */}
          {savedQuestions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Recent Questions</p>
              {savedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onTabChange("ask")}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/15 transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-amber-400/40 flex-shrink-0" />
                  <span className="text-[11px] text-white/50 truncate">{q}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-[11px] text-white/30">Ask your first question to start building your cosmic journal</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 6: Premium Depth (upsells last) ═══ */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-white">Go Deeper</span>
          <span className="text-[10px] text-white/30 font-hindi">गहन विश्लेषण</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <CalendarDays className="w-4 h-4" />, title: "Annual Forecast", desc: "Month-by-month predictions for 2026", price: "₹399", action: "pricing" as OverlayType, gradient: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/15" },
            { icon: <Heart className="w-4 h-4" />, title: "Compatibility", desc: "Deep Ashtakoot + Mangal Dosha", price: "₹249", action: "compatibility" as OverlayType, gradient: "from-pink-500/10 to-rose-500/5", border: "border-pink-500/15" },
            { icon: <Download className="w-4 h-4" />, title: "Kundli PDF", desc: "Complete birth chart export", price: "₹149", action: "pricing" as OverlayType, gradient: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/15" },
            { icon: <ExternalLink className="w-4 h-4" />, title: "Live Jyotishi", desc: "1-on-1 session with expert", price: "₹999", action: "astrologer" as OverlayType, gradient: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/15" },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => onShowOverlay(item.action)}
              className={`text-left p-3.5 rounded-xl border ${item.border} bg-gradient-to-br ${item.gradient} hover:scale-[1.01] transition-all active:scale-[0.98]`}
            >
              <div className="text-amber-400 mb-2">{item.icon}</div>
              <h4 className="text-[11px] font-bold text-white mb-0.5">{item.title}</h4>
              <p className="text-[10px] text-white/40 mb-2 line-clamp-1">{item.desc}</p>
              <span className="text-[11px] font-bold text-amber-400">{item.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cosmic Stories */}
      <CosmicStories onAction={(a) => onShowOverlay(a as OverlayType)} />

      <div className="mx-4 my-1 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />

      {/* Mantra of the day */}
      <div className="px-4 pt-2 pb-6">
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4 text-center">
          <span className="text-[10px] text-amber-400/40 uppercase tracking-wider font-bold">🕉️ Today&apos;s Mantra</span>
          <p className="text-base font-hindi font-bold text-amber-200/80 mt-2 leading-relaxed">{verse.sanskrit}</p>
          <p className="text-[11px] text-white/40 italic mt-1">{verse.meaning}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Question Counter Bar ─── */
function QuestionCounter({
  questionsLeft,
  totalQuestions,
  onUpgrade,
}: {
  questionsLeft: number
  totalQuestions: number
  onUpgrade: () => void
}) {
  return (
    <div className="mx-4 mt-3 mb-2">
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-white">
            <span className="text-amber-400 font-bold">{questionsLeft}</span>
            <span className="text-white/50"> / {totalQuestions} Questions left</span>
          </span>
        </div>
        <button
          onClick={onUpgrade}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-[#0a0e1a] text-xs font-bold hover:bg-amber-400 transition-colors"
        >
          <Crown className="w-3 h-3" />
          Buy More
        </button>
      </div>
    </div>
  )
}

/* ─── Ask Tab (Structured 7-part response format with SSE streaming) ─── */
const ASK_TOPIC_CHIPS = ["Career timing", "Love compatibility", "Money & wealth", "Health check", "Best dates", "Current Dasha"]
const ASK_FOLLOWUP_CHIPS = ["Tell me more", "What should I avoid?", "Best timing for this?", "Any remedies?"]

function AskTab({ onUpgrade }: { onUpgrade: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [questionsLeft, setQuestionsLeft] = useState(3)
  const [totalQuestions, setTotalQuestions] = useState(3)
  const [usageLoaded, setUsageLoaded] = useState(false)
  const [lastResponseDone, setLastResponseDone] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Fetch real usage from API on mount
  useEffect(() => {
    fetch("/api/usage")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data.remaining === "number") {
          setQuestionsLeft(data.remaining)
          setTotalQuestions(data.limit || 3)
          setUsageLoaded(true)
        }
      })
      .catch(() => setUsageLoaded(true))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const saveQuestion = useCallback((q: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem("grahai-saved-questions") || "[]")
      const updated = [q, ...existing.filter((x: string) => x !== q)].slice(0, 10)
      localStorage.setItem("grahai-saved-questions", JSON.stringify(updated))
    } catch { /* ignore */ }
  }, [])

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text || sending || questionsLeft <= 0) return

    setInput("")
    setLastResponseDone(false)
    if (inputRef.current) inputRef.current.style.height = "auto"

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setSending(true)
    saveQuestion(text)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          vertical: "astrology",
        }),
      })

      if (res.status === 429) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "You've reached your daily question limit. Upgrade to Pro for unlimited questions!",
          created_at: new Date().toISOString(),
        }])
        setQuestionsLeft(0)
        return
      }

      if (!res.ok) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "The cosmic connection wavered. Please try again in a moment.",
          created_at: new Date().toISOString(),
        }])
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      let fullText = ""
      const decoder = new TextDecoder()
      const assistantId = crypto.randomUUID()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6))
              if (parsed.text) {
                fullText += parsed.text
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg?.id === assistantId) {
                    lastMsg.content = fullText
                  } else {
                    updated.push({
                      id: assistantId,
                      role: "assistant",
                      content: fullText,
                      created_at: new Date().toISOString(),
                    })
                  }
                  return [...updated]
                })
              }
            } catch { /* skip non-JSON SSE lines */ }
          }
        }
      }

      if (!fullText) {
        setMessages(prev => [...prev, {
          id: assistantId,
          role: "assistant",
          content: "The stars are aligning... Please try your question again.",
          created_at: new Date().toISOString(),
        }])
      }

      setQuestionsLeft(prev => Math.max(0, prev - 1))
      setLastResponseDone(true)
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "A cosmic disturbance occurred. Please check your connection and try again.",
        created_at: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
    }
  }, [input, sending, questionsLeft, saveQuestion])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyLast = useCallback(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant")
    if (lastAssistant) navigator.clipboard?.writeText(lastAssistant.content)
  }, [messages])

  const handleShareLast = useCallback(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant")
    if (lastAssistant && navigator.share) {
      navigator.share({ title: "GrahAI Insight", text: lastAssistant.content.slice(0, 200) + "..." }).catch(() => {})
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Question counter */}
      <QuestionCounter questionsLeft={questionsLeft} totalQuestions={totalQuestions} onUpgrade={onUpgrade} />

      {/* Messages or Welcome */}
      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask GrahAI</h3>
              <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
                Calm, specific guidance rooted in your birth chart. Ask anything about career, love, timing, or life.
              </p>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {ASK_TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip === "Career timing" ? "When is the best time for career growth?" : chip === "Love compatibility" ? "Is this person right for me?" : chip === "Money & wealth" ? "When will my finances improve?" : chip === "Health check" ? "What health aspects should I watch?" : chip === "Best dates" ? "What are the most auspicious dates this month?" : "What is my current Dasha period telling me?")}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-white/50 hover:border-amber-400/25 hover:text-white/70 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Popular questions */}
            <div className="space-y-2">
              <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-2">Popular Questions</p>
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                <motion.button
                  key={q}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/60 hover:border-amber-500/20 hover:bg-amber-500/[0.04] hover:text-white/80 transition-all flex items-center gap-3"
                >
                  <MessageCircle className="w-4 h-4 text-amber-400/50 flex-shrink-0" />
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {sending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-amber-400/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-amber-400/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Footer actions after response */}
            {lastResponseDone && !sending && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 space-y-3"
              >
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button onClick={handleCopyLast} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[10px] text-white/40 hover:text-white/60 transition-colors">
                    <Copy className="w-3 h-3" /> Save
                  </button>
                  <button onClick={handleShareLast} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[10px] text-white/40 hover:text-white/60 transition-colors">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                  <button onClick={onUpgrade} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors">
                    <Lock className="w-3 h-3" /> Deeper report
                  </button>
                </div>

                {/* Follow-up chips */}
                <div className="flex flex-wrap gap-1.5">
                  {ASK_FOLLOWUP_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] text-white/50 hover:border-amber-400/20 hover:text-white/70 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] bg-[#0a0e1a]/90 backdrop-blur-xl">
        {questionsLeft <= 0 ? (
          <div className="text-center py-2">
            <p className="text-sm text-white/50 mb-2">You&apos;ve used all free questions today</p>
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0e1a] font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              <Crown className="w-4 h-4" />
              Unlock Unlimited Questions
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e: FormEvent) => { e.preventDefault(); handleSend() }}
            className="flex items-end gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your stars..."
              rows={1}
              disabled={sending}
              className="flex-1 resize-none bg-transparent text-sm text-white/90 placeholder:text-white/25 focus:outline-none disabled:opacity-50 py-2"
              style={{ maxHeight: "120px" }}
            />
            <div className="flex items-center gap-1.5 pb-1">
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-[#0a0e1a] disabled:opacity-30 transition-all active:scale-95"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── Chat Bubble ─── */
function ChatBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white/60">You</span>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      )}
      <div className="group max-w-[80%]">
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-2xl rounded-tr-sm bg-amber-500/15 border border-amber-500/15 text-white/90"
              : "rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] text-white/80"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ChatResponseParser content={message.content} />
          )}
        </div>
        {!isUser && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-white/20">
              {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-white/50 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Reports Tab ─── */
function ReportsTab({ onShowOverlay }: { onShowOverlay: (o: OverlayType) => void }) {
  return (
    <div className="overflow-y-auto px-4 pt-6 pb-4">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Reports</h2>
        <p className="text-xs text-white/50 font-hindi mb-3">गहन मार्गदर्शन — Deep Guidance</p>
        <p className="text-sm text-white/40 leading-relaxed">
          Turn insight into action. Each report solves a specific life question.
        </p>
      </div>

      {/* Report Cards - Single Column Layout */}
      <div className="space-y-3">
        {REPORTS_MARKETPLACE.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <ReportCardComponent report={report} onShowOverlay={onShowOverlay} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Single Report Card ─── */
function ReportCardComponent({ report, onShowOverlay }: { report: MarketplaceReport; onShowOverlay: (o: OverlayType) => void }) {
  return (
    <button
      onClick={() => onShowOverlay("pricing")}
      className="block w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-amber-500/20 transition-all active:scale-[0.98]"
    >
      {/* Icon + Title + Price Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${report.bgGradient} flex items-center justify-center flex-shrink-0`}>
            <div className={report.color}>{report.icon}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{report.title}</h3>
            <p className="text-xs text-amber-400 font-bold">{report.price}</p>
          </div>
        </div>
      </div>

      {/* What Problem It Solves */}
      <div className="mb-3">
        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">What problem it solves</p>
        <p className="text-sm text-white/70 leading-relaxed">{report.description}</p>
      </div>

      {/* Who It's For Badge */}
      <div className="mb-3">
        <span className="inline-block px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs text-white/60">
          For: {report.whoFor}
        </span>
      </div>

      {/* What's Included */}
      <div className="mb-4">
        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">What's included</p>
        <ul className="space-y-1">
          {report.includes.map((item, idx) => (
            <li key={idx} className="text-xs text-white/60 flex items-center gap-2">
              <span className="text-amber-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div
        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0e1a] text-xs font-bold hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.98] text-center"
      >
        Get This Report
      </div>
    </button>
  )
}

/* ─── Compatibility Tab ─── */
function CompatibilityTab({ onShowOverlay }: { onShowOverlay: (o: OverlayType) => void }) {
  const [partner1, setPartner1] = useState("")
  const [partner2, setPartner2] = useState("")

  return (
    <div className="overflow-y-auto px-4 pt-6 pb-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/20 flex items-center justify-center">
          <Heart className="w-7 h-7 text-pink-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Kundli Matching</h2>
        <p className="text-xs text-white/40">कुंडली मिलान — Ashtakoot Guna Milan</p>
        <p className="text-sm text-white/50 mt-2 max-w-xs mx-auto">
          Check your compatibility score based on ancient Vedic Ashtakoot system — 36 Guna points analysis
        </p>
      </div>

      {/* Partner inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Partner 1 — Name</label>
          <input
            type="text"
            value={partner1}
            onChange={(e) => setPartner1(e.target.value)}
            placeholder="Enter first person's name"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-pink-500/30"
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Partner 2 — Name</label>
          <input
            type="text"
            value={partner2}
            onChange={(e) => setPartner2(e.target.value)}
            placeholder="Enter second person's name"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-pink-500/30"
          />
        </div>
      </div>

      <button
        onClick={() => onShowOverlay("compatibility")}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm hover:from-pink-400 hover:to-rose-400 transition-all active:scale-[0.98]"
      >
        <Heart className="w-4 h-4" />
        Check Compatibility
      </button>

      {/* Info cards */}
      <div className="mt-8 space-y-3">
        <h3 className="text-xs text-white/30 uppercase tracking-wider font-medium">What you get</h3>
        {[
          { icon: <Star className="w-4 h-4 text-amber-400" />, title: "36-Point Guna Score", desc: "Complete Ashtakoot analysis" },
          { icon: <Moon className="w-4 h-4 text-blue-400" />, title: "Mangal Dosha Check", desc: "Mars affliction compatibility" },
          { icon: <Sun className="w-4 h-4 text-orange-400" />, title: "Nakshatra Matching", desc: "Star constellation harmony" },
          { icon: <Heart className="w-4 h-4 text-pink-400" />, title: "Remedies & Guidance", desc: "Solutions for any challenges" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            {item.icon}
            <div>
              <p className="text-xs font-medium text-white">{item.title}</p>
              <p className="text-[10px] text-white/40">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── My Chart Tab ─── */
// Type definitions for chart data
interface PlanetPlacement {
  name: string
  shortName: string
  sign: string
  signIndex: number
  house: number
  degree: number
  nakshatra: string
  nakshatraPada: number
  retrograde: boolean
  dignity: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"
  symbol: string
  color: string
}

interface YogaInfo {
  name: string
  nameSanskrit: string
  type: "raja" | "dhana" | "arishta" | "pancha_mahapurusha" | "other"
  effect: string
  strength: "strong" | "moderate" | "weak"
  classicalRef: string
}

interface DoshaInfo {
  name: string
  severity: "mild" | "moderate" | "severe"
  remedy: string
}

interface DashaInfo {
  planet: string
  start: string
  end: string
  subPlanet: string | null
  subStart: string | null
  subEnd: string | null
}

interface ChartData {
  moonSign: string
  sunSign: string
  lagna: string
  lagnaArabic: number
  nakshatra: string
  nakshatraLord: string
  nakshatraDeity: string
  nakshatraSymbol: string
  nakshatraGana: string
  nakshatraQualities: string[]
  nakshatraDescription: string
  planets: PlanetPlacement[]
  yogas: YogaInfo[]
  doshas: DoshaInfo[]
  currentDasha: DashaInfo | null
  summary: string
  computedAt: string
}

const DIGNITY_BADGE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  exalted: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "↑" },
  own: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "★" },
  friend: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "♦" },
  neutral: { bg: "bg-white/10", text: "text-white/40", icon: "●" },
  enemy: { bg: "bg-orange-500/20", text: "text-orange-400", icon: "▼" },
  debilitated: { bg: "bg-red-500/20", text: "text-red-400", icon: "↓" },
}

const YOGA_TYPE_COLORS: Record<string, { badge: string; icon: string }> = {
  raja: { badge: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "👑" },
  dhana: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: "💰" },
  arishta: { badge: "bg-red-500/20 text-red-400 border-red-500/30", icon: "⚠" },
  pancha_mahapurusha: { badge: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: "✨" },
  other: { badge: "bg-white/10 text-white/50 border-white/20", icon: "◆" },
}

const DOSHA_SEVERITY_COLORS: Record<string, string> = {
  mild: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  moderate: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  severe: "bg-red-500/15 text-red-400 border-red-500/30",
}


function MyChartTab({ onShowKundli, onShowOverlay, onTabChange }: { onShowKundli: () => void; onShowOverlay: (o: OverlayType) => void; onTabChange: (t: TabType) => void }) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [cosmicSnapshot, setCosmicSnapshot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    // Try to load saved chart and cosmic snapshot from localStorage
    try {
      const saved = localStorage.getItem("grahai-chart-data")
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (saved) {
        setChartData(JSON.parse(saved) as ChartData)
      }
      if (snap) {
        setCosmicSnapshot(JSON.parse(snap))
      }
    } catch (e) {
      console.error("Failed to load chart data:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    )
  }

  // No chart data — prompt to generate one
  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6">
          <Moon className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Your Chart Awaits</h2>
        <p className="text-sm text-white/40 mb-6 max-w-xs">
          Generate your Kundli to see your Moon sign, Nakshatra, planetary placements, and life themes.
        </p>
        <button
          onClick={onShowKundli}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-[#0a0e1a] hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate My Kundli
        </button>
      </div>
    )
  }

  // Mock strengths and sensitivities if not available
  const strengths = [
    "Intuitive decision-making",
    "Natural charisma and influence",
    "Quick learning ability",
  ]
  const sensitivities = [
    "Tendency to overthink",
    "Emotional sensitivity in relationships",
    "Need for external validation",
  ]

  // Mock transit info
  const transitInfo =
    cosmicSnapshot?.currentTransits || "Your planets are moving through favorable phases. Focus on areas where positive shifts are occurring."

  // Mock life patterns
  const lifePatterns = {
    relationships: "Venus influence suggests deep emotional connections and loyalty.",
    career: "Mercury and Jupiter combination indicates communication skills and opportunity.",
    money: "Financial growth potential with strategic planning and patience.",
    emotional: "Moon position shows emotional depth and need for security.",
  }

  return (
    <div className="overflow-y-auto h-full px-4 pt-4 pb-6 space-y-4 bg-[#050810]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
        <h2 className="text-lg font-bold text-white">My Chart</h2>
        <p className="text-[11px] text-white/30 font-hindi">मेरी कुंडली</p>
      </motion.div>

      {/* 1. Top Summary Card - Cosmic Identity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4"
      >
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Your Cosmic Identity</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Moon Sign",
              value: chartData.moonSign,
              icon: <Moon className="w-4 h-4 text-blue-300" />,
            },
            {
              label: "Lagna",
              value: chartData.lagna,
              icon: <Sunrise className="w-4 h-4 text-amber-400" />,
            },
            {
              label: "Nakshatra",
              value: chartData.nakshatra,
              icon: <Star className="w-4 h-4 text-purple-300" />,
            },
            {
              label: "Dasha",
              value: chartData.currentDasha?.planet || "—",
              icon: <Clock className="w-4 h-4 text-indigo-400" />,
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="flex justify-center mb-1">{item.icon}</div>
              <p className="text-xs font-bold text-white">{item.value}</p>
              <p className="text-[9px] text-white/40">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. Your Recurring Themes - Strengths & Sensitivities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Your Recurring Themes</h3>

        {/* Strengths */}
        <div className="space-y-2">
          <p className="text-[10px] text-white/30 px-1">Strengths</p>
          <div className="space-y-2">
            {strengths.map((strength, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.03 }}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] p-3"
              >
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">{strength}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sensitivities */}
        <div className="space-y-2 pt-2">
          <p className="text-[10px] text-white/30 px-1">Sensitivities</p>
          <div className="space-y-2">
            {sensitivities.map((sensitivity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.03 }}
                className="rounded-lg border border-amber-500/20 bg-amber-500/[0.08] p-3"
              >
                <div className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">{sensitivity}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Current Active Energies */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4"
      >
        <div className="flex items-start gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Current Active Energies</h3>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{transitInfo}</p>
        {chartData.currentDasha && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/40 mb-2">Active Dasha Period</p>
            <p className="text-sm font-semibold text-white">
              {chartData.currentDasha.planet}
              {chartData.currentDasha.subPlanet && ` (in ${chartData.currentDasha.subPlanet})`}
            </p>
          </div>
        )}
      </motion.div>

      {/* 4. Life Map - 4 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">Life Map</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Relationships", pattern: lifePatterns.relationships, icon: <Heart className="w-4 h-4" /> },
            { title: "Career", pattern: lifePatterns.career, icon: <Briefcase className="w-4 h-4" /> },
            { title: "Money", pattern: lifePatterns.money, icon: <TrendingUp className="w-4 h-4" /> },
            { title: "Emotional", pattern: lifePatterns.emotional, icon: <Gem className="w-4 h-4" /> },
          ].map((card, i) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.04 }}
              onClick={() => onTabChange("ask")}
              className="rounded-lg border border-white/[0.04] bg-white/[0.03] p-3 text-left hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-amber-400">{card.icon}</span>
                <p className="text-xs font-bold text-white">{card.title}</p>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">{card.pattern}</p>
              <div className="mt-2 flex items-center text-amber-400/60 group-hover:text-amber-400 transition-colors">
                <span className="text-[9px] font-semibold">Ask GrahAI</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 5. Learn Your Chart - with Advanced toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Learn Your Chart</h3>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/60 transition-colors"
          >
            Advanced details
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Simple Mode - Always Show */}
        <div className="space-y-3 pb-3 border-b border-white/10">
          <div>
            <p className="text-xs text-white/40 mb-2">Your Moon Sign</p>
            <p className="text-sm text-white/80">
              {chartData.moonSign} is your emotional nature. This sign governs your inner world, needs, and how you process feelings.
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">Your Lagna (Ascendant)</p>
            <p className="text-sm text-white/80">
              {chartData.lagna} is how the world sees you. It shapes your appearance, demeanor, and first impressions.
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">Your Nakshatra</p>
            <p className="text-sm text-white/80">
              Born under {chartData.nakshatra}, ruled by {chartData.nakshatraDeity}. Your lunar mansion defines your core nature.
            </p>
          </div>
        </div>

        {/* Advanced Mode - Conditional */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 space-y-3"
          >
            {/* Planet Placements */}
            {chartData.planets.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Planet Placements</p>
                <div className="space-y-1">
                  {chartData.planets.map((planet) => {
                    const badge = DIGNITY_BADGE_COLORS[planet.dignity]
                    return (
                      <div key={planet.name} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg" style={{ color: planet.color }}>
                            {planet.symbol}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{planet.name}</p>
                            <p className="text-[9px] text-white/40">
                              {planet.sign} {planet.house}H • {planet.nakshatra}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-semibold ${badge.bg} ${badge.text} flex-shrink-0`}>
                          {badge.icon} {planet.dignity}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Yogas */}
            {chartData.yogas.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Yogas Found</p>
                <div className="space-y-1">
                  {chartData.yogas.map((yoga) => {
                    const colorScheme = YOGA_TYPE_COLORS[yoga.type]
                    return (
                      <div key={yoga.name} className="p-2 rounded-lg border border-white/5 bg-white/[0.02]">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-white">{yoga.name}</p>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold border ${colorScheme.badge} flex-shrink-0 whitespace-nowrap`}>
                            {yoga.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/60 leading-snug">{yoga.effect}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Doshas */}
            {chartData.doshas.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Active Doshas</p>
                <div className="space-y-1">
                  {chartData.doshas.map((dosha) => {
                    const colorClass = DOSHA_SEVERITY_COLORS[dosha.severity] || DOSHA_SEVERITY_COLORS.mild
                    return (
                      <div key={dosha.name} className={`p-2 rounded-lg border ${colorClass}`}>
                        <p className="text-xs font-semibold mb-0.5">{dosha.name}</p>
                        <p className="text-[9px] opacity-80 leading-snug">{dosha.remedy}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Nakshatra Details */}
            {chartData.nakshatraQualities.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Nakshatra Qualities</p>
                <div className="flex flex-wrap gap-1">
                  {chartData.nakshatraQualities.map((q, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px]">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center mb-2"
      >
        <p className="text-xs text-white/40 leading-relaxed">
          GrahAI uses Swiss Ephemeris with Lahiri Ayanamsa. All interpretations trace to classical Vedic sources.
        </p>
      </motion.div>
    </div>
  )
}

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
              <ReportsTab onShowOverlay={showOverlay} />
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
