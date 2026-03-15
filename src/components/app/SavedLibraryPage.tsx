"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, MessageCircle, FileText, Heart, Search,
  Clock, ChevronRight, Bookmark, Trash2
} from "lucide-react"

/* ── Types ── */
type LibraryTab = "answers" | "reports" | "compatibility"

interface SavedAnswer {
  id: string
  question: string
  excerpt: string
  topic: string
  timestamp: number
}

interface SavedReport {
  id: string
  title: string
  status: "generated" | "purchased" | "pending"
  timestamp: number
}

interface SavedCompatibility {
  id: string
  partnerName: string
  score: number
  timestamp: number
}

interface SavedLibraryPageProps {
  onBack: () => void
}

const TABS: { id: LibraryTab; label: string; icon: typeof MessageCircle }[] = [
  { id: "answers", label: "Answers", icon: MessageCircle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "compatibility", label: "Matches", icon: Heart },
]

// Mock data
const MOCK_ANSWERS: SavedAnswer[] = [
  { id: "1", question: "Will I get a promotion this year?", excerpt: "Based on your Saturn-Jupiter aspect and current Mars transit, the window between April-June is particularly strong...", topic: "Career", timestamp: Date.now() - 86400000 },
  { id: "2", question: "Is my relationship headed towards marriage?", excerpt: "Your 7th house lord Venus is currently in a favourable transit. The Navamsa chart shows commitment potential...", topic: "Love", timestamp: Date.now() - 172800000 },
  { id: "3", question: "Should I invest in real estate?", excerpt: "Mars in the 4th house combined with Jupiter's aspect creates a favourable window for property decisions...", topic: "Money", timestamp: Date.now() - 432000000 },
]

const MOCK_REPORTS: SavedReport[] = [
  { id: "1", title: "Love Clarity Report", status: "generated", timestamp: Date.now() - 259200000 },
  { id: "2", title: "Career Timing Report", status: "purchased", timestamp: Date.now() - 604800000 },
]

const MOCK_COMPAT: SavedCompatibility[] = [
  { id: "1", partnerName: "Priya", score: 78, timestamp: Date.now() - 86400000 },
  { id: "2", partnerName: "Rahul", score: 65, timestamp: Date.now() - 604800000 },
]

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export default function SavedLibraryPage({ onBack }: SavedLibraryPageProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("answers")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAnswers = MOCK_ANSWERS.filter((a) =>
    a.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.topic.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#F1F0F5]">Saved Library</h1>
              <p className="text-xs text-[#8892A3]">Your answers, reports, and matches</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/[0.02] rounded-xl p-1 border border-white/5">
            {TABS.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#D4A054]/10 text-[#D4A054] border border-[#D4A054]/20"
                      : "text-[#8892A3] hover:text-[#A0A5B2]"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-12">

        {/* Search */}
        {activeTab === "answers" && (
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <Search className="w-4 h-4 text-[#8892A3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved answers..."
              className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#8892A3] outline-none"
            />
          </div>
        )}

        {/* Answers Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "answers" && (
            <motion.div
              key="answers"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
              {filteredAnswers.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-10 h-10 text-[#8892A3]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#8892A3]">No saved answers yet</p>
                  <p className="text-xs text-[#8892A3]/60 mt-1">Ask GrahAI a question to get started</p>
                </div>
              ) : (
                filteredAnswers.map((answer) => (
                  <div key={answer.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#D4A054]/10 text-[#D4A054]">
                          {answer.topic}
                        </span>
                        <span className="text-[10px] text-[#8892A3]">{timeAgo(answer.timestamp)}</span>
                      </div>
                      <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-[#8892A3]" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-[#F1F0F5] mb-1">{answer.question}</p>
                    <p className="text-xs text-[#A0A5B2] leading-relaxed line-clamp-2">{answer.excerpt}</p>
                    <button className="flex items-center gap-1 mt-2 text-[10px] text-[#D4A054] font-medium hover:underline">
                      Read full answer <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
              {MOCK_REPORTS.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-[#8892A3]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#8892A3]">No reports yet</p>
                  <p className="text-xs text-[#8892A3]/60 mt-1">Purchase or generate a report to see it here</p>
                </div>
              ) : (
                MOCK_REPORTS.map((report) => (
                  <div key={report.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#D4A054]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#F1F0F5]">{report.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          report.status === "generated" ? "bg-emerald-500/10 text-emerald-400" :
                          report.status === "purchased" ? "bg-[#D4A054]/10 text-[#D4A054]" :
                          "bg-amber-500/10 text-amber-400"
                        }`}>
                          {report.status === "generated" ? "Ready" : report.status === "purchased" ? "Purchased" : "Generating..."}
                        </span>
                        <span className="text-[10px] text-[#8892A3]">{timeAgo(report.timestamp)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8892A3]" />
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Compatibility Tab */}
          {activeTab === "compatibility" && (
            <motion.div
              key="compatibility"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
              {MOCK_COMPAT.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-10 h-10 text-[#8892A3]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#8892A3]">No compatibility checks yet</p>
                  <p className="text-xs text-[#8892A3]/60 mt-1">Check compatibility with someone to see results here</p>
                </div>
              ) : (
                MOCK_COMPAT.map((compat) => {
                  const scoreColor = compat.score >= 75 ? "text-emerald-400" : compat.score >= 50 ? "text-amber-400" : "text-rose-400"
                  return (
                    <div key={compat.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#F1F0F5]">You & {compat.partnerName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-bold ${scoreColor}`}>{compat.score}/100</span>
                          <span className="text-[10px] text-[#8892A3]">{timeAgo(compat.timestamp)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8892A3]" />
                    </div>
                  )
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
