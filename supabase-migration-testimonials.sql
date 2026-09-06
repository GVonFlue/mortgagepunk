-- ===========================================================================
-- MIGRATION: testimonials
-- Run once, after supabase-schema.sql and supabase-migration-topics.sql.
-- ===========================================================================

create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) <= 48),
  role       text check (char_length(role) <= 60),      -- "First-time buyer, Wichita"
  quote      text not null check (char_length(quote) <= 420),
  rating     integer not null default 5 check (rating between 1 and 5),
  featured   boolean not null default false,             -- max 3 on the homepage
  published  boolean not null default true,
  sort       integer not null default 0,
  created_at timestamptz not null default now()
);
alter table testimonials enable row level security;
create index if not exists testimonials_sort_idx on testimonials (sort);

-- Seeded as UNPUBLISHED placeholders on purpose. Real testimonials are
-- regulated marketing claims — nothing here goes public until Chris confirms
-- the person said it and is happy to be named.
insert into testimonials (name, role, quote, rating, featured, published, sort) values
 ('Client name', 'First-time buyer, Wichita',
  'Placeholder. Replace with a real quote in Backstage before publishing.', 5, true, false, 1),
 ('Client name', 'Refinance, Kansas',
  'Placeholder. Replace with a real quote in Backstage before publishing.', 5, true, false, 2),
 ('Client name', 'Investor, Wichita',
  'Placeholder. Replace with a real quote in Backstage before publishing.', 5, true, false, 3)
on conflict do nothing;
