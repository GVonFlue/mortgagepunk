# One manual edit: mount the chat widget

`src/app/layout.tsx` has never been in my working copy, so I can't edit it
safely. Two lines, in your existing layout.

```tsx
import ChatWidget from "@/components/chat/ChatWidget";
```

then just before the closing `</body>`:

```tsx
        <ChatWidget />
      </body>
```

That's it. It's a client component and renders a fixed launcher, so it doesn't
matter where inside `<body>` it sits.

## Env var it needs

```
ANTHROPIC_API_KEY   your Anthropic API key
```

All three Vercel environments. Server-side only, never `NEXT_PUBLIC_`.

Without it the widget still appears and answers with a graceful "not switched
on yet, here's the form instead" — it never looks broken.

## Compliance, read this before changing the prompt

The system prompt in `src/app/api/chat/route.ts` is a control, not decoration.
Mortgage advertising is regulated, and an assistant that appears to quote a
rate, estimate what someone qualifies for, or promise an approval creates real
exposure under Regulation Z and UDAAP.

The assistant is instructed to refuse all of the following:

- quoting, estimating or implying an interest rate
- saying what someone qualifies for or how much they could borrow
- promising an approval, a timeline or a cost
- giving tax, legal or investment advice

It also identifies itself as an AI whenever asked, and the panel carries a
standing "AI assistant · not a loan officer" line plus a legal footer. Do not
remove either.

**Andrew Richels should review the system prompt** alongside the rest of the
site copy before launch. It is the one piece of the site that generates novel
language at runtime, which makes it the piece most worth him seeing.

## Where chat leads go

Exactly where form leads go. When someone volunteers an email and a phone
number in conversation, `/api/chat` writes to the `leads` table AND posts to
`LEAD_ENDPOINT`, with the full transcript in the notes field. It shows up in
Backstage → Leads tagged `source: chat`.
