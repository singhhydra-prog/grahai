"use client"

import { useState } from "react"
import {
  ArrowLeft, Mail, MessageCircle, Clock, Send,
  AlertCircle, CreditCard, Bug, HelpCircle, Sparkles
} from "lucide-react"

const SUPPORT_CATEGORIES = [
  { id: "general", label: "General Question", icon: HelpCircle },
  { id: "billing", label: "Billing & Subscription", icon: CreditCard },
  { id: "bug", label: "Report a Bug", icon: Bug },
  { id: "feature", label: "Feature Request", icon: Sparkles },
  { id: "account", label: "Account Issue", icon: AlertCircle },
]

interface SupportPageProps {
  onBack: () => void
}

export default function SupportPage({ onBack }: SupportPageProps) {
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = category && message.trim().length >= 10 && email.trim().includes("@")

  const handleSubmit = () => {
    if (!canSubmit) return
    // Will connect to support API
    setSubmitted(true)
  }

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#F1F0F5]">Support</h1>
            <p className="text-xs text-[#8892A3]">We&apos;re here to help</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-6 pb-12">

        {!submitted ? (
          <>
            {/* Quick contact info */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#D4A054]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F1F0F5]">Email us directly</p>
                  <a
                    href="mailto:support@grahai.app"
                    className="text-xs text-[#D4A054] hover:underline"
                  >
                    support@grahai.app
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D4A054]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F1F0F5]">Response time</p>
                  <p className="text-xs text-[#A0A5B2]">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Support form */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#A0A5B2] uppercase tracking-wider">
                Send us a message
              </h2>

              {/* Category selection */}
              <div>
                <label className="text-xs text-[#A0A5B2] mb-2 block">What is this about?</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORT_CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-medium
                          transition-all border ${
                          isSelected
                            ? "border-[#D4A054]/40 bg-[#D4A054]/10 text-[#D4A054]"
                            : "border-white/5 bg-white/[0.02] text-[#A0A5B2] hover:border-white/10"
                        }`}
                      >
                        <CatIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-[#A0A5B2] mb-1.5 block">Your email</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <Mail className="w-4 h-4 text-[#D4A054]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#8892A3] outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs text-[#A0A5B2] mb-1.5 block">Your message</label>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    className="w-full bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#8892A3]
                      outline-none resize-none leading-relaxed"
                  />
                </div>
                <p className="text-[10px] text-[#8892A3] mt-1">
                  {message.length < 10 ? `At least ${10 - message.length} more characters needed` : "Good to go!"}
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                  transition-all duration-300
                  bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
                  hover:shadow-[0_0_20px_rgba(212,160,84,0.3)]
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>

            {/* FAQ link */}
            <div className="text-center">
              <p className="text-xs text-[#8892A3] mb-2">
                Looking for quick answers?
              </p>
              <button
                onClick={() => window.open("/faq", "_blank")}
                className="text-xs text-[#D4A054] font-medium hover:underline"
              >
                Check our FAQ →
              </button>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-[#F1F0F5] mb-2">Message Sent!</h2>
            <p className="text-sm text-[#A0A5B2] max-w-[280px] mb-6">
              Thank you for reaching out. We&apos;ll get back to you at <span className="text-[#D4A054]">{email}</span> within 24 hours.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-[#D4A054]
                border border-[#D4A054]/20 hover:border-[#D4A054]/40 hover:bg-[#D4A054]/5 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
