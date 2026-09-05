/** Right arrow used on the hero CTAs. Slides on hover; the motion lives with
 *  the button that owns it, in Hero.module.css. */
export default function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 5h21M17.2 1 21.6 5l-4.4 4"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
