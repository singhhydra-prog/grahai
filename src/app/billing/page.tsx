"use client"

import dynamic from "next/dynamic"

const BillingHistoryPage = dynamic(
  () => import("@/components/app/BillingHistoryPage"),
  { ssr: false }
)

export default function BillingRoute() {
  return <BillingHistoryPage onBack={() => window.close()} />
}
