-- ============================================================
-- Komunikasi Group V2 — base schema
-- Dijalankan lewat Supabase SQL Editor. server.js tidak pernah
-- membuat atau mengubah tabel.
-- Migrasi Recording V1 ada di 001_recording_v1.sql.
-- ============================================================

create table if not exists public.users (
  id bigint generated always as identity primary key,
  username text not null unique,
  password_hash text not null,
  role text not null default 'user',
  active boolean not null default true,
  banned boolean not null default false,
  muted boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists users_username_lower_idx on public.users (lower(username));

create table if not exists public.auth_sessions (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists auth_sessions_expires_idx on public.auth_sessions(expires_at);

create table if not exists public.admin_sessions (
  id bigint generated always as identity primary key,
  admin_user_id bigint not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists admin_sessions_expires_idx on public.admin_sessions(expires_at);

create table if not exists public.app_config (
  config_key text primary key,
  config_value jsonb not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  username text not null,
  group_name text not null,
  channel_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_room_idx on public.chat_messages(group_name, channel_name, created_at);

create table if not exists public.online_sessions (
  socket_id text primary key,
  username text not null,
  group_name text not null,
  channel_name text not null,
  peer_id text,
  mic_status boolean default false,
  floor_status text default 'idle',
  updated_at timestamptz default now()
);
create index if not exists online_sessions_room_idx on public.online_sessions(group_name, channel_name);

-- Kolom admin_name harus sama dengan yang ditulis auditAdmin() di server.js.
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  admin_name text,
  action text,
  target text,
  detail text,
  created_at timestamptz default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- Sumber data statistik admin (MASUK / KELUAR channel).
create table if not exists public.activity_logs (
  id bigint generated always as identity primary key,
  username text not null,
  group_name text not null,
  channel_name text not null,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_logs_created_idx on public.activity_logs(created_at desc);
create index if not exists activity_logs_action_idx on public.activity_logs(action, created_at desc);
