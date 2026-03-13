"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { AstroSource } from "@/types/app"

// ─── Source Drawer ─────────────────────────────
// Bottom sheet showing the astrological sources behind
// any insight. Builds trust through transparency.

interface SourceDrawerProps {
  isOpen: boolean
  sources: AstroSource[]
  onClose: () => void
}

const CONFIDENCE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-green/10", text: "text-green", label: "Strong" },
  medium: { bg: "bg-saffron/10", text: "text-saffron", label: "Moderate" },
  low: { bg: "bg-text-dim/10", text: "text-text-dim", label: "Exploratory" },
}

export default function SourceDrawer({ isOpen, sources, onClose }: SourceDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] rounded-t-3xl bg-bg-card border-t border-white/[0.06] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-text">Sources & Reasoning</h3>
              <p className="text-[11px] text-text-dim/60 mt-0.5">
                How we arrived at this insight
              </p>
            </div>

            {/* Source list */}
            <div className="overflow-y-auto max-h-[calc(70vh-100px)] p-5 space-y-4">
              {sources.map((source, i) => {
                const conf = source.confidence
                  ? CONFIDENCE_BADGE[source.confidence]
                  : null

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-text">{source.label}</h4>
                      {conf && (
                        <span className={`text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>
                          {conf.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-dim/70 mb-1">{source.system}</p>
                    {source.reference && (
                      <p className="text-[10px] text-text-dim/40 font-mono">
                        {source.reference}
                      </p>
                    )}
                  </div>
                )
              })}

              {sources.length === 0 && (
                <p className="text-xs text-text-dim/50 text-center py-8">
                  No sources available for this insight.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
