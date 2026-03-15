"use client"

import { Shield, FileText, AlertTriangle, CreditCard, HelpCircle, MessageCircle } from "lucide-react"

const LEGAL_LINKS = [
  { icon: AlertTriangle, label: "Disclaimer", href: "/disclaimer" },
  { icon: FileText, label: "Terms & Conditions", href: "/terms" },
  { icon: Shield, label: "Privacy Policy", href: "/privacy-policy" },
  { icon: CreditCard, label: "Cancellation & Refund", href: "/refund-policy" },
  { icon: HelpCircle, label: "FAQ", href: "/faq" },
  { icon: MessageCircle, label: "Support", href: "/support" },
]

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0A0E1A]/80 backdrop-blur-sm px-5 py-6 pb-28">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
          {LEGAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#8892A3]/70 hover:text-[#D4A054] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-[#8892A3]/40 text-center">
          &copy; {new Date().getFullYear()} GrahAI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export { LEGAL_LINKS }
