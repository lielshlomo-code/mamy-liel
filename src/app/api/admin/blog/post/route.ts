import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getBlogPost } from "@/lib/content";

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

  try {
    const post = getBlogPost(slug);
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
