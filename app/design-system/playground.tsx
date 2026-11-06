"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Arrow, Button, Field, Notice } from "@/components/brand/primitives";

export function ColorSwatch({ name, hex, token, note, dark }: { name: string; hex: string; token: string; note: string; dark: boolean }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(hex); setMessage(`${hex} copied`); }
    catch { setMessage(`Select and copy ${hex}`); }
  }
  return <div className={`ds-swatch${dark ? " ds-swatch-dark" : ""}`} style={{ background: `var(${token})` }}><div className="ds-swatch-top"><span>Aa</span><button type="button" onClick={copy} aria-label={`Copy ${name} ${hex}`}>Copy <Arrow /></button></div><div><h3>{name}</h3><code>{hex}</code><p>{note}</p><code className="ds-token-name">{token}</code></div><span className="ds-copy-message" role="status">{message}</span></div>;
}

export function GlassDemo() {
  const [night, setNight] = useState(false);
  return <div className={`ds-glass-demo${night ? " is-night" : ""}`}><div className="ds-glass-shapes" aria-hidden="true"><i /><i /><i /></div><div className="ds-glass-strip mc-glass"><span>Clarity, with depth.</span><span className="ds-glass-dot" />A familiar next step</div><div className="ds-glass-controls"><p>Light, layered, never muddy.</p><button type="button" onClick={() => setNight(!night)} aria-pressed={night}>Try {night ? "light" : "dark"} behind it <Arrow /></button></div></div>;
}

export function ComponentLab() {
  const [feedback, setFeedback] = useState("Choose an action to preview its feedback.");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => { if (saved) confirmation.current?.focus(); }, [saved]);
  function openDialog() { setSaved(false); setError(""); dialog.current?.showModal(); }
  function closeDialog() { dialog.current?.close(); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter an email address, like you@example.com."); dialog.current?.querySelector<HTMLInputElement>("input")?.focus(); return; }
    setError(""); setSaved(true);
  }
  return <div className="ds-component-lab">
    <div className="ds-component-row"><div className="ds-component-label"><h3>Actions</h3><p>One primary action per group. An arrow points forward, not away.</p></div><div><div className="ds-button-set"><Button arrow onClick={() => setFeedback("Primary action selected. This is a component preview.")}>Join the waitlist</Button><Button variant="secondary" arrow onClick={() => setFeedback("Secondary action selected. This is a component preview.")}>I want to sell</Button><Button variant="ink" small arrow onClick={() => setFeedback("Compact navigation action selected.")}>Join the waitlist</Button><Button variant="link" arrow onClick={() => setFeedback("Text action selected. Use this for a quieter next step.")}>Explore the story</Button></div><p className="ds-demo-status" role="status">{feedback}</p><div className="ds-button-states"><Button disabled>Unavailable</Button><Button disabled aria-busy="true">Saving your place…</Button><span>Tab to any enabled action to see focus.</span></div></div></div>
    <div className="ds-component-row"><div className="ds-component-label"><h3>Fields</h3><p>A label stays visible. An error explains what to do next.</p></div><div className="ds-fields"><Field id={`${id}-name`} label="Your name" placeholder="First and last name" autoComplete="off" hint="Use the name you’d like us to use." /><Field id={`${id}-invalid`} label="Email address" defaultValue="alex@" error="Enter a complete email address." autoComplete="off" /><label className="mc-choice"><input type="checkbox" />Email me about launch and early access.</label></div></div>
    <div className="ds-component-row"><div className="ds-component-label"><h3>Feedback</h3><p>Color, an icon, and words. Never color alone.</p></div><div className="ds-notices"><Notice tone="success"><strong>You’re on the list.</strong> We’ll be in touch about launch and early access.</Notice><Notice tone="error"><strong>We couldn’t save your details.</strong> Check your connection and try again.</Notice><Notice><strong>Just exploring?</strong> Joining doesn’t commit you to a purchase or sale.</Notice></div></div>
    <div className="ds-component-row"><div className="ds-component-label"><h3>Dialog</h3><p>A focused next step. Escape closes it; focus returns to the opener.</p></div><div><button ref={opener} className="mc-button mc-button--ink" type="button" onClick={openDialog}>Open sample dialog <Arrow /></button><p className="ds-demo-status">Local preview only. No information is submitted or stored.</p></div></div>
    <div className="ds-component-row"><div className="ds-component-label"><h3>Disclosure</h3><p>Let people choose how much detail they need.</p></div><div><details className="mc-disclosure"><summary>Do I need to be ready right now?</summary><p>No. You can be exploring ownership for the first time or thinking about selling a few years from now.</p></details><details className="mc-disclosure"><summary>What happens after I join?</summary><p>Maychant will email about launch and early access. Joining does not create a listing or commit you to a transaction.</p></details></div></div>
    <dialog className="ds-demo-dialog" ref={dialog} aria-labelledby={`${id}-dialog-title`} aria-describedby={`${id}-dialog-description`} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(); } }}>
      <button className="ds-dialog-close mc-control" onClick={closeDialog} type="button" aria-label="Close sample dialog">×</button><p className="ds-kicker">Component preview</p><h2 id={`${id}-dialog-title`}>A good place<br />to begin.</h2><p id={`${id}-dialog-description`}>Try the validation and success states. This demo does not join the waitlist.</p>
      {saved ? <div className="ds-dialog-result" role="status" tabIndex={-1} ref={confirmation}><Notice tone="success">Preview complete. Nothing was sent or stored.</Notice><Button onClick={closeDialog}>Close preview</Button></div> : <form onSubmit={submit} noValidate><Field id={`${id}-demo-email`} label="Email address" type="email" autoComplete="off" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} error={error} required /><Button type="submit" arrow>Preview confirmation</Button></form>}
    </dialog>
  </div>;
}

