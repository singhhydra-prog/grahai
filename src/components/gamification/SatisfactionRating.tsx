"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X } from "lucide-react"

interface SatisfactionRatingProps {
  show: boolean
  onRate: (rating: number) => void
  onDismiss: () => void
}

export function SatisfactionRating({ show, onRate, onDismiss }: SatisfactionRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleRate = (rating: number) => {
    setSelectedStar(rating)
    setSubmitted(true)
    onRate(rating)
    setTimeout(() => {
      onDismiss()
      setSubmitted(false)
      setSelectedStar(0)
    }, 2000)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="rounded-2xl border border-indigo/30 bg-navy-light/90 backdrop-blur-xl p-5 shadow-2xl shadow-deep-space/50 min-w-[280px]">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-cosmic-white">How was this reading?</p>
                  <button onClick={onDismiss} className="text-cosmic-white/30 hover:text-cosmic-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleRate(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredStar || selectedStar)
                            ? "text-saffron fill-saffron"
                            : "text-cosmic-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-cosmic-white/30 text-center mt-2">Rate to earn bonus XP</p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
              >
                <p className="text-sm text-saffron font-medium">Thank you! +{selectedStar * 5} XP</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
