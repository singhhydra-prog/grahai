/**
 * GrahAI Internationalization System
 *
 * Supports 9 languages: English (default), Hindi, Tamil, Telugu,
 * Kannada, Malayalam, Bengali, Marathi, Gujarati
 *
 * Tone: Simple, engaging, 10th-grade reading level,
 * neutral and empathetic throughout.
 */

export type Language =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "bn"
  | "mr"
  | "gu"

export interface LanguageMeta {
  code: Language
  label: string        // Native name
  labelEn: string      // English name
  script: string       // Script name
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English",   labelEn: "English",   script: "Latin" },
  { code: "hi", label: "हिन्दी",     labelEn: "Hindi",     script: "Devanagari" },
  { code: "ta", label: "தமிழ்",      labelEn: "Tamil",     script: "Tamil" },
  { code: "te", label: "తెలుగు",     labelEn: "Telugu",    script: "Telugu" },
  { code: "kn", label: "ಕನ್ನಡ",      labelEn: "Kannada",   script: "Kannada" },
  { code: "ml", label: "മലയാളം",    labelEn: "Malayalam", script: "Malayalam" },
  { code: "bn", label: "বাংলা",      labelEn: "Bengali",   script: "Bengali" },
  { code: "mr", label: "मराठी",      labelEn: "Marathi",   script: "Devanagari" },
  { code: "gu", label: "ગુજરાતી",    labelEn: "Gujarati",  script: "Gujarati" },
]

// ═══════════════════════════════════════════════════
// Translation keys — organized by feature area
// ═══════════════════════════════════════════════════

export interface Translations {
  // ─── Language Picker (Onboarding Step 0) ───
  langPicker: {
    title: string
    subtitle: string
  }

  // ─── Onboarding ───
  onboarding: {
    welcomeSubtitle: string
    welcomeDesc: string
    getFirstInsight: string
    intentTitle: string
    intentSubtitle: string
    intentCareer: string
    intentLove: string
    intentMarriage: string
    intentMoney: string
    intentEmotional: string
    intentDaily: string
    intentExploring: string
    trustTitle: string
    trustSubtitle: string
    trustCard1Title: string
    trustCard1Desc: string
    trustCard2Title: string
    trustCard2Desc: string
    trustCard3Title: string
    trustCard3Desc: string
    birthTitle: string
    birthSubtitle: string
    fullName: string
    fullNamePlaceholder: string
    dateOfBirth: string
    timeOfBirth: string
    dontKnowTime: string
    placeOfBirth: string
    placePlaceholder: string
    generateChart: string
    revealTitle: string
    revealSubtitle: string
    moonSign: string
    nakshatra: string
    risingSign: string
    todayLabel: string
    readyToAsk: string
    askFirstTitle: string
    askFirstSubtitle: string
    typePlaceholder: string
    suggestionsLabel: string
    askNow: string
    skipExplore: string
    saveChartTitle: string
    saveChartSubtitle: string
    emailPlaceholder: string
    saveBenefit1: string
    saveBenefit2: string
    saveBenefit3: string
    saveAndEnter: string
    skipForNow: string
    continueBtn: string
    readingChart: string
    askYourFirst: string
  }

  // ─── Bottom Navigation ───
  nav: {
    home: string
    ask: string
    compatibility: string
    reports: string
    profile: string
  }

  // ─── Home Tab ───
  home: {
    greeting: string // "Good {timeOfDay}, {name}"
    todayGuidance: string
    tomorrowGuidance: string
    loveCard: string
    careerCard: string
    energyCard: string
    panchangTitle: string
    luckyColors: string
    luckyNumbers: string
    askQuestion: string
    viewReports: string
    sourcesTitle: string
    doThis: string           // "Do this"
    beCareful: string        // "Be careful"
    whyActive: string        // "Why this is active"
    unlockDeeper: string     // "Unlock deeper insights"
    unlockDesc: string       // "Career blueprints, timing reports, compatibility"
    completeOnboarding: string // "Complete onboarding to see your daily guidance"
    askMore: string          // "Ask more"
  }

  // ─── Ask Tab ───
  ask: {
    title: string
    placeholder: string
    topicLove: string
    topicCareer: string
    topicTiming: string
    topicFamily: string
    topicHealth: string
    topicMoney: string
    directAnswer: string
    whyShowingUp: string
    whatToDo: string
    whatToAvoid: string
    timeWindow: string
    remedy: string
    source: string
    followUp: string
    questionsLeft: string
    upgradeForMore: string
    suggestion1: string      // "What should I focus on this week based on my chart?"
    suggestion2: string      // "Why have I been feeling restless or stuck lately?"
    suggestion3: string      // "When is my next big opportunity coming?"
    followUp1: string        // "Tell me more"
    followUp2: string        // "When does this change?"
    followUp3: string        // "Why does this keep repeating?"
    followUp4: string        // "What should I do next?"
    whatsOnMind: string      // "What's on your mind"
    history: string          // "History"
    clearConversation: string // "Clear conversation"
    thisSession: string      // "This session"
    noQuestionsYet: string   // "No questions asked yet this session."
    questionsAppearHere: string // "Your questions will appear here."
    errorGenerate: string    // "I couldn't generate a response."
    errorRetry: string       // "Something went wrong. Please try again."
    thinking: string         // "thinking..."
    questionsRemaining: string // "questions remaining"
    basedOnChart: string     // "Based on your question and chart analysis"
    viewFullSource: string   // "View full source"
  }

  // ─── My Chart Tab ───
  chart: {
    title: string
    birthChart: string
    sunSign: string
    moonSign: string
    risingSign: string
    nakshatra: string
    element: string
    strengths: string
    sensitivities: string
    showAdvanced: string
    hideAdvanced: string
    simple: string           // "Simple"
    advanced: string         // "Advanced" (replaces showAdvanced for toggle)
    yourBlueprint: string    // "Your cosmic blueprint"
    sun: string              // "Sun"
    elementLabel: string     // "Element"
    nakshatraPada: string    // "Nakshatra Pada"
    nakshatraLord: string    // "Nakshatra Lord"
    nakshatraDeity: string   // "Nakshatra Deity"
    signQuality: string      // "Sign Quality"
    rulingPlanet: string     // "Ruling Planet"
    signDegree: string       // "Sign Degree"
    lifePath: string         // "Life Path"
    currentDasha: string     // "Current Dasha"
    calculating: string      // "Calculating..."
    timeUnknownLabel: string // "Time unknown"
    currentEnergies: string  // "Current Active Energies"
    activeDasha: string      // "Active Dasha Period"
    askTransits: string      // "Ask about my active transits"
    recurringThemes: string  // "Recurring Themes"
    deepDive: string         // "Deep Dive"
    deity: string            // "Deity"
    lord: string             // "Lord"
    symbol: string           // "Symbol"
    shakti: string           // "Shakti"
    animal: string           // "Animal"
    gana: string             // "Gana"
    pada: string             // "Pada"
    emotionalPattern: string // "Emotional pattern"
    workStyle: string        // "Work style"
    relationshipStyle: string // "Relationship style"
  }

  // ─── Reports Tab ───
  reports: {
    title: string
    loveCompat: string
    careerBlueprint: string
    marriageTiming: string
    annualForecast: string
    wealthGrowth: string
    dashaDeepDive: string
    unlocked: string
    locked: string
    buyReport: string
    preview: string
    oneTimePacks: string
    subtitle: string         // "Life-outcome reports"
    intro: string            // "Each report maps to a real life outcome — not a generic product. Pick what matters most to you right now."
    whatsInside: string      // "What's inside"
    ready: string            // "Report ready!"
    downloadPdf: string      // "Download PDF"
    generating: string       // "Generating report..."
    downloadReport: string   // "Download Report"
    generateReport: string   // "Generate Report"
    unlockFor: string        // "Unlock for"
    upgradeTo: string        // "Upgrade to"
    askAboutTopic: string    // "Ask GrahAI about this topic"
    completeFirst: string    // "Please complete onboarding first."
    tryAgain: string         // "Something went wrong. Please try again."
    plus: string             // "Plus"
    premium: string          // "Premium"
    free: string             // "FREE"
  }

  // ─── Profile Tab ───
  profile: {
    title: string
    editBirthDetails: string
    changeLanguage: string
    vedic: string
    western: string
    questions: string
    reportsLabel: string
    compatibility: string
    available: string
    buyQuestions: string
    buyReports: string
    buyCompatibility: string
    helpSupport: string
    activity: string
    referEarn: string
    questionsHistory: string
    reportsHistory: string
    compatHistory: string
    familyMembers: string
    upgradePremium: string
    upgradeDesc: string
    signOut: string
    signOutConfirm: string
    signOutDesc: string
    cancel: string
    version: string
    // Edit birth details modal
    editBirthTitle: string
    editBirthDesc: string
    saveChanges: string
    saving: string
    // Help page
    faq1Q: string
    faq1A: string
    faq2Q: string
    faq2A: string
    faq3Q: string
    faq3A: string
    faq4Q: string
    faq4A: string
    faq5Q: string
    faq5A: string
    askForHelp: string
  }

  // ─── Pricing Overlay ───
  pricing: {
    title: string
    subtitle: string
    monthly: string
    oneTime: string
    free: string
    graha: string
    rishi: string
    perMonth: string
    currentPlan: string
    upgrade: string
    popular: string
    tagline: string          // "Source-backed guidance, deeper clarity"
    monthlyPlans: string     // "Monthly Plans"
    oneTimeReports: string   // "One-Time Reports"
    oneTimeDesc: string      // "Buy individual reports. No subscription needed."
    bestValue: string        // "Best Value"
    secureRazorpay: string   // "Secure via Razorpay"
    cancelAnytime: string    // "Cancel Anytime"
    bphsSourced: string      // "BPHS-sourced"
    startGraha: string       // "Start Graha — ₹199/mo"
    startRishi: string       // "Start Rishi — ₹499/mo"
    explorePlan: string      // "Explore your cosmic blueprint"
    deeperInsights: string   // "Deeper insights for daily clarity"
    completeCompanion: string // "Complete Jyotish companion"
  }

  // ─── Paywall Banner ───
  paywall: {
    limitReached: string
    upgradeNow: string
    dismiss: string
    triggerLimitTitle: string    // "You've used today's free question"
    triggerLimitDesc: string     // "Upgrade to keep asking — your chart has more to tell you."
    triggerIntentTitle: string   // "Want the deeper analysis?"
    triggerIntentDesc: string    // "Graha members get fuller explanations with timing and remedies."
    triggerSourceTitle: string   // "You're digging deep — we love that"
    triggerSourceDesc: string    // "Unlock fuller source-backed reasoning and unlimited asks."
    triggerReportTitle: string   // "This report maps to a real life outcome"
    triggerReportDesc: string    // "Unlock detailed, chart-specific guidance for what matters most."
    triggerGeneralTitle: string  // "Unlock the full GrahAI experience"
    triggerGeneralDesc: string   // "Deeper clarity, more questions, premium reports."
    tryPlan: string              // "Try"
  }

  // ─── Referral Page ───
  referral: {
    title: string
    subtitle: string
    yourCode: string
    copyCode: string
    shareWithFriends: string
    rewardsTitle: string
    friendsReferred: string
    shareText: string         // "Join GrahAI for personalized Vedic astrology insights! Use my code:"
    rewardMilestones: string  // "Reward Milestones"
    howItWorks: string        // "How it works"
    step1: string             // "Share your unique referral code with friends"
    step2: string             // "They sign up and complete onboarding with your code"
    step3: string             // "You both get 3 bonus questions instantly"
    step4: string             // "Unlock bigger rewards as more friends join"
    invite: string            // "Invite"
    friend: string            // "friend"
    friends: string           // "friends"
    freeQuestions: string     // "5 free questions"
    freeReport: string        // "1 free report"
    monthGraha: string        // "1 month Graha plan"
    monthRishi: string        // "1 month Rishi plan"
    friendsJoined: string     // "Friends joined"
    rewardsEarned: string     // "Rewards earned"
  }

  // ─── Source ───
  source: {
    whyGrahaiSays: string     // "Why GrahAI says this"
    sourceBackedReasoning: string // "Source-backed reasoning"
    activePrinciple: string   // "Active Principle"
    explanation: string       // "Explanation"
    shownBecause: string      // "This was shown because:"
    groundsInsight: string    // "GrahAI grounds every insight in classical Jyotish tradition"
  }

  // ─── Common / Shared ───
  common: {
    loading: string
    error: string
    retry: string
    close: string
    back: string
    next: string
    save: string
    done: string
    today: string
    tomorrow: string
  }
}

