import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

// ─── Premium Typography Stack ─────────────────────────────────────────────────
// Loaded ONCE here and applied at the root layout. Previously every section
// component (Banner, About, Contact, Projects, Skills) re-imported and
// re-instantiated these same three Google Fonts, which meant next/font was
// generating a separate CSS module + JS wrapper for each component's chunk
// instead of one shared instance. That duplication was inflating both the
// render-blocking CSS and the unused-JS in several page chunks. The CSS
// variables set here (--font-instrument-serif, --font-inter,
// --font-jetbrains-mono) are inherited by every descendant, so components
// just reference var(--font-...) directly — no local import needed.

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
