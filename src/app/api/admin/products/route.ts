import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function isAliExpressUrl(url: string): boolean {
  return /aliexpress\.com|aliexpress\.us|ali\.ski/i.test(url);
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

function extractAliExpressImage(html: string): string | null {
  const patterns = [
    /"imageUrl"\s*:\s*"([^"]+)"/,
    /"imgUrl"\s*:\s*"([^"]+)"/,
    /"productImage"\s*:\s*"([^"]+)"/,
    /"mainImageUrl"\s*:\s*"([^"]+)"/,
    /"imagePathList"\s*:\s*\["([^"]+)"/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && !isBadImage(match[1])) {
      let img = match[1];
      if (img.startsWith("//")) img = "https:" + img;
      return img;
    }
  }
  // Try any alicdn image URL in the HTML
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

async function fetchOgImage(url: string): Promise<string | null> {
  const isAliExpress = isAliExpressUrl(url);

  // Strategy 1: Direct fetch
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();

    // For AliExpress, try specific extraction first
    if (isAliExpress) {
      const aliImage = extractAliExpressImage(html);
      if (aliImage) return aliImage;
    }

    // 1. Try og:image
    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
      );
    if (ogMatch?.[1] && (!isAliExpress || !isBadImage(ogMatch[1])))
      return normalizeImageUrl(ogMatch[1], url);

    // 2. Try twitter:image
    const twitterMatch =
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
      );
    if (twitterMatch?.[1] && (!isAliExpress || !isBadImage(twitterMatch[1])))
      return normalizeImageUrl(twitterMatch[1], url);

    // 3. Try JSON-LD structured data
    const jsonLdMatches = html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );
    for (const m of jsonLdMatches) {
      try {
        const data = JSON.parse(m[1]);
        const img = extractJsonLdImage(data);
        if (img && (!isAliExpress || !isBadImage(img)))
          return normalizeImageUrl(img, url);
      } catch {
        // ignore
      }
    }

    // 4. Try itemprop="image"
    const itempropMatch = html.match(
      /<(?:img|meta)[^>]*itemprop=["']image["'][^>]*(?:src|content)=["']([^"']+)["']/i
    );
    if (itempropMatch?.[1] && (!isAliExpress || !isBadImage(itempropMatch[1])))
      return normalizeImageUrl(itempropMatch[1], url);
  } catch {
    // Direct fetch failed, try fallback
  }

  // Strategy 2: For AliExpress, try mobile version
  if (isAliExpress) {
    try {
      const mobileUrl = url.replace(
        /\/\/(www\.|he\.|[a-z]{2}\.)?aliexpress\.(com|us)/,
        "//m.aliexpress.$2"
      );
      const response = await fetch(mobileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      const html = await response.text();
      const aliImage = extractAliExpressImage(html);
      if (aliImage) return aliImage;
    } catch {
      // mobile fetch failed
    }
  }

  // Strategy 3: Microlink API fallback (headless browser)
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    if (data?.data?.image?.url && !isBadImage(data.data.image.url))
      return data.data.image.url;
  } catch {
    // fallback also failed
  }

  return null;
}

function extractJsonLdImage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const r = extractJsonLdImage(item);
      if (r) return r;
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

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("date_added", { ascending: false });

  const allCategory = { id: "all", label: "הכל" };

  return NextResponse.json({
    categories: [allCategory, ...(categories || [])],
    products: (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      url: p.url,
      image: p.image,
      featured: p.featured,
      dateAdded: p.date_added,
    })),
  });
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await request.json();

    const id = `product-${Date.now()}`;
    const dateAdded = new Date().toISOString().split("T")[0];

    let image = product.image || null;
    if (!image && product.url) {
      image = await fetchOgImage(product.url);
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        id,
        name: product.name,
        description: product.description,
        category: product.category,
        url: product.url,
        image,
        featured: product.featured || false,
        date_added: dateAdded,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...data,
      dateAdded: data.date_added,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת מוצר" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await request.json();

    let image = updated.image || null;
    if (!image && updated.url) {
      image = await fetchOgImage(updated.url);
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        description: updated.description,
        category: updated.category,
        url: updated.url,
        image,
        featured: updated.featured,
      })
      .eq("id", updated.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({
      ...data,
      dateAdded: data.date_added,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון מוצר" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת מוצר" }, { status: 500 });
  }
}
