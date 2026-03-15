# GrahAI Copy System & Voice Guide

## Brand Voice & Tone

### Core Identity
GrahAI is the **authorized guide to your cosmic destiny**. Our voice balances ancient Vedic wisdom with modern accessibility—we're authoritative without being mystical, trustworthy without being clinical.

### Voice Principles
- **Authoritative yet warm:** We know astrology deeply; you can trust us.
- **Respectful of tradition:** Vedic references are accurate, never trivialized.
- **Empowering, not fatalistic:** "Understand your timing" not "your fate is sealed."
- **Direct and clear:** Cut through astrology jargon; explain in plain language.
- **Optimistic:** Reports highlight opportunities, challenges framed as growth.

### Tone Spectrum
```
Formal ←→ Conversational
(Legal pages)              (Daily horoscope)
"As per the Indian Penal Code..."   "Your Mars energy is rising ✨"

Technical ←→ Mystical
(API docs)                 (Report headlines)
"Longitude/latitude coordinates"    "Cosmic windows opening for you"
```

---

## Copy Patterns by Context

### Landing Page (/)

**Hero Headline:**
```
DO:   "Discover Your Cosmic Blueprint"
      "Your Kundli Awaits"
      "Know Your Timing, Own Your Destiny"

DON'T: "AI Astrology Predictions 2026"
       "Artificial Intelligence Meets Ancient Vedic Science" (too corporate)
```

**Subheader:**
```
DO:   "Personalized Vedic insights in minutes. Understand your marriage timing,
       career path, and wealth cycles—all calculated from your birth chart."

DON'T: "Machine learning powered astrology"
       "Vedic astrology + cutting-edge AI technology"
```

**CTA Buttons:**
```
Landing → Login:
DO:   "Get Your Kundli" / "View My Chart" / "Explore My Destiny"
DON'T: "Sign Up" / "Start Now" / "Begin Your Journey"

(Vedic-specific action verbs preferred)
```

---

### Onboarding Copy

**Step 1 - Welcome**
```
Heading: "Welcome to GrahAI"
Body: "Let's create your cosmic profile. We'll calculate your birth chart
       (kundli) using your birth date, time, and location. Everything is
       private and never sold."
```

**Step 2 - Birth Date**
```
Label: "When were you born?"
Help text: "Your birth date anchors your entire chart. Precision matters."
Error: "Please enter a valid date."
```

**Step 3 - Birth Time (Optional)**
```
Label: "What time were you born? (optional)"
Help text: "If unknown, we'll use 12:00 PM. You can refine this later."
Placeholder: "HH:MM AM/PM"
```

**Step 4 - Birth Location**
```
Label: "Where were you born?"
Help text: "We'll detect your timezone and calculate accurate positions."
(LocationSearch component - shows city suggestions)
```

**Step 5 - Confirm & Calculate**
```
Button: "Create My Kundli" (not "Submit" or "Confirm")
Processing: "Calculating your cosmic blueprint..." (not "Loading")
Success: "Your kundli is ready!" → show KundliChart
```

---

### Daily Horoscope Copy

**HomeTab Feed Item**
```
DO:   "Aries: Your Monday Cosmic Guide"
      "Mercury enters your 7th house—collaboration peaks today"
      "Read full forecast" [CTA]

DON'T: "Daily Horoscope for Aries"
       "Planetary Transits Update"
```

**Streak Notification**
```
3-day: "🔥 You're on fire! 3-day streak"
7-day: "🌟 You're consistent. 7-day streak unlocked!"
30-day: "👑 Cosmic dedication: 30-day streak. Your insights are growing."

(Celebrate milestones; milestone unlocked at 7, 14, 21, 30)
```

**Daily Push Notification**
```
DO:   "Your daily horoscope is ready—Venus is smiling on you today"
      "Your cosmic reading awaits" [opens /daily]

DON'T: "New horoscope available"
       "Your daily prediction is here"
```

---

### Report Teasers (Paywall / PricingOverlay)

**Marriage Timing (₹299)**
```
Teaser:
"Discover when the stars align for your marriage. Learn the auspicious
windows ahead, timing considerations, and how to prepare."

Preview highlight: "Your next favorable window: [Date range]"
Button: "Unlock Full Report" (not "Buy" / "Purchase")
```

**Career Blueprint (₹499)**
```
Teaser:
"Navigate your professional path with cosmic precision. See the optimal
timing for job changes, entrepreneurial ventures, and skill mastery."

Preview: "Best timing for career shift: [Quarter/Year]"
Button: "View Career Path"
```

**Wealth Growth (₹599)**
```
Teaser:
"Understand your financial cycles. Timing, risk windows, investment
opportunities—aligned with your chart's wealth indicators."

Preview: "Your prosperity outlook: Strong growth in [Period]"
Button: "Unlock Wealth Insights"
```

**Dasha Deep Dive (₹999) - Premium**
```
Teaser:
"The most detailed astrological report. Your planetary periods (dashas),
life timing, and the full cosmic context of the next 15+ years."

Preview: "Current dasha: [Planet] (most influential period)"
Badge: "Premium" / "Most Popular"
Button: "Access Deep Insights"
```

---

### Payment & Conversion Copy

**Razorpay Modal Header**
```
DO:   "Secure Payment"
      "Complete Your Purchase"

DON'T: "Checkout" / "Pay Now"
```

