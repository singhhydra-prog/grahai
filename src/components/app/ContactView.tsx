"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Clock, Send, Loader2, Check, ArrowLeft } from "lucide-react"
import { BlurReveal, Reveal } from "@/components/Animations"

interface ContactViewProps {
  onBack: () => void
}

const contactInfo = [
  { icon: <Mail className="h-5 w-5" />, label: "Email", value: "hello@grahai.in", href: "mailto:hello@grahai.in" },
  { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "India", href: null },
  { icon: <Clock className="h-5 w-5" />, label: "Response Time", value: "Within 24 hours", href: null },
]

export default function ContactView({ onBack }: ContactViewProps) {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

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
        <h1 className="text-lg font-bold text-white">Contact</h1>
      </div>

      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal><p className="text-xs font-medium text-amber-400/30 mb-6">Contact</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">Get in <span className="text-amber-400">touch</span></h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-sm text-white/60 mx-auto max-w-lg">
              Have questions about GrahAI? Want to collaborate or provide feedback?
              We'd love to hear from you.
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.04] text-amber-400/50">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-400/45 mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-base text-white transition-colors hover:text-amber-400">{info.value}</a>
                    ) : (
                      <p className="text-base text-white">{info.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <div className="mt-12 rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8">
                <p className="font-hindi text-lg text-amber-400/40 mb-4">
                  आपके ग्रह, आपकी राह
                </p>
                <p className="text-xs text-white/50">
                  Your Planets, Your Path — we're building something meaningful and
                  we value every piece of feedback from our community.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8 lg:p-10">
                {status === "success" ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
                      <Check className="h-8 w-8 text-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent</h3>
                    <p className="text-xs text-white/50 max-w-sm">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-white/60 mb-2 block">Name</label>
                        <input type="text" required value={formState.name}
                          onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                          className="w-full h-12 rounded-xl border border-white/[0.06] bg-[#050810]/60 px-4 text-sm text-white placeholder:text-white/45 transition-all focus:border-amber-400/20 focus:outline-none focus:ring-1 focus:ring-amber-400/10"
                          placeholder="Your name" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-white/60 mb-2 block">Email</label>
                        <input type="email" required value={formState.email}
                          onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                          className="w-full h-12 rounded-xl border border-white/[0.06] bg-[#050810]/60 px-4 text-sm text-white placeholder:text-white/45 transition-all focus:border-amber-400/20 focus:outline-none focus:ring-1 focus:ring-amber-400/10"
                          placeholder="you@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/60 mb-2 block">Subject</label>
                      <input type="text" required value={formState.subject}
                        onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                        className="w-full h-12 rounded-xl border border-white/[0.06] bg-[#050810]/60 px-4 text-sm text-white placeholder:text-white/45 transition-all focus:border-amber-400/20 focus:outline-none focus:ring-1 focus:ring-amber-400/10"
                        placeholder="What's this about?" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/60 mb-2 block">Message</label>
                      <textarea required rows={5} value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        className="w-full rounded-xl border border-white/[0.06] bg-[#050810]/60 px-4 py-3 text-sm text-white placeholder:text-white/45 transition-all focus:border-amber-400/20 focus:outline-none focus:ring-1 focus:ring-amber-400/10 resize-none"
                        placeholder="Tell us more..." />
                    </div>
                    <button type="submit" disabled={status === "loading"}
                      className="group flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 w-full sm:w-auto">
                      {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>Send Message<Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>
                      )}
                    </button>
                    {status === "error" && (
                      <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