// ═══════════════════════════════════════════════════
// English (default)
// ═══════════════════════════════════════════════════
const en: Translations = {
  langPicker: {
    title: "Choose your language",
    subtitle: "You can always change this later in your profile settings.",
  },
  onboarding: {
    welcomeSubtitle: "The stars have been waiting for you.",
    welcomeDesc: "GrahAI reads the language of your birth chart to offer gentle, time-tested guidance for the moments that truly matter.",
    getFirstInsight: "Begin my journey",
    intentTitle: "What does your heart seek clarity on?",
    intentSubtitle: "Tell us, and we\u2019ll guide you with what your chart reveals",
    intentCareer: "Career & Work",
    intentLove: "Love & Relationship",
    intentMarriage: "Marriage & Timing",
    intentMoney: "Money & Growth",
    intentEmotional: "Emotional Energy",
    intentDaily: "Daily Guidance",
    intentExploring: "Just Exploring",
    trustTitle: "Rooted in ancient wisdom.",
    trustSubtitle: "Crafted around your unique chart.",
    trustCard1Title: "Born from your birth chart",
    trustCard1Desc: "Swiss Ephemeris Engine calculates real planetary positions to arc-second accuracy \u2014 the same engine used by NASA and professional astrologers worldwide.",
    trustCard2Title: "Rooted in 5,000 years of Jyotish",
    trustCard2Desc: "Interpretations drawn from BPHS, Saravali, and Phaladeepika. Classical wisdom, modern clarity.",
    trustCard3Title: "Made for the decisions that matter",
    trustCard3Desc: "Career, love, timing, money \u2014 let the planets illuminate your path forward.",
    birthTitle: "Share your birth details",
    birthSubtitle: "The more precise, the deeper we can see into your chart",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    dateOfBirth: "Date of Birth",
    timeOfBirth: "Time of Birth",
    dontKnowTime: "I don\u2019t know my birth time",
    placeOfBirth: "Place of Birth",
    placePlaceholder: "Search city \u2014 e.g. Mumbai, Delhi, London...",
    generateChart: "Generate my chart",
    revealTitle: "Your chart, at first glance",
    revealSubtitle: "{name}\u2019s cosmic blueprint",
    moonSign: "Moon Sign",
    nakshatra: "Nakshatra",
    risingSign: "Rising Sign",
    todayLabel: "Today",
    readyToAsk: "Ready to ask your first question?",
    askFirstTitle: "Ask your first question",
    askFirstSubtitle: "Your chart is ready. Ask anything about love, career, timing, or life.",
    typePlaceholder: "Type your question...",
    suggestionsLabel: "Suggestions for you",
    askNow: "Ask GrahAI",
    skipExplore: "Skip and explore",
    saveChartTitle: "Save your chart",
    saveChartSubtitle: "Enter your email to keep your birth chart, history, and daily guidance across devices.",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "Your birth chart saved securely",
    saveBenefit2: "Daily personalized guidance",
    saveBenefit3: "Question history across sessions",
    saveAndEnter: "Save and enter GrahAI",
    skipForNow: "Skip for now",
    continueBtn: "Continue",
    readingChart: "Reading your chart...",
    askYourFirst: "Ask your first question",
  },
  nav: {
    home: "Home",
    ask: "Ask",
    compatibility: "Match",
    reports: "Reports",
    profile: "Profile",
  },
  home: {
    greeting: "Good {timeOfDay}, {name}",
    todayGuidance: "Today\u2019s Guidance",
    tomorrowGuidance: "Tomorrow\u2019s Guidance",
    loveCard: "Love",
    careerCard: "Career",
    energyCard: "Energy",
    panchangTitle: "Panchang",
    luckyColors: "Lucky Colors",
    luckyNumbers: "Lucky Numbers",
    askQuestion: "Ask a question",
    viewReports: "View Reports",
    sourcesTitle: "Sources",
    doThis: "Do this",
    beCareful: "Be careful",
    whyActive: "Why this is active",
    unlockDeeper: "Unlock deeper insights",
    unlockDesc: "Career blueprints, timing reports, compatibility",
    completeOnboarding: "Complete onboarding to see your daily guidance",
    askMore: "Ask more",
  },
  ask: {
    title: "Ask GrahAI",
    placeholder: "Ask about love, career, timing...",
    topicLove: "Love",
    topicCareer: "Career",
    topicTiming: "Timing",
    topicFamily: "Family",
    topicHealth: "Health",
    topicMoney: "Money",
    directAnswer: "Direct Answer",
    whyShowingUp: "Why This Is Showing Up",
    whatToDo: "What To Do",
    whatToAvoid: "What To Avoid",
    timeWindow: "Time Window",
    remedy: "Remedy",
    source: "Source",
    followUp: "Follow-up Questions",
    questionsLeft: "{count} questions left today",
    upgradeForMore: "Upgrade for more",
    suggestion1: "What should I focus on this week based on my chart?",
    suggestion2: "Why have I been feeling restless or stuck lately?",
    suggestion3: "When is my next big opportunity coming?",
    followUp1: "Tell me more",
    followUp2: "When does this change?",
    followUp3: "Why does this keep repeating?",
    followUp4: "What should I do next?",
    whatsOnMind: "What\u2019s on your mind",
    history: "History",
    clearConversation: "Clear conversation",
    thisSession: "This session",
    noQuestionsYet: "No questions asked yet this session.",
    questionsAppearHere: "Your questions will appear here.",
    errorGenerate: "I couldn\u2019t generate a response.",
    errorRetry: "Something went wrong. Please try again.",
    thinking: "thinking...",
    questionsRemaining: "questions remaining",
    basedOnChart: "Based on your question and chart analysis",
    viewFullSource: "View full source",
  },
  chart: {
    title: "My Chart",
    birthChart: "Birth Chart",
    sunSign: "Sun Sign",
    moonSign: "Moon Sign",
    risingSign: "Rising Sign",
    nakshatra: "Nakshatra",
    element: "Element",
    strengths: "Strengths",
    sensitivities: "Sensitivities",
    showAdvanced: "Show Advanced",
    hideAdvanced: "Hide Advanced",
    simple: "Simple",
    advanced: "Advanced",
    yourBlueprint: "Your cosmic blueprint",
    sun: "Sun",
    elementLabel: "Element",
    nakshatraPada: "Nakshatra Pada",
    nakshatraLord: "Nakshatra Lord",
    nakshatraDeity: "Nakshatra Deity",
    signQuality: "Sign Quality",
    rulingPlanet: "Ruling Planet",
    signDegree: "Sign Degree",
    lifePath: "Life Path",
    currentDasha: "Current Dasha",
    calculating: "Calculating...",
    timeUnknownLabel: "Time unknown",
    currentEnergies: "Current Active Energies",
    activeDasha: "Active Dasha Period",
    askTransits: "Ask about my active transits",
    recurringThemes: "Recurring Themes",
    deepDive: "Deep Dive",
    deity: "Deity",
    lord: "Lord",
    symbol: "Symbol",
    shakti: "Shakti",
    animal: "Animal",
    gana: "Gana",
    pada: "Pada",
    emotionalPattern: "Emotional pattern",
    workStyle: "Work style",
    relationshipStyle: "Relationship style",
  },
  reports: {
    title: "Reports",
    loveCompat: "Love & Compatibility",
    careerBlueprint: "Career Blueprint",
    marriageTiming: "Marriage Timing",
    annualForecast: "Annual Forecast",
    wealthGrowth: "Wealth Growth",
    dashaDeepDive: "Dasha Deep Dive",
    unlocked: "Unlocked",
    locked: "Locked",
    buyReport: "Buy Report",
    preview: "Preview",
    oneTimePacks: "One-Time Packs",
    subtitle: "Life-outcome reports",
    intro: "Each report maps to a real life outcome \u2014 not a generic product. Pick what matters most to you right now.",
    whatsInside: "What\u2019s inside",
    ready: "Report ready!",
    downloadPdf: "Download PDF",
    generating: "Generating report...",
    downloadReport: "Download Report",
    generateReport: "Generate Report",
    unlockFor: "Unlock for",
    upgradeTo: "Upgrade to",
    askAboutTopic: "Ask GrahAI about this topic",
    completeFirst: "Please complete onboarding first.",
    tryAgain: "Something went wrong. Please try again.",
    plus: "Plus",
    premium: "Premium",
    free: "FREE",
  },
  profile: {
    title: "Profile",
    editBirthDetails: "Edit Birth Details",
    changeLanguage: "Change Language",
    vedic: "Vedic",
    western: "Western",
    questions: "Questions",
    reportsLabel: "Reports",
    compatibility: "Compatibility",
    available: "available",
    buyQuestions: "Buy Questions",
    buyReports: "Buy Reports",
    buyCompatibility: "Buy Compatibility",
    helpSupport: "Help & Support",
    activity: "Activity",
    referEarn: "Refer & Earn",
    questionsHistory: "Questions History",
    reportsHistory: "Reports History",
    compatHistory: "Compatibility History",
    familyMembers: "Family Members",
    upgradePremium: "Upgrade to Premium",
    upgradeDesc: "Unlimited questions, deeper insights, full reports",
    signOut: "Sign out",
    signOutConfirm: "Sign out?",
    signOutDesc: "This will clear your birth data and chart from this device. You can always re-enter it later.",
    cancel: "Cancel",
    version: "GrahAI v3.0 \u00b7 Made with care in India",
    editBirthTitle: "Edit Birth Details",
    editBirthDesc: "Update your birth information for more accurate readings.",
    saveChanges: "Save Changes",
    saving: "Saving...",
    faq1Q: "How does GrahAI work?",
    faq1A: "GrahAI uses your birth date, time, and place to compute your Vedic chart. Our AI then interprets classical Jyotish principles to provide personalized guidance.",
    faq2Q: "How accurate is it?",
    faq2A: "Accuracy depends on birth time precision. GrahAI uses the same sidereal calculations as traditional astrologers, enhanced by AI for more nuanced interpretation.",
    faq3Q: "Is my data safe?",
    faq3A: "Your birth data is stored locally on your device. We don\u2019t share your personal information with third parties.",
    faq4Q: "How do I get more questions?",
    faq4A: "You can upgrade to a Graha or Rishi plan for more daily questions, or buy question packs from the pricing page.",
    faq5Q: "Can I get a refund?",
    faq5A: "Yes, we offer a 7-day refund policy on all purchases. Contact support for assistance.",
    askForHelp: "Ask GrahAI for help",
  },
  pricing: {
    title: "Choose Your Plan",
    subtitle: "Get deeper guidance with a plan that suits you",
    monthly: "Monthly",
    oneTime: "One-Time",
    free: "Free",
    graha: "Graha",
    rishi: "Rishi",
    perMonth: "/month",
    currentPlan: "Current Plan",
    upgrade: "Upgrade",
    popular: "Popular",
    tagline: "Source-backed guidance, deeper clarity",
    monthlyPlans: "Monthly Plans",
    oneTimeReports: "One-Time Reports",
    oneTimeDesc: "Buy individual reports. No subscription needed.",
    bestValue: "Best Value",
    secureRazorpay: "Secure via Razorpay",
    cancelAnytime: "Cancel Anytime",
    bphsSourced: "BPHS-sourced",
    startGraha: "Start Graha \u2014 \u20b9199/mo",
    startRishi: "Start Rishi \u2014 \u20b9499/mo",
    explorePlan: "Explore your cosmic blueprint",
    deeperInsights: "Deeper insights for daily clarity",
    completeCompanion: "Complete Jyotish companion",
  },
  paywall: {
    limitReached: "You\u2019ve used your free questions for today",
    upgradeNow: "Upgrade Now",
    dismiss: "Maybe later",
    triggerLimitTitle: "You\u2019ve used today\u2019s free question",
    triggerLimitDesc: "Upgrade to keep asking \u2014 your chart has more to tell you.",
    triggerIntentTitle: "Want the deeper analysis?",
    triggerIntentDesc: "Graha members get fuller explanations with timing and remedies.",
    triggerSourceTitle: "You\u2019re digging deep \u2014 we love that",
    triggerSourceDesc: "Unlock fuller source-backed reasoning and unlimited asks.",
    triggerReportTitle: "This report maps to a real life outcome",
    triggerReportDesc: "Unlock detailed, chart-specific guidance for what matters most.",
    triggerGeneralTitle: "Unlock the full GrahAI experience",
    triggerGeneralDesc: "Deeper clarity, more questions, premium reports.",
    tryPlan: "Try",
  },
  referral: {
    title: "Refer & Earn",
    subtitle: "Share GrahAI with friends and earn rewards",
    yourCode: "Your Referral Code",
    copyCode: "Copy Code",
    shareWithFriends: "Share with Friends",
    rewardsTitle: "Your Rewards",
    friendsReferred: "Friends Referred",
    shareText: "Join GrahAI for personalized Vedic astrology insights! Use my code:",
    rewardMilestones: "Reward Milestones",
    howItWorks: "How it works",
    step1: "Share your unique referral code with friends",
    step2: "They sign up and complete onboarding with your code",
    step3: "You both get 3 bonus questions instantly",
    step4: "Unlock bigger rewards as more friends join",
    invite: "Invite",
    friend: "friend",
    friends: "friends",
    freeQuestions: "5 free questions",
    freeReport: "1 free report",
    monthGraha: "1 month Graha plan",
    monthRishi: "1 month Rishi plan",
    friendsJoined: "Friends joined",
    rewardsEarned: "Rewards earned",
  },
  source: {
    whyGrahaiSays: "Why GrahAI says this",
    sourceBackedReasoning: "Source-backed reasoning",
    activePrinciple: "Active Principle",
    explanation: "Explanation",
    shownBecause: "This was shown because:",
    groundsInsight: "GrahAI grounds every insight in classical Jyotish tradition",
  },
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try again",
    close: "Close",
    back: "Back",
    next: "Next",
    save: "Save",
    done: "Done",
    today: "Today",
    tomorrow: "Tomorrow",
  },
}

// ═══════════════════════════════════════════════════
// Hindi
// ═══════════════════════════════════════════════════
const hi: Translations = {
  langPicker: {
    title: "अपनी भाषा चुनें",
    subtitle: "आप इसे बाद में प्रोफ़ाइल सेटिंग्स से बदल सकते हैं।",
  },
  onboarding: {
    welcomeSubtitle: "आपके सितारे, आपकी राह",
    welcomeDesc: "GrahAI आपकी जन्म कुंडली को समझकर आपको सही guidance देता है — simple भाषा में, बिल्कुल आपके लिए।",
    getFirstInsight: "शुरू करें →",
    intentTitle: "आज आपको किस बारे में जानना है?",
    intentSubtitle: "बताइए, हम आपकी कुंडली से guide करेंगे",
    intentCareer: "करियर और काम",
    intentLove: "प्यार और रिश्ते",
    intentMarriage: "शादी और समय",
    intentMoney: "पैसा और विकास",
    intentEmotional: "भावनात्मक ऊर्जा",
    intentDaily: "दैनिक मार्गदर्शन",
    intentExploring: "बस देख रहे हैं",
    trustTitle: "प्राचीन ज्ञान पर आधारित।",
    trustSubtitle: "आपकी अनूठी कुंडली के इर्द-गिर्द बुना हुआ।",
    trustCard1Title: "आपकी कुंडली, आपकी गणना",
    trustCard1Desc: "Swiss Ephemeris Engine से ग्रहों की सही-सही स्थिति पता चलती है — वही engine जो NASA और दुनिया के ज्योतिषी use करते हैं।",
    trustCard2Title: "5,000 साल पुरानी ज्योतिष विद्या",
    trustCard2Desc: "बृहत् पाराशर होरा शास्त्र, सारावली और फलदीपिका पर based — असली शास्त्र, modern clarity।",
    trustCard3Title: "बड़े फैसलों में साथी",
    trustCard3Desc: "नौकरी, प्यार, शादी, पैसा — ग्रहों की रोशनी में सही दिशा पाएं।",
    birthTitle: "आपकी जन्म जानकारी",
    birthSubtitle: "सटीक जानकारी से सटीक मार्गदर्शन मिलता है",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम लिखें",
    dateOfBirth: "जन्म तिथि",
    timeOfBirth: "जन्म का समय",
    dontKnowTime: "मुझे अपना जन्म समय नहीं पता",
    placeOfBirth: "जन्म स्थान",
    placePlaceholder: "शहर खोजें — जैसे मुंबई, दिल्ली...",
    generateChart: "मेरी कुंडली बनाएं",
    revealTitle: "आपकी कुंडली तैयार है!",
    revealSubtitle: "{name} की कुंडली",
    moonSign: "चंद्र राशि",
    nakshatra: "नक्षत्र",
    risingSign: "लग्न राशि",
    todayLabel: "आज",
    readyToAsk: "चलिए, अपना पहला सवाल पूछते हैं!",
    askFirstTitle: "कुछ भी पूछें",
    askFirstSubtitle: "कुंडली तैयार है! प्यार, करियर, पैसा, शादी — जो मन में हो, पूछें।",
    typePlaceholder: "अपना सवाल लिखें...",
    suggestionsLabel: "आपके लिए सुझाव",
    askNow: "GrahAI से पूछें",
    skipExplore: "छोड़ें और देखें",
    saveChartTitle: "कुंडली सेव करें",
    saveChartSubtitle: "Email डालें ताकि कुंडली और daily guidance हमेशा safe रहे — किसी भी device पर।",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "कुंडली हमेशा safe",
    saveBenefit2: "रोज़ का personal guidance",
    saveBenefit3: "पुराने सवाल-जवाब saved",
    saveAndEnter: "Save करें और शुरू करें",
    skipForNow: "बाद में करेंगे",
    continueBtn: "आगे बढ़ें →",
    readingChart: "कुंडली बना रहे हैं...",
    askYourFirst: "पहला सवाल पूछें →",
  },
  nav: {
    home: "होम",
    ask: "पूछें",
    compatibility: "मिलान",
    reports: "रिपोर्ट",
    profile: "प्रोफ़ाइल",
  },
  home: {
    greeting: "शुभ {timeOfDay}, {name}",
    todayGuidance: "आज का Guidance",
    tomorrowGuidance: "कल का Guidance",
    loveCard: "प्यार",
    careerCard: "करियर",
    energyCard: "ऊर्जा",
    panchangTitle: "पंचांग",
    luckyColors: "शुभ रंग",
    luckyNumbers: "शुभ अंक",
    askQuestion: "सवाल पूछें",
    viewReports: "रिपोर्ट देखें",
    sourcesTitle: "स्रोत",
    doThis: "यह करें",
    beCareful: "सावधान रहें",
    whyActive: "यह सक्रिय क्यों है",
    unlockDeeper: "और गहराई से जानें",
    unlockDesc: "Career report, timing, compatibility — सब एक जगह",
    completeOnboarding: "Daily guidance देखने के लिए पहले details भरें",
    askMore: "और पूछें",
  },
  ask: {
    title: "GrahAI से पूछें",
    placeholder: "प्यार, करियर, समय के बारे में पूछें...",
    topicLove: "प्यार",
    topicCareer: "करियर",
    topicTiming: "समय",
    topicFamily: "परिवार",
    topicHealth: "स्वास्थ्य",
    topicMoney: "पैसा",
    directAnswer: "सीधा जवाब",
    whyShowingUp: "यह क्यों दिख रहा है",
    whatToDo: "क्या करें",
    whatToAvoid: "क्या न करें",
    timeWindow: "समय सीमा",
    remedy: "उपाय",
    source: "स्रोत",
    followUp: "और सवाल",
    questionsLeft: "आज {count} सवाल बचे हैं",
    upgradeForMore: "और सवालों के लिए अपग्रेड करें",
    suggestion1: "इस हफ्ते मुझे किस चीज़ पर focus करना चाहिए?",
    suggestion2: "आजकल मन बेचैन क्यों लग रहा है?",
    suggestion3: "मेरा अगला बड़ा मौका कब आएगा?",
    followUp1: "और बताओ",
    followUp2: "ये कब बदलेगा?",
    followUp3: "ये बार-बार क्यों होता है?",
    followUp4: "अब मुझे क्या करना चाहिए?",
    whatsOnMind: "मन में क्या चल रहा है?",
    history: "पुराने सवाल",
    clearConversation: "Chat clear करें",
    thisSession: "अभी की बातचीत",
    noQuestionsYet: "अभी तक कोई सवाल नहीं पूछा।",
    questionsAppearHere: "जो पूछेंगे वो यहाँ दिखेगा।",
    errorGenerate: "जवाब नहीं आ पाया।",
    errorRetry: "कुछ गड़बड़ हुई। फिर से try करें।",
    thinking: "सोच रहे हैं...",
    questionsRemaining: "सवाल बाकी",
    basedOnChart: "आपकी कुंडली और सवाल के हिसाब से",
    viewFullSource: "पूरा source देखें",
  },
  chart: {
    title: "मेरी कुंडली",
    birthChart: "जन्म कुंडली",
    sunSign: "सूर्य राशि",
    moonSign: "चंद्र राशि",
    risingSign: "लग्न राशि",
    nakshatra: "नक्षत्र",
    element: "तत्व",
    strengths: "शक्तियाँ",
    sensitivities: "संवेदनशीलता",
    showAdvanced: "विस्तार दिखाएं",
    hideAdvanced: "विस्तार छुपाएं",
    simple: "सरल",
    advanced: "उन्नत",
    yourBlueprint: "आपका ब्रह्मांडीय नक्शा",
    sun: "सूर्य",
    elementLabel: "तत्व",
    nakshatraPada: "नक्षत्र पद",
    nakshatraLord: "नक्षत्र प्रभु",
    nakshatraDeity: "नक्षत्र देवता",
    signQuality: "राशि गुण",
    rulingPlanet: "शासक ग्रह",
    signDegree: "राशि डिग्री",
    lifePath: "जीवन पथ",
    currentDasha: "वर्तमान दशा",
    calculating: "गणना हो रही है...",
    timeUnknownLabel: "समय अज्ञात",
    currentEnergies: "वर्तमान सक्रिय ऊर्जाएं",
    activeDasha: "सक्रिय दशा अवधि",
    askTransits: "मेरी सक्रिय गोचर के बारे में पूछें",
    recurringThemes: "दोहराए जाने वाले विषय",
    deepDive: "गहन विश्लेषण",
    deity: "देवता",
    lord: "प्रभु",
    symbol: "प्रतीक",
    shakti: "शक्ति",
    animal: "जानवर",
    gana: "गण",
    pada: "पद",
    emotionalPattern: "भावनात्मक पैटर्न",
    workStyle: "काम की शैली",
    relationshipStyle: "रिश्ते की शैली",
  },
  reports: {
    title: "रिपोर्ट",
    loveCompat: "प्यार और अनुकूलता",
    careerBlueprint: "करियर ब्लूप्रिंट",
    marriageTiming: "शादी का समय",
    annualForecast: "वार्षिक भविष्यफल",
    wealthGrowth: "धन वृद्धि",
    dashaDeepDive: "दशा विश्लेषण",
    unlocked: "अनलॉक",
    locked: "लॉक",
    buyReport: "रिपोर्ट खरीदें",
    preview: "झलक",
    oneTimePacks: "एक बार के पैक",
    subtitle: "जीवन परिणाम रिपोर्ट",
    intro: "प्रत्येक रिपोर्ट वास्तविक जीवन परिणाम से जुड़ी होती है — सामान्य उत्पाद नहीं। अभी आपके लिए सबसे महत्वपूर्ण बात चुनें।",
    whatsInside: "इसके अंदर क्या है",
    ready: "रिपोर्ट तैयार!",
    downloadPdf: "PDF डाउनलोड करें",
    generating: "रिपोर्ट बन रही है...",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    generateReport: "रिपोर्ट बनाएं",
    unlockFor: "के लिए अनलॉक करें",
    upgradeTo: "में अपग्रेड करें",
    askAboutTopic: "इस विषय के बारे में GrahAI से पूछें",
    completeFirst: "पहले ऑनबोर्डिंग पूरी करें।",
    tryAgain: "कुछ गड़बड़ हो गई। फिर से कोशिश करें।",
    plus: "प्लस",
    premium: "प्रीमियम",
    free: "मुफ़्त",
  },
  profile: {
    title: "प्रोफ़ाइल",
    editBirthDetails: "जन्म जानकारी बदलें",
    changeLanguage: "भाषा बदलें",
    vedic: "वैदिक",
    western: "पश्चिमी",
    questions: "सवाल",
    reportsLabel: "रिपोर्ट",
    compatibility: "अनुकूलता",
    available: "उपलब्ध",
    buyQuestions: "सवाल खरीदें",
    buyReports: "रिपोर्ट खरीदें",
    buyCompatibility: "अनुकूलता खरीदें",
    helpSupport: "मदद और सहायता",
    activity: "गतिविधि",
    referEarn: "रेफर करें और कमाएं",
    questionsHistory: "सवालों का इतिहास",
    reportsHistory: "रिपोर्ट का इतिहास",
    compatHistory: "अनुकूलता इतिहास",
    familyMembers: "परिवार के सदस्य",
    upgradePremium: "प्रीमियम में अपग्रेड करें",
    upgradeDesc: "असीमित सवाल, गहरी जानकारी, पूरी रिपोर्ट",
    signOut: "साइन आउट",
    signOutConfirm: "साइन आउट करें?",
    signOutDesc: "यह आपकी जन्म जानकारी और कुंडली इस डिवाइस से हटा देगा। आप बाद में दोबारा डाल सकते हैं।",
    cancel: "रद्द करें",
    version: "GrahAI v3.0 · भारत में प्यार से बनाया",
    editBirthTitle: "जन्म जानकारी बदलें",
    editBirthDesc: "सटीक रीडिंग के लिए अपनी जन्म जानकारी अपडेट करें।",
    saveChanges: "बदलाव सेव करें",
    saving: "सेव हो रहा है...",
    faq1Q: "GrahAI कैसे काम करता है?",
    faq1A: "GrahAI आपकी जन्म तिथि, समय और स्थान से आपकी वैदिक कुंडली बनाता है। फिर AI शास्त्रीय ज्योतिष के सिद्धांतों से आपको व्यक्तिगत मार्गदर्शन देता है।",
    faq2Q: "यह कितना सटीक है?",
    faq2A: "सटीकता जन्म समय की सटीकता पर निर्भर करती है। GrahAI वही गणना करता है जो पारंपरिक ज्योतिषी करते हैं, AI से और बेहतर बनाया।",
    faq3Q: "क्या मेरा डेटा सुरक्षित है?",
    faq3A: "आपकी जन्म जानकारी आपके डिवाइस पर ही रहती है। हम आपकी जानकारी किसी से साझा नहीं करते।",
    faq4Q: "और सवाल कैसे मिलेंगे?",
    faq4A: "आप Graha या Rishi प्लान में अपग्रेड कर सकते हैं, या प्राइसिंग पेज से सवालों के पैक खरीद सकते हैं।",
    faq5Q: "क्या रिफंड मिल सकता है?",
    faq5A: "हाँ, सभी खरीदारी पर 7 दिन की रिफंड पॉलिसी है। सहायता के लिए सपोर्ट से संपर्क करें।",
    askForHelp: "GrahAI से मदद मांगें",
  },
  pricing: {
    title: "अपना प्लान चुनें",
    subtitle: "आपके लिए सही प्लान से गहरा मार्गदर्शन पाएं",
    monthly: "मासिक",
    oneTime: "एक बार",
    free: "मुफ़्त",
    graha: "ग्रह",
    rishi: "ऋषि",
    perMonth: "/महीना",
    currentPlan: "वर्तमान प्लान",
    upgrade: "अपग्रेड",
    popular: "लोकप्रिय",
    tagline: "स्रोत-समर्थित मार्गदर्शन, गहरी स्पष्टता",
    monthlyPlans: "मासिक योजनाएं",
    oneTimeReports: "एकबारी रिपोर्ट",
    oneTimeDesc: "व्यक्तिगत रिपोर्ट खरीदें। कोई सदस्यता आवश्यक नहीं।",
    bestValue: "सर्वश्रेष्ठ मूल्य",
    secureRazorpay: "Razorpay के माध्यम से सुरक्षित",
    cancelAnytime: "कभी भी रद्द करें",
    bphsSourced: "BPHS-आधारित",
    startGraha: "ग्रह शुरू करें — ₹199/माह",
    startRishi: "ऋषि शुरू करें — ₹499/माह",
    explorePlan: "अपने ब्रह्मांडीय नक्शे की खोज करें",
    deeperInsights: "दैनिक स्पष्टता के लिए गहरी जानकारी",
    completeCompanion: "संपूर्ण ज्योतिष साथी",
  },
  paywall: {
    limitReached: "आज के मुफ़्त सवाल खत्म हो गए",
    upgradeNow: "अभी अपग्रेड करें",
    dismiss: "बाद में",
    triggerLimitTitle: "आपने आज का मुफ़्त सवाल इस्तेमाल कर लिया",
    triggerLimitDesc: "पूछते रहने के लिए अपग्रेड करें — आपकी कुंडली को कहने के लिए बहुत कुछ है।",
    triggerIntentTitle: "गहन विश्लेषण चाहते हैं?",
    triggerIntentDesc: "Graha सदस्य समय और उपायों के साथ पूर्ण व्याख्या प्राप्त करते हैं।",
    triggerSourceTitle: "आप गहराई से खोदा रहे हैं — हमें यह पसंद है",
    triggerSourceDesc: "पूर्ण स्रोत-समर्थित तर्क और असीमित सवाल अनलॉक करें।",
    triggerReportTitle: "यह रिपोर्ट वास्तविक जीवन परिणाम से जुड़ी है",
    triggerReportDesc: "आपके लिए सबसे महत्वपूर्ण चीज़ों के लिए विस्तृत, कुंडली-विशिष्ट मार्गदर्शन अनलॉक करें।",
    triggerGeneralTitle: "संपूर्ण GrahAI अनुभव अनलॉक करें",
    triggerGeneralDesc: "गहरी स्पष्टता, अधिक सवाल, प्रीमियम रिपोर्ट।",
    tryPlan: "आजमाएं",
  },
  referral: {
    title: "रेफर करें और कमाएं",
    subtitle: "दोस्तों के साथ GrahAI शेयर करें और इनाम पाएं",
    yourCode: "आपका रेफरल कोड",
    copyCode: "कोड कॉपी करें",
    shareWithFriends: "दोस्तों के साथ शेयर करें",
    rewardsTitle: "आपके इनाम",
    friendsReferred: "रेफर किए गए दोस्त",
    shareText: "व्यक्तिगतकृत वैदिक ज्योतिष अंतर्दृष्टि के लिए GrahAI में शामिल हों! मेरा कोड इस्तेमाल करें:",
    rewardMilestones: "पुरस्कार मील के पत्थर",
    howItWorks: "यह कैसे काम करता है",
    step1: "अपना अनन्य रेफरल कोड दोस्तों के साथ साझा करें",
    step2: "वे आपके कोड के साथ साइन अप करते हैं और ऑनबोर्डिंग पूरी करते हैं",
    step3: "आप दोनों को तुरंत 3 बोनस सवाल मिलते हैं",
    step4: "जैसे-जैसे अधिक दोस्त शामिल होते हैं, बड़े पुरस्कार अनलॉक करें",
    invite: "आमंत्रण",
    friend: "दोस्त",
    friends: "दोस्त",
    freeQuestions: "5 मुफ़्त सवाल",
    freeReport: "1 मुफ़्त रिपोर्ट",
    monthGraha: "1 महीने की Graha योजना",
    monthRishi: "1 महीने की Rishi योजना",
    friendsJoined: "दोस्त शामिल हुए",
    rewardsEarned: "पुरस्कार अर्जित",
  },
  source: {
    whyGrahaiSays: "GrahAI ऐसा क्यों कहता है",
    sourceBackedReasoning: "स्रोत-समर्थित तर्क",
    activePrinciple: "सक्रिय सिद्धांत",
    explanation: "व्याख्या",
    shownBecause: "यह इसलिए दिखाया गया क्योंकि:",
    groundsInsight: "GrahAI प्रत्येक अंतर्दृष्टि को शास्त्रीय ज्योतिष परंपरा में आधारित करता है",
  },
  common: {
    loading: "लोड हो रहा है...",
    error: "कुछ गड़बड़ हो गई",
    retry: "फिर से कोशिश करें",
    close: "बंद करें",
    back: "वापस",
    next: "आगे",
    save: "सेव करें",
    done: "हो गया",
    today: "आज",
    tomorrow: "कल",
  },
}

