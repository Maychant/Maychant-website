/* The landing page initializes its legacy script on document load; use full navigation until that initializer is lifecycle-aware. */
/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import Image from "next/image";
import { Arrow, BrandLogo } from "@/components/brand/primitives";
import { ColorSwatch, ComponentLab, GlassDemo, MotionDemo, PathwayDemo } from "./playground";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Maychant — Design system",
  description: "The visual foundations, reusable components and interaction principles behind Maychant.",
  robots: { index: false, follow: false },
};

const sections = ["Identity", "Color", "Typography", "Layout & surfaces", "Components", "Patterns", "Motion", "Voice & access"];
const colors = [
  { name: "Maychant blue", hex: "#1557ff", token: "--mc-blue", note: "Primary actions · emphasis", dark: true },
  { name: "Navy ink", hex: "#101e42", token: "--mc-navy", note: "Headlines · wordmark · depth", dark: true },
  { name: "White", hex: "#FFFFFF", token: "--mc-white", note: "Space to breathe", dark: false },
  { name: "Cloud", hex: "#F3F5F8", token: "--mc-cloud", note: "Quiet surfaces", dark: false },
  { name: "Cyan", hex: "#11B5E4", token: "--mc-cyan", note: "Illustration · motion accents", dark: false },
  { name: "Deep teal", hex: "#034748", token: "--mc-teal", note: "Supporting illustration", dark: true },
];

