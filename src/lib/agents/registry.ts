/* ════════════════════════════════════════════════════════
   GRAHAI AGENT REGISTRY — Full 28-Agent Hierarchy

   CEO Orchestrator sits at the top. Below are 8 departments:

   ┌─ PRODUCT (existing) ────────────────────────────┐
   │  Jyotish Guru (Astrology) — 6 sub-agents        │
   │  Anka Vidya (Numerology)  — 4 sub-agents         │
   │  Tarot Reader             — 4 sub-agents         │
   │  Vastu Acharya            — 4 sub-agents         │
   └──────────────────────────────────────────────────┘
   ┌─ BUSINESS OPS (new) ────────────────────────────┐
   │  Customer Service          — 3 sub-agents        │
   │  Marketing & Growth        — 4 sub-agents        │
   │  Analytics & Intelligence  — 3 sub-agents        │
   │  Content & Education       — 3 sub-agents        │
   └──────────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════ */

export interface AgentDefinition {
  agent_name: string
  display_name: string
  role: "ceo" | "department_head" | "sub_agent"
  department: string
  vertical: string
  parent_agent: string | null
  status: "active" | "beta" | "planned"
  capabilities: string[]
  description: string
  emoji: string
  systemPromptKey: string
}

/* ────────────────────────────────────────────────────
   CEO — The Orchestrator
   ──────────────────────────────────────────────────── */

const CEO: AgentDefinition = {
  agent_name: "ceo-orchestrator",
  display_name: "GrahAI CEO",
  role: "ceo",
  department: "executive",
  vertical: "general",
  parent_agent: null,
  status: "active",
  capabilities: ["routing", "delegation", "strategy", "escalation", "user-onboarding"],
  description: "Routes queries to the right department, handles onboarding, escalates complex issues, and orchestrates multi-department tasks.",
  emoji: "👑",
  systemPromptKey: "ceo-orchestrator",
}

/* ────────────────────────────────────────────────────
   PRODUCT DEPARTMENT HEADS (existing)
   ──────────────────────────────────────────────────── */

const PRODUCT_HEADS: AgentDefinition[] = [
  {
    agent_name: "jyotish-guru",
    display_name: "Jyotish Guru",
    role: "department_head",
    department: "product-astrology",
    vertical: "astrology",
    parent_agent: "ceo-orchestrator",
    status: "active",
    capabilities: ["kundli-generation", "dasha-analysis", "transit-tracking", "yoga-detection", "remedy-prescription"],
    description: "Head of Vedic Astrology. Generates precise birth charts using Swiss Ephemeris, interprets planetary positions, and provides Dasha-based life predictions.",
    emoji: "🪐",
    systemPromptKey: "reading-generator",
  },
  {
    agent_name: "anka-vidya",
    display_name: "Anka Vidya",
    role: "department_head",
    department: "product-numerology",
    vertical: "numerology",
    parent_agent: "ceo-orchestrator",
    status: "active",
    capabilities: ["life-path", "name-analysis", "cycle-tracking", "compatibility-numerology"],
    description: "Head of Numerology. Calculates life path, destiny, and soul urge numbers. Tracks personal year/month cycles.",
    emoji: "🔢",
    systemPromptKey: "anka-vidya",
  },
  {
    agent_name: "tarot-reader",
    display_name: "Tarot Reader",
    role: "department_head",
    department: "product-tarot",
    vertical: "tarot",
    parent_agent: "ceo-orchestrator",
    status: "active",
    capabilities: ["card-drawing", "spread-design", "intuitive-reading", "journal-management"],
    description: "Head of Tarot. Draws cards, interprets spreads, and provides intuitive guidance using classical Rider-Waite symbolism.",
    emoji: "🃏",
    systemPromptKey: "tarot-reader",
  },
  {
    agent_name: "vastu-acharya",
    display_name: "Vastu Acharya",
    role: "department_head",
    department: "product-vastu",
    vertical: "vastu",
    parent_agent: "ceo-orchestrator",
    status: "active",
    capabilities: ["direction-analysis", "element-balancing", "space-planning", "vastu-remedies"],
    description: "Head of Vastu Shastra. Analyzes spatial harmony, directional compliance, and prescribes non-structural corrections.",
    emoji: "🏠",
    systemPromptKey: "vastu-acharya",
  },
]

