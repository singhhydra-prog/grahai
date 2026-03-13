"use client"

import { motion, AnimatePresence } from "framer-motion"

// ─── Sticky CTA Bar ────────────────────────────
// Slides up from bottom when user scrolls past threshold.
// Used for gentle conversion on report pages, etc.

interface StickyCTAProps {
  visible: boolean
  label: string
  sublabel?: string
  price?: string
  onTap: () => void
}

export default function StickyCTA({
  visible,
  label,
  sublabel,
  price,
  onTap,
}: StickyCTAProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
        >
          <button
            onClick={onTap}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-gold to-gold-dark shadow-lg shadow-gold/10 transition-transform active:scale-[0.98]"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-bg">{label}</p>
              {sublabel && (
                <p className="text-[10px] text-bg/60 mt-0.5">{sublabel}</p>
              )}
            </div>
            {price && (
              <span className="text-sm font-bold text-bg">{price}</span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
