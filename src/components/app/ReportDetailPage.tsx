"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft, Lock, CheckCircle, Star, Users, Clock,
  ChevronDown, Sparkles, ShieldCheck
} from "lucide-react"

/* ── Types ── */
interface ReportSection {
  title: string
  preview: string
  isLocked: boolean
}

interface ReportDetail {
  id: string
  title: string
  subtitle: string
  price: number
  icon: string
  oneLineValue: string
  description: string
  sections: ReportSection[]
  whoIsItFor: string[]
  sampleInsight: string
  whyNow: string
}

interface ReportDetailPageProps {
  reportId: string
  onBack: () => void
}

const REPORTS: Record<string, ReportDetail> = {
  "love-clarity": {
    id: "love-clarity",
    title: "Love Clarity",
    subtitle: "Your Emotional Blueprint",
    price: 299,
    icon: "❤️",
    oneLineValue: "Understand your emotional patterns and what you truly need in love",
    description: "A deep analysis of your Venus placement, 7th house, Navamsa chart, and emotional tendencies based on your Moon sign and Nakshatra. This report reveals your love language, attachment style, ideal partner traits, and relationship timing.",
    sections: [
      { title: "Your Love Language (Vedic)", preview: "Your Venus in the 5th house with Pushya Nakshatra creates a nurturing love style. You express love through care and consistency, not grand gestures...", isLocked: false },
      { title: "Emotional Patterns & Triggers", preview: "Moon-Ketu conjunction suggests a pattern of emotional withdrawal during conflict. Understanding this is the first step to healthier relationships...", isLocked: true },
      { title: "Ideal Partner Profile", preview: "Your 7th house lord and Navamsa placement suggest you need a partner who values stability but brings spontaneity...", isLocked: true },
      { title: "Relationship Timeline", preview: "Your Venus Dasha period (starting in 8 months) marks a significant window for committed relationships...", isLocked: true },
      { title: "Remedies & Guidance", preview: "Strengthening Venus through specific practices can enhance your relationship magnetism and emotional resilience...", isLocked: true },
    ],
    whoIsItFor: [
      "You're single and want to understand what kind of partner suits your chart",
      "You're in a relationship and want to deepen emotional understanding",
      "You've experienced recurring relationship patterns and want clarity on why",
    ],
    sampleInsight: "Your Venus in the 5th house combined with Pushya Nakshatra gives you a rare nurturing quality in love. You express affection through consistent acts of care rather than dramatic gestures. Partners who need flashy romance may misread your steady devotion as disinterest — but those who value depth will find your love profoundly reassuring. Your Moon-Ketu conjunction adds a layer of emotional complexity: you feel deeply but may withdraw during conflict, which partners can interpret as coldness. Awareness of this pattern is transformative.",
    whyNow: "Venus is transiting your 7th house this month, making this an ideal time to understand and work with your emotional patterns. Insights from this report will be especially actionable for the next 45 days.",
  },
  "career-timing": {
    id: "career-timing",
    title: "Career Timing",
    subtitle: "Strategic Professional Guidance",
    price: 299,
    icon: "💼",
    oneLineValue: "Know when to push, when to wait, and what roles fit your chart",
    description: "Analyzes your 10th house, Saturn placement, Dasha periods, and upcoming transits to reveal your optimal career timing, natural leadership style, and professional strengths.",
    sections: [
      { title: "Your Professional Archetype", preview: "Saturn in the 10th house gives you the archetype of the 'Steady Builder' — success comes through persistence and expertise, not shortcuts...", isLocked: false },
      { title: "Best Months for Career Moves", preview: "The Mars transit through your 10th house in March-April creates a power window for promotions, job changes, or launching new projects...", isLocked: true },
      { title: "Natural Leadership Style", preview: "Your Sun-Jupiter aspect suggests a mentorship-oriented leadership approach. You lead by teaching and inspiring...", isLocked: true },
      { title: "Industries & Roles That Fit", preview: "Your Mercury-Rahu conjunction in the 2nd house suggests aptitude for technology, communications, or finance...", isLocked: true },
      { title: "5-Year Career Outlook", preview: "The upcoming Jupiter transit promises expansion. Combined with your Dasha phase, 2027-2028 is your peak window...", isLocked: true },
    ],
    whoIsItFor: [
      "You're considering a career change and want to time it wisely",
      "You want to understand your natural professional strengths",
      "You're planning a business launch and need timing guidance",
    ],
    sampleInsight: "Saturn's prominent position in your 10th house marks you as someone who builds lasting career success through discipline and expertise. Unlike flashy risers who burn out, your trajectory is a steady upward climb. The key is patience: your chart shows that rushing career decisions during unfavourable transits leads to frustration, while waiting for the right windows leads to lasting advancement. Your next major career window opens when Mars transits your 10th house.",
    whyNow: "Mars enters your 10th house next week, opening a rare career power window. Understanding your chart's professional indicators now means you can act strategically during this transit.",
  },
  "decision-window": {
    id: "decision-window",
    title: "Decision Window",
    subtitle: "Your 12-Month Timing Map",
    price: 399,
    icon: "📅",
    oneLineValue: "Your best months for major decisions in the next 12 months",
    description: "A month-by-month analysis of your planetary transits and Dasha periods, identifying the best windows for major life decisions over the coming year.",
    sections: [
      { title: "Your Annual Overview", preview: "2026 is a year of consolidation followed by expansion. The first half favors finishing what you started; the second half opens new doors...", isLocked: false },
      { title: "Month-by-Month Timing Map", preview: "March: Career moves. April: Financial planning. May: Rest. June-July: Relationship decisions. August: Travel & learning...", isLocked: true },
      { title: "Best Days for Important Decisions", preview: "Your personal power days are calculated from your birth Nakshatra and current Dasha lord...", isLocked: true },
      { title: "Periods to Avoid Major Changes", preview: "Saturn retrograde in your 8th house (May-October) suggests caution with investments and legal matters during this window...", isLocked: true },
    ],
    whoIsItFor: [
      "You have a major decision coming up and want to time it right",
      "You want a yearly overview to plan career, finances, and relationships",
      "You believe in working with cosmic timing rather than against it",
    ],
    sampleInsight: "The first quarter of 2026 is your most dynamic period. Mars in the 10th house (March) combined with Jupiter's aspect on your Ascendant creates a rare convergence of ambition and luck. If you have been waiting to make a bold professional move, the window between March 15 - April 20 is strongly supported. Conversely, May-June favors introspection — avoid signing major contracts during this slower period.",
    whyNow: "You're in the early part of a powerful Dasha sub-period. Understanding your timing map now gives you a strategic advantage for the rest of the year.",
  },
  "compatibility-deep": {
    id: "compatibility-deep",
    title: "Compatibility Report",
    subtitle: "Two Charts, One Story",
    price: 499,
    icon: "💕",
    oneLineValue: "Deep analysis of two charts: strengths, friction, long-term potential",
    description: "Goes beyond Ashtakoot matching to analyze cross-chart planetary aspects, Navamsa compatibility, Dasha synchronicity, and practical relationship dynamics.",
    sections: [
      { title: "Ashtakoot Score Breakdown", preview: "Your Ashtakoot score of 27/36 (75%) places you in the 'strongly compatible' range with notable strengths in Nadi and Graha Maitri...", isLocked: false },
      { title: "Cross-Chart Planetary Aspects", preview: "The Venus-Mars cross-aspect between your charts creates sustained physical and emotional chemistry...", isLocked: true },
      { title: "Communication & Conflict Patterns", preview: "Mercury positions reveal how you communicate and resolve disagreements...", isLocked: true },
      { title: "Long-Term Sustainability", preview: "Saturn aspects across both charts indicate the potential for lasting commitment...", isLocked: true },
      { title: "Timing & Practical Advice", preview: "Key windows for relationship milestones based on combined Dasha analysis...", isLocked: true },
    ],
    whoIsItFor: [
      "Couples considering marriage who want Kundli matching beyond just a score",
      "Partners who want to understand their relationship dynamics deeper",
      "Anyone who wants clarity on a specific relationship's potential",
    ],
    sampleInsight: "Your Ashtakoot score of 27/36 tells only part of the story. What makes your connection special is the Venus-Mars cross-aspect: your Venus falls in your partner's Mars sign, and vice versa. This creates a magnetic pull that goes beyond initial attraction — it sustains passion and mutual respect over time. The challenge area is Mercury: your communication styles differ significantly, which may cause misunderstandings during stress.",
    whyNow: "Venus is transiting your 7th house, heightening relationship awareness. Insights from this report will be especially resonant during this transit.",
  },
  "deep-life-pattern": {
    id: "deep-life-pattern",
    title: "Deep Life Pattern",
    subtitle: "Your Dasha Map & Life Themes",
    price: 599,
    icon: "🌀",
    oneLineValue: "Your Dasha map, recurring themes, and life-phase guidance",
    description: "A comprehensive analysis of your Vimshottari Dasha timeline, recurring life themes, karmic patterns, and phase-specific guidance for the next 5-10 years.",
    sections: [
      { title: "Your Dasha Timeline", preview: "You are currently in Moon Mahadasha, Venus Antardasha — a period of emotional depth and creative flowering...", isLocked: false },
      { title: "Life Theme Analysis", preview: "The recurring theme in your chart is the tension between security and freedom...", isLocked: true },
      { title: "Karmic Patterns", preview: "Rahu in the 5th house suggests past-life patterns around creativity and romance that play out in this lifetime...", isLocked: true },
      { title: "Next 5-Year Phase Guide", preview: "The transition from Moon to Mars Mahadasha in 18 months will shift your life energy from emotional to action-oriented...", isLocked: true },
      { title: "Remedies & Integration", preview: "Specific remedies for optimizing each Dasha phase and working with your chart's natural flow...", isLocked: true },
    ],
    whoIsItFor: [
      "You want to understand the larger arc and purpose of your life",
      "You're going through a major life transition and need context",
      "You want to prepare for upcoming Dasha changes",
    ],
    sampleInsight: "Your Moon Mahadasha has been a period of deep emotional processing and inner growth. The Venus Antardasha within it (your current phase) brings out the creative, romantic, and aesthetic dimensions of this emotional journey. You may find yourself drawn to art, beauty, and meaningful relationships in ways that feel new. This is not random — it's your chart activating specific life lessons. The upcoming transition to Mars Mahadasha will shift everything toward action, ambition, and external achievement.",
    whyNow: "You're in the final stretch of your current Antardasha. Understanding the bigger pattern helps you make the most of this phase and prepare for the next one.",
  },
}

