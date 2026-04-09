-- Users authenticated via Firebase are mirrored here.
create table if not exists public.users (
  id text primary key,
  email text,
  display_name text,
  photo_url text,
  provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create index if not exists users_email_idx on public.users (email);

-- Analysis reports are scoped by user_id for account-level history.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  input_type text not null check (input_type in ('text', 'transcript')),
  input_snippet text not null,
  scores jsonb not null,
  report jsonb not null,
  session_id text not null,
  word_timestamps jsonb,
  audio_duration double precision
);

create index if not exists reports_user_id_created_at_idx on public.reports (user_id, created_at desc);