/* ────────────────────────────────────────────────────
   PRODUCT SUB-AGENTS (existing — from delegation.ts)
   ──────────────────────────────────────────────────── */

const PRODUCT_SUB_AGENTS: AgentDefinition[] = [
  // Astrology sub-agents
  { agent_name: "chart-calculator", display_name: "Chart Calculator", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["kundli-generation", "planet-positions", "house-calculation"], description: "Generates precise birth charts with Swiss Ephemeris", emoji: "📊", systemPromptKey: "chart-calculator" },
  { agent_name: "dasha-analyst", display_name: "Dasha Analyst", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["dasha-calculation", "period-analysis", "timing-prediction"], description: "Analyzes Vimshottari Dasha periods and timing", emoji: "⏳", systemPromptKey: "dasha-analyst" },
  { agent_name: "yoga-expert", display_name: "Yoga Expert", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["yoga-detection", "strength-analysis", "combination-interpretation"], description: "Detects and interprets 50+ planetary yogas", emoji: "✨", systemPromptKey: "yoga-expert" },
  { agent_name: "transit-tracker", display_name: "Transit Tracker", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["transit-analysis", "sade-sati", "gochar-prediction"], description: "Analyzes current planetary transits and Sade Sati", emoji: "🔭", systemPromptKey: "transit-tracker" },
  { agent_name: "astro-remedy-advisor", display_name: "Remedy Advisor", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["gemstone-recommendation", "mantra-prescription", "fasting-advice"], description: "Prescribes personalized Vedic remedies for doshas", emoji: "💎", systemPromptKey: "remedy-advisor" },
  { agent_name: "qa-reviewer", display_name: "QA Reviewer", role: "sub_agent", department: "product-astrology", vertical: "astrology", parent_agent: "jyotish-guru", status: "active", capabilities: ["quality-check", "validation", "second-opinion"], description: "Quality-checks astrological interpretations", emoji: "✅", systemPromptKey: "qa-reviewer" },

  // Numerology sub-agents
  { agent_name: "life-path-calculator", display_name: "Life Path Calculator", role: "sub_agent", department: "product-numerology", vertical: "numerology", parent_agent: "anka-vidya", status: "active", capabilities: ["life-path", "birth-number", "master-number"], description: "Calculates core numerology numbers from birth date", emoji: "🔢", systemPromptKey: "life-path-calculator" },
  { agent_name: "name-analyst", display_name: "Name Analyst", role: "sub_agent", department: "product-numerology", vertical: "numerology", parent_agent: "anka-vidya", status: "active", capabilities: ["name-vibration", "destiny-number", "soul-urge"], description: "Analyzes name vibrations and letter values", emoji: "📝", systemPromptKey: "name-analyst" },
  { agent_name: "cycle-tracker", display_name: "Cycle Tracker", role: "sub_agent", department: "product-numerology", vertical: "numerology", parent_agent: "anka-vidya", status: "active", capabilities: ["personal-year", "personal-month", "pinnacle-challenge"], description: "Tracks personal year/month/day cycles", emoji: "🔄", systemPromptKey: "cycle-tracker" },
  { agent_name: "prediction-engine", display_name: "Prediction Engine", role: "sub_agent", department: "product-numerology", vertical: "numerology", parent_agent: "anka-vidya", status: "active", capabilities: ["prediction", "compatibility", "lucky-numbers"], description: "Generates predictions based on number patterns", emoji: "🎯", systemPromptKey: "prediction-engine" },

  // Tarot sub-agents
  { agent_name: "card-interpreter", display_name: "Card Interpreter", role: "sub_agent", department: "product-tarot", vertical: "tarot", parent_agent: "tarot-reader", status: "active", capabilities: ["card-meaning", "symbolism", "reversal-interpretation"], description: "Provides deep card-by-card interpretations", emoji: "🎴", systemPromptKey: "card-interpreter" },
  { agent_name: "spread-analyst", display_name: "Spread Analyst", role: "sub_agent", department: "product-tarot", vertical: "tarot", parent_agent: "tarot-reader", status: "active", capabilities: ["spread-design", "position-reading", "celtic-cross"], description: "Designs and interprets card spreads", emoji: "🗂️", systemPromptKey: "spread-analyst" },
  { agent_name: "energy-reader", display_name: "Energy Reader", role: "sub_agent", department: "product-tarot", vertical: "tarot", parent_agent: "tarot-reader", status: "active", capabilities: ["intuitive-reading", "energy-channel", "guidance"], description: "Channels intuitive energy readings from cards", emoji: "🌊", systemPromptKey: "energy-reader" },
  { agent_name: "journal-keeper", display_name: "Journal Keeper", role: "sub_agent", department: "product-tarot", vertical: "tarot", parent_agent: "tarot-reader", status: "active", capabilities: ["reading-history", "pattern-tracking", "journal"], description: "Manages tarot reading history and patterns", emoji: "📖", systemPromptKey: "journal-keeper" },

  // Vastu sub-agents
  { agent_name: "direction-analyst", display_name: "Direction Analyst", role: "sub_agent", department: "product-vastu", vertical: "vastu", parent_agent: "vastu-acharya", status: "active", capabilities: ["direction-analysis", "entrance-evaluation", "compass-reading"], description: "Analyzes directional compliance and energy flow", emoji: "🧭", systemPromptKey: "direction-analyst" },
  { agent_name: "element-balancer", display_name: "Element Balancer", role: "sub_agent", department: "product-vastu", vertical: "vastu", parent_agent: "vastu-acharya", status: "active", capabilities: ["element-balance", "pancha-bhuta", "energy-flow"], description: "Evaluates and balances the five elements", emoji: "🌍", systemPromptKey: "element-balancer" },
  { agent_name: "vastu-remedy-advisor", display_name: "Vastu Remedy Advisor", role: "sub_agent", department: "product-vastu", vertical: "vastu", parent_agent: "vastu-acharya", status: "active", capabilities: ["vastu-correction", "mirror-placement", "color-therapy"], description: "Prescribes non-structural Vastu corrections", emoji: "🪞", systemPromptKey: "vastu-remedy-advisor" },
  { agent_name: "space-planner", display_name: "Space Planner", role: "sub_agent", department: "product-vastu", vertical: "vastu", parent_agent: "vastu-acharya", status: "active", capabilities: ["room-planning", "furniture-arrangement", "layout-optimization"], description: "Plans room placement and furniture arrangement", emoji: "📐", systemPromptKey: "space-planner" },
]

