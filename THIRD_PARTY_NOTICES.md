# Third-party notices and original assets

- GSAP 3.13.0 and ScrollTrigger 3.13.0 are vendored from the official npm package via jsDelivr. Their original license headers remain intact. Source: https://github.com/greensock/GSAP. License: https://gsap.com/standard-license/.
- Cabinet Grotesk by Indian Type Foundry is served locally from files supplied by Fontshare's official stylesheet API. Source and font information: https://www.fontshare.com/fonts/cabinet-grotesk. Licensing information: https://www.fontshare.com/licenses.
- All current illustrations are authored SVG and CSS, animated with GSAP. They contain no generated photographs, video or third-party artwork. The supplied Acquire screenshots and Coinbase clip were references for layout and pacing only; no clip or screenshot is embedded in the site.
- Historical generated design references and prompts remain outside `dist/` for provenance. The original photographs, film, poster and captions were removed from the deployed assets in the vector revision.
- All eleven requested GitHub repositories were consulted. Their patterns were reimplemented in bespoke source; no template or React component source was copied into this site. Exact inspected sources, reuse distinctions, and license observations are recorded in research/repository-influences.md.

## Neighborhood waitlist revision

- The current neighborhood illustration and key/Open-sign artwork are bespoke SVG. Fictional shop names are illustration details, not customer endorsements or available listings. Continuous SVG motion uses native CSS; GSAP handles page entrances.
- The full-stack runtime uses the supported Sites Vinext starter, React, Cloudflare Workers, D1, Drizzle and Zod. Package versions and dependency licenses are in package-lock.json and their retained distributions. The Sites build integration license remains in scripts/vite/sites-vite-plugin.LICENSE as supplied by the starter.
