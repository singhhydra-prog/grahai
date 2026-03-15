"use client"

import { useState } from "react"
import {
  ArrowLeft, CreditCard, Download, Receipt, Calendar,
  CheckCircle, Clock, XCircle, Crown, ChevronRight
} from "lucide-react"

/* ── Types ── */
interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: "success" | "pending" | "failed" | "refunded"
  type: "subscription" | "one-time"
  receiptUrl?: string
}

interface BillingHistoryPageProps {
  onBack: () => void
}

const STATUS_CONFIG = {
  success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Paid" },
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pending" },
  failed: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", label: "Failed" },
  refunded: { icon: Receipt, color: "text-blue-400", bg: "bg-blue-500/10", label: "Refunded" },
}

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN001", date: "2026-03-10", description: "Graha Plan — Monthly", amount: 199, status: "success", type: "subscription", receiptUrl: "#" },
  { id: "TXN002", date: "2026-03-05", description: "Love Clarity Report", amount: 299, status: "success", type: "one-time", receiptUrl: "#" },
  { id: "TXN003", date: "2026-02-10", description: "Graha Plan — Monthly", amount: 199, status: "success", type: "subscription", receiptUrl: "#" },
  { id: "TXN004", date: "2026-02-02", description: "Career Timing Report", amount: 299, status: "refunded", type: "one-time" },
  { id: "TXN005", date: "2026-01-10", description: "Graha Plan — Monthly", amount: 199, status: "success", type: "subscription", receiptUrl: "#" },
]

export default function BillingHistoryPage({ onBack }: BillingHistoryPageProps) {
  const [filter, setFilter] = useState<"all" | "subscription" | "one-time">("all")

  const filtered = MOCK_TRANSACTIONS.filter((t) =>
    filter === "all" ? true : t.type === filter
  )

  const totalSpent = MOCK_TRANSACTIONS.filter((t) => t.status === "success").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#F1F0F5]">Billing & Invoices</h1>
            <p className="text-xs text-[#8892A3]">Your payment history</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5 pb-12">

        {/* Current Plan */}
        <div className="rounded-2xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A054]/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#D4A054]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F1F0F5]">Graha Plan</p>
                <p className="text-xs text-[#A0A5B2]">₹199/month — Renews April 10</p>
              </div>
            </div>
            <button className="text-xs text-[#D4A054] font-medium hover:underline">Manage</button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <p className="text-xs text-[#8892A3] mb-1">Total Spent</p>
            <p className="text-lg font-bold text-[#F1F0F5]">₹{totalSpent}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <p className="text-xs text-[#8892A3] mb-1">Transactions</p>
            <p className="text-lg font-bold text-[#F1F0F5]">{MOCK_TRANSACTIONS.length}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {([
            { id: "all" as const, label: "All" },
            { id: "subscription" as const, label: "Subscriptions" },
            { id: "one-time" as const, label: "Reports" },
          ]).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === f.id
                  ? "border-[#D4A054]/30 bg-[#D4A054]/10 text-[#D4A054]"
                  : "border-white/5 bg-white/[0.02] text-[#A0A5B2]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 text-[#8892A3]/30 mx-auto mb-3" />
              <p className="text-sm text-[#8892A3]">No transactions found</p>
            </div>
          ) : (
            filtered.map((txn) => {
              const status = STATUS_CONFIG[txn.status]
              const StatusIcon = status.icon
              return (
                <div key={txn.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F1F0F5]">{txn.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#8892A3]">
                            <Calendar className="w-3 h-3 inline mr-0.5" />
                            {new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${txn.status === "refunded" ? "text-blue-400 line-through" : "text-[#F1F0F5]"}`}>
                        ₹{txn.amount}
                      </p>
                      {txn.receiptUrl && (
                        <button className="text-[10px] text-[#D4A054] font-medium flex items-center gap-0.5 mt-1">
                          <Download className="w-3 h-3" /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Refund policy link */}
        <button
          onClick={() => window.open("/refund-policy", "_blank")}
          className="w-full flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
        >
          <span className="text-xs text-[#A0A5B2]">View Cancellation & Refund Policy</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8892A3]" />
        </button>
      </div>
    </div>
  )
}
