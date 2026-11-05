"use client";

import { useEffect } from "react";

let loading: Promise<void> | undefined;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

export default function SiteScripts() {
  useEffect(() => {
    // Passive effects run after hydration. app.js may then update the opaque
    // landing markup without racing React's initial attribute comparison.
    loading ??= (async () => {
      for (const source of ["/assets/gsap.min.js", "/assets/ScrollTrigger.min.js"]) {
        try {
          await loadScript(source);
        } catch {
          // Motion is optional; the waitlist must initialize if an animation asset fails.
        }
      }
      await loadScript("/app.js");
    })();
    void loading.catch(() => console.error("Maychant could not initialize its form. Please reload the page."));
  }, []);

  return null;
}
