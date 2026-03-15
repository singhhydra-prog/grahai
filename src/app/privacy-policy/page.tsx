"use client"

import PrivacyPolicyPage from "@/components/app/legal/PrivacyPolicyPage"

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage onBack={() => window.close()} />
}
