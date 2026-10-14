/**
 * EDITABLE SECTION PHOTOGRAPHY.
 *
 * Every photograph on the site that Chris might reasonably want to swap is
 * registered here as a named slot. Backstage → Photos renders this list, so a
 * slot added here appears in the dashboard with no other change — the editor
 * is generated from this file rather than hand-built per picture.
 *
 * WHY A REGISTRY RATHER THAN A FREE-FOR-ALL UPLOADER. A generic media library
 * would let anyone put a 12MB portrait into a slot shaped for a wide stage
 * shot, and the page would quietly look broken. Each slot below carries the
 * shape it expects and the file it falls back to, so the editor can warn
 * before the upload rather than after the page is live.
 *
 * WHY THE FALLBACK IS A FILE PATH. Nothing here depends on the database being
 * reachable or on anything having been uploaded. With an empty table every
 * slot resolves to the file that shipped with the build, which is what the
 * site shows today. The database only ever supplies an override.
 */

export type ImageSlot = {
  /** Stable key. Stored in the database; never change one after launch. */
  key: string;
  /** What Chris sees in Backstage. */
  label: string;
  /** Where it appears, in his words, so the right picture goes in. */
  where: string;
  /** What makes a good photo for this spot. */
  guidance: string;
  /** The file that ships with the build, used until something is uploaded. */
  fallback: string;
  /** Natural size of the fallback — also the aspect the slot is designed for. */
  w: number;
  h: number;
  /** Cut-out slots need a real alpha channel; a JPG arrives in a white box. */
  needsTransparency?: boolean;
};

export type SiteImage = {
  slot: string;
  url: string;
  w: number | null;
  h: number | null;
};

/**
 * The slots, grouped by the page they live on. Order here is the order in
 * Backstage, so keep each page's slots together and lead with the one someone
 * is most likely to want to change.
 */
export const IMAGE_SLOTS: { group: string; slots: ImageSlot[] }[] = [
  {
    group: "About Chris",
    slots: [
      {
        key: "about-portrait",
        label: "Chris, beside his story",
        where: "The cut-out standing next to the long write-up, halfway down /about",
        guidance:
          "A cut-out with a transparent background, standing or seated, roughly head to waist. Portrait shape. It sits on a dark panel, so anything with a white box around it will show the box.",
        fallback: "/brand/chris-portrait.png",
        w: 1080,
        h: 1200,
        needsTransparency: true,
      },
      {
        key: "about-hero",
        label: "The banner at the top of About",
        where: "The wide photograph behind the page title on /about",
        guidance:
          "This one is cropped to a wide band, so the middle of the photo is what survives — keep Chris off-centre and leave room for the title over him. Portrait or landscape both work.",
        fallback: "/brand/chris-red.jpg",
        w: 2400,
        h: 3599,
      },
      {
        key: "about-booking",
        label: "Chris on stage, in the booking block",
        where: "Next to 'Get Chris in the room' at the bottom of /about",
        guidance: "Landscape, mid-talk, crowd or stage visible. This one sells the speaking.",
        fallback: "/brand/chris-stage.jpg",
        w: 1600,
        h: 1067,
      },
    ],
  },
  {
    group: "The Movement",
    slots: [
      {
        key: "movement-shot-1",
        label: "Last year, first photo",
        where: "The left-hand picture in the 'Last year' row on /movement",
        guidance: "Landscape. The room full, from the back or the side — scale is the point.",
        fallback: "/brand/adc-stage-crowd.jpg",
        w: 1800,
        h: 1200,
      },
      {
        key: "movement-shot-2",
        label: "Last year, middle photo",
        where: "The middle picture in the 'Last year' row on /movement",
        guidance: "Landscape. A session or a panel in progress.",
        fallback: "/brand/adc-panel.jpg",
        w: 1600,
        h: 1067,
      },
      {
        key: "movement-shot-3",
        label: "Last year, right photo",
        where: "The right-hand picture in the 'Last year' row on /movement",
        guidance: "Landscape. Something human — the audience, a reaction, somebody filming.",
        fallback: "/brand/adc-phone.jpg",
        w: 1600,
        h: 1067,
      },
    ],
  },
];

/** Flat list, for lookups. */
export const ALL_SLOTS: ImageSlot[] = IMAGE_SLOTS.flatMap((g) => g.slots);

/**
 * Resolve a slot to the image the page should render.
 *
 * Takes the overrides already loaded by the page, so a component never
 * triggers its own database round trip. Falls back to the shipped file, which
 * means a missing table, an empty table or an unknown key all degrade to the
 * picture that is on the site today rather than to a hole in the layout.
 */
export function pickImage(
  overrides: Record<string, SiteImage>,
  key: string
): { src: string; width: number; height: number } {
  const slot = ALL_SLOTS.find((s) => s.key === key);
  const over = overrides[key];

  if (over?.url) {
    return {
      src: over.url,
      // A replacement at a different aspect would letterbox against the
      // slot's declared shape, so the stored size wins when we have it.
      width: over.w ?? slot?.w ?? 1200,
      height: over.h ?? slot?.h ?? 1200,
    };
  }
  return {
    src: slot?.fallback ?? "/brand/hero-plate.jpg",
    width: slot?.w ?? 1200,
    height: slot?.h ?? 1200,
  };
}
