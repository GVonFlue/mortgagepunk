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

## 2. Supabase, so changes actually save

Until these are set, every screen shows a yellow "Preview mode" banner and
says plainly that edits won't save.

1. **Create the project** at supabase.com. Any region, any name.
2. **Run the schema.** SQL Editor → New query → paste all of
   `supabase-schema.sql` → Run. It creates six tables and seeds the two
   single-row ones.
3. **Copy the credentials.** Project Settings → API:
   - *Project URL* → `SUPABASE_URL`
   - *service_role* secret (NOT `anon`) → `SUPABASE_SERVICE_KEY`
4. **Add both to Vercel**, all three environments, then **redeploy**.

The service key bypasses row-level security. Server-side only, always. Never
prefix it with `NEXT_PUBLIC_` — that ships it to the browser and hands anyone
full write access to every table.

RLS is enabled on all six tables with no public policies, so even if the
`anon` key leaked it can read and write nothing. Every query goes through the
server with the service key, behind the password gate.

### Confirming it worked

Reload `/backstage`. The yellow banner should be gone. Add a video, refresh
the page — if it's still there, you're live. It should also appear on the
homepage within five minutes (pages revalidate on a 300-second cycle).

## What each screen drives on the live site

| Screen | Shows up on |
|---|---|
| Library | Homepage teaser (4 featured max) and `/library` + every topic page |
| Conference | The card in the Movement section of the homepage |
| Press | The press cards on `/about` |
| Speaking | The tour-date list on `/about` |
| Announcement | A red bar above the nav on every page |
| Leads | Nowhere public. Read-only record of form submissions |

Public pages revalidate every 5 minutes, so an edit shows up within that
window without a redeploy.

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


## How saving behaves

**Library** saves per action — add, feature, publish, remove all write
immediately. Toggles are optimistic: the switch flips at once and rolls back
if the server rejects it.

**Press and Speaking** are edited as a list and saved with an explicit Save
button. The button stays disabled until something actually changes, so there
is never a doubt about whether the work is stored.

**Conference and Announcement** save on their own button.

**Leads** are read-only.

## Two rules enforced on the server, not just in the UI

The dashboard caps every field and blocks a fifth featured video. Those same
rules are repeated in the API routes and again as CHECK constraints in
Postgres, because the UI is only a suggestion to anyone who knows the endpoint
exists.

## Leads never get lost

`/api/lead` writes to Supabase first, then to the Apps Script endpoint that
feeds the sheet and the inbox. The Apps Script leg runs whether or not the
database write succeeded. A database outage means a lead is missing from the
dashboard, never missing entirely.
