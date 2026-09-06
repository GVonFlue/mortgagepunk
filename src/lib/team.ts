/**
 * The lending team.
 *
 * Three people today, and the structure assumes more. Each one gets a real
 * page rather than a card in a grid, because an individual page with a name,
 * an NMLS number and a market is a genuine local-search asset — and at any
 * kind of scale that coverage is worth more than one person's blog.
 *
 * Not dashboard-editable on purpose: the team changes a few times a year, not
 * weekly, and every entry carries a regulated NMLS number that should go
 * through a person rather than a text box.
 */

export type Member = {
  slug: string;
  name: string;
  role: string;
  nmls?: string;
  market: string;
  /** One line for the card. */
  short: string;
  /** A few paragraphs for their own page. */
  bio: string[];
  photo?: string;
  email?: string;
  phone?: string;
  /** Held back from the public page until confirmed. */
  pending?: boolean;
};

export const TEAM: Member[] = [
  {
    slug: "chris-waipa",
    name: "Chris Waipa",
    role: "Founder & Loan Officer",
    nmls: "339232",
    market: "Wichita, Kansas",
    short:
      "Twenty-three years in lending, and the reason Mortgage Punk exists in the first place.",
    bio: [
      "Chris has spent more than two decades in mortgage lending and most of that time frustrated by it. The loan itself builds wealth. The process around it is what leaves people confused, stressed and treated like a transaction.",
      "Mortgage Punk started as an unconventional answer to a very conventional industry. It has grown into a lending team, a media platform, an education community, a live event, and a movement to reimagine what the American Dream actually looks like.",
      "He is also the creator of the American Dream Conference and speaks nationally on homeownership, wealth-building, and living beyond a paycheck.",
    ],
    photo: "/brand/chris-suit.png",
  },
  {
    slug: "team-member-two",
    name: "Team member",
    role: "Loan Officer",
    market: "Wichita, Kansas",
    short: "Name, NMLS number, market and headshot needed from Mortgage Punk.",
    bio: [
      "Placeholder. Send the name, title, NMLS number, market, a short bio and a headshot and this becomes a real page.",
    ],
    pending: true,
  },
  {
    slug: "team-member-three",
    name: "Team member",
    role: "Loan Officer",
    market: "Wichita, Kansas",
    short: "Name, NMLS number, market and headshot needed from Mortgage Punk.",
    bio: [
      "Placeholder. Send the name, title, NMLS number, market, a short bio and a headshot and this becomes a real page.",
    ],
    pending: true,
  },
];

export function memberBySlug(slug: string): Member | undefined {
  return TEAM.find((m) => m.slug === slug);
}
