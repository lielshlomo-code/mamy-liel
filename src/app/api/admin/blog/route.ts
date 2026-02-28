import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import readingTime from "reading-time";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, date, excerpt, image, tags, content")
    .order("date", { ascending: false });

  const posts = (data || []).map((post) => {
    const stats = readingTime(post.content || "");
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      image: post.image,
      tags: post.tags,
      readingTime: stats.text.replace("read", "קריאה"),
    };
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, excerpt, tags, content } = await request.json();

    const slug =
      title
        .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase() || `post-${Date.now()}`;

    const date = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("blog_posts").insert({
      slug,
      title,
      date,
      excerpt,
      image: null,
      tags: tags || [],
      content: content || "",
    });

    if (error) throw error;

    return NextResponse.json({ slug, title, date });
  } catch {
    return NextResponse.json({ error: "שגיאה ביצירת פוסט" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, title, excerpt, tags, content } = await request.json();

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title,
        excerpt,
        tags: tags || [],
        content: content || "",
      })
      .eq("slug", slug);

    if (error) throw error;

    return NextResponse.json({ slug, title });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון פוסט" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("slug", slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת פוסט" }, { status: 500 });
  }
}