// ═══════════════════════════════════════════════════
// Tamil
// ═══════════════════════════════════════════════════
const ta: Translations = {
  langPicker: {
    title: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    subtitle: "பிறகு புரொஃபைல் செட்டிங்ஸில் மாற்றிக்கொள்ளலாம்.",
  },
  onboarding: {
    welcomeSubtitle: "காதல், தொழில், நேரம், வாழ்க்கை — தெளிவான பதில்கள்.",
    welcomeDesc: "GrahAI உங்கள் ஜாதகத்தை படித்து, நிதானமான, நடைமுறை வழிகாட்டுதல் வழங்குகிறது.",
    getFirstInsight: "எனது முதல் பதிலைப் பெறுங்கள்",
    intentTitle: "என்னிடம் வந்தது எதற்காக?",
    intentSubtitle: "இது உங்கள் அனுபவத்தை தனிப்பயனாக்க உதவும்",
    intentCareer: "தொழில் & வேலை",
    intentLove: "காதல் & உறவு",
    intentMarriage: "திருமணம் & நேரம்",
    intentMoney: "பணம் & வளர்ச்சி",
    intentEmotional: "உணர்வு ஆற்றல்",
    intentDaily: "தினசரி வழிகாட்டுதல்",
    intentExploring: "பார்த்துக்கொண்டிருக்கிறேன்",
    trustTitle: "பொதுவானது அல்ல. சீரற்றது அல்ல.",
    trustSubtitle: "உங்கள் ஜாதகத்தின் அடிப்படையில்.",
    trustCard1Title: "உங்கள் ஜாதகம், உங்கள் கணக்கீடு",
    trustCard1Desc: "Swiss Ephemeris Engine கொண்டு கோள்களின் சரியான நிலை கண்டுபிடிக்கிறோம் — NASA மற்றும் உலகம் முழுதுமுள்ள ஜோதிடர்கள் பயன்படுத்தும் engine இதுதான்।",
    trustCard2Title: "5,000 வருடங்களின் ஜோதிசம்",
    trustCard2Desc: "BPHS, Saravali, Phaladeepika — பழைய சாஸ்திரங்களிலிருந்து வழிகாட்டுதல், நூலின் பெயர் அப்படியே வைத்திருக்கிறோம்।",
    trustCard3Title: "முக்கிய முடிவுகளுக்கு சாதனம் செய்யப்பட்டது",
    trustCard3Desc: "தொழில், காதல், நேரம், பணம் — எளிய, நிஜ வாழ்க்கைக்கான வழிகாட்டுதல்।",
    birthTitle: "உங்கள் பிறப்பு விவரங்கள்",
    birthSubtitle: "துல்லியமான விவரங்கள் துல்லியமான வழிகாட்டுதலை அளிக்கும்",
    fullName: "முழுப் பெயர்",
    fullNamePlaceholder: "உங்கள் முழுப் பெயரை உள்ளிடவும்",
    dateOfBirth: "பிறந்த தேதி",
    timeOfBirth: "பிறந்த நேரம்",
    dontKnowTime: "பிறந்த நேரம் தெரியாது",
    placeOfBirth: "பிறந்த இடம்",
    placePlaceholder: "நகரம் தேடவும் — உதா. சென்னை, மதுரை...",
    generateChart: "எனது ஜாதகத்தை உருவாக்கவும்",
    revealTitle: "உங்கள் ஜாதகம், முதல் பார்வை",
    revealSubtitle: "{name} இன் விண்மீன் வரைபடம்",
    moonSign: "சந்திர ராசி",
    nakshatra: "நட்சத்திரம்",
    risingSign: "லக்ன ராசி",
    todayLabel: "இன்று",
    readyToAsk: "முதல் கேள்வி கேட்கத் தயாரா?",
    askFirstTitle: "முதல் கேள்வியைக் கேளுங்கள்",
    askFirstSubtitle: "உங்கள் ஜாதகம் தயார். காதல், தொழில், நேரம் பற்றி எதையும் கேளுங்கள்.",
    typePlaceholder: "உங்கள் கேள்வியை எழுதுங்கள்...",
    suggestionsLabel: "உங்களுக்கான பரிந்துரைகள்",
    askNow: "GrahAI-யிடம் கேளுங்கள்",
    skipExplore: "தவிர்த்து பாருங்கள்",
    saveChartTitle: "உங்கள் ஜாதகத்தை சேமிக்கவும்",
    saveChartSubtitle: "உங்கள் ஜாதகம், வரலாறு மற்றும் தினசரி வழிகாட்டுதலை எல்லா சாதனங்களிலும் பாதுகாக்க ஈமெயில் உள்ளிடவும்.",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "உங்கள் ஜாதகம் பாதுகாப்பாக சேமிக்கப்படும்",
    saveBenefit2: "தினசரி தனிப்பயன் வழிகாட்டுதல்",
    saveBenefit3: "எல்லா அமர்வுகளிலும் கேள்வி வரலாறு",
    saveAndEnter: "சேமித்து GrahAI-ல் நுழையுங்கள்",
    skipForNow: "இப்போது தவிர்",
    continueBtn: "தொடரவும்",
    readingChart: "உங்கள் ஜாதகத்தை படிக்கிறது...",
    askYourFirst: "முதல் கேள்வியைக் கேளுங்கள்",
  },
  nav: { home: "முகப்பு", ask: "கேளுங்கள்", compatibility: "பொருத்தம்", reports: "அறிக்கைகள்", profile: "புரொஃபைல்" },
  home: {
    greeting: "இனிய {timeOfDay}, {name}",
    todayGuidance: "இன்றைய வழிகாட்டுதல்",
    tomorrowGuidance: "நாளைய வழிகாட்டுதல்",
    loveCard: "காதல்", careerCard: "தொழில்", energyCard: "ஆற்றல்",
    panchangTitle: "பஞ்சாங்கம்", luckyColors: "அதிர்ஷ்ட நிறங்கள்", luckyNumbers: "அதிர்ஷ்ட எண்கள்",
    askQuestion: "கேள்வி கேளுங்கள்", viewReports: "அறிக்கைகள் பாருங்கள்", sourcesTitle: "ஆதாரங்கள்",
    doThis: "இதைச் செய்யுங்கள்", beCareful: "조심하세요", whyActive: "இது ஏன் செயல்பட்டுக்கொண்டிருக்கிறது",
    unlockDeeper: "ஆழமான உணர்வை அনுமதி", unlockDesc: "தொழில் வரைபடங்கள், நேர அறிக்கைகள், பொருத்தம்",
    completeOnboarding: "உங்கள் தினசரி வழிகாட்டுதலை காணவும் onboarding பூர்ணம் செய்யுங்கள்", askMore: "மேலும் கேளுங்கள்",
  },
  ask: {
    title: "GrahAI-யிடம் கேளுங்கள்", placeholder: "காதல், தொழில், நேரம் பற்றி கேளுங்கள்...",
    topicLove: "காதல்", topicCareer: "தொழில்", topicTiming: "நேரம்", topicFamily: "குடும்பம்", topicHealth: "உடல்நலம்", topicMoney: "பணம்",
    directAnswer: "நேரடி பதில்", whyShowingUp: "ஏன் இது வருகிறது", whatToDo: "என்ன செய்யவேண்டும்",
    whatToAvoid: "என்ன தவிர்க்கவேண்டும்", timeWindow: "நேர கட்டம்", remedy: "பரிகாரம்", source: "ஆதாரம்",
    followUp: "தொடர் கேள்விகள்", questionsLeft: "இன்று {count} கேள்விகள் உள்ளன", upgradeForMore: "மேலும் பெற அப்கிரேட் செய்யுங்கள்",
    suggestion1: "என் ஜாதகத்தின் அடிப்படையில் இந்த வாரம் எதில் கவனம் செலுத்த வேண்டும்?",
    suggestion2: "நான் சமீபத்தில் ஏன் அமைதியற்ற அல்லது சிக்கி இருக்கிறேன்?",
    suggestion3: "எனது அடுத்த பெரிய வாய்ப்பு எப்போது வரப்போகிறது?",
    followUp1: "என்னை மேலும் சொல்லுங்கள்", followUp2: "இது எப்போது மாறுகிறது?", followUp3: "இது ஏன் மீண்டும் மீண்டும் நிகழ்கிறது?", followUp4: "நான் அடுத்து என்ன செய்ய வேண்டும்?",
    whatsOnMind: "உங்கள் மனதில் என்ன இருக்கிறது", history: "வரலாறு", clearConversation: "உரையாடலை அழி",
    thisSession: "இந்த அமர்வு", noQuestionsYet: "இந்த அமர்வில் இன்னும் கேள்விகள் கேட்கப்படவில்லை.",
    questionsAppearHere: "உங்கள் கேள்விகள் இங்கே தோன்றும்.", errorGenerate: "நான் பதிலைப் பெற முடியவில்லை.",
    errorRetry: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.", thinking: "சிந்தனை...",
    questionsRemaining: "கேள்விகள் மீதமுள்ளன", basedOnChart: "உங்கள் கேள்வி மற்றும் ஜாதக பகுப்பாய்வின் அடிப்படையில்",
    viewFullSource: "முழு ஆதாரத்தைக் காணுங்கள்",
  },
  chart: {
    title: "எனது ஜாதகம்", birthChart: "பிறப்பு ஜாதகம்", sunSign: "சூரிய ராசி", moonSign: "சந்திர ராசி",
    risingSign: "லக்ன ராசி", nakshatra: "நட்சத்திரம்", element: "தத்துவம்", strengths: "பலங்கள்",
    sensitivities: "உணர்திறன்", showAdvanced: "மேலும் காட்டு", hideAdvanced: "குறைவாக காட்டு",
    simple: "எளிமையான", advanced: "மேம்பட்ட", yourBlueprint: "உங்கள் விண்மீன் வரைபடம்", sun: "சூரியன்",
    elementLabel: "தத்துவம்", nakshatraPada: "நட்சத்திர பாதம்", nakshatraLord: "நட்சத்திர கர்த்தா", nakshatraDeity: "நட்சத்திர தெய்வம்",
    signQuality: "ராசி குணம்", rulingPlanet: "ஆளும் கிரகம்", signDegree: "ராசி பாகை", lifePath: "வாழ்க்கை பாதை",
    currentDasha: "தற்போதைய தசை", calculating: "கணக்கிடப்படுகிறது...", timeUnknownLabel: "நேரம் தெரியாது",
    currentEnergies: "தற்போதைய সक்রிய ஆற்றல்கள்", activeDasha: "சक்தி தசை காலம்", askTransits: "எனது சक்தி நகர்வுகளைப் பற்றி கேளுங்கள்",
    recurringThemes: "மீண்டும் மீண்டும் வரும் கருப்பொருள்கள்", deepDive: "ஆழமாக நுழைய", deity: "தெய்வம்", lord: "கர்த்தா",
    symbol: "சின்னம்", shakti: "சக்தி", animal: "விலங்கு", gana: "கணം", pada: "பாதம்",
    emotionalPattern: "உணர்ச்சி முறை", workStyle: "வேலை செய்முறை", relationshipStyle: "உறவு செய்முறை",
  },
  reports: {
    title: "அறிக்கைகள்", loveCompat: "காதல் & பொருத்தம்", careerBlueprint: "தொழில் வரைபடம்",
    marriageTiming: "திருமண நேரம்", annualForecast: "வருடாந்திர கணிப்பு", wealthGrowth: "செல்வ வளர்ச்சி",
    dashaDeepDive: "தசா ஆழ்வு", unlocked: "திறந்தது", locked: "பூட்டியது",
    buyReport: "அறிக்கை வாங்கவும்", preview: "முன்னோட்டம்", oneTimePacks: "ஒரு முறை பேக்குகள்",
    subtitle: "வாழ்க்கை பலன் அறிக்கைகள்", intro: "ஒவ்வொரு அறிக்கையும் ஒரு உண்மையான வாழ்க்கை பலனுடன் வரைபடமாக உள்ளது — ஒரு பொதுவான பொருள் அல்ல।",
    whatsInside: "உள்ளே என்ன இருக்கிறது", ready: "அறிக்கை தயாரம்!", downloadPdf: "PDF பதிவிறக்க",
    generating: "அறிக்கை உருவாக்க ...", downloadReport: "அறிக்கை பதிவிறக்க", generateReport: "அறிக்கை உருவாக்க",
    unlockFor: "க்கு அনுமतி", upgradeTo: "க்கு முன்னேற்றம்", askAboutTopic: "இந்த தலைப்பை பற்றி GrahAI க்கு கேளுங்கள்",
    completeFirst: "முதலில் onboarding முடிக்க.", tryAgain: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    plus: "கூட", premium: "பிரீமியம்", free: "இலவசம்",
  },
  profile: {
    title: "புரொஃபைல்", editBirthDetails: "பிறப்பு விவரங்களை மாற்றவும்", changeLanguage: "மொழி மாற்றவும்",
    vedic: "வேதம்", western: "மேற்கத்தியம்", questions: "கேள்விகள்", reportsLabel: "அறிக்கைகள்",
    compatibility: "பொருத்தம்", available: "உள்ளது", buyQuestions: "கேள்விகள் வாங்கவும்",
    buyReports: "அறிக்கைகள் வாங்கவும்", buyCompatibility: "பொருத்தம் வாங்கவும்",
    helpSupport: "உதவி & ஆதரவு", activity: "செயல்பாடு", referEarn: "பரிந்துரை & சம்பாதிப்பு",
    questionsHistory: "கேள்விகள் வரலாறு", reportsHistory: "அறிக்கைகள் வரலாறு",
    compatHistory: "பொருத்தம் வரலாறு", familyMembers: "குடும்ப உறுப்பினர்கள்",
    upgradePremium: "பிரீமியத்திற்கு அப்கிரேட் செய்யுங்கள்", upgradeDesc: "வரம்பற்ற கேள்விகள், ஆழமான பதில்கள், முழு அறிக்கைகள்",
    signOut: "வெளியேறு", signOutConfirm: "வெளியேற வேண்டுமா?",
    signOutDesc: "இது உங்கள் பிறப்பு தகவல் மற்றும் ஜாதகத்தை இந்த சாதனத்தில் இருந்து நீக்கும். பின்னர் மீண்டும் சேர்க்கலாம்.",
    cancel: "ரத்து செய்", version: "GrahAI v3.0 · இந்தியாவில் அன்புடன் உருவாக்கப்பட்டது",
    editBirthTitle: "பிறப்பு விவரங்களை மாற்றவும்", editBirthDesc: "துல்லியமான பதில்களுக்கு உங்கள் பிறப்பு தகவலை புதுப்பிக்கவும்.",
    saveChanges: "மாற்றங்களை சேமி", saving: "சேமிக்கிறது...",
    faq1Q: "GrahAI எப்படி வேலை செய்கிறது?", faq1A: "GrahAI உங்கள் பிறந்த தேதி, நேரம், இடம் கொண்டு வேத ஜாதகம் கணிக்கிறது. AI சாஸ்திர ஜோதிட கோட்பாடுகளை பயன்படுத்தி வழிகாட்டுகிறது.",
    faq2Q: "இது எவ்வளவு துல்லியமானது?", faq2A: "பிறந்த நேரத்தின் துல்லியத்தை பொறுத்தது. GrahAI பாரம்பரிய ஜோதிடர்கள் பயன்படுத்தும் அதே கணக்கீடுகளை பயன்படுத்துகிறது.",
    faq3Q: "எனது தரவு பாதுகாப்பாக உள்ளதா?", faq3A: "உங்கள் பிறப்பு தரவு உங்கள் சாதனத்தில் மட்டுமே சேமிக்கப்படும். நாங்கள் யாரிடமும் பகிர்வதில்லை.",
    faq4Q: "மேலும் கேள்விகள் எப்படி பெறுவது?", faq4A: "Graha அல்லது Rishi திட்டத்திற்கு அப்கிரேட் செய்யலாம், அல்லது கேள்வி பேக்குகள் வாங்கலாம்.",
    faq5Q: "பணம் திரும்ப கிடைக்குமா?", faq5A: "ஆம், எல்லா வாங்குதல்களுக்கும் 7 நாள் பணம் திரும்ப கொள்கை உள்ளது.",
    askForHelp: "GrahAI-யிடம் உதவி கேளுங்கள்",
  },
  pricing: {
    title: "உங்கள் திட்டத்தைத் தேர்ந்தெடுக்கவும்", subtitle: "உங்களுக்கு ஏற்ற திட்டத்தில் ஆழமான வழிகாட்டுதல் பெறுங்கள்",
    monthly: "மாதாந்திர", oneTime: "ஒரு முறை", free: "இலவசம்", graha: "கிரகம்", rishi: "ரிஷி",
    perMonth: "/மாதம்", currentPlan: "தற்போதைய திட்டம்", upgrade: "அப்கிரேட்", popular: "பிரபலம்",
    tagline: "மூல ஆதரவு வழிகாட்டுதல், ஆழமான தெளிவு", monthlyPlans: "மாதாந்திர திட்டங்கள்",
    oneTimeReports: "ஒரு முறை அறிக்கைகள்", oneTimeDesc: "தனிப்பட்ட அறிக்கைகள் வாங்கவும்.",
    bestValue: "சிறந்த மதிப்பு", secureRazorpay: "Razorpay மூலம் பாதுகாப்பு", cancelAnytime: "எப்போது வேண்டுமோ ரத்துசெய்யுங்கள்",
    bphsSourced: "BPHS-ஆல் ஆபத்துற்றது", startGraha: "க்கிரகம் தொடங்க", startRishi: "ரிஷி தொடங்க",
    explorePlan: "உங்கள் விண்மீன் வரைபடம் ஆராயுங்கள்", deeperInsights: "தினசரி தெளிவுக்கு ஆழமான உணர்வுகள்",
    completeCompanion: "முழு ஜ்யோதிஷ உபயோகி",
  },
  paywall: { limitReached: "இன்றைய இலவச கேள்விகள் முடிந்தன", upgradeNow: "இப்போது அப்கிரேட் செய்யுங்கள்", dismiss: "பின்னர்",
    triggerLimitTitle: "நீங்கள் இன்றைய இலவச கேள்வியைப் பயன்படுத்தியுள்ளீர்கள்", triggerLimitDesc: "கேட்பது தொடர அப்கிரேட் செய்யுங்கள்.",
    triggerIntentTitle: "ஆழமான பகுப்பாய்வு வேண்டும்?", triggerIntentDesc: "Graha உறுப்பினர்கள் முழுமையான விளக்கங்களைப் பெறுகிறார்கள்.",
    triggerSourceTitle: "நீங்கள் ஆழமாக வெட்டுவதாக இருக்கிறீர்கள்", triggerSourceDesc: "முழுமையான ஆதாரம் மற்றும் வரம்பற்ற கேள்விகளை அনலாக் செய்யுங்கள்.",
    triggerReportTitle: "இந்த அறிக்கை ஒரு உண்மையான வாழ்க்கை பலனுடன் வரைபடமாக உள்ளது", triggerReportDesc: "விস்தாரமான அறிக்கையை அனலாக் செய்யுங்கள்.",
    triggerGeneralTitle: "முழுமையான GrahAI அனுபவத்தை அனலாக் செய்யுங்கள்", triggerGeneralDesc: "ஆழமான தெளிவு, அதிக கேள்விகள், பிரீமியம் அறிக்கைகள்.",
    tryPlan: "முயற்சிக்க",
  },
  referral: {
    title: "பரிந்துரை & சம்பாதிப்பு", subtitle: "நண்பர்களுடன் GrahAI பகிர்ந்து வெகுமதிகள் பெறுங்கள்",
    yourCode: "உங்கள் பரிந்துரை குறியீடு", copyCode: "குறியீடு நகலெடு", shareWithFriends: "நண்பர்களுடன் பகிரவும்",
    rewardsTitle: "உங்கள் வெகுமதிகள்", friendsReferred: "பரிந்துரைக்கப்பட்ட நண்பர்கள்",
    shareText: "ব্যক்তিগত ভেদিক জ্যোতিষ অন্তর্দৃষ্টির জন্য GrahAI ত্রুকুল করুন!", rewardMilestones: "পুরস্কার মাইলফলক",
    howItWorks: "এটি কীভাবে কাজ করে", step1: "নির্বাচন করা বন্ধুদের সাথে আপনার অনন্য রেফারেল কোড শেয়ার করুন", step2: "তারা আপনার কোড দিয়ে সাইন আপ করে এবং onboarding সম্পূর্ণ করে",
    step3: "আপনি উভয়ে তাত্ক্ষণিক 3 বোনাস প্রশ্ন পান", step4: "আরও বন্ধুরা যোগদান করার সাথে সাথে বড় পুরস্কার আনলক করুন",
    invite: "আমন্ত্রণ", friend: "বন্ধু", friends: "বন্ধু", freeQuestions: "5 নিখরচা প্রশ্ন", freeReport: "1 নিখরচা প্রতিবেদন",
    monthGraha: "1 মাসের Graha পরিকল্পনা", monthRishi: "1 মাসের Rishi পরিকল্পনা", friendsJoined: "বন্ধু যোগদান", rewardsEarned: "পুরস্কার অর্জিত",
  },
  source: {
    whyGrahaiSays: "GrahAI কেন এটি বলে", sourceBackedReasoning: "উৎস-সমর্থিত যুক্তি", activePrinciple: "সক্রিয় নীতি",
    explanation: "ব্যাখ্যা", shownBecause: "এটি প্রদর্শিত হয়েছে কারণ:", groundsInsight: "GrahAI প্রতিটি অন্তর্দৃষ্টিকে শাস্ত্রীয় ভেদিক ঐতিহ্যে প্রতিষ্ঠিত করে",
  },
  common: { loading: "ஏற்றுகிறது...", error: "ஏதோ தவறு ஏற்பட்டது", retry: "மீண்டும் முயற்சிக்கவும்", close: "மூடு", back: "பின்", next: "அடுத்து", save: "சேமி", done: "முடிந்தது", today: "இன்று", tomorrow: "நாளை" },
}

