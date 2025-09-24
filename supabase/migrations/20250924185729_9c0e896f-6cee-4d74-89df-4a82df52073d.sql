create table if not exists realtyna_tokens (
  id uuid primary key default gen_random_uuid(),
  principal_type text check (principal_type in ('app','agent')) not null,
  principal_id uuid,
  access_token text not null,
  refresh_token text,
  scope text,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ingest_state (
  source text primary key,
  last_cursor text,
  last_item_ts timestamptz,
  last_run_at timestamptz default now()
);

alter table realtyna_tokens enable row level security;
revoke all on realtyna_tokens from anon, authenticated;