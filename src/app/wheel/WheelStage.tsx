"use client";

import { useEffect, useRef } from "react";
import { initWheel } from "./wheelEngine";
import "./wheel.css";

const LOGO = "/brand/mortgagepunk-logo@3x.png";

/**
 * The markup the wheel engine drives. The ids are the engine's contract:
 * rename one here and the engine stops finding it.
 *
 * Names typed here stay in this browser (localStorage). Nothing is sent
 * anywhere, so a list of entrants never leaves the laptop running the draw.
 */
export default function WheelStage() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    // React runs effects twice in development; the engine must only wire once.
    if (!el || el.dataset.live) return;
    el.dataset.live = "1";
    const stop = initWheel(el);
    return () => { stop(); delete el.dataset.live; };
  }, []);

  return (
    <div className="mpw" ref={root}>
      <div className="fx fx-ice" />
      <div className="fx fx-aurora" />
      <div className="fx fx-beams" />
      <div className="fx fx-cracks" />
      <div className="fx fx-frost" />
      <div className="fx snow" id="snow" />
      <div className="fx fx-vignette" />
      <canvas id="bolts" />

      <div className="page">
        <main>
          <aside>
            <div className="lockup">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO} alt="Mortgage Punk" />
            </div>
            <div>
              <p className="kicker">Live drawing <b>//</b> Mortgage Punk</p>
              <h1><span className="icy">Spin for the</span><br /><span className="hot">winner</span></h1>
            </div>

            <div className="panel edit">
              <label htmlFor="names">Names on the wheel <span id="count">0</span></label>
              <textarea id="names" spellCheck={false} placeholder="Paste names here, one per line" />
              <p className="dupes" id="dupes" />
            </div>

            <div className="btns">
              <button className="btn btn-go" id="spinBtn">Spin the wheel</button>
              <button className="btn edit" id="shuffleBtn">Shuffle</button>
              <button className="btn edit" id="clearBtn">Clear</button>
              <button className="btn" id="stageBtn">Stage mode</button>
              <button className="btn" id="fsBtn">Full screen</button>
            </div>

            <div className="panel drawn">
              <h2>Drawn so far</h2>
              <ol id="drawnList" />
              <p className="empty" id="drawnEmpty">No winners yet. Hit spin.</p>
            </div>
          </aside>

          <div className="stageWrap">
            <div className="stage" id="stage">
              <div className="halo" />
              <svg className="pointer" id="pointer" viewBox="0 0 60 100" aria-hidden="true">
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF8A90" /><stop offset=".45" stopColor="#EB2933" /><stop offset="1" stopColor="#B81F27" />
                  </linearGradient>
                </defs>
                <path d="M37 2 L6 56 L28 56 L19 98 L56 38 L33 38 L45 2 Z" fill="url(#bg)" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
              </svg>
              <canvas id="wheel" aria-label="Name wheel" />
              <button className="puck" id="puck" aria-label="Spin the wheel"><span>SPIN</span></button>
            </div>
          </div>
        </main>

        <div className="marquee" aria-hidden="true"><div className="track" id="track" /></div>
      </div>

      <div id="flash" />
      <div id="goal" />
      <div id="goalEdge" />
      <div id="win" role="dialog" aria-modal="true" aria-labelledby="winName">
        <div className="card">
          <div className="mini">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="" />
          </div>
          <p className="kicker">We have a winner</p>
          <div id="winName" className="icy" />
          <div className="bar" />
          <div className="btns">
            <button className="btn btn-go" id="removeBtn">Remove and spin again</button>
            <button className="btn" id="keepBtn">Keep on wheel</button>
            <button className="btn" id="closeBtn">Remove and close</button>
          </div>
        </div>
      </div>
      <canvas id="confetti" />
    </div>
  );
}