/* ════════════════════════════════════════════════════════
   NEW BUSINESS OPERATIONS DEPARTMENTS
   ════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────
   CUSTOMER SERVICE DEPARTMENT
   ──────────────────────────────────────────────────── */

const CS_HEAD: AgentDefinition = {
  agent_name: "cs-head",
  display_name: "Seva Manager",
  role: "department_head",
  department: "customer-service",
  vertical: "support",
  parent_agent: "ceo-orchestrator",
  status: "active",
  capabilities: ["ticket-routing", "escalation", "satisfaction-tracking", "user-support"],
  description: "Head of Customer Service (Seva). Routes support tickets, handles escalations, tracks CSAT/NPS, and ensures every user feels heard.",
  emoji: "🙏",
  systemPromptKey: "cs-head",
}

const CS_SUB_AGENTS: AgentDefinition[] = [
  {
    agent_name: "onboarding-guide",
    display_name: "Onboarding Guide",
    role: "sub_agent",
    department: "customer-service",
    vertical: "support",
    parent_agent: "cs-head",
    status: "active",
    capabilities: ["new-user-walkthrough", "feature-explanation", "birth-data-collection", "first-reading-setup"],
    description: "Guides new users through onboarding — collecting birth data, explaining features, and setting up their first reading. Makes the first 5 minutes magical.",
    emoji: "🌟",
    systemPromptKey: "onboarding-guide",
  },
  {
    agent_name: "issue-resolver",
    display_name: "Issue Resolver",
    role: "sub_agent",
    department: "customer-service",
    vertical: "support",
    parent_agent: "cs-head",
    status: "active",
    capabilities: ["bug-diagnosis", "reading-rerun", "refund-processing", "account-recovery"],
    description: "Resolves user issues — incorrect readings, account problems, payment failures. Diagnoses root cause and applies fixes or escalates to engineering.",
    emoji: "🔧",
    systemPromptKey: "issue-resolver",
  },
  {
    agent_name: "feedback-collector",
    display_name: "Feedback Collector",
    role: "sub_agent",
    department: "customer-service",
    vertical: "support",
    parent_agent: "cs-head",
    status: "active",
    capabilities: ["nps-survey", "feature-request-logging", "sentiment-analysis", "review-solicitation"],
    description: "Collects user feedback through surveys, analyzes sentiment, logs feature requests, and prompts satisfied users to leave reviews.",
    emoji: "📋",
    systemPromptKey: "feedback-collector",
  },
]

