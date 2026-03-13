"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, MessageCircle, Menu, ArrowRight,
  Star, Moon, Send, Sparkles,
  Briefcase, Flame, Award, Crown, Download,
  Bell, Eye, CalendarDays, Sunrise, Info,
  Check, ChevronRight, ChevronLeft, BookOpen,
  Share2, Zap,
} from "lucide-react"
import { OverlayType, TabType, CosmicStory, TopUpModule } from "@/types/app"

// ═══════════════════════════════════════════════════
// DATA CONSTANTS
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

function getTodaysVerse() {
  const day = new Date().getDay()
  return DAILY_VERSES[day] || DAILY_VERSES[0]
}

// ═══════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════

/* ─── Cosmic Stories Component ─── */
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
    <div className="px-4 pt-8 pb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Daily Cosmic Stories</h3>
          <span className="text-[10px] text-white/30 font-hindi">दैनिक कथा</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/40">{currentIndex + 1}/{COSMIC_STORIES.length}</span>
          {readStories.size >= 3 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">
              <Award className="w-2.5 h-2.5 inline mr-0.5" />Streak
            </span>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-5">
        {COSMIC_STORIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="flex-1 h-1.5 rounded-full transition-all duration-300"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative rounded-2xl border border-white/[0.06] bg-gradient-to-br ${story.gradient} overflow-hidden`}
          >
            {/* Card content */}
            <div className="p-5">
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
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
                  className="text-white/40 hover:text-white/70 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-lg font-bold text-white leading-tight mb-1">
                {story.title}
              </h4>
              <p className="text-[10px] text-white/30 font-hindi mb-4">{story.titleHi}</p>

              {/* Body */}
              <p className="text-sm text-white/80 leading-relaxed mb-5">
                {story.body}
              </p>

              {/* Source */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-black/20 border border-white/[0.05] mb-5">
                <BookOpen className="w-4 h-4 text-amber-400/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-amber-400/80 font-medium">{story.source}</p>
                  <p className="text-[9px] text-white/30">{story.sourceRef}</p>
                </div>
              </div>

              {/* CTA — Clear Primary Action */}
              <button
                onClick={() => onAction(story.cta.action)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-400 text-[#050810] font-semibold text-sm hover:bg-amber-300 transition-all duration-300 active:scale-[0.98]"
              >
                {story.cta.label}
                <ArrowRight className="w-4 h-4" />
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
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Top-Up Micro Modules ─── */
function TopUpModules({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="px-4 pt-8 pb-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Power-Ups</h3>
        <span className="text-[10px] text-white/30 font-hindi">विशेष सेवाएँ</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TOP_UP_MODULES.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
          >
            <button
              onClick={() => onAction(mod.action)}
              className={`block w-full text-left relative rounded-xl border border-white/[0.06] bg-gradient-to-br ${mod.gradient} p-5 hover:border-amber-500/30 transition-all duration-300 active:scale-[0.97] h-full`}
            >
              {/* Tag badge */}
              {mod.tag && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[8px] font-bold border border-amber-500/30">
                  {mod.tag}
                </span>
              )}

              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-amber-400 mb-3">
                {mod.icon}
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-white leading-tight mb-1">{mod.title}</h4>
              <p className="text-[9px] text-white/30 font-hindi mb-2">{mod.titleHi}</p>

              {/* Description */}
              <p className="text-[10px] text-white/60 leading-relaxed line-clamp-2 mb-4">{mod.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-amber-400">{mod.price}</span>
                <span className="text-[9px] text-white/40">{mod.priceLabel}</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// HOME TAB MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function HomeTab({
  onShowOverlay,
  onTabChange,
  isNewUser,
}: {
  onShowOverlay: (o: OverlayType) => void
  onTabChange: (t: TabType) => void
  isNewUser?: boolean
}) {
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
  const greeting = userName
    ? `Good ${today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, ${userName.split(" ")[0]}`
    : `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}`

  return (
    <div className="overflow-y-auto h-full bg-[#050810]">
      {/* ─── Acquisition Hero (new users only) ─── */}
      {isNewUser && (
        <div className="relative px-4 pt-8 pb-8 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-400/[0.06] blur-[100px]" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-white">
                Grah<span className="text-amber-400">AI</span>
              </span>
            </div>
            <h1 className="text-2xl leading-tight font-bold text-white max-w-xs mx-auto">
              Get chart-based clarity for love, career, timing, and life decisions.
            </h1>
            <p className="mt-3 text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
              AI Jyotish guidance, personalized from your birth chart, with source-backed explanations.
            </p>
            <div className="mt-6 space-y-3 max-w-xs mx-auto">
              <button
                onClick={() => onShowOverlay("onboarding")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
              >
                Get my first insight <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowOverlay("sample-preview")}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-amber-400/30 hover:text-white active:scale-[0.98]"
              >
                See a sample answer
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              {["Personalized", "Classical sources", "Real decisions"].map((badge) => (
                <span key={badge} className="flex items-center gap-1 text-[10px] text-white/40">
                  <span className="w-1 h-1 rounded-full bg-amber-400/50" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
        </div>
      )}

      {/* ═══ SECTION 1: Today for You (Simplified Hero) ═══ */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-xs text-white/50 mb-2">{greeting}</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.03] p-5 relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/[0.05] blur-[60px]" />
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Sunrise className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-wider">Today's Theme</span>
            </div>

            {/* Primary message */}
            <h2 className="text-lg font-bold text-white leading-snug mb-3">{todayTheme}</h2>

            {/* Supporting info */}
            <p className="text-sm text-white/80 leading-relaxed mb-4">{verse.meaning}</p>

            {/* Cosmic snapshot chips */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {cosmicSnap?.moonSign && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-blue-500/15 border border-blue-500/20 text-[11px] text-blue-300 font-medium">
                  <Moon className="w-3.5 h-3.5" />
                  {cosmicSnap.moonSign}
                </span>
              )}
              {cosmicSnap?.nakshatra && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-purple-500/15 border border-purple-500/20 text-[11px] text-purple-300 font-medium">
                  <Star className="w-3.5 h-3.5" />
                  {cosmicSnap.nakshatra}
                </span>
              )}
            </div>

            {/* Single clear CTA */}
            <button
              onClick={() => onTabChange("ask")}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-amber-400 text-[#050810] font-semibold text-sm hover:bg-amber-300 transition-all duration-300 active:scale-[0.98] justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Ask About Today
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ═══ SECTION 2: Quick Guidance Lanes ═══ */}
      <div className="px-4 pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-6">Quick Guidance</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Heart className="w-5 h-5 text-pink-400" />, label: "Love", sublabel: "Today" },
            { icon: <Briefcase className="w-5 h-5 text-blue-400" />, label: "Career", sublabel: "Today" },
            { icon: <Flame className="w-5 h-5 text-orange-400" />, label: "Energy", sublabel: "Today" },
          ].map((lane) => (
            <motion.button
              key={lane.label}
              onClick={() => onTabChange("ask")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-amber-500/20 transition-all duration-300 active:scale-[0.97]"
            >
              {lane.icon}
              <span className="text-xs font-semibold text-white">{lane.label}</span>
              <span className="text-[9px] text-white/40">{lane.sublabel}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 3: Ask GrahAI ═══ */}
      <div className="px-4 pt-6 pb-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/25 to-orange-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-white">Ask GrahAI</span>
          </div>

          {/* Input area */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && askInput.trim()) {
                  onTabChange("ask")
                }
              }}
              placeholder="What's on your mind?"
              className="flex-1 px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/40 transition-colors"
            />
            <button
              onClick={() => onTabChange("ask")}
              className="px-4 py-3 rounded-lg bg-amber-400 text-[#050810] font-semibold text-sm hover:bg-amber-300 transition-colors duration-300 active:scale-[0.97]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-2">
            {["Career timing", "Love match", "Health today", "Money flow", "Auspicious dates"].map((chip) => (
              <button
                key={chip}
                onClick={() => onTabChange("ask")}
                className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[10px] text-white/50 hover:border-amber-400/30 hover:text-white/70 transition-all duration-300"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 4: Your Momentum ═══ */}
      <div className="px-4 pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-6">Your Momentum</h3>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          {/* Streak */}
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.04]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">1 day streak</p>
              <p className="text-[10px] text-white/50">Keep asking daily for deeper insights</p>
            </div>
          </div>

          {/* Last questions */}
          {savedQuestions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-3">Recent Questions</p>
              {savedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onTabChange("ask")}
                  className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-amber-500/20 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0" />
                  <span className="text-[11px] text-white/70 truncate">{q}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[11px] text-white/50">Ask your first question to start building your cosmic journal</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 5: Premium Depth ═══ */}
      <div className="px-4 pt-6 pb-4">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-6">Go Deeper</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <CalendarDays className="w-5 h-5" />,
              title: "Annual Forecast",
              desc: "Month-by-month predictions",
              price: "₹399",
              action: "pricing" as OverlayType,
            },
            {
              icon: <Heart className="w-5 h-5" />,
              title: "Compatibility",
              desc: "Deep Ashtakoot + Dosha",
              price: "₹249",
              action: "compatibility" as OverlayType,
            },
            {
              icon: <Download className="w-5 h-5" />,
              title: "Kundli PDF",
              desc: "Complete birth chart",
              price: "₹149",
              action: "pricing" as OverlayType,
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              title: "Live Expert",
              desc: "1-on-1 guidance session",
              price: "₹999",
              action: "astrologer" as OverlayType,
            },
          ].map((item) => (
            <motion.button
              key={item.title}
              onClick={() => onShowOverlay(item.action)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/20 transition-all duration-300 active:scale-[0.97]"
            >
              <div className="text-amber-400 mb-3">{item.icon}</div>
              <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
              <p className="text-[10px] text-white/50 mb-3 line-clamp-1">{item.desc}</p>
              <span className="text-sm font-bold text-amber-400">{item.price}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION 6: Cosmic Stories ═══ */}
      <CosmicStories onAction={(a) => onShowOverlay(a as OverlayType)} />

      {/* ═══ SECTION 7: Mantra of the Day ═══ */}
      <div className="px-4 pt-6 pb-8">
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-6 text-center">
          <span className="text-[10px] text-amber-400/50 uppercase tracking-wider font-semibold">
            🕉️ Today's Mantra
          </span>
          <p className="text-base font-hindi font-bold text-amber-200/90 mt-3 leading-relaxed">{verse.sanskrit}</p>
          <p className="text-[11px] text-white/50 italic mt-2">{verse.meaning}</p>
        </div>
      </div>

      {/* Top-Up Modules */}
      <TopUpModules onAction={(a) => onShowOverlay(a as OverlayType)} />
    </div>
  )
}
