"use client"

import { useRouter } from "next/navigation"
import RefundPolicyPage from "@/components/app/legal/RefundPolicyPage"

export default function RefundPolicyRoute() {
  const router = useRouter()
  return <div className="page-enter"><RefundPolicyPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
