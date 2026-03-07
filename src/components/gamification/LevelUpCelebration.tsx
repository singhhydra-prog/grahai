"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getLevelTitle } from "@/lib/gamification/engine"

interface LevelUpCelebrationProps {
  show: boolean
  newLevel: number
  onComplete: () => void
}

export function LevelUpCelebration({ show, newLevel, onComplete }: LevelUpCelebrationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

  useEffect(() => {
    if (show) {
      // Generate random particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      // Auto dismiss after 3s
      const timer = setTimeout(onComplete, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-space/80 backdrop-blur-sm"
          onClick={onComplete}
        >
          {/* Particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                x: `${50}vw`,
                y: `${50}vh`,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: `${p.x}vw`,
                y: `${p.y}vh`,
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full bg-saffron"
            />
          ))}

          {/* Central content */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="text-center z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-bold text-cosmic-white mb-2">Level Up!</h2>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-6xl font-bold text-saffron">{newLevel}</span>
            </div>
            <p className="text-lg text-cosmic-white/60">{getLevelTitle(newLevel)}</p>
            <p className="text-sm text-cosmic-white/30 mt-2">Tap to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
