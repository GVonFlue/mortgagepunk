"use client";

import { useState } from "react";
import { thumbnail, thumbnailSd, thumbnailLarge } from "@/lib/library";

/**
 * The artwork inside a video card.
 *
 * WHY THIS IS A CLIENT COMPONENT for what is otherwise a plain <img>.
 * The feature slot runs the full width of the screen, and hqdefault.jpg is
 * 480x360 — soft past about 900px and carrying letterbox bars baked into the
 * pixels. maxresdefault.jpg is 1280x720 and true 16:9, but YouTube only
 * generates it for uploads that had a high-resolution source.
 *
 * A MISSING maxresdefault DOES NOT 404. YouTube answers 200 with a 120x90
 * grey placeholder — the one with the little play glyph on it — so onError
 * never fires and the browser happily stretches 120 pixels across the entire
 * feature. That is what put a blurred grey box at the top of the Game of
 * Money wall. The only honest test is the decoded width after it loads, which
 * is why this needs a client boundary and an onLoad rather than an onError.
 *
 * The step-down is maxres -> sd -> hq. sddefault is 640x480 and always
 * generated; it carries the same baked-in letterbox bars as hqdefault, but
 * the feature frame is 16:9 with object-fit:cover, which crops exactly those
 * bars off. The cards below stay on hqdefault, where at roughly 400px square
 * anything larger buys nothing and costs load time.
 */
export default function VideoArt({
  youtubeId,
  feature = false,
}: {
  youtubeId?: string | null;
  feature?: boolean;
}) {
  const initial = youtubeId
    ? feature
      ? thumbnailLarge(youtubeId)
      : thumbnail(youtubeId)
    : "/brand/hero-plate.jpg";

  const [src, setSrc] = useState(initial);
  /** How far down the maxres -> sd -> hq chain we have stepped. */
  const [step, setStep] = useState(0);

  function stepDown() {
    if (!youtubeId || !feature) return;
    if (step === 0) { setStep(1); setSrc(thumbnailSd(youtubeId)); }
    else if (step === 1) { setStep(2); setSrc(thumbnail(youtubeId)); }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={feature ? "eager" : "lazy"}
      onLoad={(e) => {
        // YouTube's "no such size" placeholder is 120x90 and arrives with a
        // 200, so size is the only thing that distinguishes it from a real
        // thumbnail. Anything this small is never a genuine one.
        if (e.currentTarget.naturalWidth > 0 && e.currentTarget.naturalWidth <= 121) {
          stepDown();
        }
      }}
      onError={() => stepDown()}
    />
  );
}
