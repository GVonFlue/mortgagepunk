import a from "../sections/About.module.css";

/**
 * A marked slot for photography that hasn't been supplied yet.
 *
 * Styled to read as an intentional frame during a client walkthrough rather
 * than as a broken image. When the real photo arrives, swap this for a
 * next/image with the same className — the sizing lives on the wrapper class,
 * so the layout does not move.
 */
export default function PhotoSlot({
  label,
  hint,
  className = "",
}: {
  label: string;
  hint: string;
  className?: string;
}) {
  return (
    <div className={`${a.slot} ${className}`}>
      <svg className={a.slotIcon} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <circle cx="8" cy="10" r="1.8" />
        <path d="m3.5 17.5 5-5 4 4 3-2.5 5 4" />
      </svg>
      <span className={a.slotLabel}>{label}</span>
      <span className={a.slotHint}>{hint}</span>
    </div>
  );
}
