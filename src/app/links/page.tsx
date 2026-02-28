import type { Metadata } from "next";
import { getSocialLinks, getSiteConfig } from "@/lib/content";
import LinksClient from "@/components/links/LinksClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "קישורים",
  description: "כל הקישורים שלי במקום אחד",
};

export default async function LinksPage() {
  const links = await getSocialLinks();
  const config = getSiteConfig();

  return <LinksClient links={links} config={config} />;
}
