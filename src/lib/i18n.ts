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
    chart: string
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
  }

  // ─── Paywall Banner ───
  paywall: {
    limitReached: string
    upgradeNow: string
    dismiss: string
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
    trustCard1Desc: "Every insight draws from your unique cosmic blueprint \u2014 nothing generic, nothing random.",
    trustCard2Title: "Grounded in classical Jyotish",
    trustCard2Desc: "Wisdom passed down through centuries of Vedic tradition guides every reading.",
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
    chart: "Chart",
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
  },
  paywall: {
    limitReached: "You\u2019ve used your free questions for today",
    upgradeNow: "Upgrade Now",
    dismiss: "Maybe later",
  },
  referral: {
    title: "Refer & Earn",
    subtitle: "Share GrahAI with friends and earn rewards",
    yourCode: "Your Referral Code",
    copyCode: "Copy Code",
    shareWithFriends: "Share with Friends",
    rewardsTitle: "Your Rewards",
    friendsReferred: "Friends Referred",
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
    welcomeSubtitle: "तारे आपका इंतज़ार कर रहे थे।",
    welcomeDesc: "GrahAI आपकी जन्म कुंडली की भाषा पढ़कर, उन पलों के लिए शांत और समय-परीक्षित मार्गदर्शन देता है जो सच में मायने रखते हैं।",
    getFirstInsight: "मेरी यात्रा शुरू करें",
    intentTitle: "आपका मन किस बारे में स्पष्टता चाहता है?",
    intentSubtitle: "बताइए, और हम आपकी कुंडली से मार्गदर्शन करेंगे",
    intentCareer: "करियर और काम",
    intentLove: "प्यार और रिश्ते",
    intentMarriage: "शादी और समय",
    intentMoney: "पैसा और विकास",
    intentEmotional: "भावनात्मक ऊर्जा",
    intentDaily: "दैनिक मार्गदर्शन",
    intentExploring: "बस देख रहे हैं",
    trustTitle: "प्राचीन ज्ञान पर आधारित।",
    trustSubtitle: "आपकी अनूठी कुंडली के इर्द-गिर्द बुना हुआ।",
    trustCard1Title: "आपकी जन्म कुंडली से जन्मा",
    trustCard1Desc: "हर सुझाव आपके अपने ब्रह्मांडीय नक्शे से आता है — कुछ भी सामान्य नहीं।",
    trustCard2Title: "शास्त्रीय ज्योतिष पर आधारित",
    trustCard2Desc: "सदियों से चली आ रही वैदिक परंपरा का ज्ञान हर पठन का मार्गदर्शन करता है।",
    trustCard3Title: "उन फैसलों के लिए बना जो मायने रखते हैं",
    trustCard3Desc: "करियर, प्यार, समय, पैसा — ग्रहों को आपका रास्ता रोशन करने दें।",
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
    revealTitle: "आपकी कुंडली, पहली नज़र में",
    revealSubtitle: "{name} का ब्रह्मांडीय नक्शा",
    moonSign: "चंद्र राशि",
    nakshatra: "नक्षत्र",
    risingSign: "लग्न राशि",
    todayLabel: "आज",
    readyToAsk: "अपना पहला सवाल पूछने के लिए तैयार हैं?",
    askFirstTitle: "अपना पहला सवाल पूछें",
    askFirstSubtitle: "आपकी कुंडली तैयार है। प्यार, करियर, समय या जीवन के बारे में कुछ भी पूछें।",
    typePlaceholder: "अपना सवाल लिखें...",
    suggestionsLabel: "आपके लिए सुझाव",
    askNow: "GrahAI से पूछें",
    skipExplore: "छोड़ें और देखें",
    saveChartTitle: "अपनी कुंडली सेव करें",
    saveChartSubtitle: "अपना ईमेल डालें ताकि आपकी कुंडली, इतिहास और दैनिक मार्गदर्शन हर डिवाइस पर सुरक्षित रहे।",
    emailPlaceholder: "your@email.com",
    saveBenefit1: "आपकी कुंडली सुरक्षित सेव",
    saveBenefit2: "रोज़ाना व्यक्तिगत मार्गदर्शन",
    saveBenefit3: "सभी सत्रों में सवालों का इतिहास",
    saveAndEnter: "सेव करें और GrahAI में प्रवेश करें",
    skipForNow: "अभी छोड़ें",
    continueBtn: "आगे बढ़ें",
    readingChart: "आपकी कुंडली पढ़ रहे हैं...",
    askYourFirst: "अपना पहला सवाल पूछें",
  },
  nav: {
    home: "होम",
    ask: "पूछें",
    chart: "कुंडली",
    reports: "रिपोर्ट",
    profile: "प्रोफ़ाइल",
  },
  home: {
    greeting: "शुभ {timeOfDay}, {name}",
    todayGuidance: "आज का मार्गदर्शन",
    tomorrowGuidance: "कल का मार्गदर्शन",
    loveCard: "प्यार",
    careerCard: "करियर",
    energyCard: "ऊर्जा",
    panchangTitle: "पंचांग",
    luckyColors: "शुभ रंग",
    luckyNumbers: "शुभ अंक",
    askQuestion: "सवाल पूछें",
    viewReports: "रिपोर्ट देखें",
    sourcesTitle: "स्रोत",
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
  },
  paywall: {
    limitReached: "आज के मुफ़्त सवाल खत्म हो गए",
    upgradeNow: "अभी अपग्रेड करें",
    dismiss: "बाद में",
  },
  referral: {
    title: "रेफर करें और कमाएं",
    subtitle: "दोस्तों के साथ GrahAI शेयर करें और इनाम पाएं",
    yourCode: "आपका रेफरल कोड",
    copyCode: "कोड कॉपी करें",
    shareWithFriends: "दोस्तों के साथ शेयर करें",
    rewardsTitle: "आपके इनाम",
    friendsReferred: "रेफर किए गए दोस्त",
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
    intentTitle: "எதில் தெளிவு வேண்டும்?",
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
    trustCard1Title: "உங்கள் பிறப்பு விவரங்களிலிருந்து",
    trustCard1Desc: "ஒவ்வொரு பதிலும் உங்கள் ஜாதகத்தை அடிப்படையாகக் கொண்டது.",
    trustCard2Title: "சாஸ்திர ஆதாரம்",
    trustCard2Desc: "பாரம்பரிய ஜோதிட நூல்களின் அடிப்படையில் வழிகாட்டுதல்.",
    trustCard3Title: "நிஜ வாழ்க்கை முடிவுகளுக்கு பயனுள்ளது",
    trustCard3Desc: "தொழில், காதல், நேரம், பணம் — செயல்படுத்தக்கூடிய வழிகாட்டுதல்.",
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
  nav: { home: "முகப்பு", ask: "கேளுங்கள்", chart: "ஜாதகம்", reports: "அறிக்கைகள்", profile: "புரொஃபைல்" },
  home: {
    greeting: "இனிய {timeOfDay}, {name}",
    todayGuidance: "இன்றைய வழிகாட்டுதல்",
    tomorrowGuidance: "நாளைய வழிகாட்டுதல்",
    loveCard: "காதல்", careerCard: "தொழில்", energyCard: "ஆற்றல்",
    panchangTitle: "பஞ்சாங்கம்", luckyColors: "அதிர்ஷ்ட நிறங்கள்", luckyNumbers: "அதிர்ஷ்ட எண்கள்",
    askQuestion: "கேள்வி கேளுங்கள்", viewReports: "அறிக்கைகள் பாருங்கள்", sourcesTitle: "ஆதாரங்கள்",
  },
  ask: {
    title: "GrahAI-யிடம் கேளுங்கள்", placeholder: "காதல், தொழில், நேரம் பற்றி கேளுங்கள்...",
    topicLove: "காதல்", topicCareer: "தொழில்", topicTiming: "நேரம்", topicFamily: "குடும்பம்", topicHealth: "உடல்நலம்", topicMoney: "பணம்",
    directAnswer: "நேரடி பதில்", whyShowingUp: "ஏன் இது வருகிறது", whatToDo: "என்ன செய்யவேண்டும்",
    whatToAvoid: "என்ன தவிர்க்கவேண்டும்", timeWindow: "நேர கட்டம்", remedy: "பரிகாரம்", source: "ஆதாரம்",
    followUp: "தொடர் கேள்விகள்", questionsLeft: "இன்று {count} கேள்விகள் உள்ளன", upgradeForMore: "மேலும் பெற அப்கிரேட் செய்யுங்கள்",
  },
  chart: {
    title: "எனது ஜாதகம்", birthChart: "பிறப்பு ஜாதகம்", sunSign: "சூரிய ராசி", moonSign: "சந்திர ராசி",
    risingSign: "லக்ன ராசி", nakshatra: "நட்சத்திரம்", element: "தத்துவம்", strengths: "பலங்கள்",
    sensitivities: "உணர்திறன்", showAdvanced: "மேலும் காட்டு", hideAdvanced: "குறைவாக காட்டு",
  },
  reports: {
    title: "அறிக்கைகள்", loveCompat: "காதல் & பொருத்தம்", careerBlueprint: "தொழில் வரைபடம்",
    marriageTiming: "திருமண நேரம்", annualForecast: "வருடாந்திர கணிப்பு", wealthGrowth: "செல்வ வளர்ச்சி",
    dashaDeepDive: "தசா ஆழ்வு", unlocked: "திறந்தது", locked: "பூட்டியது",
    buyReport: "அறிக்கை வாங்கவும்", preview: "முன்னோட்டம்", oneTimePacks: "ஒரு முறை பேக்குகள்",
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
  },
  paywall: { limitReached: "இன்றைய இலவச கேள்விகள் முடிந்தன", upgradeNow: "இப்போது அப்கிரேட் செய்யுங்கள்", dismiss: "பின்னர்" },
  referral: {
    title: "பரிந்துரை & சம்பாதிப்பு", subtitle: "நண்பர்களுடன் GrahAI பகிர்ந்து வெகுமதிகள் பெறுங்கள்",
    yourCode: "உங்கள் பரிந்துரை குறியீடு", copyCode: "குறியீடு நகலெடு", shareWithFriends: "நண்பர்களுடன் பகிரவும்",
    rewardsTitle: "உங்கள் வெகுமதிகள்", friendsReferred: "பரிந்துரைக்கப்பட்ட நண்பர்கள்",
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
    intentTitle: "మీకు దేని గురించి స్పష్టత కావాలి?",
    intentSubtitle: "ఇది మీ అనుభవాన్ని మెరుగుపరచడంలో సహాయపడుతుంది",
    intentCareer: "కెరీర్ & పని", intentLove: "ప్రేమ & సంబంధం", intentMarriage: "వివాహం & సమయం",
    intentMoney: "డబ్బు & వృద్ధి", intentEmotional: "భావోద్వేగ శక్తి", intentDaily: "రోజువారీ మార్గదర్శకత్వం", intentExploring: "చూస్తున్నాను",
    trustTitle: "సాధారణం కాదు. యాదృచ్ఛికం కాదు.", trustSubtitle: "మీ జాతకం ఆధారంగా.",
    trustCard1Title: "మీ జన్మ వివరాల నుండి", trustCard1Desc: "ప్రతి సమాధానం మీ జాతకం ఆధారంగా ఉంటుంది.",
    trustCard2Title: "శాస్త్ర ఆధారం", trustCard2Desc: "సాంప్రదాయ జ్యోతిష్ సూత్రాల ఆధారంగా మార్గదర్శకత్వం.",
    trustCard3Title: "నిజ జీవిత నిర్ణయాలకు ఉపయోగకరం", trustCard3Desc: "కెరీర్, ప్రేమ, సమయం, డబ్బు — ఆచరణాత్మక మార్గదర్శకత్వం.",
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
  nav: { home: "హోమ్", ask: "అడగండి", chart: "జాతకం", reports: "నివేదికలు", profile: "ప్రొఫైల్" },
  home: { greeting: "శుభ {timeOfDay}, {name}", todayGuidance: "ఈరోజు మార్గదర్శకత్వం", tomorrowGuidance: "రేపటి మార్గదర్శకత్వం", loveCard: "ప్రేమ", careerCard: "కెరీర్", energyCard: "శక్తి", panchangTitle: "పంచాంగం", luckyColors: "అదృష్ట రంగులు", luckyNumbers: "అదృష్ట సంఖ్యలు", askQuestion: "ప్రశ్న అడగండి", viewReports: "నివేదికలు చూడండి", sourcesTitle: "మూలాలు" },
  ask: { title: "GrahAI ని అడగండి", placeholder: "ప్రేమ, కెరీర్, సమయం గురించి అడగండి...", topicLove: "ప్రేమ", topicCareer: "కెరీర్", topicTiming: "సమయం", topicFamily: "కుటుంబం", topicHealth: "ఆరోగ్యం", topicMoney: "డబ్బు", directAnswer: "నేరుగా సమాధానం", whyShowingUp: "ఇది ఎందుకు కనిపిస్తోంది", whatToDo: "ఏమి చేయాలి", whatToAvoid: "ఏమి తప్పించాలి", timeWindow: "సమయ వ్యవధి", remedy: "పరిహారం", source: "మూలం", followUp: "తదుపరి ప్రశ్నలు", questionsLeft: "ఈరోజు {count} ప్రశ్నలు మిగిలి ఉన్నాయి", upgradeForMore: "మరిన్ని కోసం అప్‌గ్రేడ్ చేయండి" },
  chart: { title: "నా జాతకం", birthChart: "జన్మ జాతకం", sunSign: "సూర్య రాశి", moonSign: "చంద్ర రాశి", risingSign: "లగ్న రాశి", nakshatra: "నక్షత్రం", element: "తత్వం", strengths: "బలాలు", sensitivities: "సున్నితత్వాలు", showAdvanced: "మరింత చూపు", hideAdvanced: "తక్కువ చూపు" },
  reports: { title: "నివేదికలు", loveCompat: "ప్రేమ & అనుకూలత", careerBlueprint: "కెరీర్ బ్లూప్రింట్", marriageTiming: "వివాహ సమయం", annualForecast: "వార్షిక అంచనా", wealthGrowth: "సంపద వృద్ధి", dashaDeepDive: "దశా విశ్లేషణ", unlocked: "అన్‌లాక్", locked: "లాక్", buyReport: "నివేదిక కొనండి", preview: "ప్రివ్యూ", oneTimePacks: "ఒకసారి ప్యాక్‌లు" },
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
  pricing: { title: "మీ ప్లాన్ ఎంచుకోండి", subtitle: "మీకు సరిపోయే ప్లాన్‌తో లోతైన మార్గదర్శకత్వం పొందండి", monthly: "నెలవారీ", oneTime: "ఒకసారి", free: "ఉచితం", graha: "గ్రహ", rishi: "ఋషి", perMonth: "/నెల", currentPlan: "ప్రస్తుత ప్లాన్", upgrade: "అప్‌గ్రేడ్", popular: "ప్రజాదరణ" },
  paywall: { limitReached: "ఈరోజు ఉచిత ప్రశ్నలు అయిపోయాయి", upgradeNow: "ఇప్పుడు అప్‌గ్రేడ్ చేయండి", dismiss: "తర్వాత" },
  referral: { title: "రిఫర్ చేసి సంపాదించండి", subtitle: "స్నేహితులతో GrahAI షేర్ చేసి రివార్డ్‌లు పొందండి", yourCode: "మీ రిఫరల్ కోడ్", copyCode: "కోడ్ కాపీ చేయండి", shareWithFriends: "స్నేహితులతో షేర్ చేయండి", rewardsTitle: "మీ రివార్డ్‌లు", friendsReferred: "రిఫర్ చేసిన స్నేహితులు" },
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
    getFirstInsight: "ನನ್ನ ಮೊದಲ ಒಳನೋಟ ಪಡೆಯಿರಿ", intentTitle: "ನಿಮಗೆ ಯಾವುದರ ಬಗ್ಗೆ ಸ್ಪಷ್ಟತೆ ಬೇಕು?",
    intentSubtitle: "ಇದು ನಿಮ್ಮ ಅನುಭವವನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ",
    intentCareer: "ವೃತ್ತಿ & ಕೆಲಸ", intentLove: "ಪ್ರೀತಿ & ಸಂಬಂಧ", intentMarriage: "ಮದುವೆ & ಸಮಯ",
    intentMoney: "ಹಣ & ಬೆಳವಣಿಗೆ", intentEmotional: "ಭಾವನಾತ್ಮಕ ಶಕ್ತಿ", intentDaily: "ದೈನಂದಿನ ಮಾರ್ಗದರ್ಶನ", intentExploring: "ನೋಡುತ್ತಿದ್ದೇನೆ",
    trustTitle: "ಸಾಮಾನ್ಯವಲ್ಲ. ಯಾದೃಚ್ಛಿಕವಲ್ಲ.", trustSubtitle: "ನಿಮ್ಮ ಜಾತಕದ ಆಧಾರದ ಮೇಲೆ.",
    trustCard1Title: "ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳಿಂದ", trustCard1Desc: "ಪ್ರತಿ ಒಳನೋಟವೂ ನಿಮ್ಮ ಜಾತಕದ ಆಧಾರದ ಮೇಲೆ.",
    trustCard2Title: "ಶಾಸ್ತ್ರ ಆಧಾರಿತ", trustCard2Desc: "ಶಾಸ್ತ್ರೀಯ ಜ್ಯೋತಿಷ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಮಾರ್ಗದರ್ಶನ.",
    trustCard3Title: "ನಿಜ ಜೀವನದ ನಿರ್ಧಾರಗಳಿಗೆ ಉಪಯುಕ್ತ", trustCard3Desc: "ವೃತ್ತಿ, ಪ್ರೀತಿ, ಸಮಯ, ಹಣ — ಕಾರ್ಯಸಾಧ್ಯ ಮಾರ್ಗದರ್ಶನ.",
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
  nav: { home: "ಹೋಮ್", ask: "ಕೇಳಿ", chart: "ಜಾತಕ", reports: "ವರದಿಗಳು", profile: "ಪ್ರೊಫೈಲ್" },
  home: { greeting: "ಶುಭ {timeOfDay}, {name}", todayGuidance: "ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ", tomorrowGuidance: "ನಾಳೆಯ ಮಾರ್ಗದರ್ಶನ", loveCard: "ಪ್ರೀತಿ", careerCard: "ವೃತ್ತಿ", energyCard: "ಶಕ್ತಿ", panchangTitle: "ಪಂಚಾಂಗ", luckyColors: "ಅದೃಷ್ಟ ಬಣ್ಣಗಳು", luckyNumbers: "ಅದೃಷ್ಟ ಸಂಖ್ಯೆಗಳು", askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ", viewReports: "ವರದಿಗಳು ನೋಡಿ", sourcesTitle: "ಮೂಲಗಳು" },
  ask: { title: "GrahAI ಅನ್ನು ಕೇಳಿ", placeholder: "ಪ್ರೀತಿ, ವೃತ್ತಿ, ಸಮಯ ಬಗ್ಗೆ ಕೇಳಿ...", topicLove: "ಪ್ರೀತಿ", topicCareer: "ವೃತ್ತಿ", topicTiming: "ಸಮಯ", topicFamily: "ಕುಟುಂಬ", topicHealth: "ಆರೋಗ್ಯ", topicMoney: "ಹಣ", directAnswer: "ನೇರ ಉತ್ತರ", whyShowingUp: "ಇದು ಏಕೆ ಕಾಣಿಸುತ್ತಿದೆ", whatToDo: "ಏನು ಮಾಡಬೇಕು", whatToAvoid: "ಏನು ತಪ್ಪಿಸಬೇಕು", timeWindow: "ಸಮಯ ಅವಧಿ", remedy: "ಪರಿಹಾರ", source: "ಮೂಲ", followUp: "ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು", questionsLeft: "ಇಂದು {count} ಪ್ರಶ್ನೆಗಳು ಉಳಿದಿವೆ", upgradeForMore: "ಹೆಚ್ಚಿನದಕ್ಕಾಗಿ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ" },
  chart: { title: "ನನ್ನ ಜಾತಕ", birthChart: "ಜನ್ಮ ಜಾತಕ", sunSign: "ಸೂರ್ಯ ರಾಶಿ", moonSign: "ಚಂದ್ರ ರಾಶಿ", risingSign: "ಲಗ್ನ ರಾಶಿ", nakshatra: "ನಕ್ಷತ್ರ", element: "ತತ್ವ", strengths: "ಶಕ್ತಿಗಳು", sensitivities: "ಸಂವೇದನೆಗಳು", showAdvanced: "ಹೆಚ್ಚು ತೋರಿಸಿ", hideAdvanced: "ಕಡಿಮೆ ತೋರಿಸಿ" },
  reports: { title: "ವರದಿಗಳು", loveCompat: "ಪ್ರೀತಿ & ಹೊಂದಾಣಿಕೆ", careerBlueprint: "ವೃತ್ತಿ ಬ್ಲೂಪ್ರಿಂಟ್", marriageTiming: "ಮದುವೆ ಸಮಯ", annualForecast: "ವಾರ್ಷಿಕ ಮುನ್ಸೂಚನೆ", wealthGrowth: "ಸಂಪತ್ತು ಬೆಳವಣಿಗೆ", dashaDeepDive: "ದಶಾ ವಿಶ್ಲೇಷಣೆ", unlocked: "ಅನ್‌ಲಾಕ್", locked: "ಲಾಕ್", buyReport: "ವರದಿ ಖರೀದಿಸಿ", preview: "ಪೂರ್ವವೀಕ್ಷಣೆ", oneTimePacks: "ಒಂದು ಬಾರಿ ಪ್ಯಾಕ್‌ಗಳು" },
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
  pricing: { title: "ನಿಮ್ಮ ಪ್ಲಾನ್ ಆಯ್ಕೆಮಾಡಿ", subtitle: "ನಿಮಗೆ ಸೂಕ್ತವಾದ ಪ್ಲಾನ್‌ನಲ್ಲಿ ಆಳವಾದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ", monthly: "ಮಾಸಿಕ", oneTime: "ಒಂದು ಬಾರಿ", free: "ಉಚಿತ", graha: "ಗ್ರಹ", rishi: "ಋಷಿ", perMonth: "/ತಿಂಗಳು", currentPlan: "ಪ್ರಸ್ತುತ ಪ್ಲಾನ್", upgrade: "ಅಪ್‌ಗ್ರೇಡ್", popular: "ಜನಪ್ರಿಯ" },
  paywall: { limitReached: "ಇಂದಿನ ಉಚಿತ ಪ್ರಶ್ನೆಗಳು ಮುಗಿದಿವೆ", upgradeNow: "ಈಗ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ", dismiss: "ನಂತರ" },
  referral: { title: "ರೆಫರ್ ಮಾಡಿ & ಗಳಿಸಿ", subtitle: "ಸ್ನೇಹಿತರೊಂದಿಗೆ GrahAI ಹಂಚಿ ರಿವಾರ್ಡ್‌ಗಳನ್ನು ಗಳಿಸಿ", yourCode: "ನಿಮ್ಮ ರೆಫರಲ್ ಕೋಡ್", copyCode: "ಕೋಡ್ ನಕಲಿಸಿ", shareWithFriends: "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿ", rewardsTitle: "ನಿಮ್ಮ ರಿವಾರ್ಡ್‌ಗಳು", friendsReferred: "ರೆಫರ್ ಮಾಡಿದ ಸ್ನೇಹಿತರು" },
  common: { loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", error: "ಏನೋ ತಪ್ಪಾಯಿತು", retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", close: "ಮುಚ್ಚಿ", back: "ಹಿಂದೆ", next: "ಮುಂದೆ", save: "ಉಳಿಸಿ", done: "ಮುಗಿಯಿತು", today: "ಇಂದು", tomorrow: "ನಾಳೆ" },
}

// ═══════════════════════════════════════════════════
// For brevity, remaining languages use English as base
// with key UI strings translated. Full translation
// can be added incrementally.
// ═══════════════════════════════════════════════════

// Malayalam
const ml: Translations = {
  ...en,
  langPicker: { title: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", subtitle: "പ്രൊഫൈൽ സെറ്റിംഗ്‌സിൽ പിന്നീട് മാറ്റാം." },
  onboarding: { ...en.onboarding, welcomeSubtitle: "പ്രണയം, ജോലി, സമയം, ജീവിതം — വ്യക്തമായ ഉത്തരങ്ങൾ.", welcomeDesc: "GrahAI നിങ്ങളുടെ ജാതകം വായിച്ച് ശാന്തവും പ്രായോഗികവുമായ മാർഗ്ഗനിർദ്ദേശം നൽകുന്നു.", getFirstInsight: "എൻ്റെ ആദ്യ ഉൾക്കാഴ്ച നേടുക", intentTitle: "എന്തിനെക്കുറിച്ചാണ് വ്യക്തത വേണ്ടത്?", intentSubtitle: "ഇത് നിങ്ങളുടെ അനുഭവം മെച്ചപ്പെടുത്താൻ സഹായിക്കും", generateChart: "എൻ്റെ ജാതകം തയ്യാറാക്കുക", continueBtn: "തുടരുക" },
  nav: { home: "ഹോം", ask: "ചോദിക്കൂ", chart: "ജാതകം", reports: "റിപ്പോർട്ടുകൾ", profile: "പ്രൊഫൈൽ" },
  profile: { ...en.profile, title: "പ്രൊഫൈൽ", editBirthDetails: "ജനന വിവരങ്ങൾ മാറ്റുക", changeLanguage: "ഭാഷ മാറ്റുക", signOut: "സൈൻ ഔട്ട്", signOutConfirm: "സൈൻ ഔട്ട് ചെയ്യണോ?", cancel: "റദ്ദാക്കുക", helpSupport: "സഹായവും പിന്തുണയും", activity: "പ്രവർത്തനം" },
  common: { loading: "ലോഡ് ചെയ്യുന്നു...", error: "എന്തോ തെറ്റ് സംഭവിച്ചു", retry: "വീണ്ടും ശ്രമിക്കുക", close: "അടയ്ക്കുക", back: "പിന്നിലേക്ക്", next: "അടുത്തത്", save: "സേവ് ചെയ്യുക", done: "കഴിഞ്ഞു", today: "ഇന്ന്", tomorrow: "നാളെ" },
}

// Bengali
const bn: Translations = {
  ...en,
  langPicker: { title: "আপনার ভাষা বেছে নিন", subtitle: "পরে প্রোফাইল সেটিংস থেকে বদলাতে পারবেন।" },
  onboarding: { ...en.onboarding, welcomeSubtitle: "ভালোবাসা, ক্যারিয়ার, সময় এবং জীবন — পরিষ্কার উত্তর।", welcomeDesc: "GrahAI আপনার কুণ্ডলী পড়ে শান্ত, ব্যবহারিক পরামর্শ দেয় যা সত্যিই কাজে আসে।", getFirstInsight: "আমার প্রথম পরামর্শ পান", intentTitle: "কোন বিষয়ে স্পষ্টতা চান?", intentSubtitle: "এটি আপনার অভিজ্ঞতা ব্যক্তিগত করতে সাহায্য করে", generateChart: "আমার কুণ্ডলী তৈরি করুন", continueBtn: "এগিয়ে যান" },
  nav: { home: "হোম", ask: "জিজ্ঞাসা", chart: "কুণ্ডলী", reports: "রিপোর্ট", profile: "প্রোফাইল" },
  profile: { ...en.profile, title: "প্রোফাইল", editBirthDetails: "জন্ম তথ্য পরিবর্তন করুন", changeLanguage: "ভাষা পরিবর্তন করুন", signOut: "সাইন আউট", signOutConfirm: "সাইন আউট করবেন?", cancel: "বাতিল", helpSupport: "সাহায্য ও সহায়তা", activity: "কার্যকলাপ" },
  common: { loading: "লোড হচ্ছে...", error: "কিছু ভুল হয়েছে", retry: "আবার চেষ্টা করুন", close: "বন্ধ করুন", back: "পিছনে", next: "পরবর্তী", save: "সেভ", done: "হয়ে গেছে", today: "আজ", tomorrow: "আগামীকাল" },
}

// Marathi
const mr: Translations = {
  ...en,
  langPicker: { title: "तुमची भाषा निवडा", subtitle: "तुम्ही नंतर प्रोफाइल सेटिंग्जमधून बदलू शकता." },
  onboarding: { ...en.onboarding, welcomeSubtitle: "प्रेम, करिअर, वेळ आणि आयुष्य — स्पष्ट उत्तरं.", welcomeDesc: "GrahAI तुमची कुंडली वाचून शांत, व्यावहारिक मार्गदर्शन देतो.", getFirstInsight: "माझी पहिली माहिती मिळवा", intentTitle: "तुम्हाला कशाबद्दल स्पष्टता हवी आहे?", intentSubtitle: "हे तुमचा अनुभव वैयक्तिक करण्यात मदत करते", generateChart: "माझी कुंडली तयार करा", continueBtn: "पुढे जा" },
  nav: { home: "होम", ask: "विचारा", chart: "कुंडली", reports: "अहवाल", profile: "प्रोफाइल" },
  profile: { ...en.profile, title: "प्रोफाइल", editBirthDetails: "जन्म माहिती बदला", changeLanguage: "भाषा बदला", signOut: "साइन आउट", signOutConfirm: "साइन आउट करायचं?", cancel: "रद्द करा", helpSupport: "मदत आणि सहाय्य", activity: "कार्यकलाप" },
  common: { loading: "लोड होत आहे...", error: "काहीतरी चुकलं", retry: "पुन्हा प्रयत्न करा", close: "बंद करा", back: "मागे", next: "पुढे", save: "सेव्ह करा", done: "झालं", today: "आज", tomorrow: "उद्या" },
}

// Gujarati
const gu: Translations = {
  ...en,
  langPicker: { title: "તમારી ભાષા પસંદ કરો", subtitle: "તમે પછીથી પ્રોફાઈલ સેટિંગ્સમાંથી બદલી શકો છો." },
  onboarding: { ...en.onboarding, welcomeSubtitle: "પ્રેમ, કારકિર્દી, સમય અને જીવન — સ્પષ્ટ જવાબો.", welcomeDesc: "GrahAI તમારી કુંડળી વાંચીને શાંત, વ્યવહારુ માર્ગદર્શન આપે છે.", getFirstInsight: "મારી પહેલી જાણકારી મેળવો", intentTitle: "તમને શેના વિશે સ્પષ્ટતા જોઈએ છે?", intentSubtitle: "આ તમારો અનુભવ કસ્ટમાઈઝ કરવામાં મદદ કરે છે", generateChart: "મારી કુંડળી બનાવો", continueBtn: "આગળ વધો" },
  nav: { home: "હોમ", ask: "પૂછો", chart: "કુંડળી", reports: "રિપોર્ટ", profile: "પ્રોફાઈલ" },
  profile: { ...en.profile, title: "પ્રોફાઈલ", editBirthDetails: "જન્મ વિગતો બદલો", changeLanguage: "ભાષા બદલો", signOut: "સાઈન આઉટ", signOutConfirm: "સાઈન આઉટ કરશો?", cancel: "રદ કરો", helpSupport: "મદદ અને સહાય", activity: "પ્રવૃત્તિ" },
  common: { loading: "લોડ થઈ રહ્યું છે...", error: "કંઈક ખોટું થયું", retry: "ફરી પ્રયાસ કરો", close: "બંધ કરો", back: "પાછળ", next: "આગળ", save: "સેવ કરો", done: "થઈ ગયું", today: "આજે", tomorrow: "આવતીકાલે" },
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
