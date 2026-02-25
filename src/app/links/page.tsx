import type { Metadata } from "next";
import { getSocialLinks, getSiteConfig } from "@/lib/content";
import LinksClient from "@/components/links/LinksClient";

export const metadata: Metadata = {
  title: "קישורים",
  description: "כל הקישורים שלי במקום אחד",
};

export default function LinksPage() {
  const links = getSocialLinks();
  const config = getSiteConfig();

  return <LinksClient links={links} config={config} />;
}
