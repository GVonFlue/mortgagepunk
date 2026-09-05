-- ===========================================================================
-- Mortgage Punk — Backstage schema
--
-- Run this once in the Supabase SQL editor, then set these two env vars in
-- Vercel (ALL environments, not just Production):
--   SUPABASE_URL          your project URL
--   SUPABASE_SERVICE_KEY  the service_role key
--
-- Both are server-side only. NEVER prefix them with NEXT_PUBLIC_ — the service
-- key bypasses row-level security and must not reach the browser.
--
-- Every write goes through /api/backstage/*, which sits behind the password
-- gate in middleware.ts. The browser never talks to Supabase directly.
-- ===========================================================================

create table if not exists library_videos (
  id          uuid primary key default gen_random_uuid(),
  youtube_id  text not null,
  title       text not null check (char_length(title) <= 70),
  blurb       text not null check (char_length(blurb) <= 220),
  topic       text not null,
  featured    boolean not null default false,
  published   boolean not null default true,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists library_videos_topic_idx on library_videos (topic);
create index if not exists library_videos_sort_idx  on library_videos (sort);

create table if not exists press_items (
  id       uuid primary key default gen_random_uuid(),
  kind     text not null,
  outlet   text not null check (char_length(outlet) <= 44),
  note     text not null check (char_length(note) <= 150),
  url      text,
  pending  boolean not null default false,
  sort     integer not null default 0
);

create table if not exists speaking_topics (
  id     uuid primary key default gen_random_uuid(),
  title  text not null check (char_length(title) <= 54),
  blurb  text not null check (char_length(blurb) <= 180),
  sort   integer not null default 0
);

-- single-row tables: conference details and the announcement bar
create table if not exists site_conference (
  id          integer primary key default 1 check (id = 1),
  headline    text not null,
  date_label  text not null,
  venue       text not null,
  keynote     text not null,
  blurb       text not null,
  stats       jsonb not null default '[]'::jsonb,
  prizes      jsonb not null default '[]'::jsonb,
  url         text not null
);

create table if not exists site_announcement (
  id       integer primary key default 1 check (id = 1),
  enabled  boolean not null default false,
  text     text not null default '',
  href     text not null default ''
);

create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  first       text not null,
  last        text,
  email       text not null,
  phone       text not null,
  intent      text,
  notes       text,
  source      text,
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_idx on leads (created_at desc);

-- RLS on with no public policies: the anon key can read and write nothing.
-- All access is server-side through the service key.
alter table library_videos    enable row level security;
alter table press_items       enable row level security;
alter table speaking_topics   enable row level security;
alter table site_conference   enable row level security;
alter table site_announcement enable row level security;
alter table leads             enable row level security;

-- seed the two single-row tables so the editors always have something to load
insert into site_conference (id, headline, date_label, venue, keynote, blurb, stats, prizes, url)
values (1, 'The American Dream Conference', 'October 16, 2027',
        'Hyatt Regency · Wichita, Kansas', 'Hannah Hammond',
        'Not a sit-in-a-chair seminar. Real education, real connections, and the volume all the way up.',
        '[{"value":"3","label":"Keynotes"},{"value":"15","label":"Breakouts"},{"value":"1","label":"Live concert"}]'::jsonb,
        '["Full kitchen remodel, given away live","A brand new roof","New HVAC system","Interior and exterior paint job","One month of mortgage payments"]'::jsonb,
        'https://mortgagepunklive.com')
on conflict (id) do nothing;

insert into site_announcement (id, enabled, text, href)
values (1, false, 'Tickets for the American Dream Conference are on sale now.',
        'https://mortgagepunklive.com')
on conflict (id) do nothing;
