"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  Trash2,
  Crown,
  ChevronRight,
  Info,
  User,
  LogOut,
  FileText,
  Lock,
  Mail,
  Edit3,
  Check,
  X,
  Loader2,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

type OverlayType = "kundli" | "daily" | "pricing" | "compatibility" | "onboarding" | "dashboard" | "horoscope" | "reports-detail" | "settings" | "blog" | "chat" | "astrologer" | "checkout" | "auth-login" | "about" | "contact" | "product" | "privacy" | "terms" | "blog-post" | "refer-earn" | null

export default function SettingsView({
  onBack,
  onUpgrade,
  onShowOverlay,
}: {
  onBack: () => void
  onUpgrade: () => void
  onShowOverlay?: (o: OverlayType) => void
}) {
  const [userEmail, setUserEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [notificationDaily, setNotificationDaily] = useState(true)
  const [notificationTransit, setNotificationTransit] = useState(true)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
      if (user) {
        // Try to get name from profile or metadata
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          ""
        setUserName(displayName)
        setNameInput(displayName)
      }
    }
    getUser()
  }, [])

  const handleSaveName = async () => {
    if (!nameInput.trim()) return
    setSavingName(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.updateUser({
        data: { full_name: nameInput.trim() },
      })
      setUserName(nameInput.trim())
      setEditingName(false)
    } catch {
      // silently fail
    }
    setSavingName(false)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
      window.location.href = "/app"
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      {/* Content */}
      <div className="pb-24">
        {/* Profile Section */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white/90">Profile</h2>
          </div>
          <div className="space-y-3">
            {/* Name */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-white/50 mb-1">Display Name</p>
              {editingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
                    placeholder="Your name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="p-2 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors"
                  >
                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNameInput(userName) }}
                    className="p-2 rounded-lg bg-white/[0.06] text-white/50 hover:bg-white/[0.1] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{userName || "Not set"}</p>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-white/40" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-white/50 mb-1">Email Address</p>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/30" />
                <p className="text-sm font-medium text-white">
                  {userEmail || "Loading..."}
                </p>
              </div>
            </div>

            {/* Plan */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 mb-1">Plan Status</p>
                  <p className="text-sm font-medium text-white">Free Plan</p>
                </div>
                <button
                  onClick={onUpgrade}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                >
                  <Crown className="w-3 h-3" />
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white/90">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Daily Horoscope</p>
                <p className="text-xs text-white/50 mt-0.5">Get your daily insights at 9 AM</p>
              </div>
              <button
                onClick={() => setNotificationDaily(!notificationDaily)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  notificationDaily ? "bg-amber-500/30" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform mt-0.5 ${
                    notificationDaily ? "translate-x-5 bg-amber-400" : "translate-x-0.5 bg-white/40"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Transit Alerts</p>
                <p className="text-xs text-white/50 mt-0.5">Important planetary transit notifications</p>
              </div>
              <button
                onClick={() => setNotificationTransit(!notificationTransit)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  notificationTransit ? "bg-amber-500/30" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-transform mt-0.5 ${
                    notificationTransit ? "translate-x-5 bg-amber-400" : "translate-x-0.5 bg-white/40"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white/90">Language</h2>
          </div>
          <div className="flex gap-3">
            {[
              { code: "en" as const, label: "English", flag: "🇺🇸" },
              { code: "hi" as const, label: "हिंदी", flag: "🇮🇳" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 p-4 rounded-xl border transition-colors flex flex-col items-center gap-2 ${
                  language === lang.code
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1]"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-xs font-medium text-white/90">{lang.label}</span>
                {language === lang.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legal & Info Links */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-white/90">Legal & Info</h2>
          </div>
          <div className="space-y-1">
            {[
              { icon: <Lock className="w-4 h-4 text-white/40" />, label: "Privacy Policy", overlay: "privacy" as OverlayType },
              { icon: <FileText className="w-4 h-4 text-white/40" />, label: "Terms of Service", overlay: "terms" as OverlayType },
              { icon: <Info className="w-4 h-4 text-white/40" />, label: "About GrahAI", overlay: "about" as OverlayType },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onShowOverlay?.(item.overlay)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                {item.icon}
                <span className="text-sm text-white/70 flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50">App Version</p>
              <p className="text-xs font-medium text-white/70">1.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/40">Made with ❤️ in India</p>
              <p className="text-[11px] text-white/30">No Fluff. Accurate Guidance. Clear Answers.</p>
            </div>
          </div>
        </div>

        {/* Logout & Danger Zone */}
        <div className="px-4 py-6 border-t border-white/[0.06] space-y-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors flex items-center gap-3"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 text-white/50" />
            )}
            <span className="text-sm font-medium text-white/70">Sign Out</span>
          </button>

          <button
            onClick={() => {
              alert("Delete account feature coming soon. Please contact support.")
            }}
            className="w-full p-4 rounded-xl bg-red-500/5 border border-red-500/15 hover:border-red-500/30 transition-colors flex items-center gap-3 text-left group"
          >
            <Trash2 className="w-4 h-4 text-red-400/60 group-hover:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400/70 group-hover:text-red-400">Delete Account</p>
              <p className="text-[11px] text-red-400/40 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/20" />
          </button>
        </div>
      </div>
    </div>
  )
}
