"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle, Send, Loader2, Sparkles, Crown,
  Mic, Copy, Check, Share2, Lock
} from "lucide-react"
import ChatResponseParser from "@/components/chat/ChatResponseParser"
import type { TabType, OverlayType, ChatMessage } from "@/types/app"

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════

const ASK_TOPIC_CHIPS = ["Career timing", "Love compatibility", "Money & wealth", "Health check", "Best dates", "Current Dasha"]
const ASK_FOLLOWUP_CHIPS = ["Tell me more", "What should I avoid?", "Best timing for this?", "Any remedies?"]
const SUGGESTED_QUESTIONS = [
  "Will I get a promotion this year?",
  "Is this the right time to invest?",
  "When will I find true love?",
]

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface AskTabProps {
  onUpgrade: () => void
}

// ═══════════════════════════════════════════════════
// QUESTION COUNTER COMPONENT
// ═══════════════════════════════════════════════════

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
          <span className="text-sm font-medium text-white/85">
            <span className="text-amber-400 font-bold">{questionsLeft}</span>
            <span className="text-white/40"> / {totalQuestions} Questions left</span>
          </span>
        </div>
        <button
          onClick={onUpgrade}
          aria-label="Upgrade to buy more questions"
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-[#0a0e1a] text-xs font-bold hover:bg-amber-400 transition-colors active:scale-95"
        >
          <Crown className="w-3 h-3" />
          Buy More
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// CHAT BUBBLE COMPONENT
// ═══════════════════════════════════════════════════

function ChatBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? (
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white/40">You</span>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      )}
      <div className="group max-w-[80%]">
        <div
          className={`px-4 py-4 text-sm leading-relaxed rounded-2xl ${
            isUser
              ? "rounded-tr-sm bg-amber-400/15 border border-amber-400/20 text-white/85"
              : "rounded-tl-sm bg-white/[0.04] border border-white/[0.06] text-white/85"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ChatResponseParser content={message.content} />
          )}
        </div>
        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-white/40">
              {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              aria-label={copied ? "Copied to clipboard" : "Copy message"}
              className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white/60 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════
// MAIN ASK TAB COMPONENT
// ═══════════════════════════════════════════════════

export default function AskTab({ onUpgrade }: AskTabProps) {
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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save question to localStorage for history
  const saveQuestion = useCallback((q: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem("grahai-saved-questions") || "[]")
      const updated = [q, ...existing.filter((x: string) => x !== q)].slice(0, 10)
      localStorage.setItem("grahai-saved-questions", JSON.stringify(updated))
    } catch { /* ignore */ }
  }, [])

  // Get personalized welcome message
  const getWelcomeMessage = useCallback(() => {
    try {
      const cosmicSnapshot = localStorage.getItem("cosmic-snapshot")
      if (cosmicSnapshot) {
        const data = JSON.parse(cosmicSnapshot)
        if (data.moon) {
          return `Your Moon is in ${data.moon}... Ask about what matters to you`
        }
      }
    } catch { /* ignore */ }
    return "Ask about your stars..."
  }, [])

  // Handle sending message
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

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Copy last assistant message
  const handleCopyLast = useCallback(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant")
    if (lastAssistant) navigator.clipboard?.writeText(lastAssistant.content)
  }, [messages])

  // Share last assistant message
  const handleShareLast = useCallback(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant")
    if (lastAssistant && navigator.share) {
      navigator.share({ title: "GrahAI Insight", text: lastAssistant.content.slice(0, 200) + "..." }).catch(() => {})
    }
  }, [messages])

  // ─── Render ───
  return (
    <div className="flex flex-col h-full">
      {/* Question counter */}
      <QuestionCounter questionsLeft={questionsLeft} totalQuestions={totalQuestions} onUpgrade={onUpgrade} />

      {/* Messages or Welcome Screen */}
      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <div className="py-8">
            {/* Welcome header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Ask GrahAI</h3>
              <p className="text-xs text-white/40 mt-2 max-w-xs mx-auto leading-relaxed">
                {getWelcomeMessage().includes("Moon")
                  ? getWelcomeMessage()
                  : "Calm, specific guidance rooted in your birth chart. Ask anything about career, love, timing, or life."}
              </p>
            </div>

            {/* Topic chips - increased spacing and size */}
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto">
              {ASK_TOPIC_CHIPS.slice(0, 6).map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    const fullText = chip === "Career timing" ? "When is the best time for career growth?" : chip === "Love compatibility" ? "Is this person right for me?" : chip === "Money & wealth" ? "When will my finances improve?" : chip === "Health check" ? "What health aspects should I watch?" : chip === "Best dates" ? "What are the most auspicious dates this month?" : "What is my current Dasha period telling me?"
                    handleSend(fullText)
                  }}
                  aria-label={`Ask about ${chip.toLowerCase()}`}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/60 hover:border-amber-400/25 hover:bg-amber-400/5 hover:text-white/80 transition-all active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Popular questions - 3 items, full-width cards */}
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Popular Questions</p>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={q}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSend(q)}
                  aria-label={`Ask: ${q}`}
                  className="w-full text-left px-4 py-3 min-h-[48px] rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/60 hover:border-amber-500/20 hover:bg-amber-500/[0.04] hover:text-white/80 transition-all flex items-center gap-3 active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-amber-400/50 flex-shrink-0" />
                  <span className="text-white/70">{q}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {/* Chat messages */}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="px-4 py-4 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer actions after response - clean horizontal row */}
            <AnimatePresence>
              {lastResponseDone && !sending && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="pt-3 space-y-4"
                >
                  {/* Action buttons row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLast}
                      aria-label="Save message to clipboard"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-white/60 hover:text-white/80 hover:border-white/[0.12] transition-all active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleShareLast}
                      aria-label="Share message"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-white/60 hover:text-white/80 hover:border-white/[0.12] transition-all active:scale-95"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={onUpgrade}
                      aria-label="Get deeper astrological report"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.08] text-xs text-amber-400/70 hover:text-amber-400 hover:border-amber-500/40 transition-all active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Deeper Report</span>
                    </button>
                  </div>

                  {/* Follow-up chips */}
                  <div className="flex flex-wrap gap-2">
                    {ASK_FOLLOWUP_CHIPS.slice(0, 3).map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSend(chip)}
                        aria-label={`Follow-up: ${chip.toLowerCase()}`}
                        className="px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs text-white/50 hover:border-amber-400/20 hover:bg-amber-400/[0.04] hover:text-white/70 transition-all active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar - prominent with clear affordance */}
      <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] bg-[#0a0e1a]/90 backdrop-blur-xl">
        {questionsLeft <= 0 ? (
          <div className="text-center py-2">
            <p className="text-sm text-white/60 mb-3">You've used all free questions today</p>
            <button
              onClick={onUpgrade}
              aria-label="Unlock unlimited questions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0e1a] font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 shadow-lg"
            >
              <Crown className="w-4 h-4" />
              Unlock Unlimited Questions
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e: FormEvent) => { e.preventDefault(); handleSend() }}
            className="flex items-end gap-2 px-3 py-2 h-12 rounded-xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm"
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
              placeholder={getWelcomeMessage().includes("Moon") ? getWelcomeMessage() : "Ask about your stars..."}
              aria-label="Ask GrahAI a question"
              rows={1}
              disabled={sending}
              className="flex-1 resize-none bg-transparent text-sm text-white/90 placeholder:text-white/30 focus:outline-none disabled:opacity-50 py-2"
              style={{ maxHeight: "120px" }}
            />
            <div className="flex items-center gap-1 pb-0.5">
              <button
                type="button"
                aria-label="Voice input (coming soon)"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-colors active:scale-95"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || sending}
                aria-label={sending ? "Sending..." : "Send message"}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-[#0a0e1a] disabled:opacity-30 transition-all active:scale-95 hover:from-amber-400 hover:to-amber-500"
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
