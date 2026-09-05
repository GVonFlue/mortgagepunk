import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is configured CSS-first; src/app/globals.css is the source of
 * truth for every token. This file mirrors those tokens by reference so that
 * anything reading a JS config (editor tooling, plugins, design-token export)
 * sees the same set. It deliberately restates no literal values except the
 * font stacks' fallbacks — change a token in globals.css, not here.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "mp-red": "var(--mp-red)",
        "mp-red-deep": "var(--mp-red-deep)",
        "mp-black": "var(--mp-black)",
        "mp-ink": "var(--mp-ink)",
        "mp-concrete": "var(--mp-concrete)",
        "mp-bone": "var(--mp-bone)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "Haettenschweiler", "sans-serif"],
        "display-alt": ["var(--font-display-alt)", "Arial Black", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["var(--mp-hero-size)", { lineHeight: "var(--mp-display-leading)" }],
        body: ["var(--mp-body-size)", { lineHeight: "var(--mp-body-leading)" }],
      },
      letterSpacing: {
        display: "var(--mp-display-tracking)",
      },
      lineHeight: {
        display: "var(--mp-display-leading)",
      },
      transitionTimingFunction: {
        "out-heavy": "var(--ease-out-heavy)",
        "in-heavy": "var(--ease-in-heavy)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