**Post-Purchase Email**
```
Subject: "✨ Your Marriage Timing Report is ready!"

Body:
"Hi [Name],

Thank you for trusting GrahAI. Your personalized Marriage Timing report
has been generated using your birth chart.

[Report link]

What's inside:
• Your next 3 auspicious marriage windows
• Optimal timing for life ceremonies
• Planetary considerations for partnership

Questions? Reply to this email or visit our support page.

In cosmic alignment,
The GrahAI Team
```

---

### Paywall / Premium Messaging

**Premium Feature Gate**
```
Lock icon + message:

"This detailed analysis is reserved for our premium members.
See 3 quick insights free, or unlock the full report."

Button: "Unlock [Report Name]" → Shows price (₹[amount])
Sub-text: "One-time payment. Access forever."
```

**Upsell After Report Read**
```
"Loved this insight? Explore your full wealth cycle with our
Wealth Growth report. See the next 5 years in detail."

[Show other reports user hasn't purchased]
```

**Lapsed User Win-Back Email**
```
Subject: "We miss you—and we have a gift 🎁"

Body:
"Hi [Name],

It's been 14 days since you last checked your horoscope.
Venus has moved into a new house, and your cosmic forecast has shifted.

[Click to read new horoscope]

Plus: Get 30% off any report today. Use code: WELCOME30"
```

---

### Error States

**Payment Failed**
```
DO:   "Payment couldn't be processed. Please check your card details and try
       a different payment method. Your report is on hold."

DON'T: "Error 402: Payment gateway timeout"
       "Transaction declined"
```

**Report Generation Failed**
```
DO:   "We're having trouble calculating your report. This usually takes
       <1 minute. Try again in a moment, or contact support."

DON'T: "API Error: /reports/generate timeout"
```

**Login OTP Failed**
```
DO:   "That code didn't work. Please re-check or request a new OTP."
      "If you didn't receive an OTP, check your SMS inbox or spam folder."

DON'T: "Invalid token"
       "OTP expired"
```

---

### Empty States

**No Purchased Reports (/library)**
```
Headline: "Your Report Library Awaits"
Body: "You haven't purchased any reports yet. Explore our collection to
       unlock deeper cosmic insights."

CTA: "Browse Reports" → Returns to HomeTab with report suggestions
```

**No Daily Horoscope Yet (First User)**
```
Heading: "Your first daily horoscope will arrive tomorrow"
Body: "Check back each day for personalized cosmic guidance. Start your
       streak now."

Encouragement: "Meanwhile, explore your birth chart or ask a question."
```

**Ask Tab - Used Up Free Question**
```
"You've used your 1 free question this month.
Plans:
• Free: 1 question/month
• Premium: Unlimited questions

Upgrade to ask as many questions as you want."

CTA: "View Membership Options"
```

---

### Empty State Pattern
```
[Icon] → [Empowering Headline] → [Brief explanation]
                                → [Action-oriented CTA]

Example (No purchases):
🌟 "The universe has much to reveal" → "Explore personalized reports"
   [Browse Reports button]
```

---

### FAQ Copy

**Q: Is GrahAI astrology accurate?**
```
DO:   "GrahAI combines traditional Vedic astrology principles with precise
       birth chart calculations. Accuracy depends on exact birth time—the
       more precise, the better. We use 'uncertain birth time' modes if
       you don't remember yours."

DON'T: "Our AI is 95% accurate" (avoid % claims)
       "Astrology is 100% predictive"
```

**Q: Is my data private?**
```
"Yes. Your birth date, time, and location are encrypted and never shared
with third parties. Read our full privacy policy for details."
```

**Q: Can I get a refund?**
```
"Yes. If you're not satisfied, contact us within 7 days for a full refund.
No questions asked. See our refund policy for details."
```

---

### Support Page Copy

**Subject Line Suggestions**
```
DO:   "I couldn't see my full report"
      "My OTP didn't arrive"
      "How do I change my birth time?"
      "I'd like a refund"

DON'T: "Help"
       "Problem"
```

**Support Response Template**
```
Subject: Re: Your [Issue]

Hi [Name],

Thank you for reaching out. [Acknowledge their concern].

[Solution in 2-3 sentences, non-technical]

If this doesn't solve it, [alternative action].

Best,
GrahAI Support Team
support@grahai.app
```

---

### Legal/Trust Page Tone

**Disclaimer Page Intro**
```
"GrahAI is an astrology guidance tool. Vedic astrology is a traditional
knowledge system used for self-reflection and planning. It should not be
treated as medical, financial, or legal advice.

Always consult qualified professionals for important life decisions."

[Professional, clear, protective]
```

**Terms & Conditions Opening**
```
"By using GrahAI, you agree to our terms. Please read carefully before
signing up. Questions? Contact legal@grahai.app"

[Formal but accessible]
```

---

## Copy Audit Checklist

- [ ] All CTAs are action-oriented, not "Submit"/"OK"
- [ ] No mystical jargon without explanation
- [ ] Paywall messaging emphasizes value, not scarcity
- [ ] Error messages are helpful, not technical
- [ ] All "₹" prices shown (Razorpay requirement)
- [ ] Premium features clearly marked with badge/lock icon
- [ ] Support email visibly linked in footer
- [ ] Refund policy mentioned in checkout
- [ ] Privacy/disclaimer acknowledgments clear
- [ ] No overstated accuracy claims
- [ ] Indian English spelling (favour, colour, authorise) or US English consistent throughout

