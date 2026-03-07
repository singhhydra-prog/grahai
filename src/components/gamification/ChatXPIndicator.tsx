"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

interface ChatXPIndicatorProps {
  xpEarned: number
  show: boolean
  onComplete?: () => void
}

export function ChatXPIndicator({ xpEarned, show, onComplete }: ChatXPIndicatorProps) {
  return (
    <AnimatePresence>
      {show && xpEarned > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={() => onComplete?.()}
          className="fixed bottom-24 right-6 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-saffron/20 border border-saffron/40 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-saffron" />
            <span className="text-sm font-bold text-saffron">+{xpEarned} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
