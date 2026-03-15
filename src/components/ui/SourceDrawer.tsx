"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Quote } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

interface SourceData {
  principle: string
  text: string
  reference: string
}

interface SourceDrawerProps {
  isOpen: boolean
  onClose: () => void
  source: SourceData | null
  context?: string
}

export default function SourceDrawer({ isOpen, onClose, source, context }: SourceDrawerProps) {
  const { t } = useLanguage()
  return (
    <AnimatePresence>
      {isOpen && source && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] overflow-y-auto
              rounded-t-3xl bg-[#0D1220] border-t border-[#1E293B]"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#1E293B]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4A054]/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#D4A054]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F1F0F5]">{t.source.whyGrahaiSays || "Why GrahAI says this"}</h3>
                  <p className="text-[10px] text-[#8892A3]">{t.source.sourceBackedReasoning || "Source-backed reasoning"}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E2638] border border-[#1E293B]
                  flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#8892A3]" />
              </button>
            </div>

            <div className="px-5 pb-8 space-y-4">
              {/* Active principle */}
              <div className="bg-[#111827] border border-[#D4A054]/15 rounded-xl p-4">
                <p className="text-[10px] font-medium text-[#D4A054] uppercase tracking-wider mb-2">
                  {t.source.activePrinciple || "Active Principle"}
                </p>
                <p className="text-sm font-medium text-[#F1F0F5] leading-relaxed">
                  {source.principle}
                </p>
              </div>

              {/* Explanation */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <p className="text-[10px] font-medium text-[#ACB8C4] uppercase tracking-wider mb-2">
                  {t.source.explanation || "Explanation"}
                </p>
                <p className="text-sm text-[#ACB8C4] leading-relaxed">
                  {source.text}
                </p>
              </div>

              {/* Classical reference */}
              <div className="flex items-start gap-3 bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-4">
                <Quote className="w-4 h-4 text-[#D4A054]/50 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8892A3] italic leading-relaxed">
                    {source.reference}
                  </p>
                </div>
              </div>

              {/* Context (what the user saw) */}
              {context && (
                <div className="pt-2 border-t border-[#1E293B]">
                  <p className="text-[10px] text-[#8892A3] mb-1">{t.source.shownBecause || "This was shown because:"}</p>
                  <p className="text-xs text-[#ACB8C4]">{context}</p>
                </div>
              )}

              {/* Trust footer */}
              <div className="text-center pt-2">
                <p className="text-[10px] text-[#8892A3]">
                  {t.source.groundsInsight || "GrahAI grounds every insight in classical Jyotish tradition"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
