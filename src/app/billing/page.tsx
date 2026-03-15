"use client"

import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const BillingHistoryPage = dynamic(
  () => import("@/components/app/BillingHistoryPage"),
  { ssr: false }
)

export default function BillingRoute() {
  const router = useRouter()
  return <div className="page-enter"><BillingHistoryPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
