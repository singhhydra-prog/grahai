"use client"

/* ════════════════════════════════════════════════════════
   Product 4 — AI Astrologer (Consumer-Facing)

   Beautiful, standalone "Ask the AI Astrologer" experience.
   No login required for first 3 questions (freemium).
   Features pre-built question cards, voice-like typing
   animation, and rich response formatting.
   ════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Sparkles, Star, Moon, Sun, Heart,
  Briefcase, Brain, ArrowRight, ChevronRight,
  MessageCircle, Mic, Zap, Eye, RefreshCw,
  ArrowUp, User, Bot, Loader2
} from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickQuestion {
  icon: React.ElementType
  label: string
  question: string
  category: string
  color: string
}

// ─── Demo Response Generator ────────────────────────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateResponse(question: string): string {
  const seed = question.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = seedRandom(seed)
  const idx = (arr: string[]) => arr[Math.floor(rand() * arr.length)]

  const q = question.toLowerCase()

  if (q.includes("love") || q.includes("relationship") || q.includes("marriage") || q.includes("partner")) {
    return idx([
      `🌹 **Love & Relationships Insight**\n\nBased on Vedic astrology principles, Venus (Shukra) is the primary significator of love and marriage. Currently, Venus is transiting through a favorable position, which enhances romantic energies.\n\n**Key Observations:**\n\n• Your 7th house (house of partnerships) is receiving beneficial aspects\n• The Moon-Venus conjunction suggests heightened emotional sensitivity in relationships\n• Jupiter's aspect indicates potential for growth and expansion in love matters\n\n**Guidance:** This is a favorable period for expressing feelings and deepening bonds. If you're seeking a partner, social gatherings between Thursday and Saturday are especially auspicious.\n\n**Mantra:** *Om Shukraya Namah* — Chant 108 times on Fridays for Venus's blessings.\n\n*For a personalized reading based on your exact birth chart, I recommend generating your [Kundli](/kundli) or trying our [Compatibility Matching](/compatibility).*`,

      `💫 **Relationship Cosmic Reading**\n\nThe celestial patterns suggest an important period for matters of the heart. Let me share what the stars reveal:\n\n**Current Transit Influence:**\nVenus in your sector of relationships creates a magnetic pull toward authentic connections. This isn't about surface-level attraction — it's about soul-level recognition.\n\n**What to Watch For:**\n• A meaningful conversation that shifts a relationship dynamic\n• An opportunity to heal an old wound related to love or trust\n• Increased intuition about a partner's true feelings\n\n**Vedic Wisdom:** The Brihat Parashara Hora Shastra teaches that when Venus is well-placed, one experiences *sukha* (happiness) in partnerships. Honor this energy by practicing gratitude for the love already present in your life.\n\n**Remedy:** Offer white flowers at a temple or sacred space this Friday.\n\n*Want deeper insight? Try our [Kundli Matching](/compatibility) for comprehensive relationship analysis.*`,
    ])
  }

  if (q.includes("career") || q.includes("job") || q.includes("work") || q.includes("business") || q.includes("money") || q.includes("finance")) {
    return idx([
      `📊 **Career & Financial Insight**\n\nThe 10th house (Karma Bhava) governs career and public reputation in Vedic astrology. Let me analyze the current planetary influences:\n\n**Current Indicators:**\n\n• Saturn's disciplined energy favors long-term strategic planning over impulsive moves\n• Mercury's transit enhances communication — ideal for presentations, negotiations, and networking\n• Jupiter's aspect on your financial houses suggests gradual but steady growth\n\n**Action Items:**\n1. **This Week:** Focus on completing pending tasks. Saturn rewards finishing what you start.\n2. **Financial Timing:** The period around the next Pushya Nakshatra day is auspicious for investments.\n3. **Networking:** Thursday (Guru-vara/Jupiter's day) is optimal for important professional meetings.\n\n**Avoid:** Starting new ventures during Rahu Kaal hours. Check today's [Panchang](/horoscope) for exact timing.\n\n**Mantra for Career Success:** *Om Shanaishcharaya Namah* — Recite 11 times before important work decisions.\n\n*For a detailed career analysis based on your Dashas, generate your [Birth Chart](/kundli).*`,

      `💼 **Professional Trajectory Reading**\n\nThe cosmic blueprint for your career shows interesting patterns. Here's what the planetary alignments suggest:\n\n**Saturn's Message:** Hard work from the past 2-3 months is about to bear fruit. Saturn doesn't give quickly, but what it gives is lasting and earned.\n\n**Mercury's Gift:** Your ability to communicate complex ideas simply is heightened. Use this for:\n• Writing proposals or documentation\n• Leading team discussions\n• Negotiating terms\n\n**Jupiter's Expansion:** Financial growth comes through knowledge and mentorship. Teaching others what you know opens unexpected doors.\n\n**Timing Insight:** The most auspicious days for career moves this month fall on Thursdays and when the Moon transits through Hasta or Pushya Nakshatra.\n\n**Vedic Remedy:** Donate books or educational materials on Saturdays to strengthen Saturn's positive influence on your career house.\n\n*For precise Dasha timing of career peaks, create your [Kundli](/kundli).*`,
    ])
  }

  if (q.includes("health") || q.includes("wellness") || q.includes("energy") || q.includes("stress")) {
    return idx([
      `🌿 **Health & Wellness Reading**\n\nIn Vedic astrology, the 6th house governs health, while the Ascendant (Lagna) represents overall vitality. Here's your cosmic wellness guidance:\n\n**Current Planetary Influence on Health:**\n\n• **Sun (Surya):** Your core vitality is stable. Morning sunlight exposure between 6-8 AM strengthens Surya's positive effects.\n• **Moon (Chandra):** Emotional health needs attention. The Moon's current transit may cause sleep fluctuations.\n• **Mars (Mangal):** Physical energy is high but scattered. Channel it through structured exercise.\n\n**Wellness Recommendations:**\n\n1. **Ayurvedic Timing:** Eat your largest meal between 12-2 PM when digestive fire (Agni) peaks\n2. **Pranayama:** Practice Nadi Shodhana (alternate nostril breathing) for 10 minutes daily\n3. **Herbs:** Ashwagandha during Mars-dominant periods helps channel aggressive energy\n\n**Caution Period:** Avoid overexertion during Rahu Kaal hours today.\n\n**Healing Mantra:** *Om Dhanvantaraye Namah* — The mantra of the celestial physician.\n\n*Check today's [Daily Horoscope](/horoscope) for specific timing guidance.*`,
    ])
  }

  // General / spiritual / default
  return idx([
    `✨ **Cosmic Guidance for You**\n\nThank you for your question. Let me consult the celestial wisdom:\n\nThe current planetary alignment suggests a period of **transition and growth**. Here's what the stars reveal:\n\n**Key Planetary Messages:**\n\n• **Jupiter (Guru):** Expansion of wisdom and opportunities. Stay open to learning from unexpected sources.\n• **Saturn (Shani):** Discipline and patience are your greatest allies right now. What feels slow is actually building something lasting.\n• **Moon (Chandra):** Your intuition is especially sharp during this lunar phase. Trust your inner knowing.\n\n**Spiritual Guidance:**\nThe Bhagavad Gita teaches: *"Yoga is the journey of the self, through the self, to the self."* This period invites you to go inward before moving outward.\n\n**Practical Steps:**\n1. Meditate during Brahma Muhurta (4:00-5:30 AM) for amplified clarity\n2. Practice gratitude — list 3 blessings each morning\n3. Align major decisions with favorable Muhurta timings\n\n**Today's Mantra:** *Om Gam Ganapataye Namah* — Invoke Ganesha to remove obstacles from your path.\n\n*For personalized insights based on your exact birth details, explore your [Kundli](/kundli) or check today's [Horoscope](/horoscope).*`,

    `🔮 **Vedic Wisdom for Your Query**\n\nThe cosmic energies are dynamic right now, and your question comes at a meaningful time. Here's what I sense:\n\n**The Big Picture:**\nWe're in a period where Rahu (the North Node) is encouraging us to step beyond comfort zones, while Ketu (South Node) asks us to release outdated identities. This push-pull creates both anxiety and opportunity.\n\n**For You Specifically:**\n\n• **Trust the process.** What's unfolding may not match your expectations, but it matches your growth trajectory.\n• **Communication is key.** Mercury's influence suggests that an honest conversation will unlock a stuck situation.\n• **Timing matters.** The next Ekadashi (11th lunar day) is especially powerful for setting intentions.\n\n**Ancient Wisdom:**\nFrom the Brihat Jataka: *"The wise use astrology as a lamp in the darkness, not as a cage for the spirit."* The planets influence, but your free will and karma are the ultimate authors of your story.\n\n**Remedy:** Light a ghee lamp at dusk facing east, and state your intention clearly. The transition between day and night (Sandhya) amplifies prayers.\n\n*Dive deeper with your [Birth Chart Analysis](/kundli) or explore [Compatibility Matching](/compatibility) for relationship insights.*`,
  ])
}

// ─── Constants ──────────────────────────────────────────

const QUICK_QUESTIONS: QuickQuestion[] = [
  { icon: Heart, label: "Love", question: "What do the stars say about my love life this week?", category: "Relationships", color: "#F0C8E0" },
  { icon: Briefcase, label: "Career", question: "What career opportunities are the planets indicating for me?", category: "Career", color: "#4ADE80" },
  { icon: Moon, label: "Today", question: "What should I focus on today according to my horoscope?", category: "Daily", color: "#C8D8E4" },
  { icon: Brain, label: "Spiritual", question: "What spiritual practices would benefit me right now?", category: "Spiritual", color: "#8B8BCD" },
  { icon: Sun, label: "Health", question: "What does Vedic astrology suggest for my health and energy this month?", category: "Health", color: "#E2994A" },
  { icon: Star, label: "General", question: "Give me a general Vedic astrology reading for the current period.", category: "General", color: "#E2C474" },
]

const SUGGESTED_FOLLOWUPS = [
  "What remedies can improve my situation?",
  "Which planet is most influential for me right now?",
  "What does my Nakshatra say about this?",
  "Is there an auspicious time for important decisions?",
]

// ─── Typing Animation Hook ──────────────────────────────

function useTypingAnimation(text: string, speed: number = 12) {
  const [displayed, setDisplayed] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setIsComplete(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, isComplete }
}

// ─── Markdown-lite renderer ─────────────────────────────

function RenderContent({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return <h2 key={i} className="text-lg font-bold text-text/90 mt-3">{line.slice(2)}</h2>
        }
        if (line.startsWith("## ") || line.startsWith("**") && line.endsWith("**")) {
          const clean = line.replace(/^\*\*|\*\*$/g, "").replace(/^## /, "")
          return <h3 key={i} className="text-sm font-bold text-gold/80 mt-2">{clean}</h3>
        }
        if (line.startsWith("• ") || line.startsWith("- ")) {
          return (
            <p key={i} className="text-sm text-text/70 leading-relaxed pl-3 flex gap-2">
              <span className="text-gold/40 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
            </p>
          )
        }
        if (/^\d+\./.test(line)) {
          return (
            <p key={i} className="text-sm text-text/70 leading-relaxed pl-3">
              <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            </p>
          )
        }
        if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
          return <p key={i} className="text-xs text-text-dim/50 italic leading-relaxed">{line.replace(/^\*|\*$/g, "")}</p>
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-sm text-text/70 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text/90 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gold/70">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-gold/70 underline underline-offset-2 hover:text-gold transition-colors">$1</a>')
}

// ─── Message Bubble ─────────────────────────────────────

function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-gold/[0.1] border border-gold/[0.15]">
          <p className="text-sm text-text/90">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="h-3.5 w-3.5 text-gold/70" />
      </div>
      <div className="flex-1 max-w-[90%]">
        <div className="chat-bubble-assistant rounded-2xl rounded-tl-md bg-bg-card/80 border border-white/[0.04] px-5 py-4">
          {isLatest ? (
            <TypingResponse content={message.content} />
          ) : (
            <RenderContent content={message.content} />
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TypingResponse({ content }: { content: string }) {
  const { displayed, isComplete } = useTypingAnimation(content, 8)
  return (
    <>
      <RenderContent content={displayed} />
      {!isComplete && (
        <span className="inline-block w-1.5 h-4 bg-gold/50 animate-pulse ml-0.5 align-middle" />
      )}
    </>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function AstrologerPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const FREE_LIMIT = 3

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return
    if (questionsAsked >= FREE_LIMIT) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsThinking(true)
    setQuestionsAsked(prev => prev + 1)

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(text)
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsThinking(false)
    }, 1500 + Math.random() * 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const isAtLimit = questionsAsked >= FREE_LIMIT

  // ─── Empty State ────────────────────────────────────

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gold/[0.015] blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/[0.06] border border-gold/[0.15] flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-gold/70" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Ask the <span className="gold-text">AI Astrologer</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto mb-2">
              Get instant Vedic astrology guidance powered by ancient wisdom and modern AI
            </p>
            <p className="text-[10px] text-gold/40 tracking-wider">
              {FREE_LIMIT - questionsAsked} free questions remaining • Unlimited with GrahAI Pro
            </p>
          </motion.div>

          {/* Quick Questions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-xs text-text-dim/40 text-center mb-4 tracking-wide">Choose a topic or ask anything</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_QUESTIONS.map((q, i) => (
                <motion.button
                  key={q.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(q.question)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${q.color}10` }}>
                    <q.icon className="h-5 w-5" style={{ color: q.color }} />
                  </div>
                  <span className="text-xs font-semibold text-text/70">{q.label}</span>
                  <span className="text-[9px] text-text-dim/30">{q.category}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Input Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="glass-input flex items-center gap-3 pr-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about love, career, health, spirituality..."
                className="flex-1 bg-transparent px-5 py-4 text-sm text-text/90 placeholder:text-text-dim/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-gold/20 text-gold hover:bg-gold/30"
                    : "bg-white/[0.03] text-text-dim/20"
                }`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </motion.form>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            {[
              "Based on BPHS",
              "Panchang-Aware",
              "Vedic Traditions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gold/30" />
                <span className="text-[9px] text-text-dim/30 tracking-wider">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  // ─── Chat View ──────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header Bar */}
      <div className="fixed top-0 z-40 w-full glass-nav border-b border-white/[0.04]">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-gold/70" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text/80">AI Astrologer</span>
              <span className="text-[9px] text-green/50 ml-2">● Online</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-dim/30">
              {isAtLimit ? "Limit reached" : `${FREE_LIMIT - questionsAsked} questions left`}
            </span>
            <Link href="/horoscope" className="text-[10px] text-gold/50 hover:text-gold/70 transition-colors">
              Daily Horoscope →
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 pt-20 pb-32 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 space-y-6 py-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLatest={msg.role === "assistant" && i === messages.length - 1}
            />
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gold/[0.08] border border-gold/[0.15] flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-gold/70" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-bg-card/80 border border-white/[0.04] px-5 py-4">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested follow-ups after AI response */}
          {messages.length > 0 &&
           messages[messages.length - 1].role === "assistant" &&
           !isThinking &&
           !isAtLimit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 pl-11"
            >
              {SUGGESTED_FOLLOWUPS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gold/10 bg-gold/[0.03] text-gold/60 hover:bg-gold/[0.06] hover:border-gold/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          {/* Free limit reached */}
          {isAtLimit && !isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center space-y-4 mx-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gold/[0.08] flex items-center justify-center">
                <Zap className="h-5 w-5 text-gold/70" />
              </div>
              <h3 className="text-sm font-semibold text-text/80">You&apos;ve used your {FREE_LIMIT} free questions</h3>
              <p className="text-xs text-text-dim/50 max-w-sm mx-auto">
                Unlock unlimited AI astrology consultations, personalized daily readings, and deep chart analysis with GrahAI Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/pricing"
                  className="glow-btn text-sm py-2.5 px-6 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
                <Link
                  href="/chat"
                  className="rounded-xl border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-sm font-semibold text-gold/70 hover:border-gold/30 transition-all flex items-center justify-center gap-2"
                >
                  Sign in for more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar (fixed bottom) */}
      <div className="fixed bottom-0 w-full bg-gradient-to-t from-bg via-bg/95 to-transparent pt-6 pb-6">
        <div className="max-w-2xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className={`glass-input flex items-center gap-3 pr-2 ${isAtLimit ? "opacity-50 pointer-events-none" : ""}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAtLimit ? "Upgrade to continue asking..." : "Ask a follow-up question..."}
                disabled={isAtLimit || isThinking}
                className="flex-1 bg-transparent px-5 py-3.5 text-sm text-text/90 placeholder:text-text-dim/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking || isAtLimit}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isThinking
                    ? "bg-gold/20 text-gold hover:bg-gold/30"
                    : "bg-white/[0.03] text-text-dim/20"
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick nav */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {[
              { href: "/horoscope", label: "Daily Horoscope" },
              { href: "/kundli", label: "Birth Chart" },
              { href: "/compatibility", label: "Matching" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-[9px] text-text-dim/30 hover:text-gold/40 transition-colors tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
