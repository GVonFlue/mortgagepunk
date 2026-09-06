-- ===========================================================================
-- MIGRATION: editable homepage hero copy
-- Run once, after the other migrations.
--
-- WORDS become editable. LAYOUT does not. The layering (headline behind Chris,
-- the shadow stack, the stage scaling) stays in code, because that is design,
-- not content — and it is the part that breaks if someone nudges it.
-- ===========================================================================

create table if not exists site_hero (
  id            integer primary key default 1 check (id = 1),
  eyebrow       text not null default 'Reimagining',
  line_small    text not null default 'The',
  line_big      text not null default 'American',
  line_accent   text not null default 'Dream',
  rail_top      text not null default 'Loan Officer.',
  rail_hit      text not null default 'Leading a Movement.',
  rail_bottom   text not null default 'Building a World-Class Lending Team.',
  cta1_label    text not null default 'Get Approved the Right Way',
  cta1_href     text not null default '/get-approved',
  cta2_label    text not null default 'Follow the Movement',
  cta2_href     text not null default '/movement',
  nav_cta_label text not null default 'Get Approved',
  nav_cta_href  text not null default '/get-approved'
);
alter table site_hero enable row level security;

insert into site_hero (id) values (1) on conflict (id) do nothing;
