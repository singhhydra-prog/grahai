"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Filter } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { ReportCategory } from "@/types/app"

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: "life",
    title: "Know Yourself Better",
    reports: [
      { id: "life-guidance", title: "Life Guidance", subtitle: "Your kundali analysis and birth charts", guidancePeriod: "Lifetime", isLocked: false, isFree: true, category: "life" },
      { id: "personality", title: "Personality Traits", subtitle: "Analysis of your 20+ characteristics", guidancePeriod: "Lifetime", isLocked: false, isFree: true, category: "life" },
    ],
  },
  {
    id: "wealth",
    title: "Get Rich and Prosper",
    reports: [
      { id: "billionaire", title: "Billionaire Potential", subtitle: "Find your financial destiny", guidancePeriod: "Lifetime", isLocked: true, category: "wealth" },
      { id: "wealth", title: "Wealth", subtitle: "Quick wealth creation", guidancePeriod: "1 Year", isLocked: true, category: "wealth" },
    ],
  },
  {
    id: "career",
    title: "Plan Your Professional Roadmap",
    reports: [
      { id: "career-salaried", title: "Career (Salaried)", subtitle: "Career growth for corporate employees", guidancePeriod: "1 Year", isLocked: true, category: "career" },
      { id: "govt-job", title: "Government Job", subtitle: "Selection, promotion and growth", guidancePeriod: "5 Years", isLocked: true, isNew: true, category: "career" },
    ],
  },
  {
    id: "marriage",
    title: "Everything About Your Marriage",
    reports: [
      { id: "marriage", title: "Marriage", subtitle: "Early or delayed? Yogas, timing & remedies", guidancePeriod: "5 Years", isLocked: true, isTrending: true, category: "marriage" },
      { id: "life-partner", title: "Life Partner", subtitle: "Your ideal life partner", guidancePeriod: "Lifetime", isLocked: true, category: "marriage" },
    ],
  },
  {
    id: "love",
    title: "The Story of Love",
    reports: [
      { id: "love-navigator", title: "Love Navigator", subtitle: "Your style and strengths in romance", guidancePeriod: "1 Year", isLocked: true, category: "love" },
      { id: "love-arrange", title: "Love or Arrange Marriage", subtitle: "What suits you the best?", guidancePeriod: "Lifetime", isLocked: true, isNew: true, category: "love" },
    ],
  },
  {
    id: "business",
    title: "Growing Your Business",
    reports: [
      { id: "business-owner", title: "Business Owner", subtitle: "How to grow your business?", guidancePeriod: "1 Year", isLocked: true, category: "business" },
      { id: "job-vs-business", title: "Job vs Business", subtitle: "A stable job, a bold business, or both?", guidancePeriod: "Lifetime", isLocked: true, category: "business" },
    ],
  },
  {
    id: "education",
    title: "Prepare Your Educational Journey",
    reports: [
      { id: "multiple-intelligence", title: "Multiple Intelligence", subtitle: "Discover your unique strengths", guidancePeriod: "5 Years", isLocked: true, category: "education" },
      { id: "education-report", title: "Education", subtitle: "Navigate your academic journey", guidancePeriod: "1 Year", isLocked: true, isFree: true, category: "education" },
    ],
  },
]

interface ReportsTabProps {
  onProfileClick: () => void
}

export default function ReportsTab({ onProfileClick }: ReportsTabProps) {
  const [reportsLeft, setReportsLeft] = useState(0)

  useEffect(() => {
    try {
      const r = localStorage.getItem("grahai-reports-left")
      if (r) setReportsLeft(parseInt(r))
    } catch {}
  }, [])

  return (
    <div className="min-h-full pb-28">
      <AppHeader onProfileClick={onProfileClick} />

      <div className="px-4 py-2 flex items-center justify-between bg-[#0E0E25]">
        <span className="text-xs text-white/40">Viewing your reports</span>
        <button className="flex items-center gap-1.5 text-xs text-white/50">
          <Filter className="w-3.5 h-3.5" />
          All reports
        </button>
      </div>

      <div className="px-4 pt-4">
        {REPORT_CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.06 }}
            className="mb-6"
          >
            <h2 className="text-base font-bold text-white/90 mb-3">{cat.title}</h2>
            <div className="grid grid-cols-2 gap-3">
              {cat.reports.map((report) => (
                <button
                  key={report.id}
                  className="bg-[#12122A] border border-[#1E1E45] rounded-2xl p-3.5 text-left
                    hover:border-pink-500/20 transition-colors relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">
                        Guidance
                      </span>
                      <p className="text-sm font-bold text-white/80">{report.guidancePeriod}</p>
                    </div>
                    {report.isLocked && <Lock className="w-4 h-4 text-white/20" />}
                  </div>

                  <div className="w-full h-20 flex items-center justify-center mb-3 opacity-20">
                    <div className="w-16 h-16 rounded-full border border-white/10" />
                  </div>

                  {(report.isNew || report.isTrending || report.isFree) && (
                    <div className="mb-2">
                      {report.isTrending && (
                        <span className="text-[9px] bg-[#1E1E40] text-white/50 px-2 py-0.5 rounded-full font-medium">
                          Trending
                        </span>
                      )}
                      {report.isNew && (
                        <span className="text-[9px] bg-[#1E1E40] text-white/50 px-2 py-0.5 rounded-full font-medium">
                          New
                        </span>
                      )}
                      {report.isFree && (
                        <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-sm font-bold">
                          FREE
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-white/80 mb-0.5">{report.title}</h3>
                  <p className="text-[11px] text-white/35 leading-snug">{report.subtitle}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-4 py-3
        bg-gradient-to-t from-[#080818] via-[#080818]/95 to-transparent">
        <div className="flex items-center justify-between max-w-lg mx-auto
          bg-[#12122A] border border-[#1E1E45] rounded-full px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-pink-500/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/50">{reportsLeft}</span>
            </div>
            <span className="text-xs text-white/40">Report left</span>
          </div>
          <button className="text-xs text-white bg-pink-600 px-4 py-1.5 rounded-full font-medium">
            Buy Reports
          </button>
        </div>
      </div>
    </div>
  )
}
