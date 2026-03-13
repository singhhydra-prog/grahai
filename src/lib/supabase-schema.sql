-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  birth_data jsonb default '{}',
  preferences jsonb default '{"language": "en", "tone": "calm"}',
  plan text default 'free' check (plan in ('free', 'plus', 'premium')),
  question_count_today int default 0,
  question_count_reset_at timestamptz default now(),
  streak_days int default 0,
  last_active_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Question history table
create table if not exists public.question_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  question text not null,
  answer text not null,
  topic text,
  emotional_tone text,
  created_at timestamptz default now()
);

-- Entitlements table
create table if not exists public.entitlements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('subscription', 'one_time')),
  product_id text not null,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Reports table
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  report_type text not null,
  title text not null,
  content jsonb default '{}',
  status text default 'generating' check (status in ('generating', 'ready', 'failed')),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.question_history enable row level security;
alter table public.entitlements enable row level security;
alter table public.reports enable row level security;

-- Profiles RLS policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Question history RLS policies
create policy "Users can view own history" on public.question_history for select using (auth.uid() = user_id);
create policy "Users can insert own history" on public.question_history for insert with check (auth.uid() = user_id);

-- Entitlements RLS policies
create policy "Users can view own entitlements" on public.entitlements for select using (auth.uid() = user_id);

-- Reports RLS policies
create policy "Users can view own reports" on public.reports for select using (auth.uid() = user_id);
