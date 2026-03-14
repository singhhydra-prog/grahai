"use client"

import { motion } from "framer-motion"

interface ChatBubbleProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export default function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-magenta to-violet text-white rounded-br-md"
            : "glass-card text-text rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        {isStreaming && (
          <span className="inline-flex gap-1 ml-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-magenta/60 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-magenta/60 animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-magenta/60 animate-pulse [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </motion.div>
  )
}
