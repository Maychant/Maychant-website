import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maychant — Next chapters for good businesses",
  description:
    "Good businesses deserve a next chapter. Join Maychant’s buyer and seller waitlist and help shape a more thoughtful business handover.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
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