// ═══════════════════════════════════════════════════
// Telugu
// ═══════════════════════════════════════════════════
const te: Translations = {
  langPicker: { title: "మీ భాషను ఎంచుకోండి", subtitle: "మీరు దీన్ని తర్వాత ప్రొఫైల్ సెట్టింగ్స్‌లో మార్చుకోవచ్చు." },
  onboarding: {
    welcomeSubtitle: "ప్రేమ, కెరీర్, సమయం, జీవితం — స్పష్టమైన సమాధానాలు.",
    welcomeDesc: "GrahAI మీ జాతకాన్ని చదివి, ప్రశాంతమైన, ఆచరణాత్మక మార్గదర్శకత్వం అందిస్తుంది.",
    getFirstInsight: "నా మొదటి అంతర్దృష్టి పొందండి",
    intentTitle: "ఆజ ఇక్కడకు మీరు ఎందుకు వచ్చారు?",
    intentSubtitle: "ఇది మీ అనుభవాన్ని మెరుగుపరచడంలో సహాయపడుతుంది",
    intentCareer: "కెరీర్ & పని", intentLove: "ప్రేమ & సంబంధం", intentMarriage: "వివాహం & సమయం",
    intentMoney: "డబ్బు & వృద్ధి", intentEmotional: "భావోద్వేగ శక్తి", intentDaily: "రోజువారీ మార్గదర్శకత్వం", intentExploring: "చూస్తున్నాను",
    trustTitle: "సాధారణం కాదు. యాదృచ్ఛికం కాదు.", trustSubtitle: "మీ జాతకం ఆధారంగా.",
    trustCard1Title: "మీ జాతకం, మీ గణన", trustCard1Desc: "Swiss Ephemeris Engine నుండి గ్రహాల ఖచ్చితమైన స్థితి మనకు తెలుస్తుంది — NASA మరియు ప్రపంచవ్యాప్త జ్యోతిష్కులు ఈ engine ఉపయోగిస్తారు।",
    trustCard2Title: "5,000 సంవత్సరాల జ్యోతిషం", trustCard2Desc: "BPHS, Saravali, Phaladeepika నుండి — పురాతన ఆధారం, సులభమైన వివరణ।",
    trustCard3Title: "ముఖ్యమైన నిర్ణయాలకు రూపొందించిన", trustCard3Desc: "కెరీర్, ప్రేమ, సమయం, డబ్బు — నిజ జీవితానికి సరళ మార్గదర్శకత్వం।",
    birthTitle: "మీ జన్మ వివరాలు", birthSubtitle: "ఖచ్చితమైన వివరాలు ఖచ్చితమైన మార్గదర్శకత్వానికి దారితీస్తాయి",
    fullName: "పూర్తి పేరు", fullNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
    dateOfBirth: "పుట్టిన తేదీ", timeOfBirth: "పుట్టిన సమయం", dontKnowTime: "నా పుట్టిన సమయం తెలియదు",
    placeOfBirth: "పుట్టిన ప్రదేశం", placePlaceholder: "నగరం వెతకండి — ఉదా. హైదరాబాద్, విశాఖ...",
    generateChart: "నా జాతకాన్ని రూపొందించండి",
    revealTitle: "మీ జాతకం, మొదటి చూపు", revealSubtitle: "{name} యొక్క విశ్వ బ్లూప్రింట్",
    moonSign: "చంద్ర రాశి", nakshatra: "నక్షత్రం", risingSign: "లగ్న రాశి", todayLabel: "ఈరోజు",
    readyToAsk: "మొదటి ప్రశ్న అడగడానికి సిద్ధమా?",
    askFirstTitle: "మీ మొదటి ప్రశ్న అడగండి", askFirstSubtitle: "మీ జాతకం సిద్ధంగా ఉంది. ప్రేమ, కెరీర్, సమయం గురించి ఏదైనా అడగండి.",
    typePlaceholder: "మీ ప్రశ్న రాయండి...", suggestionsLabel: "మీ కోసం సూచనలు",
    askNow: "GrahAI ని అడగండి", skipExplore: "దాటవేసి చూడండి",
    saveChartTitle: "మీ జాతకాన్ని సేవ్ చేయండి", saveChartSubtitle: "అన్ని పరికరాల్లో మీ జాతకం, చరిత్ర మరియు రోజువారీ మార్గదర్శకత్వం కోసం ఇమెయిల్ నమోదు చేయండి.",
    emailPlaceholder: "your@email.com", saveBenefit1: "మీ జాతకం సురక్షితంగా సేవ్", saveBenefit2: "రోజువారీ వ్యక్తిగత మార్గదర్శకత్వం", saveBenefit3: "అన్ని సెషన్లలో ప్రశ్న చరిత్ర",
    saveAndEnter: "సేవ్ చేసి GrahAI లోకి ప్రవేశించండి", skipForNow: "ఇప్పుడు దాటవేయండి", continueBtn: "కొనసాగించు",
    readingChart: "మీ జాతకాన్ని చదువుతోంది...", askYourFirst: "మీ మొదటి ప్రశ్న అడగండి",
  },
  nav: { home: "హోమ్", ask: "అడగండి", compatibility: "అనుకూలత", reports: "నివేదికలు", profile: "ప్రొఫైల్" },
  home: { ...en.home, greeting: "శుభ {timeOfDay}, {name}", todayGuidance: "ఈరోజు మార్గదర్శకత్వం", tomorrowGuidance: "రేపటి మార్గదర్శకత్వం", loveCard: "ప్రేమ", careerCard: "కెరీర్", energyCard: "శక్తి", panchangTitle: "పంచాంగం", luckyColors: "అదృష్ట రంగులు", luckyNumbers: "అదృష్ట సంఖ్యలు", askQuestion: "ప్రశ్న అడగండి", viewReports: "నివేదికలు చూడండి", sourcesTitle: "మూలాలు" },
  ask: { ...en.ask, title: "GrahAI ని అడగండి", placeholder: "ప్రేమ, కెరీర్, సమయం గురించి అడగండి...", topicLove: "ప్రేమ", topicCareer: "కెరీర్", topicTiming: "సమయం", topicFamily: "కుటుంబం", topicHealth: "ఆరోగ్యం", topicMoney: "డబ్బు", directAnswer: "నేరుగా సమాధానం", whyShowingUp: "ఇది ఎందుకు కనిపిస్తోంది", whatToDo: "ఏమి చేయాలి", whatToAvoid: "ఏమి తప్పించాలి", timeWindow: "సమయ వ్యవధి", remedy: "పరిహారం", source: "మూలం", followUp: "తదుపరి ప్రశ్నలు", questionsLeft: "ఈరోజు {count} ప్రశ్నలు మిగిలి ఉన్నాయి", upgradeForMore: "మరిన్ని కోసం అప్‌గ్రేడ్ చేయండి" },
  chart: { ...en.chart, title: "నా జాతకం", birthChart: "జన్మ జాతకం", sunSign: "సూర్య రాశి", moonSign: "చంద్ర రాశి", risingSign: "లగ్న రాశి", nakshatra: "నక్షత్రం", element: "తత్వం", strengths: "బలాలు", sensitivities: "సున్నితత్వాలు", showAdvanced: "మరింత చూపు", hideAdvanced: "తక్కువ చూపు" },
  reports: { ...en.reports, title: "నివేదికలు", loveCompat: "ప్రేమ & అనుకూలత", careerBlueprint: "కెరీర్ బ్లూప్రింట్", marriageTiming: "వివాహ సమయం", annualForecast: "వార్షిక అంచనా", wealthGrowth: "సంపద వృద్ధి", dashaDeepDive: "దశా విశ్లేషణ", unlocked: "అన్‌లాక్", locked: "లాక్", buyReport: "నివేదిక కొనండి", preview: "ప్రివ్యూ", oneTimePacks: "ఒకసారి ప్యాక్‌లు" },
  profile: {
    title: "ప్రొఫైల్", editBirthDetails: "జన్మ వివరాలు మార్చండి", changeLanguage: "భాష మార్చండి",
    vedic: "వేద", western: "పాశ్చాత్య", questions: "ప్రశ్నలు", reportsLabel: "నివేదికలు", compatibility: "అనుకూలత",
    available: "అందుబాటులో", buyQuestions: "ప్రశ్నలు కొనండి", buyReports: "నివేదికలు కొనండి", buyCompatibility: "అనుకూలత కొనండి",
    helpSupport: "సహాయం & మద్దతు", activity: "కార్యాచరణ", referEarn: "రిఫర్ చేసి సంపాదించండి",
    questionsHistory: "ప్రశ్నల చరిత్ర", reportsHistory: "నివేదికల చరిత్ర", compatHistory: "అనుకూలత చరిత్ర", familyMembers: "కుటుంబ సభ్యులు",
    upgradePremium: "ప్రీమియంకి అప్‌గ్రేడ్ చేయండి", upgradeDesc: "అపరిమిత ప్రశ్నలు, లోతైన అంతర్దృష్టులు, పూర్తి నివేదికలు",
    signOut: "సైన్ అవుట్", signOutConfirm: "సైన్ అవుట్ చేయాలా?",
    signOutDesc: "ఇది మీ జన్మ డేటా మరియు జాతకాన్ని ఈ పరికరం నుండి తొలగిస్తుంది. తర్వాత మళ్ళీ చేర్చవచ్చు.",
    cancel: "రద్దు", version: "GrahAI v3.0 · భారతదేశంలో ప్రేమతో తయారు",
    editBirthTitle: "జన్మ వివరాలు మార్చండి", editBirthDesc: "ఖచ్చితమైన రీడింగ్‌ల కోసం మీ జన్మ సమాచారాన్ని అప్‌డేట్ చేయండి.",
    saveChanges: "మార్పులు సేవ్ చేయండి", saving: "సేవ్ అవుతోంది...",
    faq1Q: "GrahAI ఎలా పని చేస్తుంది?", faq1A: "GrahAI మీ జన్మ తేదీ, సమయం, ప్రదేశం ఉపయోగించి వేద జాతకం లెక్కిస్తుంది.",
    faq2Q: "ఇది ఎంత ఖచ్చితం?", faq2A: "ఖచ్చితత్వం జన్మ సమయ ఖచ్చితత్వంపై ఆధారపడి ఉంటుంది.",
    faq3Q: "నా డేటా సురక్షితమా?", faq3A: "మీ జన్మ డేటా మీ పరికరంలో మాత్రమే ఉంటుంది.",
    faq4Q: "మరిన్ని ప్రశ్నలు ఎలా పొందాలి?", faq4A: "Graha లేదా Rishi ప్లాన్‌కి అప్‌గ్రేడ్ చేయండి.",
    faq5Q: "రీఫండ్ పొందగలనా?", faq5A: "అవును, 7 రోజుల రీఫండ్ పాలసీ ఉంది.",
    askForHelp: "GrahAI ని సహాయం అడగండి",
  },
  pricing: { ...en.pricing, title: "మీ ప్లాన్ ఎంచుకోండి", subtitle: "మీకు సరిపోయే ప్లాన్‌తో లోతైన మార్గదర్శకత్వం పొందండి", monthly: "నెలవారీ", oneTime: "ఒకసారి", free: "ఉచితం", graha: "గ్రహ", rishi: "ఋషి", perMonth: "/నెల", currentPlan: "ప్రస్తుత ప్లాన్", upgrade: "అప్‌గ్రేడ్", popular: "ప్రజాదరణ" },
  paywall: { ...en.paywall, limitReached: "ఈరోజు ఉచిత ప్రశ్నలు అయిపోయాయి", upgradeNow: "ఇప్పుడు అప్‌గ్రేడ్ చేయండి", dismiss: "తర్వాత" },
  referral: { ...en.referral, title: "రిఫర్ చేసి సంపాదించండి", subtitle: "స్నేహితులతో GrahAI షేర్ చేసి రివార్డ్‌లు పొందండి", yourCode: "మీ రిఫరల్ కోడ్", copyCode: "కోడ్ కాపీ చేయండి", shareWithFriends: "స్నేహితులతో షేర్ చేయండి", rewardsTitle: "మీ రివార్డ్‌లు", friendsReferred: "రిఫర్ చేసిన స్నేహితులు" },
  source: en.source,
  common: { loading: "లోడ్ అవుతోంది...", error: "ఏదో తప్పు జరిగింది", retry: "మళ్ళీ ప్రయత్నించండి", close: "మూయండి", back: "వెనుకకు", next: "తదుపరి", save: "సేవ్", done: "అయింది", today: "ఈరోజు", tomorrow: "రేపు" },
}

