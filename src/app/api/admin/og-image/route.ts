import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua":
    '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

const MOBILE_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function isAliExpressUrl(url: string): boolean {
  return /aliexpress\.com|aliexpress\.us|ali\.ski/i.test(url);
}

function isBadImage(src: string): boolean {
  if (!src) return true;
  // Reject base64/data URLs - product images are always on CDNs
  if (src.startsWith("data:")) return true;
  const lower = src.toLowerCase();
  return (
    lower.includes("barcode") ||
    lower.includes("qrcode") ||
    lower.includes("qr-code") ||
    lower.includes("bar-code") ||
    lower.includes("code128") ||
    lower.includes("ean13") ||
    lower.includes("upc")
  );
}

function extractImageFromHtml(html: string, filterBarcode = false): string | null {
  // 1. Try og:image
  const ogMatch =
    html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );
  if (ogMatch?.[1] && (!filterBarcode || !isBadImage(ogMatch[1]))) {
    return ogMatch[1];
  }

  // 2. Try twitter:image
  const twitterMatch =
    html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );
  if (twitterMatch?.[1] && (!filterBarcode || !isBadImage(twitterMatch[1]))) {
    return twitterMatch[1];
  }

  // 3. Try JSON-LD structured data
  const jsonLdMatches = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      const img = extractImageFromJsonLd(data);
      if (img && (!filterBarcode || !isBadImage(img))) return img;
    } catch {
      // ignore
    }
  }

  // 4. Try itemprop="image"
  const itempropMatch = html.match(
    /<(?:img|meta)[^>]*itemprop=["']image["'][^>]*(?:src|content)=["']([^"']+)["']/i
  );
  if (itempropMatch?.[1] && isLikelyProductImage(itempropMatch[1])) {
    return itempropMatch[1];
  }

  // 5. Try large images from img tags
  const imgMatches = [
    ...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi),
  ];
  for (const imgMatch of imgMatches) {
    const src = imgMatch[1];
    if (isLikelyProductImage(src) && (!filterBarcode || !isBadImage(src))) {
      return src;
    }
  }

  return null;
}

// AliExpress-specific: extract product images from embedded JS data
function extractAliExpressImage(html: string): string | null {
  // Try to find image in window.runParams or pageData
  const patterns = [
    /"imageUrl"\s*:\s*"([^"]+)"/,
    /"imgUrl"\s*:\s*"([^"]+)"/,
    /"productImage"\s*:\s*"([^"]+)"/,
    /"mainImageUrl"\s*:\s*"([^"]+)"/,
    /"imagePathList"\s*:\s*\["([^"]+)"/,
    /data-role="thumb"[^>]*src=["']([^"']+)["']/i,
    /class="[^"]*magnifier[^"]*"[^>]*src=["']([^"']+)["']/i,
    /class="[^"]*product-img[^"]*"[^>]*src=["']([^"']+)["']/i,
    /<img[^>]*class="[^"]*pdp-image[^"]*"[^>]*src=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && !isBadImage(match[1])) {
      let img = match[1];
      if (img.startsWith("//")) img = "https:" + img;
      return img;
    }
  }

  // Try to find any alicdn/aliexpress-media image URL in the HTML
  const cdnMatch = html.match(
    /(https?:)?\/\/[a-z0-9-]+\.(?:alicdn\.com|aliexpress-media\.com)\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/i
  );
  if (cdnMatch) {
    let img = cdnMatch[0];
    if (img.startsWith("//")) img = "https:" + img;
    if (!isBadImage(img)) return img;
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

function isLikelyProductImage(src: string): boolean {
  if (!src || src.length < 10) return false;
  const excluded = [
    "icon", "logo", "sprite", "pixel", "tracking", "1x1",
    "spacer", "blank", "svg", "gif", "favicon", "badge", "flag",
    "barcode", "qrcode", "qr-code",
  ];
  const lower = src.toLowerCase();
  if (excluded.some((e) => lower.includes(e))) return false;
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

function normalizeImageUrl(image: string, baseUrl: string): string {
  if (image.startsWith("//")) return "https:" + image;
  if (image.startsWith("/")) {
    const urlObj = new URL(baseUrl);
    return urlObj.origin + image;
  }
  return image;
}

// Convert AliExpress URL to mobile version
function toMobileAliExpressUrl(url: string): string {
  return url.replace(
    /\/\/(www\.|he\.|[a-z]{2}\.)?aliexpress\.(com|us)/,
    "//m.aliexpress.$2"
  );
}

// Fallback: use Microlink API (free, headless browser)
async function fetchViaMetadataApi(url: string): Promise<string | null> {
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    const imageUrl = data?.data?.image?.url;
    if (imageUrl && !isBadImage(imageUrl)) {
      return imageUrl;
    }
    return null;
  } catch {
    return null;
  }
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

    const isAliExpress = isAliExpressUrl(url);

    // Strategy 1: Direct fetch
    try {
      const response = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      const html = await response.text();

      // For AliExpress, try specific extraction first
      if (isAliExpress) {
        const aliImage = extractAliExpressImage(html);
        if (aliImage) {
          return NextResponse.json({ image: normalizeImageUrl(aliImage, url) });
        }
      }

      const image = extractImageFromHtml(html, isAliExpress);
      if (image) {
        return NextResponse.json({ image: normalizeImageUrl(image, url) });
      }
    } catch {
      // Direct fetch failed
    }

    // Strategy 2: For AliExpress, try mobile version
    if (isAliExpress) {
      try {
        const mobileUrl = toMobileAliExpressUrl(url);
        const response = await fetch(mobileUrl, {
          headers: MOBILE_HEADERS,
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        const html = await response.text();

        const aliImage = extractAliExpressImage(html);
        if (aliImage) {
          return NextResponse.json({ image: normalizeImageUrl(aliImage, mobileUrl) });
        }

        const image = extractImageFromHtml(html, true);
        if (image) {
          return NextResponse.json({ image: normalizeImageUrl(image, mobileUrl) });
        }
      } catch {
        // Mobile fetch failed
      }
    }

    // Strategy 3: Microlink API fallback
    const apiImage = await fetchViaMetadataApi(url);
    if (apiImage) {
      return NextResponse.json({ image: apiImage });
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
