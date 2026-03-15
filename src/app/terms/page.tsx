"use client"

import { useRouter } from "next/navigation"
import TermsPage from "@/components/app/legal/TermsPage"

export default function TermsRoute() {
  const router = useRouter()
  return <div className="page-enter"><TermsPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
