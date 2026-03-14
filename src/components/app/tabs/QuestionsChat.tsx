"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Send, Mic, RefreshCw } from "lucide-react"
import type { ChatMessage, BirthData } from "@/types/app"

const SUGGESTIONS = [
  "What career change will I experience at 40?",
  "What will my marriage life be like at 40?",
  "What spiritual practices suit me at 35?",
]

interface QuestionsChatProps {
  onClose: () => void
}

export default function QuestionsChat({ onClose }: QuestionsChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [userName, setUserName] = useState("")
  const [initials, setInitials] = useState("HS")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [questionsLeft, setQuestionsLeft] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        const n = data.name || "User"
        setUserName(n.split(" ")[0])
        const parts = n.split(" ")
        setInitials(
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : n.substring(0, 2).toUpperCase()
        )
      }
      const q = localStorage.getItem("grahai-questions-left")
      if (q) setQuestionsLeft(parseInt(q))

      // Check pending question
      const pending = localStorage.getItem("grahai-pending-question")
      if (pending) {
        localStorage.removeItem("grahai-pending-question")
        setInput(pending)
        setTimeout(() => handleSend(pending), 300)
      }
    } catch {}
  }, [])

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
      senderName: userName,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsStreaming(true)

    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), isStreaming: true, senderName: "Vaani" },
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
    <div className="fixed inset-0 z-40 bg-[#080818] flex flex-col">
      {/* Chat header — "Asking for yourself" chip + History + Close */}
      <div className="flex items-center gap-2 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 bg-[#1E1E3A] rounded-full px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-[#3A3A50] flex items-center justify-center text-[9px] font-bold text-white">
            {initials}
          </div>
          <span className="text-xs text-white/70 font-medium">Asking for yourself</span>
        </div>
        <button className="flex items-center gap-1.5 bg-[#1E1E3A] rounded-full px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/50">History</span>
        </button>
        <button
          onClick={onClose}
          className="ml-auto w-10 h-10 rounded-full bg-[#2A2A40] flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white/50" />
        </button>
      </div>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4">
        {isEmpty ? (
          /* Empty state with Vaani greeting + suggestions */
          <div className="pt-8">
            {/* Vaani avatar */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">V</span>
              </div>
              <span className="text-xs text-white/50 font-medium">Vaani</span>
            </div>

            <p className="text-sm text-white/60 mb-6">
              Here are some suggestions for {userName || "you"}.
            </p>

            {/* Suggestion cards */}
            <div className="space-y-3 mb-6">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); handleSend(q) }}
                  className="w-full text-left bg-[#1A1A35] rounded-xl px-4 py-3.5
                    text-sm text-white/50 hover:bg-[#222245] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button className="flex items-center gap-2 text-white/30 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        ) : (
          /* Messages */
          <div className="pt-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={msg.role === "user" ? "flex flex-col items-end" : ""}
                >
                  {/* Sender label */}
                  <div className={`flex items-center gap-2 mb-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                      msg.role === "user" ? "bg-[#3A3A50]" : "bg-pink-600"
                    }`}>
                      {msg.role === "user" ? initials : "V"}
                    </div>
                    <span className="text-[10px] text-white/40">
                      {msg.role === "user" ? userName : "Vaani"}
                    </span>
                    {msg.isStreaming && (
                      <span className="text-[10px] text-white/30">...</span>
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#2A2A45] text-white/70 rounded-tr-md"
                      : "text-white/60"
                  }`}>
                    {msg.content}
                    {msg.isStreaming && !msg.content && (
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400/60 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400/60 animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400/60 animate-pulse [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Question balance bar */}
      <div className="px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-2 border-pink-500/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white/50">{questionsLeft}</span>
          </div>
          <span className="text-xs text-white/40">Question left</span>
        </div>
        <button className="text-xs text-white bg-pink-600 px-4 py-1.5 rounded-full font-medium">
          Buy More Questions
        </button>
      </div>

      {/* Input bar */}
      <div className="px-4 pb-6 pt-2 shrink-0">
        <div className="bg-white/90 rounded-full flex items-center gap-2 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask your question here..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
          <button className="w-9 h-9 rounded-full bg-[#2A2A40] flex items-center justify-center">
            <Mic className="w-4 h-4 text-white/50" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              input.trim() && !isStreaming
                ? "bg-gradient-to-r from-pink-500 to-pink-600"
                : "bg-gray-300"
            }`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
