/**
 * Design specifications for anyone producing artwork for this site.
 *
 * SINGLE SOURCE OF TRUTH. The /backstage/design page renders straight from
 * this file, so the spec a designer is handed always matches what the site
 * actually does. A written spec in a Google Doc drifts the first time anyone
 * nudges a number; this cannot.
 *
 * If you change a value in Hero.module.css, change it here in the same commit.
 * The pairing is noted on every entry.
 */

export type ArtSlot = {
  id: string;
  name: string;
  where: string;
  /** Design canvas in stage units — 1 unit = 1px at the reference size. */
  w: number;
  h: number;
  /** What to actually export. */
  exportW: number;
  exportH: number;
  format: string;
  /** Region hidden behind another element, as a fraction of the slot. */
  occluded?: { fromX: number; note: string };
  notes: string[];
  cssRef: string;
};

/** The hero is composed on a fixed stage and scaled as one unit. */
export const STAGE = { w: 1512, h: 900, mobileW: 390, mobileH: 844 };

/**
 * Chris's cutout, in stage units. Taken from .chris in Hero.module.css:
 * right:300u, width:529u, height:672u, bottom:0 → left edge at 683u.
 */
export const CHRIS = {
  left: STAGE.w - 300 - 529,
  right: STAGE.w - 300,
  top: STAGE.h - 672,
  bottom: STAGE.h,
};

export const ART_SLOTS: ArtSlot[] = [
  {
    id: "hero-desktop",
    name: "Homepage headline — desktop",
    where: "The main headline. Sits BEHIND Chris.",
    w: 1030,
    h: 544,
    exportW: 3090,
    exportH: 1632,
    format: "PNG with a real alpha channel",
    occluded: {
      // Chris starts at 683u; the art starts at 38u and runs 1030u wide
      fromX: Math.round(((CHRIS.left - 38) / 1030) * 100),
      note: "Chris covers the right of the artwork from roughly here across.",
    },
    notes: [
      "Crop tight. Artwork should end where the ink ends — empty margin makes the letters render smaller than the canvas suggests.",
      "Anything in the right third will be partly hidden behind Chris. Put the words you need read on the left.",
      "It sits on mid-grey concrete. Add your own outline or shadow if you want the letters to separate — the site won't add one.",
      "Export at 3x so it stays sharp on a large monitor.",
    ],
    cssRef: ".artWrap in Hero.module.css — left 38u, top 96u, width 1030u",
  },
  {
    id: "hero-mobile",
    name: "Homepage headline — phone",
    where: "Same headline, phone layout. Chris sits below it, not behind it.",
    w: 356,
    h: 250,
    exportW: 1424,
    exportH: 1000,
    format: "PNG with a real alpha channel",
    notes: [
      "Optional. Without it the desktop artwork is used and scaled down, which usually reads too wide.",
      "Nothing is hidden here — Chris sits below the type on a phone, so the whole thing is visible.",
      "A squarer, chunkier lockup works better than the wide desktop one.",
    ],
    cssRef: ".artWrap mobile block in Hero.module.css — left 17u, top 96u, width 356u",
  },
];

/** Photography still needed, with the shape each slot expects. */
export const PHOTO_SLOTS = [
  {
    id: "stage",
    name: "Chris on stage",
    where: "/about — the booking section",
    ratio: "4:3 landscape",
    exportW: 1600,
    notes: ["A real speaking shot. Crowd visible if possible."],
  },
  {
    id: "press",
    name: "Press covers",
    where: "/about — press cards",
    ratio: "16:10 landscape",
    exportW: 1200,
    notes: ["One per press item. A screenshot of the article works."],
  },
  {
    id: "path",
    name: "Homepage path panels",
    where: "Homepage — the three doors",
    ratio: "3:4 portrait, bleeds",
    exportW: 1200,
    notes: ["Sits behind a heavy gradient, so detail in the middle is lost."],
  },
  {
    id: "team",
    name: "Team headshots",
    where: "/team and each member page",
    ratio: "4:5 portrait",
    exportW: 1200,
    notes: ["Framed from the chest up. Rendered black and white until hover."],
  },
];

export const BRAND = {
  colors: [
    { name: "Punk red", hex: "#EB2933", use: "The only red. Never substitute." },
    { name: "Deep red", hex: "#B81F27", use: "Hover states and gradient ends." },
    { name: "Black", hex: "#0A0A0A", use: "Backgrounds and dark type." },
    { name: "Ink", hex: "#141414", use: "Second-level dark panels." },
    { name: "Bone", hex: "#EDEBE8", use: "Light type and light panels." },
    { name: "Line", hex: "#2A2A2A", use: "Borders on dark." },
  ],
  fonts: [
    { name: "Anton", use: "All display type. Always uppercase, tight tracking." },
    { name: "Inter", use: "Body copy, labels, buttons." },
  ],
  rules: [
    "Red marks two things only: what to read next, and what to click. When everything is loud, nothing is.",
    "No skulls, no anarchy symbols, no hot pink, no fake backgrounds, no AI-manipulated photos of Chris.",
    "Photography is desaturated with colour kept where the energy is.",
  ],
};
