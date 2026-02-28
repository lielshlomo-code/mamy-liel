import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

function extractImageFromHtml(html: string): string | null {
  // 1. Try og:image
  const ogMatch =
    html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
  if (ogMatch?.[1]) return ogMatch[1];

  // 2. Try twitter:image
  const twitterMatch =
    html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
  if (twitterMatch?.[1]) return twitterMatch[1];

  // 3. Try JSON-LD structured data
  const jsonLdMatches = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      const img = extractImageFromJsonLd(data);
      if (img) return img;
    } catch {
      // ignore parse errors
    }
  }

  // 4. Try itemprop="image"
  const itempropMatch = html.match(
    /<(?:img|meta)[^>]*itemprop=["']image["'][^>]*(?:src|content)=["']([^"']+)["']/i
  );
  if (itempropMatch?.[1] && isLikelyProductImage(itempropMatch[1])) {
    return itempropMatch[1];
  }

  // 5. Try large images from img tags (common for product pages)
  const imgMatches = [
    ...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi),
  ];
  for (const imgMatch of imgMatches) {
    const src = imgMatch[1];
    if (isLikelyProductImage(src)) {
      return src;
    }
  }

  return null;
}

function extractImageFromJsonLd(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const result = extractImageFromJsonLd(item);
      if (result) return result;
    }
    return null;
  }

  const obj = data as Record<string, unknown>;

  // Check for image property
  if (typeof obj.image === "string") return obj.image;
  if (Array.isArray(obj.image) && typeof obj.image[0] === "string")
    return obj.image[0];
  if (
    obj.image &&
    typeof obj.image === "object" &&
    "url" in obj.image &&
    typeof (obj.image as Record<string, unknown>).url === "string"
  )
    return (obj.image as Record<string, unknown>).url as string;

  return null;
}

function isLikelyProductImage(src: string): boolean {
  if (!src || src.length < 10) return false;
  // Filter out tiny icons, tracking pixels, etc.
  const excluded = [
    "icon",
    "logo",
    "sprite",
    "pixel",
    "tracking",
    "1x1",
    "spacer",
    "blank",
    "svg",
    "gif",
    "favicon",
    "badge",
    "flag",
  ];
  const lower = src.toLowerCase();
  if (excluded.some((e) => lower.includes(e))) return false;
  // Must be an image URL
  if (
    lower.includes(".jpg") ||
    lower.includes(".jpeg") ||
    lower.includes(".png") ||
    lower.includes(".webp") ||
    lower.includes("img") ||
    lower.includes("image")
  ) {
    return true;
  }
  return false;
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

    // Try fetching the page with full browser-like headers
    const response = await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    const html = await response.text();
    const image = extractImageFromHtml(html);

    if (image) {
      // Make sure it's an absolute URL
      let absoluteImage = image;
      if (image.startsWith("//")) {
        absoluteImage = "https:" + image;
      } else if (image.startsWith("/")) {
        const urlObj = new URL(url);
        absoluteImage = urlObj.origin + image;
      }
      return NextResponse.json({ image: absoluteImage });
    }

    return NextResponse.json({ image: null, message: "לא נמצאה תמונה" });
  } catch (error) {
    console.error("OG image fetch error:", error);
    return NextResponse.json(
      { error: "שגיאה בשליפת תמונה" },
      { status: 500 }
    );
  }
}
