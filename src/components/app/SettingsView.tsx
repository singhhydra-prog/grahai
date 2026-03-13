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
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export default function SettingsView({
  onBack,
  onUpgrade,
}: {
  onBack: () => void
  onUpgrade: () => void
}) {
  const [userEmail, setUserEmail] = useState<string>("")
  const [notificationDaily, setNotificationDaily] = useState(true)
  const [notificationTransit, setNotificationTransit] = useState(true)
  const [language, setLanguage] = useState<"en" | "hi">("en")

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
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-[#060A14] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#060A14]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <h1 className="text-lg font-bold flex-1">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {/* Account Section */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white/90">Account</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-white/50 mb-1">Email Address</p>
              <p className="text-sm font-medium text-white">
                {userEmail || "Loading..."}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
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
            {/* Daily Horoscope Toggle */}
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Daily Horoscope</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Get your daily insights at 9 AM
                </p>
              </div>
              <button
                onClick={() => setNotificationDaily(!notificationDaily)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  notificationDaily ? "bg-amber-500/30" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-amber-400 transition-transform ${
                    notificationDaily ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Transit Alerts Toggle */}
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Transit Alerts</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Notifications for important planetary transits
                </p>
              </div>
              <button
                onClick={() => setNotificationTransit(!notificationTransit)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  notificationTransit ? "bg-amber-500/30" : "bg-white/[0.1]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-amber-400 transition-transform ${
                    notificationTransit ? "translate-x-5" : "translate-x-0.5"
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
          <div className="space-y-2">
            {[
              { code: "en" as const, label: "English", flag: "🇺🇸" },
              { code: "hi" as const, label: "हिंदी", flag: "🇮🇳" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                  language === lang.code
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1]"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium flex-1 text-left text-white/90">
                  {lang.label}
                </span>
                {language === lang.code && (
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-white/90">About</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-white/50 mb-1">App Version</p>
              <p className="text-sm font-medium text-white">1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-white/50 mb-2">Credits</p>
              <div className="space-y-1.5">
                <p className="text-xs text-white/70">
                  Made with ❤️ in India
                </p>
                <p className="text-xs text-white/60">
                  No Fluff. Accurate Guidance.
                </p>
                <p className="text-xs text-white/60">
                  Clear Answers. Confident Decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-white/90">Danger Zone</h2>
          </div>
          <button
            onClick={() => {
              alert(
                "Delete account feature coming soon. For now, please contact support."
              )
            }}
            className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors flex items-center gap-3 text-left group"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400 group-hover:text-red-300">
                Delete Account
              </p>
              <p className="text-xs text-red-400/60 mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/40" />
          </button>
        </div>
      </div>
    </div>
  )
}
