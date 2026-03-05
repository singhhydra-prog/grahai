"use client"

import { useState, useEffect, useRef, Suspense, type FormEvent, type KeyboardEvent } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Send,
  ArrowLeft,
  Sun,
  Moon,
  Star,
  Compass,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

/* ────────────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────────────── */
interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  agent_name?: string
  created_at: string
}

interface Vertical {
  id: string
  name: string
  nameHi: string
  icon: typeof Sun
  color: string
  desc: string
  placeholder: string
}

/* ────────────────────────────────────────────────────
   VERTICALS CONFIG
   ──────────────────────────────────────────────────── */
const VERTICALS: Vertical[] = [
  {
    id: "astrology",
    name: "Vedic Astrology",
    nameHi: "ज्योतिष",
    icon: Sun,
    color: "text-amber-400",
    desc: "Kundli, Dasha, Transits & Yogas",
    placeholder: "Ask about your birth chart, planetary transits, Dasha periods...",
  },
  {
    id: "numerology",
    name: "Numerology",
    nameHi: "अंकशास्त्र",
    icon: Star,
    color: "text-emerald-400",
    desc: "Life Path, Destiny & Name Analysis",
    placeholder: "Ask about your life path number, name vibration, compatibility...",
  },
  {
    id: "tarot",
    name: "Tarot",
    nameHi: "टैरो",
    icon: Moon,
    color: "text-violet-400",
    desc: "Card Spreads & Intuitive Guidance",
    placeholder: "Ask for a tarot reading, card interpretation, love spread...",
  },
  {
    id: "vastu",
    name: "Vastu Shastra",
    nameHi: "वास्तु",
    icon: Compass,
    color: "text-yellow-300",
    desc: "Space Harmony & Directional Energy",
    placeholder: "Ask about home layout, office Vastu, room placements...",
  },
]

