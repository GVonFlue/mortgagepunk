"use client";

import { useEffect, useRef, useState } from "react";
import { thumbnail, thumbnailSd, thumbnailLarge } from "@/lib/library";

/**
 * The artwork inside a video card.
 *
 * WHY THIS IS A CLIENT COMPONENT for what is otherwise a plain <img>: two
 * things about YouTube's thumbnails can only be discovered after one loads.
 *
 * 1. A MISSING maxresdefault DOES NOT 404. YouTube answers 200 with a 120x90
 *    grey placeholder — the one with the little play glyph — so onError never
 *    fires and the browser stretches 120 pixels across the whole feature. The
 *    only honest test is the decoded width, which needs onLoad. The step-down
 *    is maxres -> sd -> hq.
 *
 * 2. THE BLACK BARS ARE IN THE FILE, NOT IN OUR LAYOUT. hqdefault is always
 *    480x360 and sddefault always 640x480 — both 4:3 — while the videos are
 *    16:9, so YouTube pads them with real black pixels above and below the
 *    picture. In the 16:9 feature that is harmless: object-fit:cover crops
 *    exactly the padding away. In the SQUARE cards it is not, because cover
 *    crops the sides and keeps the full height, bars and all. That is the
 *    black band at the top and bottom of every card.
 *
 *    So a 4:3 source in a square card is scaled to 133.333% height and
 *    centred: the picture is 75% of the file's height, 0.75 x 1.3333 = 1, so
 *    the padding lands exactly outside the box and the picture exactly fills
 *    it. maxresdefault is true 16:9 with no padding and must NOT be treated
 *    this way, which is why the class is decided by which variant actually
 *    loaded rather than set once.
 */

/** Which variants carry baked-in letterbox padding. */
type Variant = "maxres" | "sd" | "hq" | "none";

export default function VideoArt({
  youtubeId,
  feature = false,
}: {
  youtubeId?: string | null;
  feature?: boolean;
}) {
  /* Cards ask for maxres too, not hq. A square crop of hq uses only 270 of
     its 480 pixels once the padding is gone, which is softer than the tile it
     has to fill; maxres gives 720 and falls back when it does not exist. */
  const initial = youtubeId ? thumbnailLarge(youtubeId) : "/brand/hero-plate.jpg";

  const [src, setSrc] = useState(initial);
  const [variant, setVariant] = useState<Variant>(youtubeId ? "maxres" : "none");
  const el = useRef<HTMLImageElement>(null);

  function stepDown() {
    if (!youtubeId) return;
    if (variant === "maxres") {
      setVariant("sd");
      setSrc(thumbnailSd(youtubeId));
    } else if (variant === "sd") {
      setVariant("hq");
      setSrc(thumbnail(youtubeId));
    }
  }

  /* onLoad IS NOT ENOUGH ON ITS OWN, and this is the bug that made the fix
     look like it worked for one person and not another. The <img> is server
     rendered with its src already set, so on a repeat visit the browser has
     the file in cache and finishes loading it BEFORE React hydrates and
     attaches the handler. onLoad then never fires, the 120x90 placeholder is
     never detected, and it stays stretched across the feature — on a cold
     cache the same code works perfectly. Checking `complete` once on mount
     covers the already-loaded case; onLoad covers the rest. */
  useEffect(() => {
    const img = el.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0 && img.naturalWidth <= 121) stepDown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /* Only a 4:3 source in a square box needs the padding cropped out.
     133.333% of the box height, pulled up by half the overflow: the picture
     is 75% of the file, and 0.75 x 1.3333 = 1, so it fills the box exactly
     and the padding falls outside both edges. */
  const padded = !feature && (variant === "sd" || variant === "hq");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={el}
      /* INLINE, AND THAT IS DELIBERATE. The callers style this element
         directly — MoneyWall has `.art img{width:100%;height:100%;object-fit:
         cover}` — and a class on the <img> loses to that on specificity, so
         the crop would silently do nothing depending on bundle order. An
         inline style beats any stylesheet rule without needing !important.
         transform is left out on purpose so the cards' hover zoom still
         composes on top of this. */
      style={
        padded
          ? {
              position: "absolute",
              left: 0,
              top: "-16.6665%",
              width: "100%",
              height: "133.333%",
              maxWidth: "none",
              objectFit: "cover",
            }
          : undefined
      }
      src={src}
      alt=""
      loading={feature ? "eager" : "lazy"}
      onLoad={(e) => {
        // YouTube's "no such size" placeholder is 120x90 and arrives with a
        // 200, so size is the only thing that separates it from a real
        // thumbnail. Nothing this small is ever a genuine one.
        if (e.currentTarget.naturalWidth > 0 && e.currentTarget.naturalWidth <= 121) {
          stepDown();
        }
      }}
      onError={() => stepDown()}
    />
  );
}
