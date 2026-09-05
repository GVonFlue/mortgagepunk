# Backstage — setup

The dashboard is at **`/backstage`**. It is not linked from anywhere on the
site, carries `noindex`, and sits behind a password.

The obscure URL is not the security. `middleware.ts` is. Both together mean
nobody stumbles in, and a forwarded link on its own is useless.

## 1. Two env vars, right now

In Vercel → Settings → Environment Variables. Add to **all** environments,
not just Production.

    BACKSTAGE_PASSWORD   what Chris types to get in
    BACKSTAGE_SECRET     32+ random characters, signs the session cookie

Generate the secret with:

    openssl rand -hex 32

Never prefix either with `NEXT_PUBLIC_`.

Without these the dashboard cannot be logged into at all — which is a safe
failure, not a broken one.

## 2. Two more when you want changes to persist

Until these are set, every screen shows a yellow "Preview mode" banner and
says plainly that edits won't save. Chris can click through the whole thing
and see exactly what he's getting.

1. Run `supabase-schema.sql` in the Supabase SQL editor
2. Add to Vercel, all environments:

       SUPABASE_URL          project URL
       SUPABASE_SERVICE_KEY  service_role key

The service key bypasses row-level security. Server-side only, always.

## What Chris can change

| Screen | What it drives |
|---|---|
| **Library** | The education library. Paste a YouTube link, pick a topic, write a blurb. Title and thumbnail come from YouTube — no image uploads, ever |
| **Leads** | Read-only inbox of everyone who filled out a form |
| **Press** | The press cards on /about. Unverified items stay off the public site |
| **Conference** | The American Dream Conference card — date, venue, keynote, the three stats, giveaways |
| **Speaking** | The five talks on /about |
| **Announcement** | A red bar across every page. On for ticket drops, off after |

## What he deliberately cannot change

Layout, colours, typography, navigation, page structure. Those are design
decisions and they stay with us — which is exactly the line the build plan
drew: *"the dashboard edits content. It is not a CRM, not an analytics suite,
and not the brand dashboard."*

## Why every field has a character cap

Each public layout was designed around a length. An uncapped field is how a
dashboard quietly breaks a site three months after handover. Every input shows
a live counter and hard-stops at the limit, and the same limits are enforced
again as CHECK constraints in the database.

Caps live in one place: `LIMITS` in `src/lib/content.ts`.

## The rules that keep this safe

- Max four videos featured on the homepage. The UI blocks the fifth
- Videos can be saved as drafts and published later
- Press items marked unverified render dimmed in the dashboard and are
  withheld from the public page
- Leads are read-only. They are a record, not a document
