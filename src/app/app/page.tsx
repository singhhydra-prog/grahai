"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, Wand2, Heart, Layers, Brain, BarChart3, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

// Daily verses - one for each day of the week
const DAILY_VERSES = [
  {
    day: 0, // Sunday
    sanskrit: "ॐ आत्मा वै ब्रह्म",
    meaning: "The Self is indeed Brahman - what you seek outside is within you."
  },
  {
    day: 1, // Monday
    sanskrit: "चरैवेति चरैवेति",
    meaning: "Keep moving forward - progress is the path of the wise."
  },
  {
    day: 2, // Tuesday
    sanskrit: "शरीरं पञ्चतन्त्रं",
    meaning: "The body is a sacred temple - honor it with intention."
  },
  {
    day: 3, // Wednesday
    sanskrit: "सत्यं मार्गं दर्शय",
    meaning: "Show me the path of truth - let clarity guide your choices."
  },
  {
    day: 4, // Thursday
    sanskrit: "भय न कुरु वीर नाम",
    meaning: "Fear not, brave one - courage is your true nature."
  },
  {
    day: 5, // Friday
    sanskrit: "प्रेम सर्वशक्तिमान",
    meaning: "Love is the ultimate power - it transforms all obstacles."
  },
  {
    day: 6, // Saturday
    sanskrit: "ज्ञानं शक्तिः ज्ञानं",
    meaning: "Knowledge is power - wisdom is the greatest treasure."
  }
]

// Quick action cards config
const QUICK_ACTIONS = [
  {
    icon: "🔮",
    title: "My Kundli",
    href: "/kundli",
    borderColor: "border-yellow-500",
    accentColor: "bg-yellow-500/10"
  },
  {
    icon: "⭐",
    title: "Today's Horoscope",
    href: "/horoscope",
    borderColor: "border-blue-500",
    accentColor: "bg-blue-500/10"
  },
  {
    icon: "💕",
    title: "Match Making",
    href: "/compatibility",
    borderColor: "border-pink-500",
    accentColor: "bg-pink-500/10"
  },
  {
    icon: "🃏",
    title: "Tarot Reading",
    href: "/chat?vertical=tarot",
    borderColor: "border-purple-500",
    accentColor: "bg-purple-500/10"
  },
  {
    icon: "💬",
    title: "Ask AI Astrologer",
    href: "/astrologer",
    borderColor: "border-green-500",
    accentColor: "bg-green-500/10"
  },
  {
    icon: "📊",
    title: "My Reports",
    href: "/reports",
    borderColor: "border-orange-500",
    accentColor: "bg-orange-500/10"
  }
]

// Get Hindi date format
function getHindiDate(): string {
  const months = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ]
  const days = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]

  const today = new Date()
  const dayName = days[today.getDay()]
  const date = today.getDate()
  const month = months[today.getMonth()]

  return `${dayName}, ${date} ${month}`
}

// Get cosmic energy text based on date (deterministic seed)
function getCosmicEnergy(): string {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  const energies = [
    { vibe: "✨ Transformative", desc: "A day of growth and new beginnings. Channel your inner strength." },
    { vibe: "🌙 Introspective", desc: "Look within. Meditation and reflection will bring clarity today." },
    { vibe: "⚡ Energetic", desc: "High vibrations surround you. Act on your dreams with confidence." },
    { vibe: "🌊 Flowing", desc: "Go with the flow. Flexibility is your superpower right now." },
    { vibe: "🔥 Passionate", desc: "Your creative energy is at peak. Express yourself boldly." },
    { vibe: "🕊️ Peaceful", desc: "Harmony is in the air. Take time to rest and recharge." }
  ]

  const index = seed % energies.length
  return energies[index].vibe
}

