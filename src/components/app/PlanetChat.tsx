"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles } from "lucide-react"

/* ═══════════════════════════════════════════════════
   PLANET CHAT — Talk to your planets 1-on-1
   Each planet is a deity with unique personality
   ═══════════════════════════════════════════════════ */

interface PlanetInfo {
  name: string
  nameHi: string
  icon: string
  role: string
  color: string
  messages: string[]
  mantra: string
}

const PLANETS: Record<string, PlanetInfo> = {
  Su: {
    name: "Surya",
    nameHi: "सूर्य",
    icon: "☀️",
    role: "Your Soul Planet · Lagna Ruler",
    color: "#F59E0B",
    mantra: "ॐ सूर्याय नमः",
    messages: [
      "I am <b>Surya</b>, ruler of your Lagna.<br>Your soul chose <b>Aries rising</b> — a warrior's path.",
      "Right now I sit in your <b>1st house</b>.<br>Your <b>confidence is at peak</b>.<br>People notice you without you trying.",
      "My advice today:<br><b>Lead a meeting or pitch an idea.</b><br>My energy amplifies your voice until sunset.",
    ],
  },
  Mo: {
    name: "Chandra",
    nameHi: "चन्द्र",
    icon: "🌙",
    role: "Your Mind · 4th House Lord",
    color: "#C7D2FE",
    mantra: "ॐ चन्द्राय नमः",
    messages: [
      "I am <b>Chandra</b>, lord of your <b>4th house</b>.<br>I govern your emotions, memory, and inner peace.",
      "Today I'm in <b>Cancer — my own sign</b>.<br>Your <b>intuition is razor-sharp</b>.<br>Trust your gut over logic today.",
      "Spend time near <b>water</b> if you can.<br>A river, a fountain, even a bath.<br><b>Water amplifies my blessings.</b>",
    ],
  },
  Ma: {
    name: "Mangal",
    nameHi: "मंगल",
    icon: "🔴",
    role: "Your Energy · 3rd House Warrior",
    color: "#EF4444",
    mantra: "ॐ मंगलाय नमः",
    messages: [
      "I am <b>Mangal</b> — Mars.<br>I sit in your <b>3rd house of courage</b>.<br>I make you fearless in communication.",
      "<b>Today my transit is active.</b><br>Extra physical energy is available.<br>Channel it into <b>exercise or decisive action</b>.",
      "Warning: avoid <b>arguments after 6 PM</b>.<br>My energy turns aggressive in the evening.<br><b>Morning is your power window.</b>",
    ],
  },
  Me: {
    name: "Budh",
    nameHi: "बुध",
    icon: "💚",
    role: "Your Intellect · Communication Lord",
    color: "#22C55E",
    mantra: "ॐ बुधाय नमः",
    messages: [
      "I am <b>Budh</b> — Mercury.<br>Together with Surya in your <b>1st house</b>,<br>I give you <b>sharp analytical thinking</b>.",
      "Good news: I'm in <b>strong dignity</b> today.<br>Write that email, sign that contract.<br><b>Your words carry extra weight.</b>",
      "Tip: wear <b>green</b> today.<br>It amplifies my energy in your chart.<br><b>Wednesday is my day — use it well.</b>",
    ],
  },
  Ju: {
    name: "Guru",
    nameHi: "गुरु",
    icon: "💛",
    role: "Your Wisdom · Fortune Lord",
    color: "#EAB308",
    mantra: "ॐ बृहस्पतये नमः",
    messages: [
      "I am <b>Guru</b> — Jupiter, the great benefic.<br>In your <b>9th house of dharma</b>,<br>I bless you with <b>luck and higher wisdom</b>.",
      "<b>I'm in my own sign — Sagittarius.</b><br>This is the strongest I can be.<br>Your fortune house is <b>fully activated</b>.",
      "Seek <b>a teacher or mentor</b> today.<br>Knowledge received now will <b>transform your year</b>.<br>ॐ बृहस्पतये नमः 🙏",
    ],
  },
  Ve: {
    name: "Shukra",
    nameHi: "शुक्र",
    icon: "💎",
    role: "Your Love · 7th House Beauty",
    color: "#EC4899",
    mantra: "ॐ शुक्राय नमः",
    messages: [
      "I am <b>Shukra</b> — Venus.<br>In your <b>7th house of partnership</b>,<br>I bless your relationships with <b>beauty and harmony</b>.",
      "Your marriage/partnership house is <b>very strong</b>.<br>I attract artistic, beautiful connections.<br><b>Love comes naturally to you.</b>",
      "Today: <b>dress well, visit something beautiful</b>.<br>Art gallery, garden, or music.<br><b>Beauty recharges my power in your chart.</b>",
    ],
  },
  Sa: {
    name: "Shani",
    nameHi: "शनि",
    icon: "🪐",
    role: "Your Discipline · 10th House Taskmaster",
    color: "#6366F1",
    mantra: "ॐ शनैश्चराय नमः",
    messages: [
      "I am <b>Shani</b> — Saturn.<br>Many fear me, but in your chart<br>I sit in the <b>10th house — my favourite place</b>.",
      "I give you <b>discipline, persistence, authority</b>.<br>Your career will be built <b>brick by brick</b>.<br>But it will last <b>forever</b>.",
      "<b>Don't take shortcuts today.</b><br>I reward patience and punish haste.<br>Do the hard work. <b>I'm watching.</b> 🪐",
    ],
  },
  Ra: {
    name: "Rahu",
    nameHi: "राहु",
    icon: "🐍",
    role: "Your Ambition · Shadow Planet",
    color: "#8B5CF6",
    mantra: "ॐ राहवे नमः",
    messages: [
      "I am <b>Rahu</b> — the north node.<br>I create <b>intense desire and obsession</b>.<br>In your 12th house, I drive <b>spiritual hunger</b>.",
      "I'm the planet of <b>foreign lands and innovation</b>.<br>You may feel drawn to <b>unconventional paths</b>.<br>That's my energy — <b>embrace it</b>.",
      "Be careful of <b>illusions today</b>.<br>I can make things seem better than they are.<br><b>Verify before you trust.</b>",
    ],
  },
  Ke: {
    name: "Ketu",
    nameHi: "केतु",
    icon: "🔥",
    role: "Your Past Life · South Node",
    color: "#F97316",
    mantra: "ॐ केतवे नमः",
    messages: [
      "I am <b>Ketu</b> — the south node.<br>I carry your <b>past-life wisdom</b>.<br>In the 12th house, I accelerate <b>spiritual growth</b>.",
      "You may feel <b>detached from material things</b> today.<br>That's my gift — not my curse.<br><b>Detachment brings clarity.</b>",
      "Meditate for <b>11 minutes</b> today.<br>I'll open channels to <b>past-life knowledge</b>.<br>Trust the visions that come. 🔥",
    ],
  },
}

