import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getProducts, getAllBlogPosts, getSocialLinks } from "@/lib/content";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    products: getProducts().length,
    posts: getAllBlogPosts().length,
    links: getSocialLinks().length,
  });
}
