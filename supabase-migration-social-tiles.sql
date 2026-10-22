-- ===========================================================================
-- MIGRATION: the Movement wall (Backstage → Movement wall)
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- WHAT THIS IS FOR. The pictures under The Movement on the home page, chosen
-- and ordered in Backstage, each opening its own Instagram post.
--
-- NOTHING CHANGES ON THE SITE WHEN THIS RUNS. The table is filled with the
-- 36 pictures the wall already shows, in the same order, so the home page
-- looks identical afterwards. Nine of them already carry their post's link
-- (matched on 22 October 2026); the rest open the profile until a link is
-- pasted in for them.
--
-- The seed only goes in when the table is empty, so re-running this never
-- puts back a picture that was removed in Backstage.
--
-- Before this runs, the site reads the same 36 from src/lib/socialTiles.ts.
-- ===========================================================================

create table if not exists social_tiles (
  -- Seeded rows use their file name; tiles added in Backstage get a UUID.
  id         text primary key,
  sort       integer not null,
  -- A file that shipped with the site (/brand/...) or an upload in the
  -- public "brand" storage bucket (wall/...).
  src        text not null,
  alt        text not null default '',
  shape      text not null default 'reel'
             check (shape in ('reel', 'tallish', 'portrait', 'square')),
  -- The post. Null = the tile opens the Instagram profile.
  href       text,
  hidden     boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists social_tiles_sort on social_tiles (sort);

alter table social_tiles enable row level security;

-- Deliberately no public policy: the site reads this on the server with the
-- service key, like every other table here.

comment on table social_tiles is
  'The Movement wall on the home page, edited in Backstage. Empty = the site shows the seed set in src/lib/socialTiles.ts.';

insert into social_tiles (id, sort, src, alt, shape, href, hidden)
select * from (values
  ('adc-movement-poster', 1, '/brand/social/adc-movement-poster.jpg', 'American Dream Conference poster: the American Dream isn''t a memory, it''s a movement', 'reel', null, false),
  ('adc-concert', 2, '/brand/adc-concert.jpg', 'Live music closing the conference', 'square', null, false),
  ('portrait-red', 3, '/brand/social/portrait-red.jpg', 'Chris in red light, straightening his collar', 'reel', 'https://www.instagram.com/p/DeJ2ri0kTYi/', false),
  ('whats-your-next-move', 4, '/brand/social/whats-your-next-move.jpg', 'What''s your next move? The Game of Money', 'reel', 'https://www.instagram.com/reel/DeMYh1JxoXZ/', false),
  ('lender-lies-01', 5, '/brand/social/lender-lies-01.jpg', 'Lender Lies number one: the $12,000 free refinance', 'tallish', null, false),
  ('so-it-sucked-less', 6, '/brand/social/so-it-sucked-less.jpg', 'So it sucked less? Chris and a guest mid-conversation', 'reel', 'https://www.instagram.com/reel/DeaAzLapweZ/', false),
  ('review-five-star', 7, '/brand/social/review-five-star.jpg', 'A client review of working with Chris and the Mortgage Punk team', 'portrait', null, false),
  ('lender-lies-02', 8, '/brand/social/lender-lies-02.jpg', 'Lender Lies number two: why is my lender ghosting me?', 'reel', null, false),
  ('nobody-came-for-a-mortgage', 9, '/brand/social/nobody-came-for-a-mortgage.jpg', 'Nobody came here for a mortgage — Chris on the mic', 'reel', null, false),
  ('adc-panel', 10, '/brand/adc-panel.jpg', 'Panel session on stage', 'tallish', null, false),
  ('thank-you-wichita', 11, '/brand/social/thank-you-wichita.jpg', 'Thank you, Wichita — same energy in 2027?', 'reel', null, false),
  ('seventy-k-first-home', 12, '/brand/social/seventy-k-first-home.jpg', 'How they got $70,000 to buy their first home', 'reel', null, false),
  ('own-it', 13, '/brand/social/own-it.jpg', 'Own it: you don''t have to inherit someone else''s definition of the American Dream', 'square', null, false),
  ('podcast-kash-nancy-shih', 14, '/brand/social/podcast-kash-nancy-shih.jpg', 'The Mortgage Punk Show: Achieve K.A.S.H. to make more cash, with Nancy Shih', 'reel', null, false),
  ('adc-phone', 15, '/brand/adc-phone.jpg', 'An attendee filming the keynote', 'portrait', null, false),
  ('american-dream-tee', 16, '/brand/social/american-dream-tee.jpg', 'American Dream tee: own it, beyond a paycheck', 'reel', 'https://www.instagram.com/reel/DYdO6SoJa1r/', false),
  ('client-story-nothing-to-lose', 17, '/brand/social/client-story-nothing-to-lose.jpg', 'Client story: five years ago he had nothing to lose', 'reel', null, false),
  ('not-everything-needs-a-strategy', 18, '/brand/social/not-everything-needs-a-strategy.jpg', 'Not everything needs a strategy', 'tallish', 'https://www.instagram.com/reel/DeDGMcHpY_H/', false),
  ('adc-stage-crowd', 19, '/brand/adc-stage-crowd.jpg', 'Chris on stage at the conference, room full', 'reel', null, false),
  ('paycheck-isnt-the-playbook', 20, '/brand/social/paycheck-isnt-the-playbook.jpg', 'Your paycheck isn''t the playbook', 'square', 'https://www.instagram.com/reel/Dd1bkFBRpER/', false),
  ('problems-start-at-preapproval', 21, '/brand/social/problems-start-at-preapproval.jpg', 'Most mortgage problems start at pre-approval', 'reel', null, false),
  ('what-does-freedom-mean', 22, '/brand/social/what-does-freedom-mean.jpg', 'What does freedom actually mean? Live at Backstage Pass', 'reel', 'https://www.instagram.com/reel/Ddl9XdHxNLD/', false),
  ('vote-punk-best-of-wichita', 23, '/brand/social/vote-punk-best-of-wichita.jpg', 'Vote Punk — Best of Wichita 2026, home mortgage and financial education', 'portrait', null, false),
  ('one-closing-three-wins', 24, '/brand/social/one-closing-three-wins.jpg', 'One closing, three wins: home equity, debt paid off, startup capital', 'reel', null, false),
  ('game-of-money-chapter-02', 25, '/brand/social/game-of-money-chapter-02.jpg', 'The Game of Money, chapter two: I''ve failed, I''m still learning', 'tallish', null, false),
  ('never-too-late-to-learn', 26, '/brand/social/never-too-late-to-learn.jpg', 'Real people, real conversations — it''s never too late to learn the game', 'reel', null, false),
  ('american-dream-rewrite', 27, '/brand/social/american-dream-rewrite.jpg', 'The American Dream: the freedom and opportunity to rewrite your story', 'reel', 'https://www.instagram.com/p/DcEwOJTp6-X/', false),
  ('adc-education', 28, '/brand/adc-education.jpg', 'Breakout session at the conference', 'square', null, false),
  ('ninety-to-a-million', 29, '/brand/social/ninety-to-a-million.jpg', '$90 to $1,000,000? The Suck Less Mortgage Process', 'reel', 'https://www.instagram.com/reel/DdxH1pbp9Mo/', false),
  ('chris-stage', 30, '/brand/chris-stage.jpg', 'Chris mid-keynote', 'portrait', null, false),
  ('recruit-at-restaurants', 31, '/brand/social/recruit-at-restaurants.jpg', 'I recruit at restaurants — podcast interview', 'reel', null, false),
  ('show-sponsor-kihle', 32, '/brand/social/show-sponsor-kihle.jpg', 'The Mortgage Punk Show, sponsored by Kihle Roofing and Construction', 'reel', null, false),
  ('freedom-on-your-own-terms', 33, '/brand/social/freedom-on-your-own-terms.jpg', 'The American Dream was never about having it all — it was about the freedom to build a life on your own terms', 'tallish', null, false),
  ('explanation-didnt-fail', 34, '/brand/social/explanation-didnt-fail.jpg', 'The American Dream didn''t fail. The explanation did.', 'reel', null, false),
  ('adc-stageset', 35, '/brand/adc-stageset.jpg', 'The stage before doors', 'tallish', null, false),
  ('adc-interview', 36, '/brand/adc-interview.jpg', 'Chris interviewing on stage', 'reel', null, false)
) as seed (id, sort, src, alt, shape, href, hidden)
where not exists (select 1 from social_tiles);
