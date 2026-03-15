"use client"

import { motion } from "framer-motion"
import { ArrowLeft, FileText } from "lucide-react"

interface TermsPageProps {
  onBack: () => void
}

export default function TermsPage({ onBack }: TermsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="min-h-screen bg-[#0A0E1A] text-[#F1F0F5] pb-28"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition">
          <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
        </button>
        <h1 className="text-lg font-semibold text-[#D4A054]">Terms &amp; Conditions</h1>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A054]/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#D4A054]" />
          </div>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-[#D1D5DB]">

          <p className="text-xs text-[#9CA3AF]">
            This Terms and Conditions is drafted in conformity with the Information Technology (Intermediaries Guidelines) Rules, 2011 specified under the Information Technology Act, 2000, the General Data Protection Rules, 2016 etc., in order to regulate the terms and conditions of usage and access to the Platform and the Services.
          </p>

          <p>
            These Terms and Conditions (&quot;T&amp;C&quot;) is an agreement between you (&quot;You&quot;, &quot;Your&quot; and &quot;User&quot;) and GrahAI (&quot;GrahAI&quot;, &quot;We&quot;, &quot;Us&quot; and &quot;Our&quot;). These T&amp;C will govern your use of grahai-app.vercel.app, including any other website, media channel, mobile website or mobile application related, linked or otherwise connected thereto (&quot;Platform&quot;), which is owned by us.
          </p>

          {/* Acceptance */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Acceptance of the T&amp;C</h3>
            <p className="text-xs text-[#9CA3AF]">
              For you to accept these T&amp;C, you shall be (i) of majority age (18 and above or as may be the age of majority in your jurisdiction), (ii) you will only have one account with us which must be in your real name and details as required by us, and (iii) you are not already restricted by us from using the Services. These T&amp;C are subject to modifications at our sole and absolute discretion. Your continued use of the Services after any changes constitutes your acceptance of the updated T&amp;C. If the T&amp;C are not acceptable to you, you have the right to terminate your Account by writing to us at support@grahai.app.
            </p>
          </div>

          {/* Description of Services */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Description of Services</h3>
            <p className="text-xs text-[#9CA3AF]">
              Our Services are designed to create automated informational readings about you based on astrological positions. Our Services are intended to provide helpful and informative materials pertaining to astrology for your personal guidance only. GrahAI does not render psychological, health, or any other kind of personal professional services. If you require personal professional assistance or advice, we recommend consulting a competent professional. GrahAI expressly disclaims all responsibilities for any liability, loss or risk incurred as a consequence of availing our Services. You agree to assume full responsibility for any actions you take based on or related to your use of our Services.
            </p>
          </div>

          {/* Representations */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Representations &amp; Warranties</h3>
            <p className="text-xs text-[#9CA3AF]">
              You represent and warrant that: you have the legal capacity and agree to comply with these T&amp;C; all information you submit is true and accurate; your use of the Services is not unlawful under any applicable law; you are at least 18 years old or of legal age to use the service; you have the mental and physical capacity to consent to this electronic contract. If you provide information that is untrue, inaccurate, or incomplete, we have the right to suspend or terminate your Account.
            </p>
          </div>

          {/* Registration */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Registration &amp; Onboarding</h3>
            <p className="text-xs text-[#9CA3AF]">
              The Platform offers &quot;Free Services&quot; and &quot;Paid Services&quot; (collectively &quot;Services&quot;). Free Services are easily accessible without subscription. For personalized astrological services and Paid Services, you are required to register as a member on the Platform. You will be provided with only one Account in your real name. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your Account. You can disable your Account by writing to us at support@grahai.app.
            </p>
          </div>

          {/* License */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">License to the Platform</h3>
            <p className="text-xs text-[#9CA3AF]">
              Subject to your compliance with these Policies, GrahAI grants you a limited, non-commercial, revocable, personal, non-sub-licensable, non-transferable, non-exclusive right to access and use the Platform. You shall under no circumstances share the access of the Platform with anyone else. Except the rights provided under these T&amp;C, you shall not be entitled to any other rights or interest in the use of the Platform or Services.
            </p>
          </div>

          {/* Service Fee */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Service Fee &amp; Payments</h3>
            <p className="text-xs text-[#9CA3AF]">
              Pursuant to your subscription to Paid Services, you will be liable to pay such fees as communicated on the Platform. Payments shall be made via available means including credit card, debit card, net banking, UPI wallets, etc. You agree that the debit/credit card details provided by you must be correct and accurate and that you shall not use a card that is not lawfully owned by you. All payments made against the Services shall be in Indian Rupees or United States Dollars as applicable.
            </p>
          </div>

          {/* Platform Content */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Platform Content &amp; IP</h3>
            <p className="text-xs text-[#9CA3AF]">
              Unless otherwise indicated, the Platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (&quot;Content&quot;) and trademarks, service marks, and logos (&quot;Marks&quot;) are owned or controlled by us and are protected by copyright and trademark laws. The Platform and Content shall not be reverse-engineered, decompiled, reproduced, or redistributed for any commercial purpose without our express prior written permission.
            </p>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Prohibited Activities</h3>
            <p className="text-xs text-[#9CA3AF]">
              You agree not to: systematically retrieve data to create compilations without permission; trick, defraud, or mislead us or other Users; circumvent security features; disparage or harm us or the Platform; use information to harass or harm another person; use the Platform inconsistently with applicable laws; advertise or sell goods; upload viruses or harmful material; engage in automated use of the system; impersonate another user; sell or transfer your profile; interfere with or create undue burden on the Platform; attempt to bypass security measures; copy or adapt the Platform&apos;s software; or use the Platform to compete with us.
            </p>
          </div>

          {/* Third Party */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Third Party Applications</h3>
            <p className="text-xs text-[#9CA3AF]">
              GrahAI&apos;s Services may integrate with third party applications. You are responsible for reading and understanding the terms of such third party services. GrahAI is not liable for any third party applications and may, at any time, suspend or disable access to any third party application without notice or liability to you.
            </p>
          </div>

          {/* Force Majeure */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Force Majeure</h3>
            <p className="text-xs text-[#9CA3AF]">
              GrahAI shall not be liable for any failure to perform any obligations under these T&amp;C, if the performance is prevented by any event beyond the reasonable control of GrahAI, and in such case our Services under these T&amp;C shall be suspended for so long as such event continues.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Governing Law &amp; Dispute Resolution</h3>
            <p className="text-xs text-[#9CA3AF]">
              These T&amp;C shall be governed by the laws of India. Any claim or controversy arising out of or relating to this T&amp;C shall be referred to arbitration in accordance with the Indian Arbitration and Conciliation Act 1996. The seat of arbitration shall be in India and the proceedings shall be in English.
            </p>
          </div>

          {/* Grievance */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Grievance Redressal</h3>
            <p className="text-xs text-[#9CA3AF]">
              In accordance with the Information Technology Act 2000, Information Technology (Intermediaries Guidelines) Rules, 2011 and Consumer Protection (E-Commerce) Rules, 2020, you may contact us for any grievances at:
            </p>
            <p className="text-xs text-[#D4A054] mt-2">
              Email: support@grahai.app
            </p>
          </div>

          <p className="text-xs text-center text-[#9CA3AF] pt-4">
            &copy; {new Date().getFullYear()} GrahAI. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
