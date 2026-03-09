"use client"

/* ════════════════════════════════════════════════════════
   Reports Page — /reports

   List generated PDF Kundli reports, generate new ones,
   and download/view existing reports.
   ════════════════════════════════════════════════════════ */

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText, ArrowLeft, Download, Plus, Loader2,
  Calendar, Star, Clock, AlertCircle, ExternalLink,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import AppHeader from "@/components/AppHeader"

// ─── Types ──────────────────────────────────────────────

interface Report {
  id: string
  kundli_id: string
  report_type: string
  file_url: string
  metadata: {
    name: string
    ascendant: string
    moonSign: string
    yogaCount: number
    doshaCount: number
    pages: number
  }
  generated_at: string
}

interface Kundli {
  id: string
  name: string
  birth_date: string
  birth_place: string
  is_primary: boolean
}

// ─── Supabase Client ────────────────────────────────────

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Page Component ─────────────────────────────────────

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [kundlis, setKundlis] = useState<Kundli[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Fetch reports and kundlis in parallel
      const [reportsRes, kundlisRes] = await Promise.all([
        supabase
          .from("reports")
          .select("*")
          .eq("user_id", user.id)
          .order("generated_at", { ascending: false }),
        supabase
          .from("kundlis")
          .select("id, name, birth_date, birth_place, is_primary")
          .eq("user_id", user.id)
          .order("is_primary", { ascending: false }),
      ])

      if (reportsRes.data) setReports(reportsRes.data as Report[])
      if (kundlisRes.data) setKundlis(kundlisRes.data as Kundli[])
    } catch (err) {
      console.error("Failed to fetch reports:", err)
      setError("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ─── Generate Report ────────────────────────────────

  const generateReport = async (kundliId: string) => {
    setGenerating(kundliId)
    setError(null)

    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ kundliId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report")
      }

      // Refresh reports list
      await fetchData()
    } catch (err) {
      console.error("Report generation failed:", err)
      setError(err instanceof Error ? err.message : "Failed to generate report")
    } finally {
      setGenerating(null)
    }
  }

  // ─── Loading State ──────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      <AppHeader />
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-nav h-16 flex items-center px-6">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-text-dim hover:text-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text mb-1">
            Kundli Reports{" "}
            <span className="opacity-40" style={{ fontFamily: "var(--font-devanagari)" }}>
              कुण्डली रिपोर्ट
            </span>
          </h1>
          <p className="text-sm text-text-dim">
            Professional Vedic astrology reports with BPHS references, Dasha analysis, yoga detection, and personalized remedies.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red/20 bg-red/5 p-3 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red flex-shrink-0" />
            <p className="text-xs text-red">{error}</p>
          </motion.div>
        )}

        {/* Generate New Report Section */}
        {kundlis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-saffron" />
              Generate New Report
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {kundlis.map((kundli) => {
                const isGenerating = generating === kundli.id

                return (
                  <button
                    key={kundli.id}
                    onClick={() => generateReport(kundli.id)}
                    disabled={!!generating}
                    className="text-left rounded-xl border border-indigo/15 bg-bg-card/60 p-4 hover:border-saffron/30 hover:bg-saffron/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-text">{kundli.name || "My Chart"}</p>
                          {kundli.is_primary && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-medium">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-dim mt-1">
                          {new Date(kundli.birth_date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {kundli.birth_place && ` · ${kundli.birth_place}`}
                        </p>
                      </div>

                      {isGenerating ? (
                        <Loader2 className="w-5 h-5 text-saffron animate-spin" />
                      ) : (
                        <FileText className="w-5 h-5 text-saffron" />
                      )}
                    </div>

                    <p className="text-[10px] text-saffron mt-2 font-medium">
                      {isGenerating ? "Generating report..." : "Click to generate PDF report"}
                    </p>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* No Kundlis */}
        {kundlis.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-gold/20 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-text mb-1">No Birth Charts Saved</h3>
            <p className="text-xs text-text-dim mb-4">
              Chat with Jyotish Guru and provide your birth details to save a Kundli.
            </p>
            <button
              onClick={() => router.push("/chat?v=astrology")}
              className="px-4 py-2 rounded-xl bg-saffron/15 text-saffron text-sm font-medium hover:bg-saffron/25 transition-colors"
            >
              Go to Jyotish Guru
            </button>
          </div>
        )}

        {/* Previous Reports */}
        {reports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Previous Reports ({reports.length})
            </h2>

            <div className="space-y-3">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-indigo/15 bg-bg-card/60 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Report title */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileText className="w-4 h-4 text-gold flex-shrink-0" />
                        <p className="text-sm font-medium text-text">
                          {report.metadata?.name || "Kundli Report"}
                        </p>
                      </div>

                      {/* Metadata chips */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {report.metadata?.ascendant && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold-light">
                            Asc: {report.metadata.ascendant}
                          </span>
                        )}
                        {report.metadata?.moonSign && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo/15 text-text-dim">
                            Moon: {report.metadata.moonSign}
                          </span>
                        )}
                        {report.metadata?.yogaCount !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green/10 text-green">
                            <Star className="w-2.5 h-2.5 inline mr-0.5" />
                            {report.metadata.yogaCount} Yogas
                          </span>
                        )}
                        {report.metadata?.doshaCount !== undefined && report.metadata.doshaCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red/10 text-red">
                            {report.metadata.doshaCount} Doshas
                          </span>
                        )}
                      </div>

                      {/* Generated date */}
                      <p className="text-[10px] text-text-dim/60 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.generated_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Download button */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-gold text-xs font-medium hover:bg-gold/25 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                      <a
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo/10 text-text-dim text-xs hover:text-text transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Reports Yet */}
        {reports.length === 0 && kundlis.length > 0 && (
          <div className="text-center py-8 text-text-dim">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No reports generated yet</p>
            <p className="text-xs opacity-60 mt-1">
              Generate your first professional Kundli report above
            </p>
          </div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-indigo/10 bg-bg-card/30 p-4"
        >
          <h4 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">
            What&apos;s in the Report?
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Birth Chart (D1)",
              "Navamsa (D9)",
              "Career Chart (D10)",
              "Planetary Positions",
              "Nakshatra Analysis",
              "Dasha Timeline (20yr)",
              "50+ Yoga Detection",
              "Dosha Analysis",
              "12-House Interpretation",
              "Remedies & Mantras",
              "Transit Effects",
              "BPHS References",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gold/50" />
                <span className="text-[11px] text-text-dim">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