// Get cosmic energy description
function getCosmicEnergyDesc(): string {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  const descriptions = [
    "A day of growth and new beginnings. Channel your inner strength.",
    "Look within. Meditation and reflection will bring clarity today.",
    "High vibrations surround you. Act on your dreams with confidence.",
    "Go with the flow. Flexibility is your superpower right now.",
    "Your creative energy is at peak. Express yourself boldly.",
    "Harmony is in the air. Take time to rest and recharge."
  ]

  const index = seed % descriptions.length
  return descriptions[index]
}

// WhatsApp share handler
function handleWhatsAppShare() {
  const cosmic = getCosmicEnergy()
  const msg = encodeURIComponent(
    `🌟 My Daily Cosmic Energy from GrahAI:\n\n${cosmic}\n\nDiscover your cosmic insights: https://grahai.vercel.app`
  )
  window.open(`https://wa.me/?text=${msg}`, "_blank")
}

export default function AppGateway() {
  const [hindiDate, setHindiDate] = useState("")
  const [userName, setUserName] = useState("Seeker")
  const [todaysVerse, setTodaysVerse] = useState(DAILY_VERSES[0])

  useEffect(() => {
    // Set Hindi date
    setHindiDate(getHindiDate())

    // Get today's verse based on day of week
    const dayOfWeek = new Date().getDay()
    const verse = DAILY_VERSES.find(v => v.day === dayOfWeek) || DAILY_VERSES[0]
    setTodaysVerse(verse)

    // Try to get user name from localStorage
    const stored = localStorage.getItem("userNameForGreeting")
    if (stored) {
      setUserName(stored)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-[#060A14] text-white">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-purple-950/10 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Safe area top padding + greeting header */}
        <motion.section
          className="px-5 pt-[env(safe-area-inset-top,20px)] pb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-1">
            Namaste, <span className="text-yellow-500">{userName}</span>!
          </h1>
          <p className="text-sm text-gray-400 font-hindi">{hindiDate}</p>
        </motion.section>

        {/* Today's Cosmic Energy card */}
        <motion.section
          className="px-5 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 p-6">
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-3xl opacity-20">✨</div>
            <div className="absolute bottom-2 left-2 text-3xl opacity-20">🌟</div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-yellow-500" />
                <h2 className="text-sm font-semibold text-yellow-500">Today's Cosmic Energy</h2>
              </div>
              <p className="text-lg font-bold mb-2">{getCosmicEnergy()}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{getCosmicEnergyDesc()}</p>
            </div>
          </div>
        </motion.section>

        {/* Quick Action Grid - 2x3 */}
        <section className="px-5 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, idx) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={action.href}>
                  <motion.div
                    className={`relative rounded-xl border-2 ${action.borderColor} ${action.accentColor} p-5 text-center cursor-pointer transition-all active:scale-[0.97]`}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 rounded-xl ${action.accentColor} opacity-0 hover:opacity-100 transition-opacity blur-lg`} />

                    <div className="relative z-10">
                      <div className="text-4xl mb-2">{action.icon}</div>
                      <p className="text-sm font-semibold leading-tight">{action.title}</p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Verse section */}
        <motion.section
          className="px-5 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Daily Verse</h2>

          <div className="relative rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6">
            {/* Quote marks decoration */}
            <div className="absolute top-2 left-3 text-3xl text-purple-500/30">"</div>
            <div className="absolute bottom-2 right-3 text-3xl text-purple-500/30">"</div>

            <div className="relative z-10">
              <p className="text-center text-lg font-hindi font-bold text-purple-300 mb-4">
                {todaysVerse.sanskrit}
              </p>
              <p className="text-center text-sm text-gray-300 leading-relaxed italic">
                {todaysVerse.meaning}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Share section */}
        <motion.section
          className="px-5 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4">Share Your Cosmic Journey</h2>

          <motion.button
            onClick={handleWhatsAppShare}
            className="w-full rounded-xl bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/40 p-4 font-semibold text-green-300 flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={20} />
            Share on WhatsApp
          </motion.button>
        </motion.section>

        {/* Bottom safe area spacer */}
        <div className="h-8" />
      </div>
    </main>
  )
}
