import s from "./CompStage.module.css";

/**
 * The hero, as the approved mockup with working buttons on top.
 *
 * Replaces the typeset Hero component for now. That one built the headline
 * out of live text, which is better in every way that matters long term —
 * it is real text, it reflows, it is editable from Backstage, and it is
 * sharp at any size. It also does not look like the comp, and the comp is
 * what has to ship.
 *
 * The old Hero is untouched on disk. Restoring it is a one-line swap in
 * page.tsx, which is deliberate: this is a stopgap and should be easy to
 * reverse the moment the real assets exist. See CompStage.module.css for
 * what that costs in the meantime.
 *
 * The navigation was cropped off the image before export — the site's own
 * sticky nav sits above this and two navs would be absurd.
 */
export default function CompHero() {
  return (
    <section className={s.stage + " " + s.hero} aria-label="Reimagining the American Dream">
      {/* The headline is inside the image, so the page needs a real h1
          somewhere for screen readers and for search. */}
      <h1 className={s.srOnly}>
        Reimagining the American Dream. Chris Waipa, loan officer, leading a
        movement and building a world-class lending team.
      </h1>

      {/* The v2 design has no buttons in the hero body — Get Approved moved
          into the navigation. What is left is a hand-drawn "Have questions?
          Let's go!" with an arrow pointing down at the Ask section, so that
          prompt is the one thing here worth clicking. */}
      <a
        href="#ask"
        className={`${s.hot} ${s.heroAsk}`}
        aria-label="Have questions? Jump to Ask Mortgage Punk"
      />

    </section>
  );
}
