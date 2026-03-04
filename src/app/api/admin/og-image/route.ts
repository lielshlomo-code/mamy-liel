import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

// Allow up to 30 seconds for AliExpress redirect resolution + HTML fetch
export const maxDuration = 30;

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

function isAliExpressUrl(url: string): boolean {
  return /aliexpress\.com|aliexpress\.us|ali\.ski|s\.click\.aliexpress/i.test(
    url
  );
}

// Follow redirects to get the final URL (for shortened/affiliate links)
async function resolveRedirects(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    return res.url || url;
  } catch {
    return url;
  }
}

function isBadImage(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("data:")) return true;
  const lower = src.toLowerCase();
  return (
    lower.includes("barcode") ||
    lower.includes("qrcode") ||
    lower.includes("qr-code") ||
    lower.includes("bar-code")
  );
}

function extractImageFromHtml(html: string): string | null {
  // 1. Try og:image
  const ogMatch =
    html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
  if (ogMatch?.[1] && !isBadImage(ogMatch[1])) return ogMatch[1];

  // 2. Try twitter:image
  const twitterMatch =
    html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
  if (twitterMatch?.[1] && !isBadImage(twitterMatch[1])) return twitterMatch[1];

  // 3. Try JSON-LD structured data
  const jsonLdMatches = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      const img = extractImageFromJsonLd(data);
      if (img && !isBadImage(img)) return img;
    } catch {
      // ignore
    }
  }

  // 4. Try itemprop="image"
  const itempropMatch = html.match(
    /<(?:img|meta)[^>]*itemprop=["']image["'][^>]*(?:src|content)=["']([^"']+)["']/i
  );
  if (itempropMatch?.[1] && !isBadImage(itempropMatch[1]))
    return itempropMatch[1];

  return null;
}

// Extract main product image from AliExpress HTML page data
function extractAliExpressImage(html: string): string | null {
  // Try to find image in the page's embedded JSON data (window.runParams or similar)
  const imagePatterns = [
    // Look for imageUrl in JSON data
    /"imageUrl"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
    // Look for product main image
    /"product_main_image_url"\s*:\s*"(https?:\/\/[^"]+)"/i,
    // Look for imagePathList
    /"imagePathList"\s*:\s*\[\s*"(https?:\/\/[^"]+)"/i,
    // AliExpress img tags with product images
    /class="magnifier-image"[^>]*src="(https?:\/\/[^"]+)"/i,
    // General AliExpress CDN image pattern
    /"(https?:\/\/ae\d+\.alicdn\.com\/kf\/[^"]+)"/i,
  ];

  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match?.[1] && !isBadImage(match[1])) {
      return match[1];
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

function normalizeImageUrl(image: string, baseUrl: string): string {
  if (image.startsWith("//")) return "https:" + image;
  if (image.startsWith("/")) {
    const urlObj = new URL(baseUrl);
    return urlObj.origin + image;
  }
  return image;
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

    // For AliExpress shortened links, resolve redirects first
    let fetchUrl = url;
    if (isAliExpressUrl(url) && !/\/item\/\d+/i.test(url)) {
      fetchUrl = await resolveRedirects(url);
    }

    // Fetch the page HTML directly
    try {
      const response = await fetch(fetchUrl, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      const html = await response.text();

      // For AliExpress, try AliExpress-specific extraction first
      if (isAliExpressUrl(fetchUrl) || isAliExpressUrl(response.url)) {
        const aliImage = extractAliExpressImage(html);
        if (aliImage) {
          return NextResponse.json({
            image: normalizeImageUrl(aliImage, fetchUrl),
          });
        }
      }

      // Generic OG/meta extraction (works for all sites including AliExpress)
      const image = extractImageFromHtml(html);
      if (image) {
        return NextResponse.json({
          image: normalizeImageUrl(image, fetchUrl),
        });
      }
    } catch {
      // Direct fetch failed
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
