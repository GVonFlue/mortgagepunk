import s from "./Statement.module.css";

/**
 * THE SIZE-JUMP HEADLINE.
 *
 * This is the move that makes his posters read as his. Look at any of them:
 *
 *   THE AMERICAN DREAM        huge
 *   was never about having it all   small
 *   FREEDOM.                  enormous, red
 *   to build a life on your own terms   small
 *
 * One sentence, four size changes. The emphasis lives in SCALE, not colour —
 * red is used sparingly on the one word that carries the thought. The version
 * of this site built before we had his assets used a flat two-tone heading,
 * white then red, at one size. That is what read as boxy.
 *
 * Sizes are a scale, not arbitrary numbers, so a page can't drift: xs through
 * xl, each roughly 1.7x the last. Every line is condensed uppercase, because
 * nothing in his work is set in sentence case except long-form prose.
 */

export type Line = {
  t: string;
  /** xs and sm are the quiet connective lines; lg and xl carry the thought. */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: "bone" | "red" | "ink";
};

export default function Statement({
  lines,
  align = "left",
  as: Tag = "h2",
  /** Set on light panels: the grunge texture punches to white there and
   *  reads as damage rather than print. */
  onLight = false,
  className = "",
}: {
  lines: Line[];
  align?: "left" | "center";
  as?: "h1" | "h2" | "p" | "div";
  onLight?: boolean;
  className?: string;
}) {
  const tone = { bone: s.toneBone, red: s.toneRed, ink: s.toneInk };
  return (
    <Tag
      className={`${s.stmt} ${align === "center" ? s.center : ""} ${
        onLight ? s.onLight : ""
      } ${className}`}
    >
      {lines.map((l, i) => (
        <span
          key={i}
          className={`${s.line} ${s[l.size ?? "md"]} ${tone[l.tone ?? "bone"]}`}
        >
          {l.t}
        </span>
      ))}
    </Tag>
  );
}

/** Short body copy, condensed uppercase, the way his cards set it. */
export function Punch({
  children,
  onLight = false,
}: {
  children: React.ReactNode;
  onLight?: boolean;
}) {
  return <p className={`${s.punch} ${onLight ? s.punchLight : ""}`}>{children}</p>;
}

/** The hand-drawn red rule he uses under a kicker and above an attribution. */
export function BrushRule({ width = 300 }: { width?: number }) {
  return <span className={s.brush} style={{ maxWidth: width }} aria-hidden="true" />;
}

/** Small condensed label. Replaces the dash-prefixed kicker. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className={s.kicker}>
      {children}
      <BrushRule width={170} />
    </span>
  );
}

/** Attribution: red rule, then the name letterspaced. */
export function Attrib({ children }: { children: React.ReactNode }) {
  return (
    <span className={s.attrib}>
      <BrushRule width={220} />
      <em>{children}</em>
    </span>
  );
}
