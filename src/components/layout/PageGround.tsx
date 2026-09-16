import s from "./PageGround.module.css";

/**
 * The fixed ground the whole page floats over.
 *
 * WHY THIS IS A FIXED-POSITION DIV AND NOT `background-attachment: fixed`:
 * that CSS property is unreliable on iOS Safari — it either janks badly while
 * scrolling or silently falls back to scrolling with the page, which is the one
 * behaviour this entire idea depends on not happening. A `position: fixed`
 * layer behind the content gives the identical effect and actually works on a
 * phone.
 *
 * The image is the skate bowl from Chris's own shoot, desaturated almost to
 * grey and darkened hard. Two reasons: the brand red has to stay the only real
 * colour on the page, and every section sitting on top needs its copy to be
 * readable regardless of which part of the photograph happens to be behind it.
 *
 * Rendered once in the layout of the page rather than per section, so it costs
 * one image for the whole scroll.
 */
export default function PageGround() {
  return <div className={s.ground} aria-hidden="true" />;
}
