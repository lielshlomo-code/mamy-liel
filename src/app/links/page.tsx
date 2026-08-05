import type { Metadata } from "next";
import { getSocialLinks, getSiteConfig } from "@/lib/content";
import LinksClient from "@/components/links/LinksClient";

// Cached for five minutes. This page has no per-user state, so rendering it
// fresh on every request bought nothing and burned Vercel Fluid CPU — the
// whole team shares a 4h/month allowance and overrunning it pauses the sites.
// Admin edits show up within the window.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "קישורים",
  description: "כל הקישורים שלי במקום אחד",
};

export default async function LinksPage() {
  const links = await getSocialLinks();
  const config = getSiteConfig();

  return <LinksClient links={links} config={config} />;
}