/* ────────────────────────────────────────────────────
   MARKETING & GROWTH DEPARTMENT
   ──────────────────────────────────────────────────── */

const MARKETING_HEAD: AgentDefinition = {
  agent_name: "marketing-head",
  display_name: "Growth Guru",
  role: "department_head",
  department: "marketing",
  vertical: "growth",
  parent_agent: "ceo-orchestrator",
  status: "active",
  capabilities: ["campaign-strategy", "user-acquisition", "retention-programs", "viral-loops"],
  description: "Head of Marketing & Growth. Designs acquisition funnels, retention campaigns, viral sharing mechanics, and brand positioning.",
  emoji: "📈",
  systemPromptKey: "marketing-head",
}

const MARKETING_SUB_AGENTS: AgentDefinition[] = [
  {
    agent_name: "seo-content-writer",
    display_name: "SEO Content Writer",
    role: "sub_agent",
    department: "marketing",
    vertical: "growth",
    parent_agent: "marketing-head",
    status: "active",
    capabilities: ["blog-writing", "keyword-optimization", "meta-tags", "schema-markup", "astrology-seo"],
    description: "Writes SEO-optimized blog posts, landing page copy, and meta descriptions targeting astrology/spirituality keywords. Drives organic traffic.",
    emoji: "✍️",
    systemPromptKey: "seo-content-writer",
  },
  {
    agent_name: "social-media-manager",
    display_name: "Social Media Manager",
    role: "sub_agent",
    department: "marketing",
    vertical: "growth",
    parent_agent: "marketing-head",
    status: "active",
    capabilities: ["post-scheduling", "daily-horoscope-posts", "engagement-tracking", "influencer-outreach"],
    description: "Creates and schedules daily horoscope posts, astrological event announcements, and user success stories across Instagram, Twitter/X, and YouTube.",
    emoji: "📱",
    systemPromptKey: "social-media-manager",
  },
  {
    agent_name: "email-campaign-manager",
    display_name: "Email Campaign Manager",
    role: "sub_agent",
    department: "marketing",
    vertical: "growth",
    parent_agent: "marketing-head",
    status: "active",
    capabilities: ["drip-campaigns", "newsletter-creation", "transit-alerts", "win-back-emails", "segmentation"],
    description: "Manages email marketing — onboarding drips, weekly transit newsletters, birthday emails, re-engagement campaigns, and upgrade nudges.",
    emoji: "📧",
    systemPromptKey: "email-campaign-manager",
  },
  {
    agent_name: "referral-engine",
    display_name: "Referral Engine",
    role: "sub_agent",
    department: "marketing",
    vertical: "growth",
    parent_agent: "marketing-head",
    status: "active",
    capabilities: ["referral-program", "viral-sharing", "reward-management", "compatibility-sharing"],
    description: "Powers the referral and viral sharing system. Generates shareable reading cards, manages referral rewards, and tracks viral coefficient.",
    emoji: "🔗",
    systemPromptKey: "referral-engine",
  },
]

