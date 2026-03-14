"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, RotateCcw, ChevronDown } from "lucide-react"
import ChatBubble from "@/components/ui/ChatBubble"
import type { ChatMessage, BirthData } from "@/types/app"

const SAMPLE_QUESTIONS = [
  "How will my career look this month?",
  "Will I get married this year?",
  "What does my chart say about health?",
  "Is this a good time to invest?",
  "How is my dad's health looking?",
  "Will I succeed in my upcoming exam?",
]

export default function AskTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [userName, setUserName] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setUserName(data.name?.split(" ")[0] || "")
      }
      // Check for pending question from home tab
      const pending = localStorage.getItem("grahai-pending-question")
      if (pending) {
        localStorage.removeItem("grahai-pending-question")
        setInput(pending)
        // Auto-send after a brief delay
        setTimeout(() => handleSend(pending), 300)
      }
    } catch {}
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
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

    // Create placeholder assistant message
    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          birthData,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: fullText, isStreaming: true }
                : m
            )
          )
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: fullText || "I couldn't generate a response. Please try again.", isStreaming: false }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Something went wrong. Please try again.",
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      {/* ═══ Header ═══ */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-magenta" />
            Vaani
          </h1>
          <p className="text-xs text-text-dim">
            {userName ? `Asking for ${userName}` : "Your AI astrology companion"}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center"
            aria-label="New conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-text-dim" />
          </button>
        )}
      </div>

      {/* ═══ Chat Area ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4">
        {isEmpty ? (
          /* ═══ Empty State ═══ */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            {/* Cosmic orb */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-magenta/20 via-violet/10 to-cyan/20 blur-xl animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-magenta/30 via-violet/20 to-cyan/30" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-magenta via-violet to-cyan opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white/70" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-text mb-1">Greetings from Vaani!</h2>
            <p className="text-sm text-text-dim mb-1">
              {userName
                ? `Currently asking for ${userName}`
                : "Ask me anything about your stars"}
            </p>
            <p className="text-xs text-text-dim/60 mb-6">
              Switch profile to ask for your family members
            </p>

            {/* Sample questions */}
            <div className="w-full space-y-2">
              {SAMPLE_QUESTIONS.slice(0, 4).map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setInput(q)
                    handleSend(q)
                  }}
                  className="w-full glass-card rounded-xl px-4 py-3 text-left text-sm text-text-secondary
                    hover:border-magenta/20 transition-colors"
                >
                  &ldquo;{q}&rdquo;
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ═══ Messages ═══ */
          <div className="pt-2">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={msg.isStreaming}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ═══ Input Bar ═══ */}
      <div className="px-4 pb-20 pt-2 shrink-0">
        <div className="glass-card rounded-2xl flex items-end gap-2 p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-dim
              resize-none outline-none max-h-24 px-2 py-1.5"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              input.trim() && !isStreaming
                ? "bg-gradient-to-br from-magenta to-violet text-white"
                : "bg-bg-elevated text-text-dim"
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
