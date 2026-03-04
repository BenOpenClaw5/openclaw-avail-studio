-- Users table
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  meta_user_id text unique not null,
  meta_user_name text,
  meta_email text,
  access_token text not null,
  selected_ad_account_id text,
  selected_ad_account_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User settings
create table if not exists user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  default_date_range text default '30d',
  currency text default 'USD',
  timezone text default 'America/New_York',
  notifications_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists users_meta_user_id_idx on users(meta_user_id);
create index if not exists user_settings_user_id_idx on user_settings(user_id);

-- RLS
alter table users disable row level security;
alter table user_settings disable row level security;
