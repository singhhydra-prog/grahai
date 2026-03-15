"use client"

import { useRouter } from "next/navigation"
import PrivacyPolicyPage from "@/components/app/legal/PrivacyPolicyPage"

export default function PrivacyPolicyRoute() {
  const router = useRouter()
  return <PrivacyPolicyPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
