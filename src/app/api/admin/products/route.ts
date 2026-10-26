import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

const ALI_API_URL =
  "https://aliexpress-services-2-barshlom95.onrender.com/api/ali/product-info";

function isAliExpressUrl(url: string): boolean {
  return /aliexpress\.com|aliexpress\.us|ali\.ski/i.test(url);
}

function extractAliExpressProductId(url: string): string | null {
  const match =
    url.match(/\/item\/(\d+)\.html/i) ||
    url.match(/\/(\d{10,})\.html/i) ||
    url.match(/productId=(\d+)/i) ||
    url.match(/[\/?&](\d{10,})/);
  return match?.[1] || null;
}

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

async function fetchOgImage(
  url: string
): Promise<{ image: string; affiliateLink?: string } | null> {
  // Strategy 1: For AliExpress, use dedicated API
  if (isAliExpressUrl(url) || /ali\.ski|s\.click\.aliexpress/i.test(url)) {
    let resolvedUrl = url;
    let productId = extractAliExpressProductId(url);
    if (!productId) {
      resolvedUrl = await resolveRedirects(url);
      productId = extractAliExpressProductId(resolvedUrl);
    }
    if (productId) {
      try {
        const res = await fetch(ALI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, reviews: false }),
          signal: AbortSignal.timeout(30000),
        });
        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data;
        const image = item?.productInfo?.product_main_image_url;
        if (image) {
          return {
            image,
            affiliateLink: item?.affiliateLink || undefined,
          };
        }
      } catch {
        // API failed, try fallback
      }
    }
  }

  // Strategy 2: Direct fetch with browser headers
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();

    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
      );
    if (ogMatch?.[1] && !isBadImage(ogMatch[1]))
      return { image: normalizeImageUrl(ogMatch[1], url) };

    const twitterMatch =
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
      );
    if (twitterMatch?.[1] && !isBadImage(twitterMatch[1]))
      return { image: normalizeImageUrl(twitterMatch[1], url) };

    // Try JSON-LD
    const jsonLdMatches = html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );
    for (const m of jsonLdMatches) {
      try {
        const data = JSON.parse(m[1]);
        const img = extractJsonLdImage(data);
        if (img && !isBadImage(img))
          return { image: normalizeImageUrl(img, url) };
      } catch {
        // ignore
      }
    }
  } catch {
    // Direct fetch failed
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

  let { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  if (catError) {
    ({ data: categories } = await supabase.from("categories").select("*").order("id"));
  }

  let { data: subcategories, error: subError } = await supabase
    .from("subcategories")
    .select("*")
    .order("display_order");
  if (subError) {
    ({ data: subcategories } = await supabase.from("subcategories").select("*").order("id"));
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("date_added", { ascending: false });

  const allCategory = { id: "all", label: "הכל" };

  const categoriesWithSubs = (categories || []).map((cat) => ({
    ...cat,
    subcategories: (subcategories || [])
      .filter((s) => s.category_id === cat.id)
      .map((s) => ({ id: s.id, label: s.label, categoryId: s.category_id })),
  }));

  return NextResponse.json({
    categories: [allCategory, ...categoriesWithSubs],
    products: (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || null,
      url: p.url,
      image: p.image,
      featured: p.featured,
      published: p.published,
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
    let productUrl = product.url;
    if (!image && productUrl) {
      const result = await fetchOgImage(productUrl);
      if (result) {
        image = result.image;
        if (result.affiliateLink) productUrl = result.affiliateLink;
      }
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        id,
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory || null,
        url: productUrl,
        image,
        featured: product.featured || false,
        published: product.published !== false,
        date_added: dateAdded,
      })
      .select()
      .single();

    if (error) throw error;

    revalidateSite();
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
    let productUrl = updated.url;
    if (!image && productUrl) {
      const result = await fetchOgImage(productUrl);
      if (result) {
        image = result.image;
        if (result.affiliateLink) productUrl = result.affiliateLink;
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        description: updated.description,
        category: updated.category,
        subcategory: updated.subcategory || null,
        url: productUrl,
        image,
        featured: updated.featured,
        published: updated.published !== false,
      })
      .eq("id", updated.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    revalidateSite();
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

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת מוצר" }, { status: 500 });
  }
}