/* ────────────────────────────────────────────────────
   ANALYTICS & INTELLIGENCE DEPARTMENT
   ──────────────────────────────────────────────────── */

const ANALYTICS_HEAD: AgentDefinition = {
  agent_name: "analytics-head",
  display_name: "Data Drishti",
  role: "department_head",
  department: "analytics",
  vertical: "intelligence",
  parent_agent: "ceo-orchestrator",
  status: "active",
  capabilities: ["metrics-tracking", "cohort-analysis", "revenue-forecasting", "ab-testing"],
  description: "Head of Analytics & Intelligence (Drishti = Vision). Tracks KPIs, runs cohort analysis, forecasts revenue, and identifies growth opportunities from data.",
  emoji: "📊",
  systemPromptKey: "analytics-head",
}

const ANALYTICS_SUB_AGENTS: AgentDefinition[] = [
  {
    agent_name: "metrics-tracker",
    display_name: "Metrics Tracker",
    role: "sub_agent",
    department: "analytics",
    vertical: "intelligence",
    parent_agent: "analytics-head",
    status: "active",
    capabilities: ["dau-mau", "conversion-funnel", "retention-curves", "revenue-metrics", "agent-performance"],
    description: "Tracks core business metrics — DAU/MAU, signup-to-paid conversion, retention by cohort, ARPU, and per-agent performance scores.",
    emoji: "📉",
    systemPromptKey: "metrics-tracker",
  },
  {
    agent_name: "user-insight-miner",
    display_name: "User Insight Miner",
    role: "sub_agent",
    department: "analytics",
    vertical: "intelligence",
    parent_agent: "analytics-head",
    status: "active",
    capabilities: ["behavior-analysis", "churn-prediction", "segment-discovery", "feature-usage-heatmap"],
    description: "Mines user behavior data to predict churn, discover user segments, identify power features, and surface unexpected usage patterns.",
    emoji: "⛏️",
    systemPromptKey: "user-insight-miner",
  },
  {
    agent_name: "ab-test-runner",
    display_name: "A/B Test Runner",
    role: "sub_agent",
    department: "analytics",
    vertical: "intelligence",
    parent_agent: "analytics-head",
    status: "active",
    capabilities: ["experiment-design", "statistical-significance", "variant-analysis", "prompt-testing"],
    description: "Designs and runs A/B tests on prompts, pricing, UI flows, and reading formats. Ensures statistical significance before shipping winners.",
    emoji: "🧪",
    systemPromptKey: "ab-test-runner",
  },
]

/* ────────────────────────────────────────────────────
   CONTENT & EDUCATION DEPARTMENT
   ──────────────────────────────────────────────────── */

const CONTENT_HEAD: AgentDefinition = {
  agent_name: "content-head",
  display_name: "Vidya Guru",
  role: "department_head",
  department: "content",
  vertical: "education",
  parent_agent: "ceo-orchestrator",
  status: "active",
  capabilities: ["content-strategy", "course-design", "blog-editorial", "glossary-management"],
  description: "Head of Content & Education (Vidya = Knowledge). Creates educational content that builds trust, teaches Vedic sciences, and positions GrahAI as the authority.",
  emoji: "📚",
  systemPromptKey: "content-head",
}