// ═══════════════════════════════════════════════════
// Kannada
// ═══════════════════════════════════════════════════
const kn: Translations = {
  langPicker: { title: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", subtitle: "ನೀವು ಇದನ್ನು ನಂತರ ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಬದಲಾಯಿಸಬಹುದು." },
  onboarding: {
    welcomeSubtitle: "ಪ್ರೀತಿ, ವೃತ್ತಿ, ಸಮಯ ಮತ್ತು ಜೀವನಕ್ಕೆ ಸ್ಪಷ್ಟ ಉತ್ತರಗಳು.",
    welcomeDesc: "GrahAI ನಿಮ್ಮ ಜಾತಕವನ್ನು ಓದಿ, ಶಾಂತ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
    getFirstInsight: "ನನ್ನ ಮೊದಲ ಒಳನೋಟ ಪಡೆಯಿರಿ", intentTitle: "ಇಂದು ಇಲ್ಲಿ ಬಂದವುದು ಏಕೆ?",
    intentSubtitle: "ಇದು ನಿಮ್ಮ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ",
    intentCareer: "ವೃತ್ತಿ & ಕೆಲಸ", intentLove: "ಪ್ರೀತಿ & ಸಂಬಂಧ", intentMarriage: "ಮದುವೆ & ಸಮಯ",
    intentMoney: "ಹಣ & ಬೆಳವಣಿಗೆ", intentEmotional: "ಭಾವನಾತ್ಮಕ ಶಕ್ತಿ", intentDaily: "ದೈನಂದಿನ ಮಾರ್ಗದರ್ಶನ", intentExploring: "ನೋಡುತ್ತಿದ್ದೇನೆ",
    trustTitle: "ಸಾಮಾನ್ಯವಲ್ಲ. ಯಾದೃಚ್ಛಿಕವಲ್ಲ.", trustSubtitle: "ನಿಮ್ಮ ಜಾತಕದ ಆಧಾರದ ಮೇಲೆ.",
    trustCard1Title: "ನಿಮ್ಮ ಕುಂಡಳಿ, ನಿಮ್ಮ ಲೆಕ್ಕ", trustCard1Desc: "Swiss Ephemeris Engine ಬಳಸಿ ಗ್ರಹಗಳ ನಿಖರ ಸ್ಥಾನ ತಿಳಿದುಕೊಳ್ಳುತ್ತೇವೆ — NASA ಮತ್ತು ಪ್ರಪಂಚದೊಡ್ಡ ಜ್ಯೋತಿಷಿಗಳು ಈ engine ಬಳಸುತ್ತಾರೆ।",
    trustCard2Title: "5,000 ವರ್ಷದ ಜ್ಯೋತಿಷ", trustCard2Desc: "BPHS, Saravali, Phaladeepika ಇವುಗಳಿಂದ — ಹಳೆಯ ಶಾಸ್ತ್ರ, ಸುಲಭ ವಿವರಣೆ।",
    trustCard3Title: "ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳಿಗೆ ತಯಾರಿಸಿದೆ", trustCard3Desc: "ವೃತ್ತಿ, ಪ್ರೀತಿ, ಸಮಯ, ಹಣ — ನಿಜ ಜೀವನಕ್ಕೆ ಸರಳ ಮಾರ್ಗದರ್ಶನ।",
    birthTitle: "ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳು", birthSubtitle: "ನಿಖರ ವಿವರಗಳು ನಿಖರ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಕಾರಣ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು", fullNamePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    dateOfBirth: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", timeOfBirth: "ಹುಟ್ಟಿದ ಸಮಯ", dontKnowTime: "ನನ್ನ ಹುಟ್ಟಿದ ಸಮಯ ಗೊತ್ತಿಲ್ಲ",
    placeOfBirth: "ಹುಟ್ಟಿದ ಸ್ಥಳ", placePlaceholder: "ನಗರ ಹುಡುಕಿ — ಉದಾ. ಬೆಂಗಳೂರು, ಮೈಸೂರು...",
    generateChart: "ನನ್ನ ಜಾತಕ ರಚಿಸಿ",
    revealTitle: "ನಿಮ್ಮ ಜಾತಕ, ಮೊದಲ ನೋಟ", revealSubtitle: "{name} ಅವರ ಬ್ರಹ್ಮಾಂಡ ನಕ್ಷೆ",
    moonSign: "ಚಂದ್ರ ರಾಶಿ", nakshatra: "ನಕ್ಷತ್ರ", risingSign: "ಲಗ್ನ ರಾಶಿ", todayLabel: "ಇಂದು",
    readyToAsk: "ಮೊದಲ ಪ್ರಶ್ನೆ ಕೇಳಲು ಸಿದ್ಧರೇ?",
    askFirstTitle: "ನಿಮ್ಮ ಮೊದಲ ಪ್ರಶ್ನೆ ಕೇಳಿ", askFirstSubtitle: "ನಿಮ್ಮ ಜಾತಕ ಸಿದ್ಧವಾಗಿದೆ. ಪ್ರೀತಿ, ವೃತ್ತಿ, ಸಮಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.",
    typePlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ...", suggestionsLabel: "ನಿಮಗಾಗಿ ಸಲಹೆಗಳು",
    askNow: "GrahAI ಅನ್ನು ಕೇಳಿ", skipExplore: "ಬಿಟ್ಟು ನೋಡಿ",
    saveChartTitle: "ನಿಮ್ಮ ಜಾತಕ ಉಳಿಸಿ", saveChartSubtitle: "ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ನಿಮ್ಮ ಜಾತಕ ಸುರಕ್ಷಿತವಾಗಿರಲು ಇಮೇಲ್ ನಮೂದಿಸಿ.",
    emailPlaceholder: "your@email.com", saveBenefit1: "ನಿಮ್ಮ ಜಾತಕ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ", saveBenefit2: "ದೈನಂದಿನ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ", saveBenefit3: "ಎಲ್ಲಾ ಅಧಿವೇಶನಗಳಲ್ಲಿ ಪ್ರಶ್ನೆ ಇತಿಹಾಸ",
    saveAndEnter: "ಉಳಿಸಿ GrahAI ಪ್ರವೇಶಿಸಿ", skipForNow: "ಈಗ ಬಿಡಿ", continueBtn: "ಮುಂದುವರಿಸಿ",
    readingChart: "ನಿಮ್ಮ ಜಾತಕ ಓದುತ್ತಿದೆ...", askYourFirst: "ನಿಮ್ಮ ಮೊದಲ ಪ್ರಶ್ನೆ ಕೇಳಿ",
  },
  nav: { home: "ಹೋಮ್", ask: "ಕೇಳಿ", compatibility: "ಹೊಂದಾಣಿಕೆ", reports: "ವರದಿಗಳು", profile: "ಪ್ರೊಫೈಲ್" },
  home: { ...en.home, greeting: "ಶುಭ {timeOfDay}, {name}", todayGuidance: "ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ", tomorrowGuidance: "ನಾಳೆಯ ಮಾರ್ಗದರ್ಶನ", loveCard: "ಪ್ರೀತಿ", careerCard: "ವೃತ್ತಿ", energyCard: "ಶಕ್ತಿ", panchangTitle: "ಪಂಚಾಂಗ", luckyColors: "ಅದೃಷ್ಟ ಬಣ್ಣಗಳು", luckyNumbers: "ಅದೃಷ್ಟ ಸಂಖ್ಯೆಗಳು", askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ", viewReports: "ವರದಿಗಳು ನೋಡಿ", sourcesTitle: "ಮೂಲಗಳು" },
  ask: { ...en.ask, title: "GrahAI ಅನ್ನು ಕೇಳಿ", placeholder: "ಪ್ರೀತಿ, ವೃತ್ತಿ, ಸಮಯ ಬಗ್ಗೆ ಕೇಳಿ...", topicLove: "ಪ್ರೀತಿ", topicCareer: "ವೃತ್ತಿ", topicTiming: "ಸಮಯ", topicFamily: "ಕುಟುಂಬ", topicHealth: "ಆರೋಗ್ಯ", topicMoney: "ಹಣ", directAnswer: "ನೇರ ಉತ್ತರ", whyShowingUp: "ಇದು ಏಕೆ ಕಾಣಿಸುತ್ತಿದೆ", whatToDo: "ಏನು ಮಾಡಬೇಕು", whatToAvoid: "ಏನು ತಪ್ಪಿಸಬೇಕು", timeWindow: "ಸಮಯ ಅವಧಿ", remedy: "ಪರಿಹಾರ", source: "ಮೂಲ", followUp: "ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು", questionsLeft: "ಇಂದು {count} ಪ್ರಶ್ನೆಗಳು ಉಳಿದಿವೆ", upgradeForMore: "ಹೆಚ್ಚಿನದಕ್ಕಾಗಿ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ" },
  chart: { ...en.chart, title: "ನನ್ನ ಜಾತಕ", birthChart: "ಜನ್ಮ ಜಾತಕ", sunSign: "ಸೂರ್ಯ ರಾಶಿ", moonSign: "ಚಂದ್ರ ರಾಶಿ", risingSign: "ಲಗ್ನ ರಾಶಿ", nakshatra: "ನಕ್ಷತ್ರ", element: "ತತ್ವ", strengths: "ಶಕ್ತಿಗಳು", sensitivities: "ಸಂವೇದನೆಗಳು", showAdvanced: "ಹೆಚ್ಚು ತೋರಿಸಿ", hideAdvanced: "ಕಡಿಮೆ ತೋರಿಸಿ" },
  reports: { ...en.reports, title: "ವರದಿಗಳು", loveCompat: "ಪ್ರೀತಿ & ಹೊಂದಾಣಿಕೆ", careerBlueprint: "ವೃತ್ತಿ ಬ್ಲೂಪ್ರಿಂಟ್", marriageTiming: "ಮದುವೆ ಸಮಯ", annualForecast: "ವಾರ್ಷಿಕ ಮುನ್ಸೂಚನೆ", wealthGrowth: "ಸಂಪತ್ತು ಬೆಳವಣಿಗೆ", dashaDeepDive: "ದಶಾ ವಿಶ್ಲೇಷಣೆ", unlocked: "ಅನ್‌ಲಾಕ್", locked: "ಲಾಕ್", buyReport: "ವರದಿ ಖರೀದಿಸಿ", preview: "ಪೂರ್ವವೀಕ್ಷಣೆ", oneTimePacks: "ಒಂದು ಬಾರಿ ಪ್ಯಾಕ್‌ಗಳು" },
  profile: {
    title: "ಪ್ರೊಫೈಲ್", editBirthDetails: "ಜನ್ಮ ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ", changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    vedic: "ವೈದಿಕ", western: "ಪಾಶ್ಚಾತ್ಯ", questions: "ಪ್ರಶ್ನೆಗಳು", reportsLabel: "ವರದಿಗಳು", compatibility: "ಹೊಂದಾಣಿಕೆ",
    available: "ಲಭ್ಯವಿದೆ", buyQuestions: "ಪ್ರಶ್ನೆಗಳು ಖರೀದಿಸಿ", buyReports: "ವರದಿಗಳು ಖರೀದಿಸಿ", buyCompatibility: "ಹೊಂದಾಣಿಕೆ ಖರೀದಿಸಿ",
    helpSupport: "ಸಹಾಯ & ಬೆಂಬಲ", activity: "ಚಟುವಟಿಕೆ", referEarn: "ರೆಫರ್ ಮಾಡಿ & ಗಳಿಸಿ",
    questionsHistory: "ಪ್ರಶ್ನೆ ಇತಿಹಾಸ", reportsHistory: "ವರದಿ ಇತಿಹಾಸ", compatHistory: "ಹೊಂದಾಣಿಕೆ ಇತಿಹಾಸ", familyMembers: "ಕುಟುಂಬ ಸದಸ್ಯರು",
    upgradePremium: "ಪ್ರೀಮಿಯಂಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ", upgradeDesc: "ಅನಿಯಮಿತ ಪ್ರಶ್ನೆಗಳು, ಆಳವಾದ ಒಳನೋಟಗಳು, ಪೂರ್ಣ ವರದಿಗಳು",
    signOut: "ಸೈನ್ ಔಟ್", signOutConfirm: "ಸೈನ್ ಔಟ್ ಮಾಡಬೇಕೇ?",
    signOutDesc: "ಇದು ನಿಮ್ಮ ಜನ್ಮ ಡೇಟಾ ಮತ್ತು ಜಾತಕವನ್ನು ಈ ಸಾಧನದಿಂದ ತೆಗೆದುಹಾಕುತ್ತದೆ.",
    cancel: "ರದ್ದುಮಾಡಿ", version: "GrahAI v3.0 · ಭಾರತದಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ",
    editBirthTitle: "ಜನ್ಮ ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ", editBirthDesc: "ನಿಖರ ರೀಡಿಂಗ್‌ಗಳಿಗಾಗಿ ನಿಮ್ಮ ಜನ್ಮ ಮಾಹಿತಿ ನವೀಕರಿಸಿ.",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    faq1Q: "GrahAI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?", faq1A: "GrahAI ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಬಳಸಿ ವೈದಿಕ ಜಾತಕ ಲೆಕ್ಕಹಾಕುತ್ತದೆ.",
    faq2Q: "ಇದು ಎಷ್ಟು ನಿಖರ?", faq2A: "ನಿಖರತೆ ಜನ್ಮ ಸಮಯದ ನಿಖರತೆಯ ಮೇಲೆ ಅವಲಂಬಿತ.",
    faq3Q: "ನನ್ನ ಡೇಟಾ ಸುರಕ್ಷಿತವೇ?", faq3A: "ನಿಮ್ಮ ಜನ್ಮ ಡೇಟಾ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತದೆ.",
    faq4Q: "ಹೆಚ್ಚಿನ ಪ್ರಶ್ನೆಗಳು ಹೇಗೆ ಪಡೆಯುವುದು?", faq4A: "Graha ಅಥವಾ Rishi ಪ್ಲಾನ್‌ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ.",
    faq5Q: "ರೀಫಂಡ್ ಸಿಗುತ್ತದೆಯೇ?", faq5A: "ಹೌದು, 7 ದಿನಗಳ ರೀಫಂಡ್ ನೀತಿ ಇದೆ.",
    askForHelp: "GrahAI ಸಹಾಯ ಕೇಳಿ",
  },
  pricing: { ...en.pricing, title: "ನಿಮ್ಮ ಪ್ಲಾನ್ ಆಯ್ಕೆಮಾಡಿ", subtitle: "ನಿಮಗೆ ಸೂಕ್ತವಾದ ಪ್ಲಾನ್‌ನಲ್ಲಿ ಆಳವಾದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ", monthly: "ಮಾಸಿಕ", oneTime: "ಒಂದು ಬಾರಿ", free: "ಉಚಿತ", graha: "ಗ್ರಹ", rishi: "ಋಷಿ", perMonth: "/ತಿಂಗಳು", currentPlan: "ಪ್ರಸ್ತುತ ಪ್ಲಾನ್", upgrade: "ಅಪ್‌ಗ್ರೇಡ್", popular: "ಜನಪ್ರಿಯ" },
  paywall: { ...en.paywall, limitReached: "ಇಂದಿನ ಉಚಿತ ಪ್ರಶ್ನೆಗಳು ಮುಗಿದಿವೆ", upgradeNow: "ಈಗ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ", dismiss: "ನಂತರ" },
  referral: { ...en.referral, title: "ರೆಫರ್ ಮಾಡಿ & ಗಳಿಸಿ", subtitle: "ಸ್ನೇಹಿತರೊಂದಿಗೆ GrahAI ಹಂಚಿ ರಿವಾರ್ಡ್‌ಗಳನ್ನು ಗಳಿಸಿ", yourCode: "ನಿಮ್ಮ ರೆಫರಲ್ ಕೋಡ್", copyCode: "ಕೋಡ್ ನಕಲಿಸಿ", shareWithFriends: "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿ", rewardsTitle: "ನಿಮ್ಮ ರಿವಾರ್ಡ್‌ಗಳು", friendsReferred: "ರೆಫರ್ ಮಾಡಿದ ಸ್ನೇಹಿತರು" },
  source: en.source,
  common: { loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", error: "ಏನೋ ತಪ್ಪಾಯಿತು", retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", close: "ಮುಚ್ಚಿ", back: "ಹಿಂದೆ", next: "ಮುಂದೆ", save: "ಉಳಿಸಿ", done: "ಮುಗಿಯಿತು", today: "ಇಂದು", tomorrow: "ನಾಳೆ" },
}

// ═══════════════════════════════════════════════════
// For brevity, remaining languages use English as base
// with key UI strings translated. Full translation
// can be added incrementally.
// ═══════════════════════════════════════════════════

// Malayalam
const ml: Translations = {
  langPicker: {
    title: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    subtitle: "പ്രൊഫൈൽ സെറ്റിംഗ്‌സിൽ പിന്നീട് മാറ്റാം.",
  },
  onboarding: {
    welcomeSubtitle: "നക്ഷത്രങ്ങൾ നിങ്ങളുടെ വരവിനായി കാത്തുരുണ്ടായിരുന്നു.",
    welcomeDesc: "GrahAI നിങ്ങളുടെ ജാതകത്തിന്റെ ഭാഷ വായിച്ച്, സത്യത്തിൽ പ്രധാനമായ നിമിഷങ്ങൾക്കായി കോമലമായും കാലങ്കഴിഞ്ഞ മാർഗ്ഗനിർദ്ദേശം നൽകുന്നു.",
    getFirstInsight: "എൻ്റെ യാത്ര ആരംഭിക്കുക",
    intentTitle: "നിങ്ങൾ ഇന്ന് എന്തിനാണ് ഇവിടെ വന്നത്?",
    intentSubtitle: "എന്നോട് പറയുക, നിങ്ങളുടെ ചാർട്ട് എന്താണ് വെളിപ്പെടുത്തുന്നത് എന്നത് ഉപയോഗിച്ച് നിർദ്ദേശിക്കും",
    intentCareer: "കരിയറും ജോലിയും",
    intentLove: "പ്രേമവും ബന്ധവും",
    intentMarriage: "വിവാഹവും സമയവും",
    intentMoney: "പണവും വളർച്ചയും",
    intentEmotional: "വൈകാരിക ഊർജ്ജം",
    intentDaily: "ദൈനിക മാർഗ്ഗനിർദ്ദേശം",
    intentExploring: "കേവലം പര്യവേക്ഷണം",
    trustTitle: "പ്രാചീന ജ്ഞാനത്തിൽ വേരൂന്നിയ.",
    trustSubtitle: "നിങ്ങളുടെ അനന്യ ചാർട്ടിന് ചുറ്റുപാടും നിർമ്മിച്ചത്.",
    trustCard1Title: "നിങ്ങളുടെ ജാതകം, നിങ്ങളുടെ കണക്കാണ്",
    trustCard1Desc: "Swiss Ephemeris Engine ഉപയോഗിച്ച് ഗ്രഹങ്ങളുടെ കൃത്യമായ സ്ഥാനം കണ്ടെത്തുന്നു — NASA യും ലോകമെമ്പാടുമുള്ള ജ്യോതിഷ്കന്മാരും ഈ engine ഉപയോഗിക്കുന്നു।",
    trustCard2Title: "5,000 വർഷത്തെ ജ്യോതിഷം",
    trustCard2Desc: "BPHS, Saravali, Phaladeepika — പഴയ ശാസ്ത്രങ്ങൾ, സരളമായ വിശദീകരണം।",
    trustCard3Title: "പ്രധാനപ്പെട്ട തീരുമാനങ്ങളിലേക്ക് നിർമ്മിച്ചത്",
    trustCard3Desc: "കരിയർ, പ്രേമം, സമയം, പണം — നിജ ജീവനത്തിനായുള്ള സരളമായ നിർദേശം।",
    birthTitle: "നിങ്ങളുടെ ജന്മ വിവരങ്ങൾ പങ്കിടുക",
    birthSubtitle: "കൂടുതൽ കൃത്യമായ, ഗভീരമായി നിങ്ങളുടെ ചാർട്ടിലേക്ക് കാണാൻ കഴിയുന്നു",
    fullName: "പൂർണ്ണ നാമം",
    fullNamePlaceholder: "നിങ്ങളുടെ പൂർണ്ണ നാമം നിവേശിക്കുക",
    dateOfBirth: "ജന്മ തിയതി",
    timeOfBirth: "ജന്മ സമയം",
    dontKnowTime: "എന്റെ ജന്മ സമയം എനിക്കറിയില്ല",
    placeOfBirth: "ജന്മ സ്ഥലം",
    placePlaceholder: "നഗരം തിരയുക — ഉദാ. മുംബൈ, ഡെൽഹി, ലണ്ടൻ...",
    generateChart: "എൻ്റെ ചാർട്ട് പരിണയിക്കുക",
    revealTitle: "നിങ്ങളുടെ ചാർട്ട്, ഒരു നോട്ടത്തിൽ",
    revealSubtitle: "{name}ന്റെ കോസ്മിക് ബ്ലൂപ്രിന്റ്",
    moonSign: "ചന്ദ്ര രാശി",
    nakshatra: "നക്ഷത്രം",
    risingSign: "ഉദയ രാശി",
    todayLabel: "ഇന്ന്",
    readyToAsk: "നിങ്ങളുടെ ആദ്യ ചോദ്യം ചോദിക്കാൻ തയ്യാറാണോ?",
    askFirstTitle: "നിങ്ങളുടെ ആദ്യ ചോദ്യം ചോദിക്കുക",
    askFirstSubtitle: "നിങ്ങളുടെ ചാർട്ട് തയ്യാറാണ്. പ്രേമം, കരിയറ്, സമയം അല്ലെങ്കിൽ ജീവിതത്തെക്കുറിച്ച് എന്തെങ്കിലും ചോദിക്കുക.",
    typePlaceholder: "നിങ്ങളുടെ ചോദ്യം നിവേശിക്കുക...",
    suggestionsLabel: "നിങ്ങൾക്കായുള്ള നിർദ്ദേശങ്ങൾ",
    askNow: "GrahAI ൽ നിന്ന് ചോദിക്കുക",
    skipExplore: "അവതരണ്ടിക്കുക ആണ് പര്യവേക്ഷണം",
    saveChartTitle: "നിങ്ങളുടെ ചാർട്ട് രക്ഷിക്കുക",
    saveChartSubtitle: "നിങ്ങളുടെ ജാതകം, ചരിത്രം, ദൈനിക മാർഗ്ഗനിർദ്ദേശം എല്ലാ ഉപകരണങ്ങളിൽ സുരക്ഷിത വയ്ക്കാൻ ഇമെയിൽ നിവേശിക്കുക.",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "നിങ്ങളുടെ ജാതകം സുരക്ഷിതമായി രക്ഷിക്കപ്പെടും",
    saveBenefit2: "ദിനിച വ്യക്തിഗതൃകൃത പരാമർശം",
    saveBenefit3: "സെഷനുകളിലൂടെ ചോദ്യ ചരിത്രം",
    saveAndEnter: "രക്ഷിക്കുക ഒപ്പം GrahAI എ പ്രവേശിക്കുക",
    skipForNow: "എപ്പോൾ നിന്നും അവതരണ്ടിക്കുക",
    continueBtn: "തുടരുക",
    readingChart: "നിങ്ങളുടെ ചാർട്ട് വായിക്കുന്നു...",
    askYourFirst: "നിങ്ങളുടെ ആദ്യ ചോദ്യം ചോദിക്കുക",
  },
  nav: {
    home: "ഹോം",
    ask: "ചോദിക്കൂ",
    compatibility: "പൊരുത്തം",
    reports: "റിപ്പോർട്ടുകൾ",
    profile: "പ്രൊഫൈൽ",
  },
  home: {
    ...en.home,
    greeting: "നല്ല {timeOfDay}, {name}",
    todayGuidance: "ഇന്നത്തെ പരാമർശം",
    tomorrowGuidance: "നാളത്തെ പരാമർശം",
    loveCard: "പ്രേമം",
    careerCard: "കരിയറ്",
    energyCard: "ഊർജ്ജം",
    panchangTitle: "പഞ്ചാങ്ങ്",
    luckyColors: "ഭാഗ്യ നിറങ്ങൾ",
    luckyNumbers: "ഭാഗ്യ നിമ്പരങ്ങൾ",
    askQuestion: "ഒരു ചോദ്യം ചോദിക്കുക",
    viewReports: "റിപ്പോർട്ടുകൾ കാണുക",
    sourcesTitle: "സ്രോതസ്സുകൾ",
  },
  ask: {
    ...en.ask,
    title: "GrahAI ൽ നിന്ന് ചോദിക്കുക",
    placeholder: "പ്രേമം, കരിയറ്, സമയം എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    topicLove: "പ്രേമം",
    topicCareer: "കരിയറ്",
    topicTiming: "സമയം",
    topicFamily: "കുടുംബം",
    topicHealth: "ആരോഗ്യം",
    topicMoney: "പണം",
    directAnswer: "നേരിട്ടുള്ള ഉത്തരം",
    whyShowingUp: "ഇത് കാണിക്കുന്നത് എന്ത് കഥ",
    whatToDo: "എന്ത് ചെയ്യണം",
    whatToAvoid: "എന്ത് ഒഴിവാക്കണം",
    timeWindow: "സമയ വിളാസം",
    remedy: "പരിഹാരം",
    source: "സ്രോതസ്സ്",
    followUp: "അനുവർത്തി ചോദ്യങ്ങൾ",
    questionsLeft: "ഇന്ന് {count} ചോദ്യങ്ങൾ ശേഷിക്കുന്നുണ്ട്",
    upgradeForMore: "കൂടുതലുള്ളതിനായി അപ്‌ഗ്രേഡ് ചെയ്യുക",
  },
  chart: {
    ...en.chart,
    title: "എൻ്റെ ചാർട്ട്",
    birthChart: "ജന്മ ചാർട്ട്",
    sunSign: "സൂര്യ രാശി",
    moonSign: "ചന്ദ്ര രാശി",
    risingSign: "ഉദയ രാശി",
    nakshatra: "നക്ഷത്രം",
    element: "ഘടകം",
    strengths: "ശക്തികൾ",
    sensitivities: "സംവേദനങ്ങൾ",
    showAdvanced: "മുൻനിര കാണിക്കുക",
    hideAdvanced: "മുൻനിര ഒളിപ്പിക്കുക",
  },
  reports: {
    ...en.reports,
    title: "റിപ്പോർട്ടുകൾ",
    loveCompat: "പ്രേമവും അനുരൂപതയും",
    careerBlueprint: "കരിയറ് ബ്ലൂപ്രിന്റ്",
    marriageTiming: "വിവാഹ സമയം",
    annualForecast: "വാർഷിക പ്രവചനം",
    wealthGrowth: "സമ്പത്ത് വികാസം",
    dashaDeepDive: "ദശ ഗഭീര വിശകലനം",
    unlocked: "അണ്‍ലോക്ക് ചെയ്ത",
    locked: "ലോക്ക് ചെയ്ത",
    buyReport: "റിപ്പോർട്ട് വാങ്ങുക",
    preview: "പൂർവ്വദൃശ്യം",
    oneTimePacks: "ഒരിക്കൽ പാക്കുകൾ",
  },
  profile: {
    title: "പ്രൊഫൈൽ",
    editBirthDetails: "ജന്ന വിവരങ്ങൾ തിരുത്തുക",
    changeLanguage: "ഭാഷ മാറ്റുക",
    vedic: "വൈദിക",
    western: "പാശ്ചാത്യ",
    questions: "ചോദ്യങ്ങൾ",
    reportsLabel: "റിപ്പോർട്ടുകൾ",
    compatibility: "അനുരൂപത",
    available: "ലഭ്യമായ",
    buyQuestions: "ചോദ്യങ്ങൾ വാങ്ങുക",
    buyReports: "റിപ്പോർട്ടുകൾ വാങ്ങുക",
    buyCompatibility: "അനുരൂപത വാങ്ങുക",
    helpSupport: "സഹായവും പിന്തുണയും",
    activity: "പ്രവർത്തനം",
    referEarn: "നൽകുക ഒപ്പം സമ്പാദിക്കുക",
    questionsHistory: "ചോദ്യ ചരിത്രം",
    reportsHistory: "റിപ്പോർട്ട് ചരിത്രം",
    compatHistory: "അനുരൂപത ചരിത്രം",
    familyMembers: "കുടുംബ സമ്പർക്കങ്ങൾ",
    upgradePremium: "പ്രീമിയമിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യുക",
    upgradeDesc: "അസിമിത ചോദ്യങ്ങൾ, ഗഭീര വിശകലനം, സഹൃദയ റിപ്പോർട്ടുകൾ",
    signOut: "സൈൻ ഔട്ട്",
    signOutConfirm: "സൈൻ ഔട്ട് ചെയ്യണോ?",
    signOutDesc: "ഇത് ഈ ഉപകരണത്തിൽ നിന്ന് നിങ്ങളുടെ ജന്ന ഡാറ്റ ഒപ്പം ചാർട്ട് മായ്ച്ചിടും. നിങ്ങൾ പിന്നീട് അത് വീണ്ടും നിവേശിക്കാൻ കഴിയും.",
    cancel: "റദ്ദാക്കുക",
    version: "GrahAI v3.0 · ഇന്ത്യയിൽ സ്നേഹം കൊണ്ട് നിർമ്മിതം",
    editBirthTitle: "ജന്ന വിവരങ്ങൾ തിരുത്തുക",
    editBirthDesc: "കൂടുതൽ കൃത്യമായ വായനയ്ക്കായി നിങ്ങളുടെ ജന്ന സൂചന അപ്‌ഡേറ്റ് ചെയ്യുക.",
    saveChanges: "മാറ്റങ്ങൾ രക്ഷിക്കുക",
    saving: "രക്ഷിക്കുന്നു...",
    faq1Q: "GrahAI എങ്ങനെ ജോലി ചെയ്യുന്നു?",
    faq1A: "GrahAI നിങ്ങളുടെ ജന്ന തിയതി, സമയം, സ്ഥാനം ഉപയോഗിച്ച് നിങ്ങളുടെ വൈദിക ചാർട്ട് കണക്കാക്കുന്നു. നമ്മുടെ AI പ്രാചീന ജ്യോതിഷ സിദ്ധാന്തങ്ങൾ ഉപയോഗിച്ച് വ്യക്തിഗതൃകൃത പരാമർശം നൽകുന്നു.",
    faq2Q: "ഇത് എത്ര കൃത്യമാണ്?",
    faq2A: "കൃത്യത ജന്ന സമയ കൃത്യതയെ ആശ്രയിച്ചിരിക്കുന്നു. GrahAI പരമ്പരാഗത ജ്യോതിഷികൾ ഉപയോഗിക്കുന്ന അതേ സിദ്ധാന്തപരമായ കണക്കുകൾ ഉപയോഗിക്കുന്നു, AI കൊണ്ട് എൻഹാൻസ് ചെയ്ത്.",
    faq3Q: "എൻ്റെ ഡാറ്റ സുരക്ഷിതമാണോ?",
    faq3A: "നിങ്ങളുടെ ജന്ന ഡാറ്റ നിങ്ങളുടെ ഉപകരണത്തിൽ സ്ഥാപിതമാണ്. ഞങ്ങൾ നിങ്ങളുടെ വ്യക്തിഗത സൂചന മൂന്നാംകക്ഷിയ്ക്കായി പങ്കിടുന്നില്ല.",
    faq4Q: "കൂടുതൽ ചോദ്യങ്ങൾ എങ്ങനെ ലഭിക്കും?",
    faq4A: "നിങ്ങൾ Graha അല്ലെങ്കിൽ Rishi പ്ലാനുലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യാൻ കഴിയും, അല്ലെങ്കിൽ പ്രൈസിംഗ് പേജിൽ നിന്ന് ചോദ്യ പാക്കുകൾ വാങ്ങാൻ കഴിയും.",
    faq5Q: "എനിക്കെ വിപണി വരികയുണ്ടോ?",
    faq5A: "അതെ, എല്ലാ വയ്പ്പുകളിൽ 7 ദിവസത്തെ വിപണി നയം ഞങ്ങൾ നൽകുന്നു. സഹായയ്ക്കായി പിന്തുണയ്ക്കായി ബന്ധപ്പെടുക.",
    askForHelp: "GrahAI ൽ നിന്ന് സഹായം ചോദിക്കുക",
  },
  pricing: {
    ...en.pricing,
    title: "നിങ്ങളുടെ പ്ലാൻ തിരഞ്ഞെടുക്കുക",
    subtitle: "നിങ്ങൾക്കെ പതിയാത് പ്ലാനിന്റെ കൂടെ ഗഭീര പരാമർശം പെടുക",
    monthly: "നിമിഷിക",
    oneTime: "ഒരിക്കൽ",
    free: "സ്വതന്ത്ര",
    graha: "ഗ്രഹ",
    rishi: "ഋഷി",
    perMonth: "/മാസം",
    currentPlan: "മുൻ പ്ലാൻ",
    upgrade: "അപ്‌ഗ്രേഡ് ചെയ്യുക",
    popular: "ജനപ്രിയ",
  },
  paywall: {
    ...en.paywall,
    limitReached: "ഇന്നത്തെ സ്വതന്ത്ര ചോദ്യങ്ങൾ ഉപയോഗിച്ചു കഴിഞ്ഞു",
    upgradeNow: "ഇപ്പോൾ അപ്‌ഗ്രേഡ് ചെയ്യുക",
    dismiss: "കൂടുതൽ പിന്നീട്",
  },
  referral: {
    ...en.referral,
    title: "നൽകുക ഒപ്പം സമ്പാദിക്കുക",
    subtitle: "സ്നേഹങ്ങളുടെ കൂടെ GrahAI പങ്കിടുക ഒപ്പം ചരക്കിനുള്ള പ്രതിബന്ധം സമ്പാദിക്കുക",
    yourCode: "നിങ്ങളുടെ നൽകൽ കോഡ്",
    copyCode: "കോഡ് നകൽ ചെയ്യുക",
    shareWithFriends: "സ്നേഹങ്ങളുടെ കൂടെ പങ്കിടുക",
    rewardsTitle: "നിങ്ങളുടെ ചരക്കിനുള്ള പ്രതിബന്ധം",
    friendsReferred: "നൽകപ്പെട്ട സ്നേഹങ്ങൾ",
  },
  source: en.source,
  common: {
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "എന്തോ തെറ്റ് സംഭവിച്ചു",
    retry: "വീണ്ടും ശ്രമിക്കുക",
    close: "അടയ്ക്കുക",
    back: "പിന്നിലേക്ക്",
    next: "അടുത്തത്",
    save: "സേവ് ചെയ്യുക",
    done: "കഴിഞ്ഞു",
    today: "ഇന്ന്",
    tomorrow: "നാളെ",
  },
}

// Bengali
const bn: Translations = {
  langPicker: {
    title: "আপনার ভাষা বেছে নিন",
    subtitle: "পরে প্রোফাইল সেটিংস থেকে বদলাতে পারবেন।",
  },
  onboarding: {
    welcomeSubtitle: "তারকাগুলি আপনার জন্য অপেক্ষা করছিল।",
    welcomeDesc: "GrahAI আপনার কুণ্ডলীর ভাষা পড়ে, যে মুহূর্তগুলি সত্যিই গুরুত্বপূর্ণ সেগুলির জন্য মৃদু এবং সময়-পরীক্ষিত নির্দেশনা প্রদান করে।",
    getFirstInsight: "আমার যাত্রা শুরু করুন",
    intentTitle: "আজ এখানে এসেছেন কেন?",
    intentSubtitle: "আমাকে বলুন, এবং আমরা আপনার চার্ট কী প্রকাশ করে তার সাথে আপনাকে গাইড করব",
    intentCareer: "ক্যারিয়ার এবং কাজ",
    intentLove: "ভালোবাসা এবং সম্পর্ক",
    intentMarriage: "বিবাহ এবং সময়",
    intentMoney: "অর্থ এবং বৃদ্ধি",
    intentEmotional: "মানসিক শক্তি",
    intentDaily: "দৈনিক নির্দেশনা",
    intentExploring: "শুধু অন্বেষণ করছি",
    trustTitle: "প্রাচীন জ্ঞানে নিহিত।",
    trustSubtitle: "আপনার অনন্য চার্টের চারপাশে তৈরি।",
    trustCard1Title: "আপনার কুণ্ডলী, আপনার হিসাব",
    trustCard1Desc: "Swiss Ephemeris Engine দিয়ে গ্রহদের সঠিক অবস্থান বের করি — এই engine NASA এবং সারা বিশ্বের জ্যোতিষীরা ব্যবহার করেন।",
    trustCard2Title: "৫,০০০ বছরের জ্যোতিষ",
    trustCard2Desc: "BPHS, Saravali, Phaladeepika — পুরনো শাস্ত্র, সহজ ভাষায় বোঝানো।",
    trustCard3Title: "গুরুত্বপূর্ণ সিদ্ধান্তের জন্য তৈরি",
    trustCard3Desc: "ক্যারিয়ার, ভালোবাসা, সময়, অর্থ — নিজের জীবনের জন্য সহজ দিকনির্দেশনা।",
    birthTitle: "আপনার জন্ম বিবরণ শেয়ার করুন",
    birthSubtitle: "যত বেশি নির্ভুল, আমরা আপনার চার্টে গভীরভাবে দেখতে পারি",
    fullName: "সম্পূর্ণ নাম",
    fullNamePlaceholder: "আপনার সম্পূর্ণ নাম লিখুন",
    dateOfBirth: "জন্মের তারিখ",
    timeOfBirth: "জন্মের সময়",
    dontKnowTime: "আমি আমার জন্মের সময় জানি না",
    placeOfBirth: "জন্মস্থান",
    placePlaceholder: "শহর খুঁজুন — যেমন মুম্বাই, দিল্লি, লন্ডন...",
    generateChart: "আমার চার্ট তৈরি করুন",
    revealTitle: "আপনার চার্ট, এক নজরে",
    revealSubtitle: "{name}এর মহাজাগতিক নীলনকশা",
    moonSign: "চন্দ্র রাশি",
    nakshatra: "নক্ষত্র",
    risingSign: "উদীয়মান রাশি",
    todayLabel: "আজ",
    readyToAsk: "আপনার প্রথম প্রশ্ন জিজ্ঞাসা করতে প্রস্তুত?",
    askFirstTitle: "আপনার প্রথম প্রশ্ন জিজ্ঞাসা করুন",
    askFirstSubtitle: "আপনার চার্ট প্রস্তুত। ভালোবাসা, ক্যারিয়ার, সময় বা জীবনের যেকোনো বিষয়ে প্রশ্ন করুন।",
    typePlaceholder: "আপনার প্রশ্ন টাইপ করুন...",
    suggestionsLabel: "আপনার জন্য পরামর্শ",
    askNow: "GrahAI থেকে জিজ্ঞাসা করুন",
    skipExplore: "এড়িয়ে যান এবং অন্বেষণ করুন",
    saveChartTitle: "আপনার চার্ট সংরক্ষণ করুন",
    saveChartSubtitle: "সমস্ত ডিভাইসে আপনার চার্ট, ইতিহাস এবং দৈনিক নির্দেশনা সংরক্ষিত রাখতে আপনার ইমেল প্রবেশ করুন।",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "আপনার চার্ট নিরাপদে সংরক্ষিত",
    saveBenefit2: "দৈনিক ব্যক্তিগতকৃত নির্দেশনা",
    saveBenefit3: "সেশন জুড়ে প্রশ্ন ইতিহাস",
    saveAndEnter: "সংরক্ষণ করুন এবং GrahAI এ প্রবেশ করুন",
    skipForNow: "এখনের জন্য এড়িয়ে যান",
    continueBtn: "এগিয়ে যান",
    readingChart: "আপনার চার্ট পড়া হচ্ছে...",
    askYourFirst: "আপনার প্রথম প্রশ্ন জিজ্ঞাসা করুন",
  },
  nav: {
    home: "হোম",
    ask: "জিজ্ঞাসা",
    compatibility: "মিল",
    reports: "রিপোর্ট",
    profile: "প্রোফাইল",
  },
  home: {
    ...en.home,
    greeting: "শুভ {timeOfDay}, {name}",
    todayGuidance: "আজকের নির্দেশনা",
    tomorrowGuidance: "আগামীকালের নির্দেশনা",
    loveCard: "ভালোবাসা",
    careerCard: "ক্যারিয়ার",
    energyCard: "শক্তি",
    panchangTitle: "পঞ্চাঙ্গ",
    luckyColors: "ভাগ্যবান রং",
    luckyNumbers: "ভাগ্যবান সংখ্যা",
    askQuestion: "একটি প্রশ্ন জিজ্ঞাসা করুন",
    viewReports: "রিপোর্ট দেখুন",
    sourcesTitle: "উৎস",
  },
  ask: {
    ...en.ask,
    title: "GrahAI থেকে জিজ্ঞাসা করুন",
    placeholder: "ভালোবাসা, ক্যারিয়ার, সময় সম্পর্কে জিজ্ঞাসা করুন...",
    topicLove: "ভালোবাসা",
    topicCareer: "ক্যারিয়ার",
    topicTiming: "সময়",
    topicFamily: "পরিবার",
    topicHealth: "স্বাস্থ্য",
    topicMoney: "অর্থ",
    directAnswer: "সরাসরি উত্তর",
    whyShowingUp: "এটি কেন দেখা যাচ্ছে",
    whatToDo: "কী করতে হবে",
    whatToAvoid: "কী এড়াতে হবে",
    timeWindow: "সময় উইন্ডো",
    remedy: "প্রতিকার",
    source: "উৎস",
    followUp: "অনুসরণ প্রশ্ন",
    questionsLeft: "আজ {count} প্রশ্ন বাকি",
    upgradeForMore: "আরও জন্য আপগ্রেড করুন",
  },
  chart: {
    ...en.chart,
    title: "আমার চার্ট",
    birthChart: "জন্ম চার্ট",
    sunSign: "সূর্য রাশি",
    moonSign: "চন্দ্র রাশি",
    risingSign: "উদীয়মান রাশি",
    nakshatra: "নক্ষত্র",
    element: "উপাদান",
    strengths: "শক্তি",
    sensitivities: "সংবেদনশীলতা",
    showAdvanced: "উন্নত দেখান",
    hideAdvanced: "উন্নত লুকান",
  },
  reports: {
    ...en.reports,
    title: "রিপোর্ট",
    loveCompat: "ভালোবাসা এবং সামঞ্জস্য",
    careerBlueprint: "ক্যারিয়ার ব্লুপ্রিন্ট",
    marriageTiming: "বিবাহের সময়",
    annualForecast: "বার্ষিক পূর্বাভাস",
    wealthGrowth: "সম্পদ বৃদ্ধি",
    dashaDeepDive: "দশা গভীর পর্যালোচনা",
    unlocked: "আনলক করা",
    locked: "লক করা",
    buyReport: "রিপোর্ট কিনুন",
    preview: "পূর্বরূপ",
    oneTimePacks: "একক প্যাকেজ",
  },
  profile: {
    title: "প্রোফাইল",
    editBirthDetails: "জন্ম বিবরণ সম্পাদনা করুন",
    changeLanguage: "ভাষা পরিবর্তন করুন",
    vedic: "বৈদিক",
    western: "পশ্চিমা",
    questions: "প্রশ্ন",
    reportsLabel: "রিপোর্ট",
    compatibility: "সামঞ্জস্য",
    available: "উপলব্ধ",
    buyQuestions: "প্রশ্ন কিনুন",
    buyReports: "রিপোর্ট কিনুন",
    buyCompatibility: "সামঞ্জস্য কিনুন",
    helpSupport: "সাহায্য ও সহায়তা",
    activity: "কার্যকলাপ",
    referEarn: "রেফার করুন এবং উপার্জন করুন",
    questionsHistory: "প্রশ্ন ইতিহাস",
    reportsHistory: "রিপোর্ট ইতিহাস",
    compatHistory: "সামঞ্জস্য ইতিহাস",
    familyMembers: "পরিবারের সদস্য",
    upgradePremium: "প্রিমিয়ামে আপগ্রেড করুন",
    upgradeDesc: "সীমাহীন প্রশ্ন, গভীর অন্তর্দৃষ্টি, সম্পূর্ণ রিপোর্ট",
    signOut: "সাইন আউট",
    signOutConfirm: "সাইন আউট করবেন?",
    signOutDesc: "এটি এই ডিভাইস থেকে আপনার জন্ম ডেটা এবং চার্ট পরিষ্কার করবে। আপনি পরে এটি আবার প্রবেশ করতে পারেন।",
    cancel: "বাতিল",
    version: "GrahAI v3.0 · ভারতে যত্ন সহকারে তৈরি",
    editBirthTitle: "জন্ম বিবরণ সম্পাদনা করুন",
    editBirthDesc: "আরও নির্ভুল পড়ার জন্য আপনার জন্ম তথ্য আপডেট করুন।",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    saving: "সংরক্ষণ করা হচ্ছে...",
    faq1Q: "GrahAI কীভাবে কাজ করে?",
    faq1A: "GrahAI আপনার জন্মের তারিখ, সময় এবং স্থান ব্যবহার করে আপনার বৈদিক চার্ট গণনা করে। আমাদের AI তারপর ক্লাসিক্যাল জ্যোতিষ নীতি ব্যবহার করে ব্যক্তিগতকৃত নির্দেশনা প্রদান করে।",
    faq2Q: "এটি কতটা নির্ভুল?",
    faq2A: "নির্ভুলতা জন্মের সময় নির্ভুলতার উপর নির্ভর করে। GrahAI ঐতিহ্যবাহী জ্যোতিষীরা যা ব্যবহার করে তার মতো একই পার্শ্বীয় গণনা ব্যবহার করে, AI দ্বারা উন্নত।",
    faq3Q: "আমার ডেটা নিরাপদ?",
    faq3A: "আপনার জন্ম ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষণ করা হয়। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না।",
    faq4Q: "আমি আরও প্রশ্ন কীভাবে পাব?",
    faq4A: "আপনি একটি গ্রহ বা ঋষি পরিকল্পনায় আপগ্রেড করতে পারেন বা মূল্য নির্ধারণ পৃষ্ঠা থেকে প্রশ্ন প্যাকেজ কিনতে পারেন।",
    faq5Q: "আমি রিফান্ড পেতে পারি?",
    faq5A: "হ্যাঁ, আমরা সমস্ত ক্রয়ে 7-দিনের রিফান্ড নীতি অফার করি। সহায়তার জন্য সহায়তার সাথে যোগাযোগ করুন।",
    askForHelp: "GrahAI থেকে সাহায্য চান",
  },
  pricing: {
    ...en.pricing,
    title: "আপনার পরিকল্পনা বেছে নিন",
    subtitle: "আপনার জন্য উপযুক্ত একটি পরিকল্পনা দিয়ে গভীর নির্দেশনা পান",
    monthly: "মাসিক",
    oneTime: "একক",
    free: "বিনামূল্যে",
    graha: "গ্রহ",
    rishi: "ঋষি",
    perMonth: "/মাস",
    currentPlan: "বর্তমান পরিকল্পনা",
    upgrade: "আপগ্রেড",
    popular: "জনপ্রিয়",
  },
  paywall: {
    ...en.paywall,
    limitReached: "আপনি আজকের বিনামূল্যে প্রশ্ন ব্যবহার করেছেন",
    upgradeNow: "এখনই আপগ্রেড করুন",
    dismiss: "হতে পারে পরে",
  },
  referral: {
    ...en.referral,
    title: "রেফার করুন এবং উপার্জন করুন",
    subtitle: "বন্ধুদের সাথে GrahAI শেয়ার করুন এবং পুরস্কার অর্জন করুন",
    yourCode: "আপনার রেফারেল কোড",
    copyCode: "কোড অনুলিপি করুন",
    shareWithFriends: "বন্ধুদের সাথে শেয়ার করুন",
    rewardsTitle: "আপনার পুরস্কার",
    friendsReferred: "রেফার করা বন্ধু",
  },
  source: en.source,
  common: {
    loading: "লোড হচ্ছে...",
    error: "কিছু ভুল হয়েছে",
    retry: "আবার চেষ্টা করুন",
    close: "বন্ধ করুন",
    back: "পিছনে",
    next: "পরবর্তী",
    save: "সংরক্ষণ করুন",
    done: "সম্পন্ন",
    today: "আজ",
    tomorrow: "আগামীকাল",
  },
}

// Marathi
const mr: Translations = {
  langPicker: {
    title: "तुमची भाषा निवडा",
    subtitle: "तुम्ही नंतर प्रोफाइल सेटिंग्जमधून बदलू शकता.",
  },
  onboarding: {
    welcomeSubtitle: "तारे तुम्हाला प्रतीक्षा करत होते।",
    welcomeDesc: "GrahAI तुमची कुंडली वाचून, जे क्षण खरोखर महत्वाचे आहेत त्यांसाठी सौम्य आणि काळ-परीक्षित मार्गदर्शन देते।",
    getFirstInsight: "माझी यात्रा सुरू करा",
    intentTitle: "आज इथे आले हे का?",
    intentSubtitle: "आमच्याला सांगा, आणि आम्ही तुमच्या चार्टच्या सह मार्गदर्शन करू",
    intentCareer: "करिअर आणि काम",
    intentLove: "प्रेम आणि संबंध",
    intentMarriage: "विवाह आणि वेळ",
    intentMoney: "पैसा आणि वाढ",
    intentEmotional: "भावनात्मक शक्ति",
    intentDaily: "दैनिक मार्गदर्शन",
    intentExploring: "फक्त शोध करत आहे",
    trustTitle: "प्राचीन ज्ञानात रुजलेले।",
    trustSubtitle: "तुमच्या अनन्य चार्टभोवती तयार।",
    trustCard1Title: "तुमची कुंडली, तुमचा हिसाब",
    trustCard1Desc: "Swiss Ephemeris Engine वापरून ग्रहांची सुस्पष्ट स्थिती शोधतो — हीच engine NASA आणि जगभरातील ज्योतिषी वापरतात।",
    trustCard2Title: "५,००० वर्षांचा ज्योतिष",
    trustCard2Desc: "BPHS, Saravali, Phaladeepika — जुनी पुस्तके, सोप्या भाषेतून समजावून सांगितले।",
    trustCard3Title: "महत्वाच्या निर्णयांसाठी तयार केलेले",
    trustCard3Desc: "करिअर, प्रेम, वेळ, पैसा — असल्या जीवनाचा सोपा मार्गदर्शन।",
    birthTitle: "तुमची जन्म माहिती शेअर करा",
    birthSubtitle: "जितके अधिक अचूक, तितके आम्ही तुमच्या चार्टमध्ये गहिरे पाहू शकू",
    fullName: "पूर्ण नाव",
    fullNamePlaceholder: "तुमचे पूर्ण नाव प्रविष्ट करा",
    dateOfBirth: "जन्मतारीख",
    timeOfBirth: "जन्मवेळ",
    dontKnowTime: "मला माझी जन्मवेळ माहीत नाही",
    placeOfBirth: "जन्मस्थान",
    placePlaceholder: "शहर शोधा — उदा. मुंबई, दिल्ली, लंडन...",
    generateChart: "माझी चार्ट तयार करा",
    revealTitle: "तुमची चार्ट, एक नजरेत",
    revealSubtitle: "{name}चा ब्रह्मांडीय नकाशा",
    moonSign: "चंद्र राशी",
    nakshatra: "नक्षत्र",
    risingSign: "उदयाचा राशी",
    todayLabel: "आज",
    readyToAsk: "तुमचा पहिला प्रश्न विचारायला तयार आहात?",
    askFirstTitle: "तुमचा पहिला प्रश्न विचारा",
    askFirstSubtitle: "तुमची चार्ट तयार आहे। प्रेम, करिअर, वेळ किंवा जीवनाबद्दल काही विचारा।",
    typePlaceholder: "तुमचा प्रश्न टाइप करा...",
    suggestionsLabel: "तुमच्यासाठी सुझाव",
    askNow: "GrahAI कडून विचारा",
    skipExplore: "सोडून द्या आणि शोध करा",
    saveChartTitle: "तुमची चार्ट जतन करा",
    saveChartSubtitle: "तुमची कुंडली, इतिहास, आणि दैनिक मार्गदर्शन सर्व डिव्हाइसेसवर सुरक्षित ठेवायला ईमेल प्रविष्ट करा।",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "तुमची कुंडली सुरक्षितपणे जतन",
    saveBenefit2: "दैनिक वैयक्तिक मार्गदर्शन",
    saveBenefit3: "सर्व सेशनभोवती प्रश्न इतिहास",
    saveAndEnter: "जतन करा आणि GrahAI मध्ये प्रवेश करा",
    skipForNow: "आता सोडून द्या",
    continueBtn: "पुढे जा",
    readingChart: "तुमची चार्ट वाचत आहे...",
    askYourFirst: "तुमचा पहिला प्रश्न विचारा",
  },
  nav: {
    home: "होम",
    ask: "विचारा",
    compatibility: "जुळणी",
    reports: "अहवाल",
    profile: "प्रोफाइल",
  },
  home: {
    ...en.home,
    greeting: "शुभ {timeOfDay}, {name}",
    todayGuidance: "आजचे मार्गदर्शन",
    tomorrowGuidance: "उद्याचे मार्गदर्शन",
    loveCard: "प्रेम",
    careerCard: "करिअर",
    energyCard: "शक्ति",
    panchangTitle: "पंचांग",
    luckyColors: "भाग्यवान रंग",
    luckyNumbers: "भाग्यवान संख्या",
    askQuestion: "एक प्रश्न विचारा",
    viewReports: "अहवाल पहा",
    sourcesTitle: "स्रोत",
  },
  ask: {
    ...en.ask,
    title: "GrahAI कडून विचारा",
    placeholder: "प्रेम, करिअर, वेळ बद्दल विचारा...",
    topicLove: "प्रेम",
    topicCareer: "करिअर",
    topicTiming: "वेळ",
    topicFamily: "कुटुंब",
    topicHealth: "आरोग्य",
    topicMoney: "पैसा",
    directAnswer: "सरळ उत्तर",
    whyShowingUp: "हे का दिसत आहे",
    whatToDo: "काय करायचे",
    whatToAvoid: "काय टाळायचे",
    timeWindow: "वेळ खिडकी",
    remedy: "उपाय",
    source: "स्रोत",
    followUp: "अनुवर्ती प्रश्न",
    questionsLeft: "आज {count} प्रश्न उरलेले",
    upgradeForMore: "अधिकसाठी अपग्रेड करा",
  },
  chart: {
    ...en.chart,
    title: "माझी चार्ट",
    birthChart: "जन्म चार्ट",
    sunSign: "सूर्य राशी",
    moonSign: "चंद्र राशी",
    risingSign: "उदयाचा राशी",
    nakshatra: "नक्षत्र",
    element: "घटक",
    strengths: "शक्तिमत्ता",
    sensitivities: "संवेदनशीलता",
    showAdvanced: "उन्नत दाखवा",
    hideAdvanced: "उन्नत लपवा",
  },
  reports: {
    ...en.reports,
    title: "अहवाल",
    loveCompat: "प्रेम आणि सुसंगतता",
    careerBlueprint: "करिअर ब्लूप्रिंट",
    marriageTiming: "विवाह वेळ",
    annualForecast: "वार्षिक पूर्वानुमान",
    wealthGrowth: "संपत्ति वाढ",
    dashaDeepDive: "दशा खोल विश्लेषण",
    unlocked: "अनलॉक",
    locked: "लॉक",
    buyReport: "अहवाल खरेदी करा",
    preview: "पूर्वावलोकन",
    oneTimePacks: "एकबारी पॅकेज",
  },
  profile: {
    title: "प्रोफाइल",
    editBirthDetails: "जन्म तपशील संपादित करा",
    changeLanguage: "भाषा बदला",
    vedic: "वैदिक",
    western: "पाश्चात्य",
    questions: "प्रश्न",
    reportsLabel: "अहवाल",
    compatibility: "सुसंगतता",
    available: "उपलब्ध",
    buyQuestions: "प्रश्न खरेदी करा",
    buyReports: "अहवाल खरेदी करा",
    buyCompatibility: "सुसंगतता खरेदी करा",
    helpSupport: "मदत आणि समर्थन",
    activity: "कार्यकलाप",
    referEarn: "संदर्भ करा आणि अर्जन करा",
    questionsHistory: "प्रश्न इतिहास",
    reportsHistory: "अहवाल इतिहास",
    compatHistory: "सुसंगतता इतिहास",
    familyMembers: "कुटुंब सदस्य",
    upgradePremium: "प्रीमियमला अपग्रेड करा",
    upgradeDesc: "अमर्याद प्रश्न, गहरी अंतर्दृष्टी, पूर्ण अहवाल",
    signOut: "साइन आउट",
    signOutConfirm: "साइन आउट करायचं?",
    signOutDesc: "हे या डिव्हाइसमधून तुमचा जन्म डेटा आणि चार्ट साफ करेल। तुम्ही नंतर ते पुन्हा प्रविष्ट करू शकता।",
    cancel: "रद्द करा",
    version: "GrahAI v3.0 · भारतात प्रेमाने बनवलेले",
    editBirthTitle: "जन्म तपशील संपादित करा",
    editBirthDesc: "अधिक अचूक वाचनासाठी तुमची जन्म माहिती अपडेट करा।",
    saveChanges: "बदल जतन करा",
    saving: "जतन करत आहे...",
    faq1Q: "GrahAI कसे काम करते?",
    faq1A: "GrahAI तुमच्या जन्मतारीख, वेळ आणि स्थान वापरून तुमची वैदिक कुंडली मोजते। आमचा AI नंतर शास्त्रीय ज्योतिष तत्वांचा वापर करून वैयक्तिक मार्गदर्शन प्रदान करते।",
    faq2Q: "हे किती अचूक आहे?",
    faq2A: "अचूकता जन्मवेळ अचूकतेवर अवलंबून असते। GrahAI पारंपारिक ज्योतिषी वापरत असलेली समान गणना वापरते, AI द्वारे वर्धित।",
    faq3Q: "माझा डेटा सुरक्षित आहे?",
    faq3A: "तुमचा जन्म डेटा तुमच्या डिव्हाइसवर स्थानीयरित्या संग्रहित आहे। आम्ही तुमची वैयक्तिक माहिती तीसऱ्या पक्षांसह शेअर करत नाही।",
    faq4Q: "मी आणखी प्रश्न कसे मिळवू?",
    faq4A: "तुम्ही Graha किंवा Rishi योजनेला अपग्रेड करू शकता किंवा मूल्य पृष्ठातून प्रश्न पॅकेज खरेदी करू शकता।",
    faq5Q: "मला परतफेड मिळू शकेल?",
    faq5A: "होय, आम्ही सर्व खरेदीवर 7-दिवसीय परतफेड नीति प्रदान करतो। सहाय्यासाठी समर्थनाशी संपर्क करा।",
    askForHelp: "GrahAI कडून मदत मागा",
  },
  pricing: {
    ...en.pricing,
    title: "तुमची योजना निवडा",
    subtitle: "तुमच्यासाठी योग्य योजनेतून गहरे मार्गदर्शन मिळवा",
    monthly: "मासिक",
    oneTime: "एकबारी",
    free: "मुक्त",
    graha: "ग्रह",
    rishi: "ऋषी",
    perMonth: "/महिना",
    currentPlan: "वर्तमान योजना",
    upgrade: "अपग्रेड",
    popular: "लोकप्रिय",
  },
  paywall: {
    ...en.paywall,
    limitReached: "तुम्ही आजचे मुक्त प्रश्न वापरून घेतले",
    upgradeNow: "आता अपग्रेड करा",
    dismiss: "कदाचित नंतर",
  },
  referral: {
    ...en.referral,
    title: "संदर्भ करा आणि अर्जन करा",
    subtitle: "मित्रांसह GrahAI शेअर करा आणि पुरस्कार अर्जन करा",
    yourCode: "तुमचा संदर्भ कोड",
    copyCode: "कोड कॉपी करा",
    shareWithFriends: "मित्रांसह शेअर करा",
    rewardsTitle: "तुमचे पुरस्कार",
    friendsReferred: "संदर्भित मित्र",
  },
  source: en.source,
  common: {
    loading: "लोड होत आहे...",
    error: "काहीतरी चुकलं",
    retry: "पुन्हा प्रयत्न करा",
    close: "बंद करा",
    back: "मागे",
    next: "पुढे",
    save: "जतन करा",
    done: "झालं",
    today: "आज",
    tomorrow: "उद्या",
  },
}

// Gujarati
const gu: Translations = {
  langPicker: {
    title: "તમારી ભાષા પસંદ કરો",
    subtitle: "તમે પછીથી પ્રોફાઈલ સેટિંગ્સમાંથી બદલી શકો છો.",
  },
  onboarding: {
    welcomeSubtitle: "તારાઓ તમારી રાહ જોતા હતા.",
    welcomeDesc: "GrahAI તમારી કુંડળીની ભાષા વાંચે છે અને તે ક્ષણો માટે મૃદુ, સમય-પરીક્ષિત માર્ગદર્શન આપે છે જે સાચા અર્થમાં મહત્વપૂર્ણ છે।",
    getFirstInsight: "મારી યાત્રા શરૂ કરો",
    intentTitle: "આજ આપણી પાસે શું લાવ્યો છો?",
    intentSubtitle: "આમને કહો, અને આપણે તમારી ચાર્ટ શું પ્રગટ કરે તેના સાથે તમને માર્ગદર્શન આપીશું",
    intentCareer: "કેરિયર અને કામ",
    intentLove: "પ્રેમ અને સંબંધ",
    intentMarriage: "લગ્ન અને સમય",
    intentMoney: "પૈસા અને વૃદ્ધિ",
    intentEmotional: "ભાવનાત્મક શક્તિ",
    intentDaily: "દૈનિક માર્ગદર્શન",
    intentExploring: "માત્ર અન્વેષણ કરી રહ્યો છે",
    trustTitle: "પ્રાચીન જ્ઞાનમાં નિહિત.",
    trustSubtitle: "તમારી અનન્ય ચાર્ટની આસપાસ બનાવેલ.",
    trustCard1Title: "તમારી કુંડળી, તમારી ગણતરી",
    trustCard1Desc: "Swiss Ephemeris Engine વાપરીને ગ્રહોની બરાબર સ્થિતિ શોધીએ છીએ — NASA અને બધા દેશના જ્યોતિષીઓ આ engine વાપરે છે।",
    trustCard2Title: "५,००० વર્ષોનો જ્યોતિષ",
    trustCard2Desc: "BPHS, Saravali, Phaladeepika — જૂની પુસ્તકો, સરળ ભાષામાં સમજાવેલી।",
    trustCard3Title: "મહત્વના નિર્ણયો માટે બનાવેલ",
    trustCard3Desc: "કેરિયર, પ્રેમ, સમય, પૈસા — આસલી જીવનમાટે સરળ માર્ગદર્શન।",
    birthTitle: "તમારા જન્મ વિવરણ શેર કરો",
    birthSubtitle: "જેટલું વધુ ચોક્કસ, તમ અમરે તમારી ચાર્ટમાં ગહરું જોઈ શકીએ છીએ",
    fullName: "સંપૂર્ણ નામ",
    fullNamePlaceholder: "તમારું સંપૂર્ણ નામ દાખલ કરો",
    dateOfBirth: "જન્મ તારીખ",
    timeOfBirth: "જન્મ સમય",
    dontKnowTime: "મને મારો જન્મ સમય ખબર નથી",
    placeOfBirth: "જન્મ સ્થાન",
    placePlaceholder: "શહેર શોધો — જેમ કે મુંબઈ, દિલ્હી, લંડન...",
    generateChart: "મારી ચાર્ટ તૈયાર કરો",
    revealTitle: "તમારી ચાર્ટ, એક નજરમાં",
    revealSubtitle: "{name}નો મહાકાશીય લેઆઉટ",
    moonSign: "ચંદ્ર રાશિ",
    nakshatra: "નક્ષત્ર",
    risingSign: "ઉદય રાશિ",
    todayLabel: "આજે",
    readyToAsk: "તમારો પ્રથમ પ્રશ્ન પૂછવા માટે તૈયાર છો?",
    askFirstTitle: "તમારો પ્રથમ પ્રશ્ન પૂછો",
    askFirstSubtitle: "તમારી ચાર્ટ તૈયાર છે. પ્રેમ, કેરિયર, સમય અથવા જીવન વિશે કશું પણ પૂછો.",
    typePlaceholder: "તમારો પ્રશ્ન ટાઇપ કરો...",
    suggestionsLabel: "તમારા માટે સુધારો",
    askNow: "GrahAI પાસે પૂછો",
    skipExplore: "છોડી દો અને અન્વેષણ કરો",
    saveChartTitle: "તમારી ચાર્ટ સાચવો",
    saveChartSubtitle: "તમારી કુંડળી, ઈતિહાસ અને દૈનિક માર્ગદર્શન તમામ ઉપકરણોમાં સુરક્ષિત રાખવા માટે તમારો ઈમેલ દાખલ કરો.",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "તમારી કુંડળી સુરક્ષિતપણે સાચવવામાં આવશે",
    saveBenefit2: "દૈનિક વ્યક્તિગતકૃત માર્ગદર્શન",
    saveBenefit3: "સેશન દરમિયાન પ્રશ્ન ઈતિહાસ",
    saveAndEnter: "સાચવો અને GrahAI માં પ્રવેશો",
    skipForNow: "અभی ક્લિક કરો",
    continueBtn: "આગળ વધો",
    readingChart: "તમારી ચાર્ટ વાંચી રહ્યું છે...",
    askYourFirst: "તમારો પ્રથમ પ્રશ્ન પૂછો",
  },
  nav: {
    home: "હોમ",
    ask: "પૂછો",
    compatibility: "મેળ",
    reports: "રિપોર્ટ",
    profile: "પ્રોફાઈલ",
  },
  home: {
    ...en.home,
    greeting: "શુભ {timeOfDay}, {name}",
    todayGuidance: "આજનું માર્ગદર્શન",
    tomorrowGuidance: "આવતીકાલનું માર્ગદર્શન",
    loveCard: "પ્રેમ",
    careerCard: "કેરિયર",
    energyCard: "શક્તિ",
    panchangTitle: "પંચાંગ",
    luckyColors: "ભાગ્યશાળી રંગો",
    luckyNumbers: "ભાગ્યશાળી સંખ્યાઓ",
    askQuestion: "એક પ્રશ્ન પૂછો",
    viewReports: "રિપોર્ટ જુઓ",
    sourcesTitle: "સ્ત્રોતો",
  },
  ask: {
    ...en.ask,
    title: "GrahAI પાસે પૂછો",
    placeholder: "પ્રેમ, કેરિયર, સમય વિશે પૂછો...",
    topicLove: "પ્રેમ",
    topicCareer: "કેરિયર",
    topicTiming: "સમય",
    topicFamily: "પરિવાર",
    topicHealth: "આરોગ્ય",
    topicMoney: "પૈસા",
    directAnswer: "સીધો જવાબ",
    whyShowingUp: "તે શા માટે દેખાઈ રહ્યું છે",
    whatToDo: "શું કરવું",
    whatToAvoid: "શું ટાળવું",
    timeWindow: "સમય વિન્ડો",
    remedy: "ઉપચાર",
    source: "સ્ત્રોત",
    followUp: "અનુવર્તી પ્રશ્નો",
    questionsLeft: "આજે {count} પ્રશ્નો બાકી",
    upgradeForMore: "વધુ માટે અપગ્રેડ કરો",
  },
  chart: {
    ...en.chart,
    title: "મારી ચાર્ટ",
    birthChart: "જન્મ ચાર્ટ",
    sunSign: "સૂર્ય રાશિ",
    moonSign: "ચંદ્ર રાશિ",
    risingSign: "ઉદય રાશિ",
    nakshatra: "નક્ષત્ર",
    element: "ઘટક",
    strengths: "શક્તિઓ",
    sensitivities: "સંવેદનશીલતાઓ",
    showAdvanced: "અગ્રણી બતાવો",
    hideAdvanced: "અગ્રણી છુપાવો",
  },
  reports: {
    ...en.reports,
    title: "રિપોર્ટ",
    loveCompat: "પ્રેમ અને સુમેળ",
    careerBlueprint: "કેરિયર બ્લુપ્રિન્ટ",
    marriageTiming: "લગ્ન સમય",
    annualForecast: "વાર્ષિક પૂર્વધારણા",
    wealthGrowth: "સંપત્તિ વૃદ્ધિ",
    dashaDeepDive: "દશા ગહન વિશ્લેષણ",
    unlocked: "અનલૉક કર્યું",
    locked: "લૉક કર્યું",
    buyReport: "રિપોર્ટ ખરીદો",
    preview: "પૂર્વદર્શન",
    oneTimePacks: "એક બાર પેકેજ",
  },
  profile: {
    title: "પ્રોફાઈલ",
    editBirthDetails: "જન્મ વિગતો સંપાદિત કરો",
    changeLanguage: "ભાષા બદલો",
    vedic: "વેદિક",
    western: "પશ્ચિમી",
    questions: "પ્રશ્નો",
    reportsLabel: "રિપોર્ટ",
    compatibility: "સુમેળ",
    available: "ઉપલબ્ધ",
    buyQuestions: "પ્રશ્નો ખરીદો",
    buyReports: "રિપોર્ટ ખરીદો",
    buyCompatibility: "સુમેળ ખરીદો",
    helpSupport: "મદદ અને સમર્થન",
    activity: "પ્રવૃત્તિ",
    referEarn: "સંદર્ભ કરો અને કમાવો",
    questionsHistory: "પ્રશ્નો ઈતિહાસ",
    reportsHistory: "રિપોર્ટ ઈતિહાસ",
    compatHistory: "સુમેળ ઈતિહાસ",
    familyMembers: "પરિવાર સદસ્યો",
    upgradePremium: "પ્રીમિયમ માટે અપગ્રેડ કરો",
    upgradeDesc: "અમર્યાદ પ્રશ્નો, ગહન અંતર્દૃષ્ટિ, સંપૂર્ણ રિપોર્ટ",
    signOut: "સાઈન આઉટ",
    signOutConfirm: "સાઈન આઉટ કરશો?",
    signOutDesc: "આ આ ઉપકરણમાંથી તમારા જન્મ ડેટા અને ચાર્ટ સાફ કરશે. તમે પછીથી તેને ફરીથી દાખલ કરી શકો છો.",
    cancel: "રદ કરો",
    version: "GrahAI v3.0 · ભારતમાં પ્રેમ સાથે બનાવેલ",
    editBirthTitle: "જન્મ વિગતો સંપાદિત કરો",
    editBirthDesc: "વધુ ચોક્કસ રીડિંગ માટે તમારો જન્મ માહિતી અપડેટ કરો.",
    saveChanges: "બદલ સંરક્ષિત કરો",
    saving: "સંરક્ષિત કરી રહ્યું છે...",
    faq1Q: "GrahAI કેવી રીતે કામ કરે છે?",
    faq1A: "GrahAI તમારી જન્મ તારીખ, સમય અને સ્થાન વાપરીને તમારી વેદિક ચાર્ટ ગણતરી કરે છે. આપણો AI પછી શાસ્ત્રીય જ્યોતિષ સિદ્ધાંતો ઉપયોગ કરીને વ્યક્તિગતકૃત માર્ગદર્શન આપે છે.",
    faq2Q: "તે કેટલું સટીક છે?",
    faq2A: "સટીકતા જન્મ સમય ચોક્સતા પર આધારિત છે. GrahAI પરંપરાગત જ્યોતિષીઓ જે વાપરે છે તે જ પાર્શ્વીય ગણતરીઓ વાપરે છે, AI દ્વારા વર્ધિત.",
    faq3Q: "મારો ડેટા સુરક્ષિત છે?",
    faq3A: "તમારો જન્મ ડેટા તમારા ઉપકરણમાં સ્થાનીય રીતે સંગ્રહિત છે. આપણે તમારી વ્યક્તિગત માહિતી તૃતીય પક્ષો સાથે શેર કરતા નથી.",
    faq4Q: "મે અધિક પ્રશ્નો કેવી રીતે મેળવી શકું?",
    faq4A: "તમે ગ્રહ અથવા ઋષી પરિયોજનાને અપગ્રેડ કરી શકો છો, અથવા ભાવન પૃષ્ઠમાંથી પ્રશ્ન પેકેજ ખરીદી શકો છો.",
    faq5Q: "શું મને રીફંડ મળી શકે?",
    faq5A: "હા, આપણે બધી ખરીદી પર 7-દિવસીય રીફંડ નીતિ આપીએ છીએ. સહાય માટે સમર્થન સાથે સંપર્ક કરો.",
    askForHelp: "GrahAI પાસે મદદ માંગો",
  },
  pricing: {
    ...en.pricing,
    title: "તમારી પરિયોજના પસંદ કરો",
    subtitle: "તમારા માટે યોગ્ય પરિયોજનાથી ગહન માર્ગદર્શન મેળવો",
    monthly: "માસિક",
    oneTime: "એક બાર",
    free: "મુક્ત",
    graha: "ગ્રહ",
    rishi: "ઋષી",
    perMonth: "/માસ",
    currentPlan: "વર્તમાન પરિયોજના",
    upgrade: "અપગ્રેડ",
    popular: "લોકપ્રિય",
  },
  paywall: {
    ...en.paywall,
    limitReached: "તમે આજના મુક્ત પ્રશ્નો ઉપયોગ કર્યા છે",
    upgradeNow: "હમણાં જ અપગ્રેડ કરો",
    dismiss: "કદાચ પછીથી",
  },
  referral: {
    ...en.referral,
    title: "સંદર્ભ કરો અને કમાવો",
    subtitle: "મિત્રો સાથે GrahAI શેર કરો અને પુરસ્કાર કમાવો",
    yourCode: "તમારો સંદર્ભ કોડ",
    copyCode: "કોડ નકલ કરો",
    shareWithFriends: "મિત્રો સાથે શેર કરો",
    rewardsTitle: "તમારા પુરસ્કાર",
    friendsReferred: "સંદર્ભિત મિત્રો",
  },
  source: en.source,
  common: {
    loading: "લોડ થઈ રહ્યું છે...",
    error: "કંઈક ખોટું થયું",
    retry: "ફરી પ્રયાસ કરો",
    close: "બંધ કરો",
    back: "પાછળ",
    next: "આગળ",
    save: "સેવ કરો",
    done: "થઈ ગયું",
    today: "આજે",
    tomorrow: "આવતીકાલે",
  },
}

// ═══════════════════════════════════════════════════
// Translation map & accessor
// ═══════════════════════════════════════════════════
const translations: Record<Language, Translations> = {
  en, hi, ta, te, kn, ml, bn, mr, gu,
}

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en
}

export const DEFAULT_LANGUAGE: Language = "en"
export const LANGUAGE_STORAGE_KEY = "grahai-language"
