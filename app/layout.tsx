import type { Metadata } from "next";
import SiteAnalytics from "./site-analytics";
import "../public/brand/tokens.css";
import "./globals.css";
import "../styles/components.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maychant.com"),
  title: "Maychant | Small Business Buyers & Sellers",
  description:
    "Thinking about buying or selling a small business? Join the Maychant waitlist for launch updates and early access. Good businesses deserve a next chapter.",
  icons: {
    icon: { url: "/favicon.png", type: "image/png", sizes: "96x96" },
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Maychant | Small Business Buyers & Sellers",
    description:
      "Join the buyer and seller waitlist for a more thoughtful business handover.",
    siteName: "Maychant",
    url: "https://maychant.com/",
    type: "website",
    images: [{ url: "/brand/maychant-social.png", width: 1200, height: 630, alt: "Maychant" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
