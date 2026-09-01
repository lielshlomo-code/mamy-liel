import type { Metadata } from "next";
import { getSocialLinks, getSiteConfig } from "@/lib/content";
import LinksClient from "@/components/links/LinksClient";

// Cached for a day. This page has no per-user state, and the five-minute window
// it used to sit on regenerated six pages 288 times a day — most of the team's
// 4h/month Vercel Fluid CPU allowance, and running out pauses every site.
// Admin edits don't wait for the window; they call revalidateSite() themselves.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "קישורים",
  description: "כל הקישורים שלי במקום אחד",
};

export default async function LinksPage() {
  const links = await getSocialLinks();
  const config = getSiteConfig();

  return <LinksClient links={links} config={config} />;
}
