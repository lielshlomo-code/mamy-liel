import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

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

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    const html = await response.text();

    // Try og:image first, then twitter:image
    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
      );

    if (ogMatch) {
      return NextResponse.json({ image: ogMatch[1] });
    }

    const twitterMatch =
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
      );

    if (twitterMatch) {
      return NextResponse.json({ image: twitterMatch[1] });
    }

    return NextResponse.json({ image: null, message: "לא נמצאה תמונה" });
  } catch {
    return NextResponse.json(
      { error: "שגיאה בשליפת תמונה" },
      { status: 500 }
    );
  }
}
