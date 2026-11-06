import type { Metadata } from "next";
import "../public/brand/tokens.css";
import "./globals.css";
import "../styles/components.css";

export const metadata: Metadata = {
  title: "Maychant — Next chapters for good businesses",
  description:
    "Good businesses deserve a next chapter. Join Maychant’s buyer and seller waitlist and help shape a more thoughtful business handover.",
  icons: {
    icon: { url: "/brand/maychant-icon-v2.svg", type: "image/svg+xml", sizes: "any" },
    shortcut: "/brand/maychant-icon-v2.svg",
  },
  openGraph: {
    title: "Maychant — Next chapters for good businesses",
    description:
      "Join the buyer and seller waitlist for a more thoughtful business handover.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
