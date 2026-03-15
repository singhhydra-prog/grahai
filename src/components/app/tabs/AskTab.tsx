"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Sparkles, Clock, ArrowLeft, Trash2,
  CheckCircle, AlertTriangle, Timer, Lightbulb, BookOpen,
  MessageCircle, ChevronRight, Share2, Bookmark
} from "lucide-react"
import type { ChatMessage, BirthData } from "@/types/app"
import SourceDrawer from "@/components/ui/SourceDrawer"
import ShareCard from "@/components/ui/ShareCard"
import { useLanguage } from "@/lib/LanguageContext"

/* ─── Structured answer section parser ────────────────── */
interface AnswerSection {
  id: string
  title: string
  content: string
  icon: "answer" | "why" | "do" | "avoid" | "timing" | "reflect" | "source"
}

function parseStructuredAnswer(text: string, t: any): AnswerSection[] | null {
  const sections: AnswerSection[] = []

  const sectionDefs: { pattern: RegExp; id: string; title: string; icon: AnswerSection["icon"] }[] = [
    { pattern: /###\s*(?:1\.\s*)?Direct Answer/i, id: "direct", title: t.ask.directAnswer, icon: "answer" },
    { pattern: /###\s*(?:2\.\s*)?Why This Is (?:Showing Up|Happening)/i, id: "why", title: t.ask.whyShowingUp, icon: "why" },
    { pattern: /###\s*(?:3\.\s*)?What To Do/i, id: "do", title: t.ask.whatToDo, icon: "do" },
    { pattern: /###\s*(?:4\.\s*)?What To Avoid/i, id: "avoid", title: t.ask.whatToAvoid, icon: "avoid" },
    { pattern: /###\s*(?:5\.\s*)?Timing/i, id: "timing", title: t.ask.timeWindow, icon: "timing" },
    { pattern: /###\s*(?:6\.\s*)?Reflection(?:\s*(?:or|\/)\s*Remedy)?/i, id: "reflect", title: t.ask.remedy, icon: "reflect" },
    { pattern: /###\s*(?:7\.\s*)?(?:Why GrahAI Says This|Source)/i, id: "source", title: t.ask.source, icon: "source" },
  ]

  // Find all section positions
  const found: { def: typeof sectionDefs[0]; start: number; headerEnd: number }[] = []
  for (const def of sectionDefs) {
    const match = text.match(def.pattern)
    if (match && match.index !== undefined) {
      found.push({ def, start: match.index, headerEnd: match.index + match[0].length })
    }
  }

  // Need at least 2 sections to consider it structured
  if (found.length < 2) return null

  // Sort by position
  found.sort((a, b) => a.start - b.start)

  // Extract content between sections
  for (let i = 0; i < found.length; i++) {
    const contentStart = found[i].headerEnd
    const contentEnd = i + 1 < found.length ? found[i + 1].start : text.length
    const content = text.slice(contentStart, contentEnd).trim()
    if (content) {
      sections.push({
        id: found[i].def.id,
        title: found[i].def.title,
        content,
        icon: found[i].def.icon,
      })
    }
  }

  return sections.length >= 2 ? sections : null
}

/* ─── Section icon component ──────────────────────────── */
function SectionIcon({ type }: { type: AnswerSection["icon"] }) {
  const configs = {
    answer: { Icon: Sparkles, color: "text-[#D4A054]", bg: "bg-[#D4A054]/10" },
    why: { Icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
    do: { Icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    avoid: { Icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    timing: { Icon: Timer, color: "text-[#D4A054]", bg: "bg-[#D4A054]/10" },
    reflect: { Icon: Lightbulb, color: "text-teal-400", bg: "bg-teal-500/10" },
    source: { Icon: BookOpen, color: "text-[#94A3B8]", bg: "bg-[#94A3B8]/10" },
  }
  const { Icon, color, bg } = configs[type]
  return (
    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
    </div>
  )
}

/* ─── Structured answer renderer ──────────────────────── */
function StructuredAnswer({ sections, onViewSource, t }: { sections: AnswerSection[]; onViewSource: (text: string) => void; t: any }) {
  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <>
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl p-3.5 insight-card ${
              section.icon === "answer"
                ? "bg-[#111827] border border-[#D4A054]/15"
                : section.icon === "source"
                ? "bg-[#0A0E1A] border border-[#1E293B]"
                : "bg-[#111827] border border-[#1E293B]"
            }`}
          >
          <div className="flex items-center gap-2 mb-2">
            <SectionIcon type={section.icon} />
            <span className="text-xs font-semibold text-[#F1F0F5]">{section.title}</span>
          </div>
          <div className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-wrap pl-9">
            {section.content}
          </div>
          {section.icon === "source" && (
            <button
              onClick={() => onViewSource(section.content)}
              className="flex items-center gap-1 mt-2 pl-9 text-[11px] text-[#D4A054] hover:text-[#E8C278] transition-colors"
            >
              {t.ask.viewFullSource} <ChevronRight className="w-3 h-3" />
            </button>
          )}
          </motion.div>
          {i < sections.length - 1 && <div className="section-divider" />}
        </>
      ))}
    </div>
  )
}

/* ─── Main AskTab component ───────────────────────────── */
interface AskTabProps {
  initialQuestion?: string
}

export default function AskTab({ initialQuestion }: AskTabProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [userName, setUserName] = useState("")
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [questionsLeft, setQuestionsLeft] = useState(3)
  const [showHistory, setShowHistory] = useState(false)
  const [sourceDrawerOpen, setSourceDrawerOpen] = useState(false)
  const [sourceText, setSourceText] = useState("")
  const [shareData, setShareData] = useState<{ title: string; body: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasProcessedInitial = useRef(false)

  /* ─── Topic chips — moved inside component to access t ───────────── */
  const TOPIC_CHIPS = useMemo(() => [
    { label: t.ask.topicLove, query: "What does my chart say about my love life right now?" },
    { label: t.ask.topicCareer, query: "What career direction does my chart support right now?" },
    { label: t.ask.topicTiming, query: "Is this a good time for important decisions?" },
    { label: t.ask.topicFamily, query: "What does my chart show about my family life?" },
    { label: t.ask.topicHealth, query: "What should I watch out for regarding my health?" },
    { label: t.ask.topicMoney, query: "What does my chart say about financial growth?" },
  ], [t])

  const SUGGESTIONS = useMemo(() => [
    t.ask.suggestion1,
    t.ask.suggestion2,
    t.ask.suggestion3,
  ], [t])

  const FOLLOW_UPS = useMemo(() => [
    t.ask.followUp1,
    t.ask.followUp2,
    t.ask.followUp3,
    t.ask.followUp4,
  ], [t])

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
      const pending = localStorage.getItem("grahai-pending-question")
      if (pending) {
        localStorage.removeItem("grahai-pending-question")
        setTimeout(() => handleSend(pending), 300)
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initialQuestion && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true
      setTimeout(() => handleSend(initialQuestion), 300)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let buffer = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === "text_delta" && data.text) {
                  fullText += data.text
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: fullText, isStreaming: true } : m))
                  )
                }
              } catch {
                const raw = line.slice(6)
                if (raw && raw !== "[DONE]") {
                  fullText += raw
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: fullText, isStreaming: true } : m))
                  )
                }
              }
            }
          }
        }
      }

      if (!fullText && res.headers.get("content-type")?.includes("text/plain")) {
        fullText = await res.text()
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: fullText || t.ask.errorGenerate, isStreaming: false } : m
        )
      )

      try {
        await fetch("/api/user/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text, answer: fullText }),
        })
      } catch {}

      try {
        await fetch("/api/gamification/award-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vertical: "astrology", messageCount: messages.length + 1 }),
        })
      } catch {}

      setQuestionsLeft((prev) => Math.max(0, prev - 1))
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: t.ask.errorRetry, isStreaming: false } : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const openSourceDrawer = (text: string) => {
    setSourceText(text)
    setSourceDrawerOpen(true)
  }

  // Parse source text into SourceDrawer format
  const sourceData = useMemo(() => {
    if (!sourceText) return null
    return {
      principle: "Classical Jyotish Principle",
      text: sourceText,
      reference: "Brihat Parashara Hora Shastra",
    }
  }, [sourceText])

  const isEmpty = messages.length === 0

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 shrink-0 border-b border-white/[0.04] bg-[#0A0E1A]/80 backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A054] to-[#A16E2A] flex items-center justify-center gold-shimmer">
          <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-[#F1F0F5] text-3d">{t.ask.title}</h1>
          <p className="text-[10px] text-[#5A6478]">{questionsLeft} {t.ask.questionsRemaining}</p>
        </div>
        <button onClick={() => setShowHistory(true)}
          className="flex items-center gap-1.5 bg-[#111827] border border-[#1E293B] rounded-full px-3 py-1.5">
          <Clock className="w-3 h-3 text-[#5A6478]" />
          <span className="text-[10px] text-[#5A6478]">{t.profile.questionsHistory}</span>
        </button>
      </div>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4">
        {isEmpty ? (
          <div className="pt-10 text-center">
            <div className="cosmic-orb-sm mx-auto mb-5" />
            <h2
              className="text-lg font-bold mb-1"
              style={{
                background: "linear-gradient(270deg, #E8C278, #D4A054, #2DD4BF, #E8C278, #D4A054)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-text-flow 6s ease-in-out infinite",
              }}
            >
              {t.ask.whatsOnMind}{userName ? `, ${userName}` : ""}?
            </h2>
            <p className="text-sm text-[#5A6478] mb-6 max-w-xs mx-auto text-visible">
              {t.ask.placeholder}
            </p>

            {/* Topic chips — 6 categories from document */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.query)}
                  className="px-3.5 py-1.5 rounded-full glass-inner
                    text-xs text-[#94A3B8] font-medium hover:border-[#D4A054]/30 hover:text-[#D4A054]
                    transition-all card-scale press-scale"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Suggestion cards */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              {SUGGESTIONS.map((q) => (
                <button key={q} onClick={() => handleSend(q)}
                  className="w-full text-left glass-card card-lift px-4 py-3.5 press-scale
                    text-sm text-[#94A3B8] hover:border-[#D4A054]/20 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-4 space-y-5">
            <AnimatePresence>
              {messages.map((msg) => {
                const structured = !msg.isStreaming && msg.role === "assistant" && msg.content
                  ? parseStructuredAnswer(msg.content, t)
                  : null

                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-[#1E2638] rounded-2xl rounded-tr-md px-4 py-3">
                          <p className="text-sm text-[#F1F0F5]">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4A054] to-[#A16E2A] flex items-center justify-center">
                            <span className="text-[9px] font-bold text-[#0A0E1A]">G</span>
                          </div>
                          <span className="text-[11px] text-[#5A6478] font-medium">GrahAI</span>
                          {msg.isStreaming && <span className="text-[11px] text-[#D4A054]/60 animate-pulse">{t.ask.thinking}</span>}
                        </div>

                        {/* Structured answer (post-stream) or raw text (during stream) */}
                        {structured ? (
                          <StructuredAnswer sections={structured} onViewSource={openSourceDrawer} t={t} />
                        ) : (
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
                        )}

                        {/* Follow-up chips + actions (after answer completes) */}
                        {!msg.isStreaming && msg.content && (
                          <>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {FOLLOW_UPS.map((chip) => (
                                <button key={chip} onClick={() => handleSend(chip)}
                                  className="px-3 py-1 rounded-full bg-[#111827] border border-[#1E293B] press-scale
                                    text-[11px] text-[#94A3B8] hover:border-[#D4A054]/20 hover:text-[#D4A054] transition-colors">
                                  {chip}
                                </button>
                              ))}
                            </div>
                            {/* Share & Save actions */}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  const userMsg = messages.find(m => m.id === msg.id.replace("assistant", "user"))
                                  const question = userMsg?.content || "My Insight"
                                  const excerpt = msg.content.slice(0, 300).replace(/###\s*/g, "").trim()
                                  setShareData({ title: question, body: excerpt })
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1E293B]
                                  text-[10px] text-[#5A6478] hover:text-[#D4A054] hover:border-[#D4A054]/20 transition-colors"
                              >
                                <Share2 className="w-3 h-3" /> Share
                              </button>
                              <button
                                onClick={() => {
                                  try {
                                    const saved = JSON.parse(localStorage.getItem("grahai-saved-answers") || "[]")
                                    const userMsg = messages.find(m => m.id === msg.id.replace("assistant", "user"))
                                    saved.unshift({ id: msg.id, question: userMsg?.content || "", excerpt: msg.content.slice(0, 200), timestamp: Date.now() })
                                    localStorage.setItem("grahai-saved-answers", JSON.stringify(saved.slice(0, 50)))
                                  } catch {}
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1E293B]
                                  text-[10px] text-[#5A6478] hover:text-[#D4A054] hover:border-[#D4A054]/20 transition-colors"
                              >
                                <Bookmark className="w-3 h-3" /> Save
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-24 pt-2 shrink-0">
        {messages.length > 0 && !isStreaming && (
          <button onClick={() => { setMessages([]); hasProcessedInitial.current = false }}
            className="flex items-center gap-1.5 text-[10px] text-[#5A6478] hover:text-rose-400/70
              transition-colors mb-2 mx-auto">
            <Trash2 className="w-3 h-3" /> {t.common.close}
          </button>
        )}
        <div className="flex items-center gap-2 glass-card px-4 py-2.5
          focus-within:border-[#D4A054]/30 transition-colors">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={t.ask.placeholder}
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#5A6478]/50 outline-none" />
          <button onClick={() => handleSend()} disabled={!input.trim() || isStreaming}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              input.trim() && !isStreaming ? "bg-gradient-to-br from-[#D4A054] to-[#A16E2A]" : "bg-[#1E2638]"
            }`}>
            <Send className={`w-4 h-4 ${input.trim() && !isStreaming ? "text-[#0A0E1A]" : "text-[#5A6478]"}`} />
          </button>
        </div>
      </div>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0E1A] overflow-y-auto"
          >
            <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-[#1E293B]">
              <button onClick={() => setShowHistory(false)}
                className="w-10 h-10 rounded-full bg-[#1E2638] border border-[#1E293B] flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-[#5A6478]" />
              </button>
              <h1 className="text-base font-semibold text-[#F1F0F5]">{t.profile.questionsHistory}</h1>
            </div>
            <div className="px-5 pt-8">
              {messages.filter(m => m.role === "user").length > 0 ? (
                <div className="space-y-3">
                  {messages.filter(m => m.role === "user").map((msg) => (
                    <button key={msg.id}
                      onClick={() => { setShowHistory(false); handleSend(msg.content) }}
                      className="w-full text-left bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3.5
                        hover:border-[#D4A054]/20 transition-colors">
                      <p className="text-sm text-[#F1F0F5]">{msg.content}</p>
                      <p className="text-[10px] text-[#5A6478] mt-1">{t.ask.thisSession}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center pt-8">
                  <Clock className="w-12 h-12 text-[#5A6478]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#5A6478]">{t.ask.noQuestionsYet}</p>
                  <p className="text-xs text-[#5A6478]/60 mt-1">{t.ask.questionsAppearHere}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Source Drawer */}
      <SourceDrawer
        isOpen={sourceDrawerOpen}
        onClose={() => setSourceDrawerOpen(false)}
        source={sourceData}
        context={t.ask.basedOnChart}
      />

      {/* Share Card Overlay */}
      <AnimatePresence>
        {shareData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
            onClick={() => setShareData(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ShareCard
                title={shareData.title}
                body={shareData.body}
                footer="Powered by GrahAI — Vedic Astrology"
                onClose={() => setShareData(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