export default function ReportDetailPage({ reportId, onBack }: ReportDetailPageProps) {
  const [expandedSection, setExpandedSection] = useState(0)
  const report = REPORTS[reportId] || REPORTS["love-clarity"]

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#F1F0F5]">{report.title}</h1>
            <p className="text-xs text-[#5A6478]">{report.subtitle}</p>
          </div>
          <span className="text-sm font-bold text-[#D4A054]">₹{report.price}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-28">

        {/* Hero */}
        <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-6 text-center">
          <span className="text-4xl mb-3 block">{report.icon}</span>
          <h2 className="text-xl font-bold text-[#F1F0F5] mb-1">{report.title}</h2>
          <p className="text-sm text-[#D4A054] font-medium mb-3">{report.oneLineValue}</p>
          <p className="text-xs text-[#8A8F9E] leading-relaxed">{report.description}</p>
        </div>

        {/* What's Inside */}
        <div>
          <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1 mb-3">What&apos;s Inside</h3>
          <div className="space-y-2">
            {report.sections.map((section, i) => {
              const isExpanded = expandedSection === i
              return (
                <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(isExpanded ? -1 : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-[#D4A054] w-5">{i + 1}</span>
                      <span className="text-sm font-medium text-[#F1F0F5]">{section.title}</span>
                      {section.isLocked && <Lock className="w-3 h-3 text-[#5A6478]" />}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#5A6478] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 pb-4"
                    >
                      <p className={`text-sm leading-relaxed ${section.isLocked ? "text-[#5A6478] blur-[2px] select-none" : "text-[#C5C1D6]"}`}>
                        {section.preview}
                      </p>
                      {section.isLocked && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Lock className="w-3 h-3 text-[#D4A054]" />
                          <span className="text-[10px] text-[#D4A054] font-medium">Purchase report to unlock</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Who This Is For */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#D4A054]" />
            <h3 className="text-sm font-semibold text-[#F1F0F5]">Who This Report Is For</h3>
          </div>
          <div className="space-y-2.5">
            {report.whoIsItFor.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#8A8F9E] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Section */}
        <div className="rounded-xl border border-[#D4A054]/15 bg-[#D4A054]/[0.03] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-[#D4A054]" />
            <h3 className="text-sm font-semibold text-[#D4A054]">Sample Insight</h3>
          </div>
          <p className="text-sm text-[#C5C1D6] leading-relaxed italic">&ldquo;{report.sampleInsight}&rdquo;</p>
        </div>

        {/* Why This Matters Now */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#D4A054]" />
            <h3 className="text-sm font-semibold text-[#F1F0F5]">Why This Matters Now</h3>
          </div>
          <p className="text-xs text-[#8A8F9E] leading-relaxed">{report.whyNow}</p>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-[10px] text-[#8A8F9E] leading-relaxed">
            Generated uniquely for your birth chart. Based on classical Jyotish principles (BPHS). 24-hour refund policy.
          </p>
        </div>
      </div>

      {/* Fixed bottom purchase bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E1A]/95 backdrop-blur-md border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-bold text-[#F1F0F5]">₹{report.price}</p>
            <p className="text-[10px] text-[#5A6478]">One-time purchase</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
            hover:shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-all">
            <Sparkles className="w-4 h-4" />
            Get This Report
          </button>
        </div>
      </div>
    </div>
  )
}
