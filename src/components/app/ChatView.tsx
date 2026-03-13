"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
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
import ToolIndicator from "@/components/chat/ToolIndicator"
import MarkdownRenderer from "@/components/chat/MarkdownRenderer"
import { useGamification } from "@/contexts/GamificationContext"
import { ChatXPIndicator } from "@/components/gamification/ChatXPIndicator"
import { SatisfactionRating } from "@/components/gamification/SatisfactionRating"

/* ────────────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────────────── */
interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  agent_name?: string
  created_at: string
  tools_used?: string[]
}

interface ActiveTool {
  tool_name: string
  tool_id: string
  label: string
  icon: string
  description: string
  isComplete: boolean
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
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-600/10 border border-amber-500/15 shadow-[0_0_16px_rgba(201,162,77,0.15)]">
      <Sparkles className="h-4 w-4 text-amber-400" />
      {/* Breathing glow ring */}
      <div className="absolute inset-0 rounded-xl border border-amber-500/20" style={{ animation: "pulse-ring 3s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
    </div>
  )
}

/* ────────────────────────────────────────────────────
   STREAMING MESSAGE BUBBLE — renders as tokens arrive
   ──────────────────────────────────────────────────── */
function MessageBubble({ msg, isLast, isStreaming, activeTools }: {
  msg: ChatMessage
  isLast: boolean
  isStreaming?: boolean
  activeTools?: ActiveTool[]
}) {
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
        {/* Tool indicators (shown above assistant message) */}
        {!isUser && activeTools && activeTools.length > 0 && (
          <div className="mb-2 space-y-1.5">
            <AnimatePresence>
              {activeTools.map((tool) => (
                <ToolIndicator
                  key={tool.tool_id}
                  toolName={tool.tool_name}
                  label={tool.label}
                  icon={tool.icon}
                  description={tool.description}
                  isComplete={tool.isComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-amber-500/15 border border-amber-500/15 text-white/90"
              : "rounded-tl-sm bg-white/[0.04] border border-white/[0.06] text-white/80 chat-bubble-assistant"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{msg.content}</div>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
          {/* Streaming cursor */}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block ml-0.5 w-0.5 h-4 bg-amber-400/60 align-text-bottom"
            />
          )}
        </div>

        {/* Meta row */}
        <div className={`mt-1 flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-white/20">{getTimeLabel(msg.created_at)}</span>
          {!isUser && msg.agent_name && (
            <span className="text-[10px] text-amber-400/30">{msg.agent_name}</span>
          )}
          {!isUser && msg.tools_used && msg.tools_used.length > 0 && (
            <span className="text-[10px] text-white/15">
              {msg.tools_used.length} tool{msg.tools_used.length > 1 ? "s" : ""} used
            </span>
          )}
          {!isUser && !isStreaming && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/50"
            >
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {/* Cosmic orbiting icon */}
        <div className="relative mx-auto mb-8 h-28 w-28 flex items-center justify-center">
          <div className="absolute inset-0 orbit-ring" />
          <div className="absolute inset-3 orbit-ring-reverse" />
          {/* Orbiting dot */}
          <div className="absolute h-2 w-2 rounded-full bg-amber-400/60" style={{ animation: "orbit 8s linear infinite", ["--orbit-radius" as string]: "52px" }} />
          <div className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400/50" style={{ animation: "orbit 12s linear infinite reverse", ["--orbit-radius" as string]: "38px" }} />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-indigo-600/8 border border-amber-500/15 shadow-[0_0_30px_rgba(201,162,77,0.12)]" style={{ animation: "glow-breathe 4s ease-in-out infinite" }}>
            {vertical ? (
              <vertical.icon className={`h-7 w-7 ${vertical.color}`} />
            ) : (
              <Sparkles className="h-7 w-7 text-amber-400" />
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {vertical ? vertical.name : "Ask GrahAI anything"}
        </h2>
        {vertical && <p className="text-xs font-medium text-amber-400/50 mb-1">{vertical.nameHi}</p>}
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
   CHAT VIEW (overlay component)
   ════════════════════════════════════════════════════ */
export default function ChatView({ onBack, onUpgrade, initialVertical }: {
  onBack: () => void
  onUpgrade: () => void
  initialVertical?: string
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedVertical, setSelectedVertical] = useState<string>(initialVertical || "")
  const [showVerticalPicker, setShowVerticalPicker] = useState(false)
  const [activeTools, setActiveTools] = useState<ActiveTool[]>([])
  const [streamingAgentName, setStreamingAgentName] = useState<string | null>(null)

  // Gamification state
  const gamification = useGamification()
  const [xpEarned, setXpEarned] = useState(0)
  const [showXP, setShowXP] = useState(false)
  const [showSatisfaction, setShowSatisfaction] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const satisfactionShownRef = useRef(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeVertical = VERTICALS.find((v) => v.id === selectedVertical) || null

  // Auth check — assume user is in the app already (no redirect)
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending, isStreaming])

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

  // Parse SSE events from streaming response
  const parseSSE = useCallback(
    async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
      const decoder = new TextDecoder()
      let buffer = ""
      let streamedText = ""
      let toolsUsed: string[] = []

      // Create the streaming assistant message
      const streamMsgId = crypto.randomUUID()
      const streamMsg: ChatMessage = {
        id: streamMsgId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, streamMsg])
      setIsStreaming(true)

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Parse complete SSE events from buffer
          const lines = buffer.split("\n")
          buffer = ""
          let eventType = ""

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim()
            } else if (line.startsWith("data: ")) {
              const dataStr = line.slice(6)
              try {
                const data = JSON.parse(dataStr)
                handleSSEEvent(eventType, data)
              } catch (parseErr) {
                // Log malformed data and skip the event
                console.warn("Failed to parse SSE event data:", dataStr, parseErr)
                // Partial JSON — put back in buffer for next chunk
                buffer += `event: ${eventType}\ndata: ${dataStr}\n`
              }
            } else if (line.trim() === "") {
              // Event boundary — reset
              eventType = ""
            } else {
              // Incomplete line — put back in buffer
              buffer += line + "\n"
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Stream reading error:", err)
          // Show connection error message to user
          const errorMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Connection lost. Your response may be incomplete. Please try again or refresh the page.",
            created_at: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, errorMsg])
        }
      } finally {
        // Finalize the streaming message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamMsgId
              ? {
                  ...m,
                  content: streamedText,
                  agent_name: streamingAgentName || undefined,
                  tools_used: toolsUsed.length > 0 ? toolsUsed : undefined,
                }
              : m
          )
        )
        setIsStreaming(false)
        setActiveTools([])
        setStreamingAgentName(null)
        setSending(false)

        // Award XP for this interaction
        const newMsgCount = messageCount + 1
        setMessageCount(newMsgCount)
        if (streamedText.length > 20) {
          try {
            const result = await gamification.awardXP(selectedVertical || "general", newMsgCount)
            if (result.xpEarned > 0) {
              setXpEarned(result.xpEarned)
              setShowXP(true)
            }
          } catch {
            // Silently fail — gamification shouldn't break chat
          }
        }

        // Show satisfaction rating after 5+ messages
        if (newMsgCount >= 5 && !satisfactionShownRef.current) {
          satisfactionShownRef.current = true
          setTimeout(() => setShowSatisfaction(true), 2000)
        }
      }

      function handleSSEEvent(event: string, data: Record<string, unknown>) {
        try {
          switch (event) {
            case "meta":
              if (typeof data.conversation_id === "string") {
                setConversationId(data.conversation_id)
              }
              if (typeof data.agent_name === "string") {
                setStreamingAgentName(data.agent_name)
              }
              break

            case "text_delta":
              if (typeof data.text === "string") {
                streamedText += data.text
                setMessages((prev) =>
                  prev.map((m) => (m.id === streamMsgId ? { ...m, content: streamedText } : m))
                )
              }
              break

            case "tool_start":
              if (
                typeof data.tool_name === "string" &&
                typeof data.tool_id === "string" &&
                typeof data.label === "string" &&
                typeof data.icon === "string" &&
                typeof data.description === "string"
              ) {
                setActiveTools((prev) => [
                  ...prev,
                  {
                    tool_name: data.tool_name as string,
                    tool_id: data.tool_id as string,
                    label: data.label as string,
                    icon: data.icon as string,
                    description: data.description as string,
                    isComplete: false,
                  },
                ])
              }
              break

            case "tool_result":
              if (typeof data.tool_name === "string" && typeof data.tool_id === "string") {
                toolsUsed.push(data.tool_name)
                setActiveTools((prev) =>
                  prev.map((t) =>
                    t.tool_id === data.tool_id ? { ...t, isComplete: true } : t
                  )
                )
                // Remove completed tools after a brief delay
                setTimeout(() => {
                  setActiveTools((prev) => prev.filter((t) => t.tool_id !== data.tool_id))
                }, 1500)
              }
              break

            case "message_stop":
              // Final cleanup handled in the finally block
              break

            case "error":
              if (typeof data.message === "string") {
                streamedText += "\n\n⚠️ " + data.message
              } else {
                streamedText += "\n\n⚠️ An error occurred."
              }
              setMessages((prev) =>
                prev.map((m) => (m.id === streamMsgId ? { ...m, content: streamedText } : m))
              )
              break

            default:
              // Silently ignore unknown event types
              break
          }
        } catch (err) {
          console.error("Error handling SSE event:", event, err)
          // Skip this event and continue processing
        }
      }
    },
    [streamingAgentName]
  )

  // Send message with streaming
  async function handleSend(overrideText?: string) {
    const text = (overrideText || input).trim()
    if (!text || sending || !user) return

    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"

    // Cancel any existing stream
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    // Create optimistic user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
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
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        if (res.status === 429) {
          // Daily limit reached — show upgrade prompt
          try {
            const limitData = JSON.parse(await res.text())
            const limitMsg: ChatMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `🔒 **Daily limit reached**\n\nYou've used all ${limitData.limit || 3} messages on your **${limitData.tier || "free"}** plan today. Your messages will reset at midnight.`,
              created_at: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, limitMsg])
            setSending(false)
            return
          } catch {
            throw new Error("Daily message limit reached. Upgrade your plan for more.")
          }
        }
        const errorText = await res.text()
        throw new Error(errorText || "Failed to get response")
      }

      // Check if it's a streaming response
      if (res.headers.get("content-type")?.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader()
        await parseSSE(reader)
      } else {
        // Fallback: non-streaming JSON response
        const data = await res.json()
        if (data.conversation_id) setConversationId(data.conversation_id)
        const assistantMsg: ChatMessage = {
          id: data.message_id || crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          agent_name: data.agent_name,
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])
        setSending(false)
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I apologize, but I encountered an issue processing your request. Please try again.",
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
      }
      setSending(false)
    }
  }

  function handleNewChat() {
    if (abortRef.current) abortRef.current.abort()
    setMessages([])
    setConversationId(null)
    setActiveTools([])
    setIsStreaming(false)
    setSending(false)
    inputRef.current?.focus()
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#050810]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-white/30">Preparing your reading space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#050810]">
      {/* ─── MARKDOWN STYLES ─── */}
      <style jsx global>{`
        .markdown-content .md-h2 { font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.92); margin: 1rem 0 0.4rem; }
        .markdown-content .md-h3 { font-size: 0.95rem; font-weight: 600; color: rgba(255,255,255,0.85); margin: 0.8rem 0 0.3rem; }
        .markdown-content .md-h4 { font-size: 0.87rem; font-weight: 600; color: rgba(255,255,255,0.8); margin: 0.6rem 0 0.25rem; }
        .markdown-content .md-bold { color: rgba(255,255,255,0.92); font-weight: 600; }
        .markdown-content .md-italic { font-style: italic; }
        .markdown-content .md-p { margin: 0.4rem 0; }
        .markdown-content .md-p:first-child { margin-top: 0; }
        .markdown-content .md-p:last-child { margin-bottom: 0; }
        .markdown-content .md-ul, .markdown-content .md-ol { margin: 0.4rem 0; padding-left: 1.25rem; }
        .markdown-content .md-li { margin: 0.2rem 0; list-style-type: disc; }
        .markdown-content .md-li-num { margin: 0.2rem 0; list-style-type: decimal; }
        .markdown-content .md-code-block { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.5rem; padding: 0.75rem; margin: 0.5rem 0; overflow-x: auto; font-size: 0.8rem; font-family: monospace; white-space: pre-wrap; }
        .markdown-content .md-inline-code { background: rgba(255,255,255,0.06); border-radius: 0.25rem; padding: 0.1rem 0.35rem; font-size: 0.85em; font-family: monospace; }
        .markdown-content .md-hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0.75rem 0; }
      `}</style>

      {/* ─── TOP BAR ─── */}
      <header className="shrink-0 border-b border-white/[0.06] bg-[#050810]/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          {/* Left: back + brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
                    onClick={() => {
                      setSelectedVertical("")
                      setShowVerticalPicker(false)
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      !selectedVertical
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-white/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    All Sciences
                  </button>
                  {VERTICALS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVertical(v.id)
                        setShowVerticalPicker(false)
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        selectedVertical === v.id
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-white/50 hover:bg-white/[0.04]"
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

          {/* Right: streak + new chat */}
          <div className="flex items-center gap-2">
            {gamification.dailyStreak > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400/60">
                <span>🔥</span>
                <span>{gamification.dailyStreak}</span>
              </span>
            )}
            <button
              onClick={handleNewChat}
              className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
              title="New chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MESSAGES AREA ─── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <WelcomeScreen vertical={activeVertical} onSuggestionClick={(t) => handleSend(t)} />
          ) : (
            <div className="py-4 space-y-1">
              {messages.map((msg, i) => {
                const isLastMsg = i === messages.length - 1
                const isCurrentlyStreaming = isLastMsg && isStreaming && msg.role === "assistant"
                return (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={isLastMsg}
                    isStreaming={isCurrentlyStreaming}
                    activeTools={isCurrentlyStreaming ? activeTools : undefined}
                  />
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ─── INPUT BAR ─── */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#050810]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              handleSend()
            }}
            className="glass-input flex items-end gap-3 px-3 py-2"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder={activeVertical?.placeholder || "Ask GrahAI anything about your stars..."}
                rows={1}
                disabled={sending}
                className="w-full resize-none bg-transparent px-2 py-2 text-sm text-white/90 placeholder:text-white/25 focus:outline-none disabled:opacity-50"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-[#050810] transition-all hover:shadow-[0_0_20px_rgba(201,162,77,0.35)] active:scale-95 disabled:opacity-30 disabled:hover:shadow-none"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-white/15">
            GrahAI provides spiritual guidance based on Vedic traditions. Not a substitute for
            professional advice.
          </p>
        </div>
      </div>

      {/* ─── UPGRADE BUTTON (shown when limit reached) ─── */}
      {messages.some(m => m.content.includes("Daily limit reached")) && (
        <div className="shrink-0 border-t border-white/[0.06] bg-[#050810]/90 px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={onUpgrade}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-[#050810] transition-all hover:shadow-[0_0_20px_rgba(201,162,77,0.35)] active:scale-95"
            >
              Upgrade to unlock more
            </button>
          </div>
        </div>
      )}

      {/* Gamification overlays */}
      <ChatXPIndicator
        xpEarned={xpEarned}
        show={showXP}
        onComplete={() => setShowXP(false)}
      />
      <SatisfactionRating
        show={showSatisfaction}
        onRate={async (rating) => {
          try {
            if (conversationId) {
              await fetch("/api/gamification/rate-reading", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation_id: conversationId, rating }),
              })
            }
          } catch { /* silent */ }
        }}
        onDismiss={() => setShowSatisfaction(false)}
      />
    </div>
  )
}