export function PathwayDemo() {
  const [active, setActive] = useState("buyer");
  const id = useId();
  return <div className="ds-pathways" data-active={active}>{[
    { role: "buyer", label: "For future owners", title: "Make it your own.", detail: "An existing foundation. Your next chapter. Give future owners an open, optimistic starting point.", image: "/assets/buyer-editorial.svg", alt: "Hands holding a plan with an open doorway" },
    { role: "seller", label: "For business owners", title: "Let the story go on.", detail: "Care for what’s been built. Respect the owner’s timing, relationships, and reasons for moving on.", image: "/assets/seller-editorial.svg", alt: "Hands passing on a carefully folded business story" },
  ].map(item => <article key={item.role} className={`ds-pathway ds-pathway-${item.role}${item.role === "seller" ? " mc-on-dark" : ""}`}><button className="ds-pathway-toggle" type="button" aria-expanded={active === item.role} aria-controls={`${id}-${item.role}`} onClick={() => setActive(item.role)}>{item.label}<Arrow /></button><Image unoptimized src={item.image} alt={item.alt} width="520" height="420" loading="lazy" /><h3>{item.title}</h3><div className="ds-pathway-detail" id={`${id}-${item.role}`} inert={active !== item.role}><div><p>{item.detail}</p></div></div></article>)}</div>;
}

export function MotionDemo() {
  const [iteration, setIteration] = useState(0);
  const [paused, setPaused] = useState(false);
  return <div className="ds-motion-demo"><div key={iteration} className={`ds-motion-stage${paused ? " is-paused" : ""}`} aria-label="Three panels arrive one at a time"><div className="ds-motion-ground" /><div className="ds-motion-piece"><span>01</span><i /><p>The people.</p></div><div className="ds-motion-piece"><span>02</span><i /><p>The know-how.</p></div><div className="ds-motion-piece"><span>03</span><i /><p>The possibility.</p></div></div><div className="ds-motion-controls"><p>Arrive with purpose.<span>Three steps. One gentle sequence.</span></p><div><Button variant="secondary" small onClick={() => { setPaused(false); setIteration(n => n + 1); }}>Replay entrance</Button><Button variant="link" small onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</Button></div></div></div>;
}
