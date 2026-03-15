"use client"

import FAQPage from "@/components/app/legal/FAQPage"

export default function FAQRoute() {
  return <FAQPage onBack={() => window.close()} />
}
