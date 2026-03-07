"use client"

import Link from "next/link"

function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="url(#lgFt)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgFt)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgFt)" />
      <defs>
        <linearGradient id="lgFt" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#C9A24D" /><stop offset="100%" stopColor="#E2C474" /></linearGradient>
        <radialGradient id="sgFt" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#E2C474" /><stop offset="100%" stopColor="#C9A24D" /></radialGradient>
      </defs>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.03] bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <BrandLogo />
              <span className="text-base font-semibold text-text/80">Grah<span className="gold-text">AI</span></span>
            </Link>
            <p className="text-sm text-text-dim/60 leading-relaxed mb-3">
              Ancient Vedic wisdom meets modern AI. Your planets, your path — decoded with precision.
            </p>
            <p className="font-hindi text-xs text-gold/15">
              आपके ग्रह, आपकी राह
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-text-dim/50 mb-5">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link href="/product" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Product</Link>
              <Link href="/pricing" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Pricing</Link>
              <Link href="/about" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">About</Link>
              <Link href="/blog" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Blog</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-text-dim/50 mb-5">Company</h4>
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Sciences */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-text-dim/50 mb-5">Sciences</h4>
            <div className="flex flex-col gap-3">
              <Link href="/product#astrology" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Vedic Astrology</Link>
              <Link href="/product#numerology" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Numerology</Link>
              <Link href="/product#tarot" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Tarot Reading</Link>
              <Link href="/product#vastu" className="text-sm text-text-dim/45 hover:text-gold/60 transition-colors">Vastu Shastra</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.03] flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-[11px] text-text-dim/40">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          <p className="text-[11px] text-text-dim/15">Built with precision. Grounded in tradition.</p>
        </div>
      </div>
    </footer>
  )
}
