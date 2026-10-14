-- ===========================================================================
-- MIGRATION: editable section photography
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- WHAT THIS IS FOR. Backstage → Photos lets Chris swap the photograph in a
-- named spot on the site without a deploy. This table holds only the swaps.
--
-- AN EMPTY TABLE IS THE NORMAL STATE. Every slot has a file that ships with
-- the build, and that file is what renders until somebody uploads over it. So
-- this migration changes nothing visible on its own, and deleting a row puts
-- the original picture back. The slot keys live in src/lib/images.ts, which is
-- also what generates the Backstage screen.
-- ===========================================================================

create table if not exists site_images (
  -- Matches ImageSlot.key in src/lib/images.ts. Text rather than an enum so
  -- adding a slot is a code change only — no migration to deploy alongside it.
  slot       text primary key,
  url        text not null,
  -- Captured in the browser at upload time. These become width/height on the
  -- <Image>, which is what stops the page reflowing as the picture loads.
  w          integer,
  h          integer,
  updated_at timestamptz not null default now()
);

alter table site_images enable row level security;

-- Deliberately no public policy. The site reads this through the service key
-- on the server, the same way it reads every other table here, and nothing in
-- the browser ever queries it directly.

comment on table site_images is
  'Per-slot photo overrides for the public site. Empty = use the files that shipped with the build. Keys are defined in src/lib/images.ts.';
