/**
 * Brand asset paths.
 *
 * Everything under public/brand/ is referenced through this module so that
 * swapping an asset is a single-line edit in one known place.
 */

/**
 * The hero cutout. Chris decides between the black-and-white/red treatment and
 * the full-colour treatment on 2026-09-11 — switching is this one line.
 *
 *   bwred -> "/brand/chris-hero-bwred.png"   (current)
 *   color -> "/brand/chris-hero-color.png"
 *
 * Both files are 879x1116 with a real alpha channel, so nothing else in the
 * hero needs to change: the intrinsic dimensions below stay correct either way.
 */
export const HERO_PORTRAIT = "/brand/chris-hero-bwred.png";

/** Intrinsic pixel dimensions of both hero cutouts. */
export const HERO_PORTRAIT_SIZE = { width: 879, height: 1116 } as const;

/** Full-bleed background plate behind the hero. */
export const HERO_PLATE = "/brand/hero-plate.jpg";

/**
 * The only logo raster that exists. There is no 1x. Its source is a 403px
 * raster upscaled 3x, so it must not render above ~400px wide and should be
 * replaced with an SVG before go-live. See ENGINEERING.md.
 */
export const LOGO = "/brand/mortgagepunk-logo@3x.png";
