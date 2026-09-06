import ChatStage from "../chat/ChatStage";
import s from "../Site.module.css";
import Statement, { Kicker, Punch } from "../brand/Statement";

/**
 * The assistant, inline on the homepage.
 *
 * The floating launcher catches people who already have a question. This
 * catches the ones who don't know they can ask — and it sits directly after
 * the tools, where somebody has just run their numbers and now has exactly
 * one follow-up. That is the warmest moment on the page, and the capture card
 * inside the stage is what turns it into a lead.
 */
export default function AskSection() {
  return (
    <section className={`${s.sec} ${s.dark}`} aria-label="Ask a question">
      <div className={s.wrap}>
        <div className={s.kick}>Ask anything</div>
        <h2 className={s.h2}>
          No dumb questions.
          <br />
          <em>Only expensive silence.</em>
        </h2>
        <p className={s.lede}>
          Most people don&rsquo;t ask because they think they should already
          know. Ask here instead — it answers straight, any hour, and hands you
          to a person the moment that&rsquo;s more useful.
        </p>

        <div style={{ marginTop: "clamp(26px,3vw,44px)" }}>
          <ChatStage variant="inline" />
        </div>
      </div>
    </section>
  );
}