/* ────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────── */
function getTimeLabel(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/* ────────────────────────────────────────────────────
   BRAND LOGO (inline small version)
   ──────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
      <Sparkles className="h-4 w-4 text-amber-400" />
    </div>
  )
}

/* ────────────────────────────────────────────────────
   TYPING INDICATOR
   ──────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <BrandMark />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] px-5 py-3.5">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          className="h-2 w-2 rounded-full bg-amber-400/60" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          className="h-2 w-2 rounded-full bg-amber-400/60" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          className="h-2 w-2 rounded-full bg-amber-400/60" />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   MESSAGE BUBBLE
   ──────────────────────────────────────────────────── */
function MessageBubble({ msg, isLast }: { msg: ChatMessage; isLast: boolean }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === "user"

  function handleCopy() {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={isLast ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-3 px-4 py-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]">
          <span className="text-xs font-semibold text-white/60">You</span>
        </div>
      ) : (
        <BrandMark />
      )}

      {/* Bubble */}
      <div className={`group relative max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-amber-500/15 border border-amber-500/15 text-white/90"
            : "rounded-tl-sm bg-white/[0.04] border border-white/[0.06] text-white/80"
        }`}>
          {/* Render content with basic markdown-like formatting */}
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>

        {/* Meta row */}
        <div className={`mt-1 flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-white/20">{getTimeLabel(msg.created_at)}</span>
          {!isUser && (
            <button onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/50">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────
   WELCOME SCREEN (when no messages)
   ──────────────────────────────────────────────────── */
function WelcomeScreen({ vertical, onSuggestionClick }: {
  vertical: Vertical | null
  onSuggestionClick: (text: string) => void
}) {
  const suggestions = vertical
    ? getSuggestions(vertical.id)
    : [
        "Generate my complete Kundli reading",
        "What does my life path number mean?",
        "Draw a tarot card for my love life",
        "Is my home Vastu-compliant?",
      ]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/15">
          {vertical ? <vertical.icon className={`h-7 w-7 ${vertical.color}`} /> : <Sparkles className="h-7 w-7 text-amber-400" />}
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {vertical ? vertical.name : "Ask GrahAI anything"}
        </h2>
        <p className="text-sm text-white/35 mb-8">
          {vertical ? vertical.desc : "Personalized Vedic readings across all four sciences"}
        </p>

        <div className="grid gap-2.5">
          {suggestions.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onSuggestionClick(s)}
              className="w-full text-left rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/50 transition-all hover:border-amber-500/20 hover:bg-amber-500/[0.04] hover:text-white/70"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function getSuggestions(verticalId: string): string[] {
  switch (verticalId) {
    case "astrology":
      return [
        "Generate my complete Kundli based on my birth details",
        "What Dasha period am I currently in?",
        "Which Yogas are formed in my birth chart?",
        "What do today's planetary transits mean for me?",
      ]
    case "numerology":
      return [
        "Calculate my Life Path number and explain it",
        "What is my Destiny number?",
        "Analyze the vibration of my name",
        "What are my lucky numbers for this year?",
      ]
    case "tarot":
      return [
        "Draw a three-card spread for my career",
        "What does The Tower card mean in love?",
        "Do a Celtic Cross spread for my current situation",
        "Pull a single card for today's guidance",
      ]
    case "vastu":
      return [
        "Is my bedroom in the right direction?",
        "What's the ideal placement for my home office?",
        "How should I arrange my kitchen per Vastu?",
        "What remedies can fix a south-facing entrance?",
      ]
    default:
      return []
  }
}

/* ════════════════════════════════════════════════════
   CHAT PAGE
   ════════════════════════════════════════════════════ */
export default function ChatPageWrapper() {
  return (
    <Suspense fallback={
      <main className="flex h-screen items-center justify-center bg-[#050810]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-8 w-8 animate-pulse text-amber-400" />
          <p className="text-sm text-white/30">Preparing your reading space...</p>
        </div>
      </main>
    }>
      <ChatPage />
    </Suspense>
  )
}

function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verticalParam = searchParams.get("v")

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedVertical, setSelectedVertical] = useState<string>(verticalParam || "")
  const [showVerticalPicker, setShowVerticalPicker] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeVertical = VERTICALS.find(v => v.id === selectedVertical) || null

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  // Auto-resize textarea
  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
  }

  // Submit on Enter (shift+enter for newline)
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Send message
  async function handleSend(overrideText?: string) {
    const text = (overrideText || input).trim()
    if (!text || sending || !user) return

    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"

    // Create optimistic user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          vertical: selectedVertical || "general",
          user_id: user.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to get response")

      // Set conversation ID from response
      if (data.conversation_id) setConversationId(data.conversation_id)

      // Add assistant message
      const assistantMsg: ChatMessage = {
        id: data.message_id || crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        agent_name: data.agent_name,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      // Add error message
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I encountered an issue processing your request. Please try again.",
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setSending(false)
    }
  }

  function handleNewChat() {
    setMessages([])
    setConversationId(null)
    inputRef.current?.focus()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050810]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-8 w-8 animate-pulse text-amber-400" />
          <p className="text-sm text-white/30">Preparing your reading space...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-screen flex-col bg-[#050810]">
      {/* ─── TOP BAR ─── */}
      <header className="shrink-0 border-b border-white/[0.06] bg-[#050810]/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          {/* Left: back + brand */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <BrandMark />
              <div>
                <span className="text-sm font-semibold text-white/90">
                  Grah<span className="text-amber-400">AI</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center: vertical selector */}
          <div className="relative">
            <button
              onClick={() => setShowVerticalPicker(!showVerticalPicker)}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/[0.1] hover:text-white/70"
            >
              {activeVertical ? (
                <>
                  <activeVertical.icon className={`h-3.5 w-3.5 ${activeVertical.color}`} />
                  {activeVertical.name}
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  All Sciences
                </>
              )}
              <ChevronDown className="h-3 w-3" />
            </button>

            <AnimatePresence>
              {showVerticalPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-white/[0.08] bg-[#0a0e1a] p-1.5 shadow-xl"
                >
                  <button
                    onClick={() => { setSelectedVertical(""); setShowVerticalPicker(false) }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      !selectedVertical ? "bg-amber-500/10 text-amber-400" : "text-white/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    All Sciences
                  </button>
                  {VERTICALS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVertical(v.id); setShowVerticalPicker(false) }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        selectedVertical === v.id ? "bg-amber-500/10 text-amber-400" : "text-white/50 hover:bg-white/[0.04]"
                      }`}
                    >
                      <v.icon className={`h-4 w-4 ${v.color}`} />
                      {v.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: new chat */}
          <button onClick={handleNewChat}
            className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
            title="New chat">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ─── MESSAGES AREA ─── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <WelcomeScreen vertical={activeVertical} onSuggestionClick={(t) => handleSend(t)} />
          ) : (
            <div className="py-4 space-y-1">
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1} />
              ))}
              {sending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ─── INPUT BAR ─── */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#050810]/95 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSend() }}
            className="flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder={activeVertical?.placeholder || "Ask GrahAI anything about your stars..."}
                rows={1}
                disabled={sending}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 pr-4 text-sm text-white/90 placeholder:text-white/25 transition-all focus:border-amber-500/20 focus:outline-none focus:ring-1 focus:ring-amber-500/10 disabled:opacity-50"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/90 text-[#050810] transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-30 disabled:hover:bg-amber-500/90"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-white/15">
            GrahAI provides spiritual guidance based on Vedic traditions. Not a substitute for professional advice.
          </p>
        </div>
      </div>
    </main>
  )
}
