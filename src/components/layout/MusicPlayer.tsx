"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import m from "./MusicPlayer.module.css";

/**
 * "Vivid Color" by Refuge, Chris's band, playing under the site, with a
 * pause button beside the chat launcher.
 *
 * WHY IT CAN'T ALWAYS START ON THE FIRST SCROLL. Every browser blocks sound
 * until the visitor has interacted with the page, and a scroll doesn't count:
 * not a mouse wheel, not a finger swipe on an iPhone. A click, a tap or a key
 * press does. So:
 *
 *   1. On the first real scroll it tries to play. That works if they have
 *      already clicked or tapped anything on the page.
 *   2. If the browser says no, it waits for the first click, tap or key press
 *      anywhere and starts then. Meanwhile the button pulses a speaker so it
 *      is obvious there is sound to turn on.
 *
 * PAUSE IS REMEMBERED. Someone who pauses it has said no, so it never starts
 * by itself again for them: not on the next page, not on their next visit.
 * Pressing play again clears that.
 *
 * IT STOPS FOR VIDEOS. A Game of Money video playing over a rock song is
 * nobody's idea of a good time, so VideoPlay announces itself and the song
 * pauses. And the tap that starts a video is never the tap that starts the
 * song (data-no-music on the video buttons).
 *
 * MOUNTED IN THE ROOT LAYOUT, like the chat launcher, so moving between pages
 * inside the site doesn't restart the song. Not in Backstage.
 */

const SRC = "/audio/vivid-color.mp3";
const KEY = "mp-music";
const VOLUME = 0.55;

type State = "idle" | "waiting" | "playing" | "paused";

function readPref(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function writePref(v: "on" | "off") {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
}

export default function MusicPlayer() {
  const pathname = usePathname();
  const inBackstage = pathname?.startsWith("/backstage") ?? false;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<State>("idle");
  const stateRef = useRef<State>("idle");
  const set = (s: State) => {
    stateRef.current = s;
    setState(s);
  };

  function el() {
    if (!audio.current) {
      const a = new Audio();
      a.src = SRC;
      a.loop = true;
      a.preload = "auto";
      a.volume = 0;
      audio.current = a;
    }
    return audio.current;
  }

  // Ease in rather than blast. (iOS ignores volume, so there it is simply on.)
  function fadeIn(a: HTMLAudioElement) {
    a.volume = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1600);
      a.volume = VOLUME * k;
      if (k < 1 && !a.paused) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  async function tryPlay(): Promise<boolean> {
    const a = el();
    try {
      await a.play();
      fadeIn(a);
      set("playing");
      return true;
    } catch {
      return false;
    }
  }

  function pause(remember: boolean) {
    audio.current?.pause();
    set("paused");
    if (remember) writePref("off");
  }

  // Auto-start, once per page load, unless they've said no before.
  useEffect(() => {
    if (inBackstage) return;
    if (readPref() === "off") {
      set("paused");
      return;
    }

    let armed = true;
    const onGesture = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.("[data-no-music]")) return; // a video, or our own button
      cleanupGesture();
      if (stateRef.current === "waiting") void tryPlay();
    };
    const gestureEvents = ["pointerdown", "keydown", "touchend"] as const;
    const cleanupGesture = () =>
      gestureEvents.forEach((ev) => window.removeEventListener(ev, onGesture, true));

    const onScroll = async () => {
      if (!armed || window.scrollY < 40) return;
      armed = false;
      window.removeEventListener("scroll", onScroll);
      if (stateRef.current !== "idle") return;
      if (!(await tryPlay())) {
        set("waiting");
        gestureEvents.forEach((ev) => window.addEventListener(ev, onGesture, true));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanupGesture();
    };
    // Once per mount: the player lives in the root layout, so this is once
    // per page load, not once per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A video started: the song steps aside (without marking it as a "no").
  useEffect(() => {
    const onMedia = () => {
      if (stateRef.current === "playing" || stateRef.current === "waiting") pause(false);
    };
    window.addEventListener("mp:media-play", onMedia);
    return () => window.removeEventListener("mp:media-play", onMedia);
  }, []);

  // Leaving for Backstage stops it.
  useEffect(() => {
    if (inBackstage && stateRef.current === "playing") pause(false);
  }, [inBackstage]);

  if (inBackstage) return null;

  const playing = state === "playing";
  const label = playing ? "Pause the music" : "Play the music";

  return (
    <>
      <button
        type="button"
        data-no-music=""
        className={`${m.btn} ${state === "waiting" ? m.waiting : ""} ${playing ? m.on : ""}`}
        aria-label={`${label}: Vivid Color by Refuge`}
        aria-pressed={playing}
        onClick={async () => {
          if (playing) {
            pause(true);
          } else if (await tryPlay()) {
            writePref("on");
          }
        }}
      >
        {/* Playing shows a plain pause sign, because that is what it does
            when pressed. Two small rings pulse out behind it so it reads as
            "this is the sound you hear". */}
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={m.fill}>
            <rect x="6.5" y="5" width="4" height="14" rx="1" />
            <rect x="13.5" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" />
            <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
          </svg>
        )}
      </button>
      <span className={m.label} aria-hidden="true">
        {playing ? "Pause · Vivid Color, Refuge" : state === "waiting" ? "Tap for sound" : "Play · Vivid Color, Refuge"}
      </span>
    </>
  );
}
