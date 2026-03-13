"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

// ─── Question Input ────────────────────────────
// The primary ask input. Used in HomeTab and AskTab.
// Auto-growing textarea, send button, placeholder rotation.

interface QuestionInputProps {
  onSubmit: (question: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  compact?: boolean
  className?: string
}

const PLACEHOLDERS = [
  "What should I focus on this week?",
  "Is this a good time to change jobs?",
  "Why do I keep facing delays?",
  "What does Saturn's transit mean for me?",
  "How is my relationship looking ahead?",
]

export default function QuestionInput({
  onSubmit,
  placeholder,
  disabled = false,
  autoFocus = false,
  compact = false,
  className = "",
}: QuestionInputProps) {
  const [value, setValue] = useState("")
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Rotate placeholders
  useEffect(() => {
    if (placeholder) return // skip rotation if custom placeholder
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [placeholder])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 120) + "px"
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`
        flex items-end gap-2 rounded-2xl border border-white/[0.06]
        bg-bg-card/50 backdrop-blur-sm transition-all duration-200
        focus-within:border-gold/20 focus-within:shadow-[0_0_0_3px_rgba(201,162,77,0.06)]
        ${compact ? "p-2.5" : "p-3"}
      `}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || PLACEHOLDERS[placeholderIdx]}
          disabled={disabled}
          autoFocus={autoFocus}
          rows={1}
          className={`
            flex-1 bg-transparent resize-none text-text placeholder:text-text-dim/30
            focus:outline-none leading-relaxed
            ${compact ? "text-sm" : "text-sm"}
          `}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={`
            shrink-0 rounded-xl flex items-center justify-center transition-all
            ${value.trim()
              ? "bg-gold text-bg"
              : "bg-white/[0.04] text-text-dim/30"
            }
            ${compact ? "w-8 h-8" : "w-9 h-9"}
          `}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
