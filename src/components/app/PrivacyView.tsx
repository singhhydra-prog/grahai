"use client"

import { ArrowLeft } from "lucide-react"
import { BlurReveal } from "@/components/Animations"

interface PrivacyViewProps {
  onBack: () => void
}

export default function PrivacyView({ onBack }: PrivacyViewProps) {
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
        <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
      </div>

      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <BlurReveal><p className="text-xs font-medium text-amber-400/30 mb-6">Legal</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">Privacy <span className="text-amber-400">Policy</span></h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <div className="prose-custom space-y-8 text-white/60 text-[15px] leading-relaxed">
              <p className="text-white/70">Last updated: March 2026</p>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">1. Information We Collect</h2>
                <p>When you use GrahAI, we collect information you provide directly: your name, email address, date and time of birth, and place of birth. This birth data is essential for generating accurate Vedic astrology readings. We also collect usage data such as pages visited and features used to improve our service.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">2. How We Use Your Information</h2>
                <p>Your birth data is used exclusively to calculate your Kundli (birth chart), Dasha periods, planetary transits, and personalized recommendations. We use your email to send magic link authentication, daily insights (if opted in), and important account notifications. We never sell, rent, or trade your personal information to third parties.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">3. Data Storage &amp; Security</h2>
                <p>Your data is stored securely on Supabase (hosted on AWS) with row-level security policies ensuring each user can only access their own data. All communications are encrypted via TLS. Birth data and chart calculations are stored in encrypted JSON format.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">4. Third-Party Services</h2>
                <p>We use the following third-party services: Supabase for authentication and database, Vercel for hosting, Resend for transactional emails, and Razorpay for payment processing. Each provider has their own privacy policy and we encourage you to review them.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">5. Your Rights</h2>
                <p>You can request a copy of your data, correct inaccurate information, or delete your account at any time by contacting us at hello@grahai.in. Upon account deletion, all your birth data, charts, and readings are permanently removed from our systems within 30 days.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">6. Cookies</h2>
                <p>We use essential cookies for authentication and session management only. We do not use tracking cookies or third-party advertising cookies.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-3">7. Contact</h2>
                <p>For privacy-related inquiries, email us at <a href="mailto:hello@grahai.in" className="text-amber-400/60 hover:text-amber-400 transition-colors">hello@grahai.in</a>.</p>
              </div>
            </div>
          </BlurReveal>
        </div>
      </section>
    </main>
  )
}
