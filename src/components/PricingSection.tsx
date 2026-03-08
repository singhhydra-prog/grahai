"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Sparkles, Zap, Crown, Gift } from "lucide-react"
import Link from "next/link"
import {
  PRICING_TIERS, MICRO_TRANSACTIONS,
  detectRegion, getPriceForRegion,
  type Region,
} from "@/lib/geo-pricing"

/* ─── Micro-transaction card ─── */
function MicroCard({ item, region, delay }: { item: typeof MICRO_TRANSACTIONS[0]; region: Region; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 hover:border-gold/10 hover:bg-white/[0.04] transition-all cursor-pointer"
    >
      <span className="text-xl">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/90">{item.name}</p>
        <p className="text-[10px] text-text-dim/40 truncate">{item.description}</p>
      </div>
      <span className="text-xs font-bold text-gold whitespace-nowrap">
        {getPriceForRegion(item, region)}
      </span>
    </motion.div>
  )
}

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [region, setRegion] = useState<Region>("INTL")

  useEffect(() => {
    detectRegion().then(setRegion)
  }, [])

  return (
    <section id="pricing" className="relative py-28 lg:py-36">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-gold/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-gold/60" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold/50">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Choose your{" "}
            <span className="bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
              cosmic path
            </span>
          </h2>
          <p className="text-text-dim/60 text-sm max-w-lg mx-auto">
            Start free. Upgrade when the stars align. Every plan includes classical text references.
          </p>
          {region === "IN" && (
            <p className="text-[10px] text-emerald-400/60 mt-2">
              Prices shown in ₹ for India
            </p>
          )}
        </motion.div>

        {/* Tier cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {PRICING_TIERS.map((tier, i) => {
            const icons = [<Sparkles key="s" className="w-5 h-5" />, <Zap key="z" className="w-5 h-5" />, <Crown key="c" className="w-5 h-5" />]
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-2xl border p-6 transition-all duration-500 ${
                  tier.popular
                    ? "border-gold/30 bg-gold/[0.04] shadow-[0_0_40px_rgba(201,162,77,0.05)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-gold to-amber-500 text-black text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3 text-gold/60">
                  {icons[i]}
                  <span className="text-xs font-medium tracking-wider uppercase text-text-dim/50">
                    {tier.name}
                  </span>
                </div>

                <p className="text-xs text-text-dim/40 mb-4">{tier.description}</p>

                <div className="mb-5">
                  <span className="text-3xl font-bold text-white">
                    {getPriceForRegion(tier, region)}
                  </span>
                  {tier.priceINR > 0 && (
                    <span className="text-xs text-text-dim/40 ml-1">/month</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-text-dim/60">
                      <Check className="w-3.5 h-3.5 text-gold/50 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/chat"
                  className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-r from-gold to-amber-500 text-black hover:from-amber-400 hover:to-gold"
                      : "bg-white/[0.06] text-white/80 hover:bg-white/10 border border-white/[0.06]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Micro-transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Gift className="w-4 h-4 text-purple-400/60" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-purple-400/50">
              One-Time Deep Dives
            </span>
          </div>
          <p className="text-xs text-text-dim/40 mb-4">
            Don&apos;t need a subscription? Unlock individual deep readings at micro prices.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MICRO_TRANSACTIONS.map((item, i) => (
              <MicroCard key={item.id} item={item} region={region} delay={i * 0.05} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