interface PlanetChatProps {
  planetKey: string | null
  onClose: () => void
}

export default function PlanetChat({ planetKey, onClose }: PlanetChatProps) {
  const [visibleMsgs, setVisibleMsgs] = useState(0)
  const [userInput, setUserInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const planet = planetKey ? PLANETS[planetKey] : null

  // Stagger messages appearing
  useEffect(() => {
    if (!planet) {
      setVisibleMsgs(0)
      return
    }
    setVisibleMsgs(0)
    const timers: NodeJS.Timeout[] = []
    planet.messages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleMsgs(i + 1), 800 + i * 1200))
    })
    return () => timers.forEach(clearTimeout)
  }, [planet])

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [visibleMsgs])

  if (!planet) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-[#060A14]/95 backdrop-blur-xl"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]"
          style={{ background: `linear-gradient(135deg, ${planet.color}08, transparent)` }}
        >
          <motion.span
            className="text-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {planet.icon}
          </motion.span>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-bold text-white">{planet.name}</h2>
              <span className="font-hindi text-xs text-gold/40">{planet.nameHi}</span>
            </div>
            <p className="text-[11px] text-white/40">{planet.role}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-white/40" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
          {/* Mantra header */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-hindi text-sm text-gold/30">{planet.mantra}</p>
          </motion.div>

          {/* Planet messages */}
          {planet.messages.slice(0, visibleMsgs).map((msg, i) => (
            <motion.div
              key={i}
              className="flex gap-2.5"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-lg mt-1 shrink-0">{planet.icon}</span>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%]"
                style={{ background: `${planet.color}10`, border: `1px solid ${planet.color}15` }}
              >
                <p
                  className="text-[15px] text-white/85 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: msg }}
                />
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {visibleMsgs < planet.messages.length && (
            <motion.div
              className="flex gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-lg mt-1">{planet.icon}</span>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white/[0.03] border border-white/[0.06]">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-white/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center rounded-full bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Ask ${planet.name} anything...`}
                className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
              />
              <Sparkles className="h-4 w-4 text-gold/30 ml-2" />
            </div>
            <button
              className="p-3 rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all active:scale-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
