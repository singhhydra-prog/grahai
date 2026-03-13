"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, Copy, Check } from "lucide-react"
import ChatResponseParser from "@/components/chat/ChatResponseParser"
import { SectionHeader } from "@/components/ui"
import type { ChatMessage, AstroSource } from "@/types/app"

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════

const TOPIC_CHIPS = ["Career timing", "Love match", "Health", "Money flow", "Best dates", "Current Dasha"]
const FOLLOWUP_CHIPS = ["Tell me more", "What should I avoid?", "Best timing?", "Any remedies?"]
const SUGGESTED_QUESTIONS = [
  "Will I get a promotion this year?",
  "Is this the right time to invest?",
  "Why do I keep facing delays in relationships?",
]

// ═══════════════════════════════════════════════════
// CHAT BUBBLE
// ═══════════════════════════════════════════════════

function ChatBubble({
  message,
  onSourceTap,
}: {
  message: ChatMessage
  onSourceTap?: (sources: AstroSource[]) => void
}) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-text-dim/40">You</span>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/10 flex items-center justify-center shrink-0">
          <span className="text-xs text-gold">✦</span>
        </div>
      )}

      {/* Bubble */}
      <div className="group max-w-[82%]">
        <div
          className={`px-4 py-3 text-sm leading-relaxed rounded-2xl ${
            isUser
              ? "rounded-tr-sm bg-gold/10 border border-gold/15 text-text/85"
              : "rounded-tl-sm bg-white/[0.03] border border-white/[0.05] text-text/85"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ChatResponseParser content={message.content} />
          )}
        </div>

        {/* Meta row */}
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-text-dim/30">
              {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>

            {/* Source pill */}
            {message.sources && message.sources.length > 0 && (
              <button
                onClick={() => onSourceTap?.(message.sources!)}
                className="text-[10px] text-text-dim/40 hover:text-gold transition-colors flex items-center gap-1"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-50">
                  <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {message.sources[0].system}
              </button>
            )}

            {/* Copy */}
            <button
              onClick={() => { navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              className="opacity-0 group-hover:opacity-100 text-text-dim/30 hover:text-text-dim/60 transition-all"
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
// QUESTION COUNTER (subtle, not aggressive)
// ═══════════════════════════════════════════════════

function QuestionCounter({
  remaining,
  total,
  onUpgrade,
}: {
  remaining: number
  total: number
  onUpgrade: () => void
}) {
  if (remaining > total * 0.5) return null // hide when plenty left

  return (
    <div className="mx-5 mt-2 mb-1">
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <span className="text-[11px] text-text-dim/50">
          <span className="text-gold font-medium">{remaining}</span> / {total} questions today
        </span>
        {remaining <= 1 && (
          <button
            onClick={onUpgrade}
            className="text-[10px] text-gold/70 font-medium hover:text-gold transition-colors"
          >
            Get more →
          </button>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// MAIN ASK TAB
// ═══════════════════════════════════════════════════

interface AskTabProps {
  onUpgrade: () => void
  onSourceTap?: (sources: AstroSource[]) => void
}

export default function AskTab({ onUpgrade, onSourceTap }: AskTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [questionsLeft, setQuestionsLeft] = useState(3)
  const [totalQuestions, setTotalQuestions] = useState(3)
  const [lastResponseDone, setLastResponseDone] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Pick up pending question from HomeTab
  useEffect(() => {
    try {
      const pending = localStorage.getItem("grahai-pending-question")
      if (pending) {
        localStorage.removeItem("grahai-pending-question")
        handleSend(pending)
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch usage
  useEffect(() => {
    fetch("/api/usage")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data.remaining === "number") {
          setQuestionsLeft(data.remaining)
          setTotalQuestions(data.limit || 3)
        }
      })
      .catch(() => {})
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get personalized placeholder
  const getPlaceholder = useCallback(() => {
    try {
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const data = JSON.parse(snap)
        if (data.moonSign) return `Your Moon is in ${data.moonSign}... what's on your mind?`
      }
    } catch { /* ignore */ }
    return "Ask about your chart..."
  }, [])

  // Send message
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

    // Save to history
    try {
      const existing = JSON.parse(localStorage.getItem("grahai-saved-questions") || "[]")
      localStorage.setItem("grahai-saved-questions", JSON.stringify([text, ...existing.filter((x: string) => x !== text)].slice(0, 20)))
    } catch { /* ignore */ }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, vertical: "astrology" }),
      })

      if (res.status === 429) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(), role: "assistant",
          content: "You've reached your daily limit. Upgrade to Plus for more questions, or come back tomorrow.",
          created_at: new Date().toISOString(),
        }])
        setQuestionsLeft(0)
        return
      }

      if (!res.ok) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(), role: "assistant",
          content: "Something went wrong. Please try again in a moment.",
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
                      id: assistantId, role: "assistant",
                      content: fullText,
                      created_at: new Date().toISOString(),
                    })
                  }
                  return [...updated]
                })
              }
            } catch { /* skip */ }
          }
        }
      }

      if (!fullText) {
        setMessages(prev => [...prev, {
          id: assistantId, role: "assistant",
          content: "I wasn't able to generate a response. Please try again.",
          created_at: new Date().toISOString(),
        }])
      }

      setQuestionsLeft(prev => Math.max(0, prev - 1))
      setLastResponseDone(true)
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: "Connection lost. Please check your internet and try again.",
        created_at: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
    }
  }, [input, sending, questionsLeft])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Subtle question counter */}
      <QuestionCounter remaining={questionsLeft} total={totalQuestions} onUpgrade={onUpgrade} />

      {/* Messages or empty state */}
      <div className="flex-1 overflow-y-auto px-5">
        {messages.length === 0 ? (
          <div className="py-10">
            {/* Calm welcome */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gold/[0.06] flex items-center justify-center">
                <span className="text-lg text-gold/70">✦</span>
              </div>
              <h3 className="text-base font-semibold text-text mb-1">Ask GrahAI</h3>
              <p className="text-xs text-text-dim/50 max-w-[260px] mx-auto leading-relaxed">
                Specific, source-backed guidance from your birth chart. No vague predictions.
              </p>
            </div>

            {/* Topic lanes */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-3.5 py-2 rounded-xl border border-white/[0.05] bg-white/[0.02] text-xs text-text-dim/50 hover:border-gold/15 hover:text-text-dim/80 transition-all active:scale-[0.97]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Suggested questions */}
            <SectionHeader title="Try asking" className="px-0" />
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={q}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.02] text-sm text-text-dim/60 hover:border-gold/10 hover:text-text/70 transition-all active:scale-[0.98] flex items-center gap-3"
                >
                  <span className="text-gold/30 text-xs">→</span>
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} onSourceTap={onSourceTap} />
            ))}

            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-xs text-gold">✦</span>
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.05]">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Follow-up row */}
            <AnimatePresence>
              {lastResponseDone && !sending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {FOLLOWUP_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="px-3 py-1.5 rounded-full border border-white/[0.04] text-[11px] text-text-dim/40 hover:border-gold/10 hover:text-text-dim/70 transition-all active:scale-[0.97]"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 border-t border-white/[0.04] bg-bg/90 backdrop-blur-xl">
        {questionsLeft <= 0 ? (
          <div className="text-center py-2">
            <p className="text-xs text-text-dim/50 mb-2">Daily limit reached</p>
            <button
              onClick={onUpgrade}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-bg text-sm font-semibold transition-transform active:scale-[0.98]"
            >
              Upgrade for more questions
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e: FormEvent) => { e.preventDefault(); handleSend() }}
            className="flex items-end gap-2 px-3 py-2 rounded-2xl border border-white/[0.06] bg-bg-card/40 backdrop-blur-sm focus-within:border-gold/15 transition-all"
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
              placeholder={getPlaceholder()}
              rows={1}
              disabled={sending}
              className="flex-1 resize-none bg-transparent text-sm text-text/90 placeholder:text-text-dim/25 focus:outline-none disabled:opacity-50 py-2"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-[0.9] ${
                input.trim() ? "bg-gold text-bg" : "bg-white/[0.04] text-text-dim/20"
              }`}
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
