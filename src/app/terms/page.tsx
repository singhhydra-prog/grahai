"use client"

import { useRouter } from "next/navigation"
import TermsPage from "@/components/app/legal/TermsPage"

export default function TermsRoute() {
  const router = useRouter()
  return <TermsPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
