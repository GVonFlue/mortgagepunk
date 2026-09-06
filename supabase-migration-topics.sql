-- ===========================================================================
-- MIGRATION: editable topics + multiple topics per video
--
-- Run this ONCE in the Supabase SQL editor, after supabase-schema.sql.
-- Safe to run on a table that already has rows — existing videos keep their
-- topic, it just moves into the new array column.
--
-- Order matters: create the new column, backfill from the old one, and only
-- then drop the old one. Dropping first would lose the three videos' topics.
-- ===========================================================================

-- 1. topics become real rows so Chris can add, rename and reorder them
create table if not exists library_topics (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique check (char_length(name) <= 46),
  sort  integer not null default 0
);
alter table library_topics enable row level security;

-- seed with Chris's ten, verbatim from onboarding
insert into library_topics (name, sort) values
 ('The Game of Money', 1),
 ('Buying a Home', 2),
 ('Getting a Mortgage the Right Way', 3),
 ('Building Wealth', 4),
 ('Living Beyond a Paycheck', 5),
 ('Real Estate Investing', 6),
 ('Taxes + Keeping More of Your Money', 7),
 ('Lender Lies', 8),
 ('Saved Loans / Real Stories', 9),
 ('Reimagining the American Dream', 10)
on conflict (name) do nothing;

-- 2. a video can now sit in several topics at once
alter table library_videos
  add column if not exists topics text[] not null default '{}';

-- 3. backfill from the single-topic column before it goes away
update library_videos
   set topics = array[topic]
 where cardinality(topics) = 0
   and topic is not null
   and topic <> '';

-- 4. now the old column is safe to remove
alter table library_videos drop column if exists topic;

create index if not exists library_videos_topics_idx
  on library_videos using gin (topics);
