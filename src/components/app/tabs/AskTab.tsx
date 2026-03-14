"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Clock, ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import type { ChatMessage, BirthData } from "@/types/app"

const TOPIC_CHIPS = ["Love", "Career", "Timing", "Family", "Health", "Money"]

const SUGGESTION_QUESTIONS = [
  "What career direction does my chart support right now?",
  "What is my emotional pattern this month?",
  "When is a good time for important financial decisions?",
]

interface AskTabProps {
  initialQuestion?: string
  onBack?: () => void
}

export default function AskTab({ initialQuestion, onBack }: AskTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [userName, setUserName] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [questionsLeft, setQuestionsLeft] = useState(3)
  const [expandedSource, setExpandedSource] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasProcessedInitial = useRef(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setUserName(data.name?.split(" ")[0] || "")
      }
      const q = localStorage.getItem("grahai-questions-left")
      if (q) setQuestionsLeft(parseInt(q))

      // Check for pending question from home screen
      const pending = localStorage.getItem("grahai-pending-question")
      if (pending) {
        localStorage.removeItem("grahai-pending-question")
        setTimeout(() => handleSend(pending), 300)
      }
    } catch {}
  }, [])

  // Handle initial question from parent
  useEffect(() => {
    if (initialQuestion && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true
      setTimeout(() => handleSend(initialQuestion), 300)
    }
  }, [initialQuestion])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim()
    if (!text || isStreaming) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsStreaming(true)

    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), isStreaming: true },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          birthData,
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error("Failed")
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: fullText, isStreaming: true } : m))
          )
        }
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: fullText || "I couldn't generate a response.", isStreaming: false } : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false } : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="min-h-dvh flex flex-col bg-[#0A0E1A]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 shrink-0 border-b border-[#1E293B]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
          flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-[#F1F0F5]">Ask GrahAI</h1>
          <p className="text-[10px] text-[#5A6478]">{questionsLeft} questions remaining</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#111827] border border-[#1E293B] rounded-full px-3 py-1.5">
          <Clock className="w-3 h-3 text-[#5A6478]" />
          <span className="text-[10px] text-[#5A6478]">History</span>
        </button>
      </div>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4">
        {isEmpty ? (
          /* ═══ Empty state ═══ */
          <div className="pt-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[#D4A054]" />
            </div>
            <h2 className="text-lg font-semibold text-[#F1F0F5] mb-1">
              What&apos;s on your mind{userName ? `, ${userName}` : ""}?
            </h2>
            <p className="text-sm text-[#5A6478] mb-6 max-w-xs mx-auto">
              Ask about love, work, timing, emotions, or anything you need clarity on.
            </p>

            {/* Topic chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {TOPIC_CHIPS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInput(`Tell me about my ${topic.toLowerCase()} right now`)}
                  className="px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#1E293B]
                    text-xs text-[#94A3B8] font-medium hover:border-[#D4A054]/30 hover:text-[#D4A054]
                    transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Suggestion cards */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              {SUGGESTION_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3.5
                    text-sm text-[#94A3B8] hover:border-[#D4A054]/20 hover:text-[#D4A054]/80 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ═══ Messages ═══ */
          <div className="pt-4 space-y-5">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role === "user" ? (
                    /* User message */
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#1E2638] rounded-2xl rounded-tr-md px-4 py-3">
                        <p className="text-sm text-[#F1F0F5]">{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    /* Assistant message */
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
                          flex items-center justify-center">
                          <span className="text-[9px] font-bold text-[#0A0E1A]">G</span>
                        </div>
                        <span className="text-[11px] text-[#5A6478] font-medium">GrahAI</span>
                        {msg.isStreaming && (
                          <span className="text-[11px] text-[#D4A054]/60 animate-pulse">thinking...</span>
                        )}
                      </div>
                      <div className="max-w-[95%] text-sm text-[#94A3B8] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                        {msg.isStreaming && !msg.content && (
                          <span className="flex gap-1 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A054]/40 animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A054]/40 animate-pulse [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A054]/40 animate-pulse [animation-delay:300ms]" />
                          </span>
                        )}
                      </div>

                      {/* Source drawer toggle (show for completed messages) */}
                      {!msg.isStreaming && msg.content && (
                        <div className="mt-3">
                          <button
                            onClick={() => setExpandedSource(expandedSource === msg.id ? null : msg.id)}
                            className="flex items-center gap-1.5 text-[11px] text-[#5A6478]
                              hover:text-[#D4A054] transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            Why GrahAI says this
                            {expandedSource === msg.id
                              ? <ChevronUp className="w-3 h-3" />
                              : <ChevronDown className="w-3 h-3" />}
                          </button>
                          {expandedSource === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 bg-[#0D1220] border border-[#1E293B] rounded-lg p-3"
                            >
                              <p className="text-xs text-[#5A6478] leading-relaxed">
                                This guidance is based on your birth chart analysis including current
                                planetary transits and dasha period. Classical Jyotish principles from
                                Brihat Parashara Hora Shastra inform the interpretation.
                              </p>
                            </motion.div>
                          )}

                          {/* Follow-up chips */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {["Tell me more", "Why now?", "When does this change?", "What should I do next?"].map((chip) => (
                              <button
                                key={chip}
                                onClick={() => handleSend(chip)}
                                className="px-3 py-1 rounded-full bg-[#111827] border border-[#1E293B]
                                  text-[11px] text-[#94A3B8] hover:border-[#D4A054]/20 hover:text-[#D4A054]
                                  transition-colors"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-5 pb-24 pt-2 shrink-0">
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-2.5
          focus-within:border-[#D4A054]/30 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about love, work, timing..."
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#5A6478]/50 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              input.trim() && !isStreaming
                ? "bg-gradient-to-br from-[#D4A054] to-[#A16E2A]"
                : "bg-[#1E2638]"
            }`}
          >
            <Send className={`w-4 h-4 ${input.trim() && !isStreaming ? "text-[#0A0E1A]" : "text-[#5A6478]"}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
