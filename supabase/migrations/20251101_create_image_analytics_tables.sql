-- Image Editor Analytics Tables
-- Tracks AI image editing runs and downloads for owner analytics

create table if not exists image_edit_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  prompt text not null,
  options jsonb,
  images_in int not null default 0,
  images_out int not null default 0,
  storage_bytes bigint not null default 0,
  created_at timestamptz default now()
);

create table if not exists image_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  run_id uuid references image_edit_runs(id) on delete cascade,
  file_url text not null,
  bytes bigint,
  created_at timestamptz default now()
);

-- Enable RLS
alter table image_edit_runs enable row level security;
alter table image_downloads enable row level security;

-- RLS Policies: Owners see everything, agents see only their own
create policy "runs_owner_full" on image_edit_runs
  for select using (
    exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'owner')
    or user_id = auth.uid()
  );

create policy "runs_insert_self" on image_edit_runs
  for insert with check (user_id = auth.uid());

create policy "downloads_owner_full" on image_downloads
  for select using (
    exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'owner')
    or user_id = auth.uid()
  );

create policy "downloads_insert_self" on image_downloads
  for insert with check (user_id = auth.uid());

-- Postgres function to get top agents by edit count this month
create or replace function top_edit_agents_this_month()
returns table(user_email text, edits int)
language sql
as $$
  select coalesce(p.email, 'unknown') as user_email, sum(r.images_out)::int as edits
  from image_edit_runs r
  left join profiles p on p.user_id = r.user_id
  where r.created_at >= date_trunc('month', now())
  group by p.email
  order by edits desc
  limit 5;
$$;

-- Indexes for performance
create index if not exists idx_image_edit_runs_user_id on image_edit_runs(user_id);
create index if not exists idx_image_edit_runs_created_at on image_edit_runs(created_at);
create index if not exists idx_image_downloads_user_id on image_downloads(user_id);
create index if not exists idx_image_downloads_run_id on image_downloads(run_id);
