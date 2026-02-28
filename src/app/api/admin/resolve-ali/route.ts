import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

function extractProductId(url: string): string | null {
  const match =
    url.match(/\/item\/(\d+)\.html/i) ||
    url.match(/\/(\d{10,})\.html/i) ||
    url.match(/productId=(\d+)/i) ||
    url.match(/[\/?&](\d{10,})/);
  return match?.[1] || null;
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Try to extract product ID directly first
    let productId = extractProductId(url);
    if (productId) {
      return NextResponse.json({ productId });
    }

    // Follow redirects to get the final URL
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    productId = extractProductId(res.url);
    if (productId) {
      return NextResponse.json({ productId });
    }

    return NextResponse.json({ error: "Product ID not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
  }
}
