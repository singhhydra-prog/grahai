"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Sparkles, ArrowRight, Download, Star } from "lucide-react"

interface PurchaseSuccessProps {
  isOpen: boolean
  onClose: () => void
  type: "subscription" | "report"
  planName?: string
  reportTitle?: string
  downloadUrl?: string
}

export default function PurchaseSuccess({
  isOpen,
  onClose,
  type,
  planName,
  reportTitle,
  downloadUrl,
}: PurchaseSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowConfetti(true), 300)
    } else {
      setShowConfetti(false)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0A0E1A]/95 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#111827] to-[#0A0E1A] p-8 text-center relative overflow-hidden"
          >
            {/* Confetti particles */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ["#D4A054", "#F5D89A", "#4ADE80", "#818CF8", "#F472B6"][i % 5],
                      left: `${10 + Math.random() * 80}%`,
                      top: "-10px",
                    }}
                    initial={{ y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      y: 400 + Math.random() * 200,
                      opacity: 0,
                      rotate: 360 + Math.random() * 360,
                      x: (Math.random() - 0.5) * 100,
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, damping: 15 }}
              className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
                flex items-center justify-center shadow-lg shadow-[#D4A054]/30"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Check className="w-10 h-10 text-[#0A0E1A]" strokeWidth={3} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-[#F1F0F5] mb-2"
            >
              {type === "subscription" ? "Welcome to " + (planName || "Premium") + "!" : "Report Purchased!"}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-[#A0A5B2] mb-6 leading-relaxed"
            >
              {type === "subscription"
                ? "Your premium features are now active. Enjoy deeper insights and unlimited guidance."
                : `Your "${reportTitle || "Report"}" is being generated. This usually takes about 30 seconds.`}
            </motion.p>

            {/* What's unlocked */}
            {type === "subscription" && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 mb-6 text-left"
              >
                {[
                  "Unlimited AI questions",
                  "All compatibility sections",
                  "Full report catalog",
                  "Weekly guidance digest",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#D4A054]" />
                    <span className="text-xs text-[#C5C1D6]">{item}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Report generating animation */}
            {type === "report" && !downloadUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#D4A054]/30 border-t-[#D4A054] animate-spin" />
                  <span className="text-xs text-[#D4A054] font-medium">Generating your report...</span>
                </div>
              </motion.div>
            )}

            {/* Download ready */}
            {type === "report" && downloadUrl && (
              <motion.a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-5 py-3 mb-4 rounded-xl
                  bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400
                  hover:bg-emerald-500/15 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </motion.a>
            )}

            {/* CTA */}
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
                hover:shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-all
                flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {type === "subscription" ? "Start Exploring" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
