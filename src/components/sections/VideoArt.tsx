"use client";

import { useState } from "react";
import { thumbnail, thumbnailLarge } from "@/lib/library";

/**
 * The artwork inside a video card.
 *
 * WHY THIS IS A CLIENT COMPONENT for what is otherwise a plain <img>.
 * The feature slot runs the full width of the screen, and hqdefault.jpg is
 * 480x360 — soft past about 900px and carrying letterbox bars baked into the
 * pixels. maxresdefault.jpg is 1280x720 and true 16:9, but YouTube only
 * generates it for uploads that had a high-resolution source, so it 404s on
 * some videos with no way to know in advance. onError is the only reliable
 * way to find out, and onError needs a client boundary.
 *
 * The cards below the feature stay on hqdefault: they render at roughly
 * 400px square, where the larger file buys nothing and costs load time.
 *
 * `fell` guards the fallback so a second failure cannot loop the handler.
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
  const [fell, setFell] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={feature ? "eager" : "lazy"}
      onError={() => {
        if (!fell && youtubeId) {
          setFell(true);
          setSrc(thumbnail(youtubeId));
        }
      }}
    />
  );
}
