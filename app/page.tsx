import type { Metadata } from "next";
import landingContent from "./landing-content";
import SiteScripts from "./site-scripts";

export const metadata: Metadata = {
  alternates: { canonical: "https://maychant.com/" },
};

const brandSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://maychant.com/#website",
      name: "Maychant",
      url: "https://maychant.com/",
      publisher: { "@id": "https://maychant.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://maychant.com/#organization",
      name: "Maychant",
      url: "https://maychant.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://maychant.com/brand/maychant-symbol.png",
        width: 512,
        height: 512,
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema).replace(/</g, "\\u003c") }}
      />
      <div id="maychant-site" dangerouslySetInnerHTML={{ __html: landingContent }} />
      <SiteScripts />
    </>
  );
}
