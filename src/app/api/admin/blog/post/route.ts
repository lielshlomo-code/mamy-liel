import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import readingTime from "reading-time";

export async function GET(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const stats = readingTime(data.content || "");

  return NextResponse.json({
    slug: data.slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    image: data.image,
    tags: data.tags,
    readingTime: stats.text.replace("read", "קריאה"),
    content: data.content,
  });
}
