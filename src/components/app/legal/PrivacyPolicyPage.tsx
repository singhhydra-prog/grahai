"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"

interface PrivacyPolicyPageProps {
  onBack: () => void
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
        <h1 className="text-lg font-semibold text-[#D4A054]">Privacy Policy</h1>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A054]/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#D4A054]" />
          </div>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-[#D1D5DB]">

          <p>
            This Privacy Policy is in continuation of the Terms and Conditions on our Platform and shall be read with the same. All capitalized terms used herein and not defined shall have the same meaning as ascribed in the Terms and Conditions.
          </p>
          <p>
            GrahAI (&quot;GrahAI&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;) is an AI-powered astrology platform that provides personalized guidance to its users (&quot;You&quot;, &quot;Your&quot; or &quot;User&quot;). These Services are made available through our website grahai-app.vercel.app, including any related mobile applications (&quot;Platform&quot;).
          </p>
          <p className="text-xs text-[#9CA3AF]">
            This Privacy Policy (&quot;Policy&quot;) outlines our practices, the kinds of information we may collect, the reasons for and methods of collection, use and disclosure of the information we gather for your use of the Platform, as well as security practices for safeguarding your privacy.
          </p>

          {/* Definitions */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Definitions</h3>
            <div className="space-y-2 text-xs text-[#9CA3AF]">
              <p><span className="text-[#D1D5DB] font-medium">Non-personal Identification Information:</span> Browser name, type of computer and technical information about your means of connection to the Platform such as the operating system, ISP, and other similar information.</p>
              <p><span className="text-[#D1D5DB] font-medium">Personal Identification Information:</span> Information voluntarily shared by you that can ascertain a person&apos;s identity, including but not limited to name, email address, phone number, and residential address disclosed pursuant to creation of an Account.</p>
              <p><span className="text-[#D1D5DB] font-medium">Sensitive Personal Data or Information (SPDI):</span> Information relating to you including credentials, financial information, health conditions, sexual orientation, medical records, biometric information, and other information considered sensitive under applicable law.</p>
            </div>
          </div>

          {/* Information Collected */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Information We Collect</h3>
            <div className="space-y-2 text-xs text-[#9CA3AF]">
              <p><span className="text-[#D1D5DB] font-medium">Voluntarily Provided:</span> All information you provide when accessing or using the Platform, including Account creation and Service usage information.</p>
              <p><span className="text-[#D1D5DB] font-medium">Third-Party Sites:</span> You may register using existing Google, Facebook, or similar accounts. It is your responsibility to read the policies of Third-Party accounts.</p>
              <p><span className="text-[#D1D5DB] font-medium">Cookies:</span> Our cookies aid in extending the functionality of the website and assist in more precise usage analysis. You may set your browser to reject cookies, but this may affect Platform functionality.</p>
              <p><span className="text-[#D1D5DB] font-medium">SPDI:</span> For accuracy in providing services, you may be asked to reveal certain sensitive information including health conditions or medical history.</p>
              <p><span className="text-[#D1D5DB] font-medium">Aggregated Data:</span> We may perform research on demographics, interests, and usage patterns. Your personal information is not contained in this aggregate data.</p>
              <p><span className="text-[#D1D5DB] font-medium">Device &amp; Usage Information:</span> We may collect device type, OS, carrier, unique device ID, time zones, browser type, and usage activity data.</p>
              <p><span className="text-[#D1D5DB] font-medium">Push Notifications:</span> We may ask to send push notifications. You can disable these in your device settings.</p>
            </div>
          </div>

          {/* Use of Data */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Use of Personal Data</h3>
            <p className="text-xs text-[#9CA3AF]">
              GrahAI uses the Personal Data you supply in connection with the purpose for which it was provided. We will notify you when we wish to provide information about you to any Third Parties and give you the opportunity to choose not to share that information. If you deny permission, we might not be able to provide the full extent of our Services.
            </p>
          </div>

          {/* Disclosure */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Disclosure of Information</h3>
            <p className="text-xs text-[#9CA3AF]">
              GrahAI does not sell or involve itself in businesses related to selling information. Disclosure is encrypted and acceptable under all data privacy and protection laws. Exceptions include: business transfers (mergers, acquisitions), service requirements (generating personalized readings — your gender, date of birth, or place of birth will not be disclosed to other users), communications (you agree to receive transactional/promotional messages), and requirements under applicable law.
            </p>
          </div>

          {/* Security */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Security</h3>
            <p className="text-xs text-[#9CA3AF]">
              We work to protect your information against unauthorized access, alteration, disclosure, or destruction. We put in place physical, electronic, and managerial safeguards. As no method of data protection is 100% safe, we cannot guarantee perfect security. You must keep your login information private and notify us immediately if you suspect unauthorized use of your account. GrahAI restricts access to personal information to employees who need it, have received necessary training, and are subject to confidentiality obligations.
            </p>
          </div>

          {/* Minors */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Minors &amp; Age Restrictions</h3>
            <p className="text-xs text-[#9CA3AF]">
              We reserve the right to terminate accounts of minors at our discretion. Children under the age of 13 are not permitted to use our Services. Please do not submit any Personal Data through the Services if you are under 13. If you believe a child under 13 has provided Personal Data through the Services, please contact us and we will work to remove that data.
            </p>
          </div>

          {/* Third Party Links */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Links to Third Parties</h3>
            <p className="text-xs text-[#9CA3AF]">
              Only the Services are covered by this Privacy Policy. The Platform may link to Third-Party websites or applications that are not under GrahAI&apos;s control. The privacy policies of Third-Party sites are not our responsibility. You may log in through Third-Party Sites such as Google, Facebook, etc. It is your responsibility to read and understand their terms.
            </p>
          </div>

          {/* User Rights */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Your Rights</h3>
            <div className="space-y-1 text-xs text-[#9CA3AF]">
              <p><span className="text-[#D1D5DB] font-medium">Right to Access:</span> Request copies of your personal data.</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Rectification:</span> Request correction of inaccurate or incomplete information.</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Erasure:</span> Request deletion of your information under certain conditions.</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Restrict Processing:</span> Restrict GrahAI from processing your information (may result in service limitations).</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Data Portability:</span> Request transfer of your data to another organization or directly to you.</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Object:</span> Object to GrahAI processing your personal data under certain conditions.</p>
              <p><span className="text-[#D1D5DB] font-medium">Right to Notification:</span> Be notified regarding any rectification, erasure, or restriction of processing.</p>
            </div>
          </div>

          {/* Grievance */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Grievance Redressal</h3>
            <p className="text-xs text-[#9CA3AF]">
              For grievances related to this policy, you may contact us at:
            </p>
            <p className="text-xs text-[#D4A054] mt-2">
              Email: support@grahai.app
            </p>
          </div>

          <p className="text-xs text-center text-[#9CA3AF] pt-2 font-medium uppercase tracking-wide">
            By agreeing to the terms of this policy, you agree to our processing of your personal information for the purposes given herein.
          </p>

          <p className="text-xs text-center text-[#9CA3AF] pt-2">
            &copy; {new Date().getFullYear()} GrahAI. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
