"use client"

import SupportPage from "@/components/app/legal/SupportPage"

export default function SupportRoute() {
  return <SupportPage onBack={() => window.close()} />
}
