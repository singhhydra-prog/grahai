"use client"

import RefundPolicyPage from "@/components/app/legal/RefundPolicyPage"

export default function RefundPolicyRoute() {
  return <RefundPolicyPage onBack={() => window.close()} />
}
