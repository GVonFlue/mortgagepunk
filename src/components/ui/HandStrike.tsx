/**
 * A hand-drawn strike/underline rule.
 *
 * Deliberately irregular: the ribbon is drawn as a filled path whose top and
 * bottom edges wander independently, so the stroke thickens and thins the way
 * a marker does. It stretches to the width of whatever it sits under
 * (preserveAspectRatio="none"), which is what lets it track a headline whose
 * width changes with the viewport.
 */
export default function HandStrike({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 11"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M1.2 6.1C34 3.3 61 7.4 95 5.2c33-2.1 60-4.3 92-2.6 30 1.6 58 4.4 89 1.1l22.6-2.2.9 3.3-22.3 2.4c-32 3.4-61 .6-91-1-31-1.6-57 .5-89 2.6C63 11.1 35 6.9 1.6 9.6z"
      />
    </svg>
  );
}
