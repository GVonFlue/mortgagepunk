"use client";

import { useState } from "react";
import VideoArt from "./VideoArt";
import v from "./VideoPlay.module.css";

/**
 * A YouTube video that plays where it sits.
 *
 * Every video surface on the site goes through this: the homepage feature and
 * album row, the library teaser, /library and /library/[topic]. Before it,
 * each one was an <a> to youtube.com, which handed the visitor to a different
 * site mid-session and lost them to the recommendation sidebar.
 *
 * THE FACADE. Nothing is loaded from YouTube until somebody clicks. A page
 * with a dozen videos on it would otherwise mount a dozen iframes, each
 * pulling roughly a megabyte of player and setting cookies before anyone has
 * shown any interest. Until the click this is a still image and a button.
 * After it, it is youtube-nocookie with autoplay, so the click that revealed
 * the player is also the click that starts it — one action, not two.
 *
 * THE CALLER OWNS THE LOOK. `frameClassName` and `playClassName` come from
 * whichever stylesheet is using this, so the homepage keeps its record-shelf
 * treatment and the library keeps its grayscale-until-hover cards from one
 * component. This file only supplies the button reset and the iframe fill.
 *
 * The frame class goes on an inner span, never on the <button> itself. Both
 * are single-class selectors, so if they shared an element whichever landed
 * later in the bundle would win and the button reset could quietly strip a
 * border the caller wanted. A transparent shell around a styled box has no
 * such argument to lose.
 */
export default function VideoPlay({
  youtubeId,
  title,
  feature = false,
  frameClassName = "",
  playClassName = "",
}: {
  youtubeId?: string | null;
  title: string;
  /** Pulls the 1280x720 thumbnail instead of the 480px one. */
  feature?: boolean;
  frameClassName?: string;
  playClassName?: string;
}) {
  const [playing, setPlaying] = useState(false);

  // No video attached yet — a placeholder frame, not something to click.
  if (!youtubeId) {
    return (
      <span className={`${v.box} ${frameClassName}`}>
        <VideoArt youtubeId={null} feature={feature} />
      </span>
    );
  }

  if (playing) {
    return (
      <div className={`${v.box} ${frameClassName}`}>
        <iframe
          className={v.frame}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={v.btn}
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
    >
      <span className={`${v.box} ${frameClassName}`}>
        <VideoArt youtubeId={youtubeId} feature={feature} />
        <span className={playClassName} aria-hidden="true" />
      </span>
    </button>
  );
}
