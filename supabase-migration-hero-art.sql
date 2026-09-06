-- ===========================================================================
-- MIGRATION: uploadable hero artwork
-- Run after supabase-migration-hero.sql.
--
-- Chris's designer produces the headline as finished art. This lets him upload
-- that PNG and have it land in the hero at the same position, at the same
-- scale, and still BEHIND Chris — the layering stays in code, only the artwork
-- swaps.
-- ===========================================================================

alter table site_hero
  add column if not exists art_url          text,
  add column if not exists art_w            integer,
  add column if not exists art_h            integer,
  add column if not exists art_mobile_url   text,
  add column if not exists art_mobile_w     integer,
  add column if not exists art_mobile_h     integer,
  -- how wide the art sits on the 1512-wide stage. 1030 matches the current
  -- headline. Lets Chris nudge scale without touching code.
  add column if not exists art_width_units  integer default 1030,
  add column if not exists art_top_units    integer default 96;

-- ---------------------------------------------------------------------------
-- Storage bucket for brand art.
-- Public read (these are hero images on a public site), writes only through
-- the service key behind the password gate.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('brand', 'brand', true)
on conflict (id) do nothing;

-- Anyone can read; nobody can write with the publishable key.
drop policy if exists "brand public read" on storage.objects;
create policy "brand public read"
  on storage.objects for select
  using (bucket_id = 'brand');