function SectionTitle({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return <div className="ds-section-heading"><span className="ds-index">0{n}</span><div><h2>{title}</h2><p>{children}</p></div></div>;
}

export default function DesignSystem() {
  return <div className="ds-page">
    <a className="skip-link" href="#system-main">Skip to design system</a>
    <header className="ds-topbar"><a className="ds-wordmark" href="/" aria-label="Maychant home"><BrandLogo /></a><span className="ds-topbar-label">Design system <span>/ 01</span></span><a className="ds-site-link" href="/">View the site <Arrow /></a></header>
    <div className="ds-shell">
      <aside className="ds-sidebar"><p className="ds-kicker">The working guide</p><nav aria-label="Design system sections">{sections.map((name, i) => <a href={`#system-${i + 1}`} key={name}><span>0{i + 1}</span>{name}</a>)}</nav><a className="ds-download" href="/brand/tokens.css" download>Download tokens <Arrow /></a><p className="ds-sidebar-note">One shared language.<br />Room for personality.</p></aside>
      <main id="system-main" className="ds-main">
        <section className="ds-cover" aria-labelledby="system-title"><div className="ds-cover-top"><span className="ds-kicker">Maychant / brand & interface</span><span className="ds-version">Version 1.0</span></div><h1 id="system-title">Good things,<br /><span>by design.</span></h1><div className="ds-cover-bottom"><p>A thoughtful system for the people buying a business, the people passing one on, and everything we build around them.</p><a href="#system-1" className="ds-start" aria-label="Explore the design system"><Arrow /></a></div><div className="ds-principles"><span>Human in tone.</span><span>Clear in purpose.</span><span>Full of possibility.</span></div></section>

        <section className="ds-section" id="system-1">
          <SectionTitle n={1} title="A familiar sign. A fresh start.">The storefront awning and the M belong together. Keep the identity recognizable, generous, and simple.</SectionTitle>
          <div className="ds-logo-board"><div className="ds-logo-clearspace"><BrandLogo className="ds-master-logo" /></div><div className="ds-board-caption"><span>The original outlined SVG</span><span>Awning + M + wordmark + blue full stop</span></div></div>
          <div className="ds-logo-variants"><div className="ds-logo-inverse"><BrandLogo inverse /><span>Full lockup / on dark</span></div><div><Image unoptimized src="/brand/maychant-symbol.svg" alt="Maychant storefront symbol" width="400" height="400" /><span>Symbol / compact spaces</span></div><div><Image unoptimized src="/brand/maychant-symbol-mono.svg" alt="Monochrome Maychant symbol" width="400" height="400" /><span>Single-color mark</span></div></div>
          <div className="ds-rule-grid"><div><h3>Give it breathing room.</h3><p>Reserve at least half the symbol’s height around the full lockup. Use 180px in desktop navigation and at least 132px on mobile. Use the symbol alone in smaller spaces.</p></div><div><h3>Let the artwork lead.</h3><p>Use the supplied vector master. Keep its proportions and outlined lettering intact. Never stretch, recolor individual pieces, or typeset a replacement wordmark.</p></div><div><h3>Keep it crisp.</h3><p>Use the full-color logo on white or light glass, the supplied reversed lockup on navy, and the isolated mark for small brand moments.</p></div></div>
          <div className="ds-logo-downloads"><a href="/brand/maychant-logo.svg" download>Download logo SVG <Arrow /></a><a href="/brand/maychant-logos.zip" download>Download all logo files <Arrow /></a></div>
        </section>

        <section className="ds-section" id="system-2">
          <SectionTitle n={2} title="Blue opens the door.">White and navy do most of the work. Blue leads to the next step. Cyan brings small moments of life.</SectionTitle>
          <div className="ds-palette">{colors.map(color => <ColorSwatch key={color.token} {...color} />)}</div>
          <div className="ds-color-guidance"><p><strong>Use color with a job.</strong> A blue action, navy text, a quiet background. Supporting illustration colors should never compete with the main action.</p><p><strong>Keep text readable.</strong> White on blue. Navy on cyan. Navy or slate on white. Cyan is an accent, not small text on a white page.</p></div>
          <div className="ds-semantic-row"><div><i className="ds-dot ds-dot-success" /><strong>Success</strong><code>#087B58</code><span>Saved or complete</span></div><div><i className="ds-dot ds-dot-error" /><strong>Error</strong><code>#B42318</code><span>What needs attention</span></div><div><i className="ds-dot ds-dot-warning" /><strong>Notice</strong><code>#885B12</code><span>Something to consider</span></div></div>
          <p className="ds-fineprint">Blue and navy match the original logo artwork exactly. Semantic green is darker than the decorative accent green so small status text stays readable.</p>
        </section>

        <section className="ds-section" id="system-3">
          <SectionTitle n={3} title="Character, without the noise.">Cabinet Grotesk. A single, self-hosted family with enough warmth for a story and enough clarity for a form.</SectionTitle>
          <div className="ds-type-feature"><div><span className="ds-kicker">Our typeface</span><p className="ds-aa">Aa<span>.</span></p><p className="ds-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 &?!</p></div><div className="ds-type-weights"><span style={{ fontWeight: 400 }}>Regular <small>400 / supporting copy</small></span><span style={{ fontWeight: 500 }}>Medium <small>500 / body & controls</small></span><span style={{ fontWeight: 700 }}>Bold <small>700 / headings & actions</small></span><span style={{ fontWeight: 800 }}>Extrabold <small>800 / hero emphasis</small></span></div></div>
          <div className="ds-type-scale"><div><code>Display / 48–96</code><p className="ds-sample-display">Something good.</p></div><div><code>Heading / 36–72</code><p className="ds-sample-heading">A next chapter.</p></div><div><code>Title / 28–44</code><p className="ds-sample-title">Built around people.</p></div><div><code>Body / 18</code><p className="ds-sample-body">There’s a whole life behind a small business. Give the story room to breathe.</p></div><div><code>Label / 14</code><p className="ds-sample-label">Your email address</p></div><div><code>Note / 12</code><p className="ds-sample-note">A first step, not a commitment.</p></div></div>
          <p className="ds-fineprint">Tight tracking for large headings, relaxed 1.55 line height for reading. Keep body copy near 60 characters per line. Use sentence case. Never shrink form input text below 16px.</p>
        </section>

        <section className="ds-section" id="system-4">
          <SectionTitle n={4} title="Room to feel at home.">A four-pixel spacing foundation, generous section breaks, and glass used where layers actually meet.</SectionTitle>
          <div className="ds-spacing">{[4,8,12,16,24,32,48,64,96].map((n) => <div key={n}><span style={{ height: n }} /><code>{n}</code></div>)}</div>
          <div className="ds-rule-grid"><div><h3>Space</h3><p>16–24px inside small groups. 32–48px between content groups. 64–120px between chapters of the page.</p></div><div><h3>Grid</h3><p>1380px maximum content width. Flexible gutters. One column on mobile; paired content expands into two columns where it fits.</p></div><div><h3>Shape</h3><p>10px fields. 24px panels and glass. 26px dialogs. Pill shapes are reserved for actions—not every surface.</p></div></div>
          <GlassDemo />
          <p className="ds-fineprint">Glass recipe: 28px backdrop blur, 165% saturation, a translucent fill, a fine inner edge, and a restrained navy shadow. Use an opaque fallback for reduced transparency or unsupported browsers.</p>
        </section>

        <section className="ds-section" id="system-5">
          <SectionTitle n={5} title="Every next step, considered.">Real components using the same styles as the site. Try the controls, tab through them, and open the sample dialog.</SectionTitle>
          <ComponentLab />
        </section>

        <section className="ds-section" id="system-6">
          <SectionTitle n={6} title="One story. Two perspectives.">The same visual language can hold different needs. Expand one pathway and the other gives it room.</SectionTitle>
          <PathwayDemo />
          <div className="ds-rule-grid"><div><h3>Illustration</h3><p>Authored vector artwork. Navy outlines, white space, cobalt and cyan. Let the scene explain a human moment; avoid generic dashboard decoration.</p></div><div><h3>Composition</h3><p>A full-width neighborhood belongs under the hero. Follow it with editorial type, useful detail, and one illustration per idea.</p></div><div><h3>Disclosure</h3><p>Keep the main choice visible. Expand supporting details on demand. Preserve keyboard focus and keep hidden content out of the tab order.</p></div></div>
        </section>

        <section className="ds-section" id="system-7">
          <SectionTitle n={7} title="A little life. A clear purpose.">Motion introduces, connects, and responds. It should never make someone wait to understand the page.</SectionTitle>
          <MotionDemo />
          <div className="ds-motion-timings"><div><strong>180<span>ms</span></strong><p>Focus & color</p><code>--mc-duration-fast</code></div><div><strong>250<span>ms</span></strong><p>Buttons & feedback</p><code>--mc-duration-ui</code></div><div><strong>600<span>ms</span></strong><p>Panel expansion</p><code>--mc-duration-expand</code></div><div><strong>800<span>ms</span></strong><p>Scene introduction</p><code>--mc-duration-reveal</code></div></div>
          <p className="ds-fineprint">Shared ease: cubic-bezier(.22, 1, .36, 1). Reveal with opacity and a short vertical move; stagger by 120ms. Continuous scenes need a pause control. Reduced motion shows the final state immediately.</p>
        </section>

        <section className="ds-section" id="system-8">
          <SectionTitle n={8} title="Sound like someone who cares.">Plain words. Honest expectations. Room for people who are still figuring things out.</SectionTitle>
          <div className="ds-voice"><div><span className="ds-kicker">Say it like this</span><p>“Join the waitlist.”<br />“Explore at your own pace.”<br />“We couldn’t save your details. Try again.”</p></div><div><span className="ds-kicker">Leave this behind</span><p>“Unlock your potential.”<br />“The future of acquisition.”<br />“Oops! Something went wrong!”</p></div></div>
          <div className="ds-checklist"><h3>Before it ships</h3><ul><li>Every control has a visible keyboard focus state and a clear name.</li><li>Normal text meets 4.5:1 contrast; essential control boundaries and focus indicators meet 3:1.</li><li>Buttons provide at least a 44px target. Forms use real labels, inline errors, and explicit consent.</li><li>Dialogs trap focus, close with Escape, and return focus to the opener.</li><li>Content fits 320px screens and remains usable at 200% zoom.</li><li>Reduced motion and reduced transparency preferences have a usable fallback.</li><li>No invented transaction counts, customer claims, or guaranteed outcomes.</li></ul><p className="ds-fineprint">Contrast reference: <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">W3C text contrast</a> and <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">non-text contrast</a>. These are design checks, not a claim of accessibility certification.</p></div>
          <div className="ds-handoff"><div><span className="ds-kicker">Build from the same source</span><h3>Ready for what<br />comes next.</h3><p>The live site and this guide share tokens and component styles. Change the foundation once, then verify both.</p></div><div><a className="mc-button mc-button--primary" href="/brand/tokens.css" download>Download CSS tokens <Arrow /></a><a className="mc-button mc-button--secondary" href="/brand/design-guide.md" download>Download usage guide <Arrow /></a><a className="ds-repo-link" href="https://github.com/Maychant/Maychant-website/tree/main/components/brand">View reusable components <Arrow /></a></div></div>
        </section>
        <footer className="ds-footer"><span>Maychant design system / 1.0</span><a href="#system-main">Back to top ↑</a></footer>
      </main>
    </div>
  </div>;
}
