import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, posts, links] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("slug", { count: "exact", head: true }),
    supabase.from("social_links").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    products: products.count || 0,
    posts: posts.count || 0,
    links: links.count || 0,
  });
}
