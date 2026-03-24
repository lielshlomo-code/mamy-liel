import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [shortLinksRes, socialLinksRes] = await Promise.all([
    supabase
      .from("short_links")
      .select("code, title, target_url")
      .eq("published", true)
      .eq("show_in_popup", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("social_links")
      .select("label, url")
      .eq("published", true)
      .eq("show_in_popup", true),
  ]);

  const shortLinks = (shortLinksRes.data || []).map((link) => ({
    title: link.title || link.target_url,
    url: `/s/${link.code}`,
  }));

  const socialLinks = (socialLinksRes.data || []).map((link) => ({
    title: link.label,
    url: link.url,
  }));

  return NextResponse.json([...socialLinks, ...shortLinks]);
}
