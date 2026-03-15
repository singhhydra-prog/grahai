"use client"

import TermsPage from "@/components/app/legal/TermsPage"

export default function TermsRoute() {
  return <TermsPage onBack={() => window.close()} />
}