const CONTENT_SUB_AGENTS: AgentDefinition[] = [
  {
    agent_name: "daily-content-generator",
    display_name: "Daily Content Generator",
    role: "sub_agent",
    department: "content",
    vertical: "education",
    parent_agent: "content-head",
    status: "active",
    capabilities: ["daily-horoscope-writing", "panchang-summary", "transit-bulletin", "festival-calendar"],
    description: "Generates daily horoscopes for all 12 signs, Panchang summaries, transit bulletins, and festival/muhurta calendars. Publishes at 5 AM IST daily.",
    emoji: "🌅",
    systemPromptKey: "daily-content-generator",
  },
  {
    agent_name: "course-creator",
    display_name: "Course Creator",
    role: "sub_agent",
    department: "content",
    vertical: "education",
    parent_agent: "content-head",
    status: "active",
    capabilities: ["lesson-design", "quiz-creation", "certification", "vedic-curriculum"],
    description: "Designs structured learning paths — 'Learn Your Birth Chart in 7 Days', Numerology Basics, Tarot for Beginners. Includes quizzes and certificates.",
    emoji: "🎓",
    systemPromptKey: "course-creator",
  },
  {
    agent_name: "glossary-keeper",
    display_name: "Glossary Keeper",
    role: "sub_agent",
    department: "content",
    vertical: "education",
    parent_agent: "content-head",
    status: "active",
    capabilities: ["term-definition", "sanskrit-translation", "tooltip-content", "wiki-management"],
    description: "Maintains the Sanskrit-English glossary, provides hover tooltips throughout the app, and ensures consistent terminology across all content.",
    emoji: "📖",
    systemPromptKey: "glossary-keeper",
  },
]

/* ════════════════════════════════════════════════════════
   FULL REGISTRY — Assembled Hierarchy
   ════════════════════════════════════════════════════════ */

export const AGENT_REGISTRY: AgentDefinition[] = [
  CEO,
  ...PRODUCT_HEADS,
  ...PRODUCT_SUB_AGENTS,
  CS_HEAD,
  ...CS_SUB_AGENTS,
  MARKETING_HEAD,
  ...MARKETING_SUB_AGENTS,
  ANALYTICS_HEAD,
  ...ANALYTICS_SUB_AGENTS,
  CONTENT_HEAD,
  ...CONTENT_SUB_AGENTS,
]

/* ────────────────────────────────────────────────────
   HELPER FUNCTIONS
   ──────────────────────────────────────────────────── */

/** Get all agents in a department */
export function getAgentsByDepartment(department: string): AgentDefinition[] {
  return AGENT_REGISTRY.filter(a => a.department === department)
}

/** Get all department heads */
export function getDepartmentHeads(): AgentDefinition[] {
  return AGENT_REGISTRY.filter(a => a.role === "department_head")
}

/** Get sub-agents for a specific head */
export function getSubAgentsFor(parentAgentName: string): AgentDefinition[] {
  return AGENT_REGISTRY.filter(a => a.parent_agent === parentAgentName)
}

/** Get agent by name */
export function getAgent(agentName: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find(a => a.agent_name === agentName)
}

/** Get unique department list */
export function getDepartments(): string[] {
  return [...new Set(AGENT_REGISTRY.map(a => a.department))]
}

/** Summary stats */
export function getRegistryStats() {
  return {
    total: AGENT_REGISTRY.length,
    ceo: AGENT_REGISTRY.filter(a => a.role === "ceo").length,
    departmentHeads: AGENT_REGISTRY.filter(a => a.role === "department_head").length,
    subAgents: AGENT_REGISTRY.filter(a => a.role === "sub_agent").length,
    active: AGENT_REGISTRY.filter(a => a.status === "active").length,
    beta: AGENT_REGISTRY.filter(a => a.status === "beta").length,
    planned: AGENT_REGISTRY.filter(a => a.status === "planned").length,
    departments: getDepartments().length,
  }
}
