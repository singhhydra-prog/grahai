"use client"

import { useRouter } from "next/navigation"
import RefundPolicyPage from "@/components/app/legal/RefundPolicyPage"

export default function RefundPolicyRoute() {
  const router = useRouter()
  return <RefundPolicyPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
