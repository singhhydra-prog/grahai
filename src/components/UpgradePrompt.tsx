"use client"

import { motion } from "framer-motion"
import { Lock, Sparkles, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  feature: string
  description: string
  plan?: "graha" | "rishi"
}

export default function UpgradePrompt({ feature, description, plan = "graha" }: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] to-transparent p-8 text-center"
    >
      {/* Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-gold/10 blur-[80px]" />

      <div className="relative z-10">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-gold/10 p-3">
          <Lock className="h-6 w-6 text-gold" />
        </div>

        <h3 className="mb-2 text-lg font-bold text-white">
          Unlock {feature}
        </h3>
        <p className="mb-6 text-sm text-white/60 max-w-sm mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/pricing/checkout?plan=${plan}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gold/90 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to {plan === "graha" ? "Graha ₹499/mo" : "Rishi ₹1,499/mo"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gold/60 hover:text-gold/80 transition-colors"
          >
            Compare Plans
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="h-3 w-3 fill-gold/40 text-gold/40" />
          ))}
          <span className="ml-1 text-[11px] text-white/40">Trusted by 50,000+ users</span>
        </div>
      </div>
    </motion.div>
  )
}
