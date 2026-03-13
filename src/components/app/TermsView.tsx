"use client"

import { ArrowLeft } from "lucide-react"
import { BlurReveal } from "@/components/Animations"

interface TermsViewProps {
  onBack: () => void
}

export default function TermsView({ onBack }: TermsViewProps) {
  return (
    <main className="min-h-screen bg-[#050810]">
      {/* Back button header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Terms of Service</h1>
      </div>

      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <BlurReveal><p className="text-xs font-medium text-amber-400/30 mb-6">Legal</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">Terms of <span className="text-amber-400">Service</span></h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <div className="prose-custom space-y-8 text-white/60 text-[15px] leading-relaxed">
              <p className="text-white/70">Last updated: March 2026</p>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using GrahAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">2. Service Description</h2>
                <p>GrahAI is an AI-powered Vedic astrology platform that provides personalized birth chart analysis, Dasha predictions, yoga and dosha analysis, numerology readings, tarot guidance, and Vastu consultations. Our calculations are based on the Swiss Ephemeris for astronomical precision and classical Sanskrit texts including Brihat Parashara Hora Shastra (BPHS).</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">3. Disclaimer</h2>
                <p>GrahAI provides astrological insights for informational and entertainment purposes only. Our readings should not be considered a substitute for professional medical, legal, financial, or psychological advice. Astrology is a belief system and not a scientifically proven method of prediction. You are responsible for any decisions you make based on the information provided.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">4. User Accounts</h2>
                <p>You must provide accurate birth data for meaningful astrological readings. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to create an account.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">5. Subscriptions &amp; Payments</h2>
                <p>Premium features require a paid subscription processed through Razorpay. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are available within 7 days of purchase if you have not generated any premium reports during that period.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">6. Intellectual Property</h2>
                <p>All content, designs, algorithms, and code on GrahAI are owned by GrahAI or its licensors. You may not reproduce, distribute, or create derivative works without written permission. Your generated reports and readings are yours to keep and share.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">7. Limitation of Liability</h2>
                <p>GrahAI is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the service, including decisions made based on astrological readings.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">8. Contact</h2>
                <p>Questions about these terms? Email us at <a href="mailto:hello@grahai.in" className="text-amber-400/60 hover:text-amber-400 transition-colors">hello@grahai.in</a>.</p>
              </div>
            </div>
          </BlurReveal>
        </div>
      </section>
    </main>
  )
}
