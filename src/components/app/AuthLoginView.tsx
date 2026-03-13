"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Sparkles, Mail, Loader2, ArrowRight, Check, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface AuthLoginViewProps {
  onBack: () => void
  onSuccess: () => void
}

export default function AuthLoginView({ onBack, onSuccess }: AuthLoginViewProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const redirect = "/app"

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    setErrorMsg("")

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus("error")
    } else {
      setStatus("sent")
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })
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
        <h1 className="text-lg font-bold text-white">Sign In</h1>
      </div>

      {/* Background */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-indigo/20 blur-[128px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-saffron/10 blur-[96px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto px-6 pt-12"
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-saffron" />
            <span className="text-2xl font-bold text-cosmic-white">
              Grah<span className="text-saffron">AI</span>
            </span>
          </div>
          <h1 className="text-xl font-semibold text-cosmic-white">
            Begin your cosmic journey
          </h1>
          <p className="mt-2 text-sm text-cosmic-white/40">
            Sign in to access personalized Vedic readings
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-indigo/30 bg-navy-light/50 p-8 backdrop-blur-sm">
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-full bg-success/20 p-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-cosmic-white">
                Check your email
              </h2>
              <p className="text-sm text-cosmic-white/50">
                We sent a magic link to{" "}
                <span className="font-medium text-saffron">{email}</span>.
                Click it to sign in.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-saffron/70 transition-colors hover:text-saffron"
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <>
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-indigo/30 bg-cosmic-white/5 py-3.5 text-sm font-medium text-cosmic-white transition-all hover:border-saffron/30 hover:bg-cosmic-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-indigo/20" />
                <span className="text-xs text-cosmic-white/30">or</span>
                <div className="h-px flex-1 bg-indigo/20" />
              </div>

              {/* Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-cosmic-white/60">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmic-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === "error") setStatus("idle")
                      }}
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 pl-11 pr-4 text-cosmic-white placeholder:text-cosmic-white/25 transition-all focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-saffron font-semibold text-deep-space transition-all hover:bg-gold-light disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {status === "error" && errorMsg && (
                  <p className="text-center text-sm text-error">{errorMsg}</p>
                )}
              </form>
            </>
          )}
        </div>

        {/* What you get */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-cosmic-white/30">
          <span>✓ 3 daily AI readings</span>
          <span>✓ Free Kundli</span>
          <span>✓ Daily Horoscope</span>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-cosmic-white/20">
          By signing in, you agree to our{" "}
          <span className="underline hover:text-cosmic-white/40 transition-colors cursor-pointer">Terms of Service</span>
          {" "}and{" "}
          <span className="underline hover:text-cosmic-white/40 transition-colors cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </main>
  )
}
