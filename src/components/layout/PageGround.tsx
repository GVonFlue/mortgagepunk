import s from "./PageGround.module.css";

/**
 * The fixed concrete the whole page floats over.
 *
 * WHY A FIXED-POSITION DIV AND NOT `background-attachment: fixed`:
 * that property is unreliable on iOS Safari — it janks while scrolling or
 * silently falls back to scrolling with the page, which is the one behaviour
 * this entire idea depends on not happening. A position:fixed layer behind the
 * content gives the identical effect and actually works on a phone.
 *
 * Rendered once per page rather than per section, so the whole scroll costs a
 * single image.
 */
export default function PageGround() {
  return <div className={s.ground} aria-hidden="true" />;
}
