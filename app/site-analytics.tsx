"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function beforeSend(event: BeforeSendEvent) {
  const url = new URL(event.url);
  // Keep internal brand-reference visits out of the public site's traffic.
  if (url.pathname === "/design-system" || url.pathname.startsWith("/design-system/")) return null;
  // Only send the page address, never contact details or tokens in a query/hash.
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export default function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
