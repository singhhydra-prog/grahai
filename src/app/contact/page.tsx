"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Mail, MapPin, Clock, Send, Loader2, Check } from "lucide-react"
import Link from "next/link"

const ease = [0.25, 0.46, 0.45, 0.94] as const

function BlurReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(8px)" }}
      transition={{ duration: 0.85, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="url(#lgC)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgC)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgC)" />
      <defs>
        <linearGradient id="lgC" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#C9A24D" /><stop offset="100%" stopColor="#E2C474" /></linearGradient>
        <radialGradient id="sgC" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#E2C474" /><stop offset="100%" stopColor="#C9A24D" /></radialGradient>
      </defs>
    </svg>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "glass-nav border-b border-white/[0.04]" : ""}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={40} />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">Grah<span className="gold-text">AI</span></span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold/25 font-medium leading-none">Vedic Intelligence</span>
          </div>
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          <Link href="/product" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Product</Link>
          <Link href="/pricing" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Pricing</Link>
          <Link href="/about" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">About</Link>
          <Link href="/#waitlist" className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06]">
            Early Access<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

const contactInfo = [
  { icon: <Mail className="h-5 w-5" />, label: "Email", value: "hello@grahai.in", href: "mailto:hello@grahai.in" },
  { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "India", href: null },
  { icon: <Clock className="h-5 w-5" />, label: "Response Time", value: "Within 24 hours", href: null },
]

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    // Simulate submission
    setTimeout(() => setStatus("success"), 1500)
  }

  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal><p className="text-label text-gold/30 mb-6">Contact</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="heading-section mb-6">Get in <span className="gold-text">touch</span></h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body mx-auto max-w-lg">
              Have questions about GrahAI? Want to collaborate or provide feedback?
              We&apos;d love to hear from you.
            </p>
          </BlurReveal>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-32 lg:pb-48">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {contactInfo.map((info, i) => (
              <Reveal key={info.label} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/10 bg-gold/[0.04] text-gold/50">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-label text-gold/25 mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-base text-text transition-colors hover:text-gold">{info.value}</a>
                    ) : (
                      <p className="text-base text-text">{info.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <div className="mt-12 rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8">
                <p className="font-[family-name:var(--font-devanagari)] text-lg text-gold/20 mb-4">
                  आपके ग्रह, आपकी राह
                </p>
                <p className="text-caption">
                  Your Planets, Your Path — we&apos;re building something meaningful and
                  we value every piece of feedback from our community.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 lg:p-10">
                {status === "success" ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
                      <Check className="h-8 w-8 text-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-text mb-2">Message Sent</h3>
                    <p className="text-caption max-w-sm">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="text-label text-text-dim/40 mb-2 block">Name</label>
                        <input type="text" required value={formState.name}
                          onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                          className="w-full h-12 rounded-xl border border-white/[0.06] bg-bg/60 px-4 text-sm text-text placeholder:text-text-dim/30 transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10"
                          placeholder="Your name" />
                      </div>
                      <div>
                        <label className="text-label text-text-dim/40 mb-2 block">Email</label>
                        <input type="email" required value={formState.email}
                          onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                          className="w-full h-12 rounded-xl border border-white/[0.06] bg-bg/60 px-4 text-sm text-text placeholder:text-text-dim/30 transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10"
                          placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-label text-text-dim/40 mb-2 block">Subject</label>
                      <input type="text" required value={formState.subject}
                        onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                        className="w-full h-12 rounded-xl border border-white/[0.06] bg-bg/60 px-4 text-sm text-text placeholder:text-text-dim/30 transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10"
                        placeholder="What's this about?" />
                    </div>
                    <div>
                      <label className="text-label text-text-dim/40 mb-2 block">Message</label>
                      <textarea required rows={5} value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="w-full rounded-xl border border-white/[0.06] bg-bg/60 px-4 py-3 text-sm text-text placeholder:text-text-dim/30 transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10 resize-none"
                        placeholder="Tell us more..." />
                    </div>
                    <button type="submit" disabled={status === "loading"}
                      className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98] disabled:opacity-50 w-full sm:w-auto">
                      {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>Send Message<Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.03] px-6 lg:px-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2"><BrandLogo size={28} /><span className="text-sm font-medium text-text/40">GrahAI</span></Link>
          <p className="text-[11px] text-text-dim/25">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/product" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Product</Link>
            <Link href="/pricing" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Pricing</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
