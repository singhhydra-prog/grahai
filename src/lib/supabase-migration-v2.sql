-- ═══════════════════════════════════════════════════════════════
-- GrahAI V2 Migration — Full Data Model per Execution Document §10
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)
--
-- This migration:
-- 1. Upgrades existing tables (profiles, question_history, entitlements, reports)
-- 2. Creates new tables (charts, memory_threads, analytics_events, notifications, user_daily_limits)
-- 3. Adds proper indexes and RLS policies
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. UPGRADE PROFILES TABLE ──────────────────────────────
-- Add new columns from Section 10 spec

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auth_provider text DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS language_pref text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'plus', 'premium')),
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_intent text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS birth_time time,
  ADD COLUMN IF NOT EXISTS birth_place text,
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision,
  ADD COLUMN IF NOT EXISTS chart_mode text DEFAULT 'approx'
    CHECK (chart_mode IN ('exact', 'approx'));

-- Index for subscription tier lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_complete);


-- ─── 2. CHARTS TABLE (NEW) ─────────────────────────────────
-- Stores computed natal chart data, separate from profile birth inputs

CREATE TABLE IF NOT EXISTS public.charts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  chart_json jsonb NOT NULL DEFAULT '{}',
  moon_sign text,
  rising_sign text,
  sun_sign text,
  nakshatra text,
  dasha_state jsonb DEFAULT '{}',
  active_transits jsonb DEFAULT '{}',
  confidence_mode text DEFAULT 'approx' CHECK (confidence_mode IN ('exact', 'approx')),
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- One chart per user (latest computation)
CREATE UNIQUE INDEX IF NOT EXISTS idx_charts_user_id ON public.charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_computed_at ON public.charts(computed_at);

ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chart" ON public.charts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chart" ON public.charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chart" ON public.charts
  FOR UPDATE USING (auth.uid() = user_id);
-- Service role can always access (for API routes)
CREATE POLICY "Service role full access to charts" ON public.charts
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 3. UPGRADE QUESTION_HISTORY TABLE ──────────────────────
-- Add source refs, category, saved flag, structured answer

ALTER TABLE public.question_history
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS answer_json jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_refs jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS saved_flag boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vertical text DEFAULT 'astrology';

CREATE INDEX IF NOT EXISTS idx_question_history_user_id ON public.question_history(user_id);
CREATE INDEX IF NOT EXISTS idx_question_history_category ON public.question_history(category);
CREATE INDEX IF NOT EXISTS idx_question_history_saved ON public.question_history(user_id, saved_flag)
  WHERE saved_flag = true;
CREATE INDEX IF NOT EXISTS idx_question_history_created ON public.question_history(user_id, created_at DESC);


-- ─── 4. MEMORY THREADS TABLE (NEW) ─────────────────────────
-- Tracks recurring life themes across conversations

CREATE TABLE IF NOT EXISTS public.memory_threads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  theme text NOT NULL,
  life_area text,
  last_seen_at timestamptz DEFAULT now(),
  intensity_score double precision DEFAULT 0.5
    CHECK (intensity_score >= 0 AND intensity_score <= 1),
  occurrence_count int DEFAULT 1,
  summary text,
  related_questions uuid[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_threads_user ON public.memory_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_threads_theme ON public.memory_threads(user_id, theme);
CREATE INDEX IF NOT EXISTS idx_memory_threads_intensity ON public.memory_threads(user_id, intensity_score DESC);
CREATE INDEX IF NOT EXISTS idx_memory_threads_recent ON public.memory_threads(user_id, last_seen_at DESC);

ALTER TABLE public.memory_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memory threads" ON public.memory_threads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access to memory_threads" ON public.memory_threads
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 5. UPGRADE REPORTS TABLE ───────────────────────────────

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS report_json jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS life_area text,
  ADD COLUMN IF NOT EXISTS pricing_tier text DEFAULT 'free';

CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(user_id, status);


-- ─── 6. UPGRADE ENTITLEMENTS TABLE ──────────────────────────

ALTER TABLE public.entitlements
  ADD COLUMN IF NOT EXISTS plan text,
  ADD COLUMN IF NOT EXISTS feature_flags jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS purchase_history jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id text;

CREATE INDEX IF NOT EXISTS idx_entitlements_user ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON public.entitlements(user_id, status)
  WHERE status = 'active';


-- ─── 7. ANALYTICS EVENTS TABLE (NEW) ───────────────────────
-- Lightweight event tracking for founder dashboard

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  session_id text,
  payload_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Partition-friendly indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON public.analytics_events(event_name, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Only service role can write analytics (from API routes)
CREATE POLICY "Service role full access to analytics" ON public.analytics_events
  FOR ALL USING (auth.role() = 'service_role');
-- Users can view their own events (for debugging/transparency)
CREATE POLICY "Users can view own analytics" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);


-- ─── 8. NOTIFICATIONS TABLE (NEW) ──────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('daily_push', 'weekly_summary', 'onboarding_reminder',
    'report_ready', 'reactivation', 'custom')),
  title text NOT NULL,
  body text,
  payload jsonb DEFAULT '{}',
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(user_id, type);
CREATE INDEX IF NOT EXISTS idx_notifications_sent ON public.notifications(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unopened ON public.notifications(user_id, opened_at)
  WHERE opened_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role full access to notifications" ON public.notifications
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 9. USER DAILY LIMITS TABLE (ensure exists) ────────────
-- Used by usage-limiter.ts for per-day message counting

CREATE TABLE IF NOT EXISTS public.user_daily_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  astrology_count int DEFAULT 0,
  numerology_count int DEFAULT 0,
  tarot_count int DEFAULT 0,
  vastu_count int DEFAULT 0,
  pipeline_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_limits_user_date ON public.user_daily_limits(user_id, date);

ALTER TABLE public.user_daily_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own limits" ON public.user_daily_limits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access to daily_limits" ON public.user_daily_limits
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 10. MEMORIES TABLE (ensure exists for memory.ts) ───────

CREATE TABLE IF NOT EXISTS public.memories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  memory_type text NOT NULL,
  content text NOT NULL,
  importance double precision DEFAULT 0.5,
  metadata jsonb DEFAULT '{}',
  access_count int DEFAULT 0,
  last_accessed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memories_user ON public.memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON public.memories(user_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_importance ON public.memories(user_id, importance DESC);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memories" ON public.memories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access to memories" ON public.memories
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 11. AGENT PROMPT VERSIONS (ensure exists) ─────────────

CREATE TABLE IF NOT EXISTS public.agent_prompt_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name text NOT NULL,
  system_prompt text NOT NULL,
  version int DEFAULT 1,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prompts_active ON public.agent_prompt_versions(agent_name, is_active)
  WHERE is_active = true;

ALTER TABLE public.agent_prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to prompts" ON public.agent_prompt_versions
  FOR ALL USING (auth.role() = 'service_role');


-- ─── 12. PUSH SUBSCRIPTIONS TABLE ──────────────────────────

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  keys jsonb NOT NULL DEFAULT '{}',
  preferences jsonb DEFAULT '{"daily": true, "weekly": true, "reports": true}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_user ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_active ON public.push_subscriptions(active) WHERE active = true;

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subs" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role full access to push_subs" ON public.push_subscriptions
  FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'provider', 'email')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ═══════════════════════════════════════════════════════════════
-- Done! All tables, indexes, RLS policies, and triggers created.
-- ═══════════════════════════════════════════════════════════════
