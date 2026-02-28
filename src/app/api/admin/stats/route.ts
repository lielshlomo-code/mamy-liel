import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, posts, links, shortLinks, totalClicks, contactCount] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("slug", { count: "exact", head: true }),
      supabase.from("social_links").select("id", { count: "exact", head: true }),
      supabase.from("short_links").select("id", { count: "exact", head: true }),
      supabase.from("click_events").select("id", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    ]);

  return NextResponse.json({
    products: products.count || 0,
    posts: posts.count || 0,
    links: links.count || 0,
    shortLinks: shortLinks.count || 0,
    totalClicks: totalClicks.count || 0,
    contactSubmissions: contactCount.count || 0,
  });
}
