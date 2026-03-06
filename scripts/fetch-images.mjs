import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zhqifgoptqqfnkkfiuzq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocWlmZ29wdHFxZm5ra2ZpdXpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5OTUyNiwiZXhwIjoyMDg3ODc1NTI2fQ.3XseL4JlrfH_I5YX80sHSSoBKYTbpcs8gnO59wDOGdQ";

const supabase = createClient(supabaseUrl, supabaseKey);

const ALI_API =
  "https://aliexpress-services-2-barshlom95.onrender.com/api/ali/product-info";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function resolveRedirects(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: HEADERS,
    });
    return res.url || url;
  } catch {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: HEADERS,
      });
      return res.url || url;
    } catch {
      return url;
    }
  }
}

function extractProductId(url) {
  const match =
    url.match(/\/item\/(\d+)\.html/i) ||
    url.match(/\/(\d{10,})\.html/i) ||
    url.match(/productId=(\d+)/i) ||
    url.match(/[\/?&](\d{10,})/);
  return match?.[1] || null;
}

function isAliUrl(url) {
  return /aliexpress|ali\.ski|s\.click\.aliexpress/i.test(url);
}

async function fetchFromAliApi(productId) {
  try {
    const res = await fetch(ALI_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, reviews: false }),
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : data;
    const image = item?.productInfo?.product_main_image_url;
    const affiliateLink = item?.affiliateLink;
    return { image: image || null, affiliateLink: affiliateLink || null };
  } catch {
    return { image: null, affiliateLink: null };
  }
}

async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();

    const ogMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
      );
    if (ogMatch?.[1]) return normalizeUrl(ogMatch[1], url);

    const twMatch =
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
      );
    if (twMatch?.[1]) return normalizeUrl(twMatch[1], url);
  } catch {
    // ignore
  }
  return null;
}

function normalizeUrl(img, base) {
  if (img.startsWith("//")) return "https:" + img;
  if (img.startsWith("/")) {
    const u = new URL(base);
    return u.origin + img;
  }
  return img;
}

async function main() {
  console.log("📷 Fetching images for products without images...\n");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, url, image")
    .is("image", null);

  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }

  console.log(`Found ${products.length} products without images.\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    let image = null;
    let newUrl = null;

    try {
      let resolvedUrl = p.url;

      // Resolve short links first
      if (
        /mommy-mor\.link|s\.click\.aliexpress|ali\.ski/i.test(p.url)
      ) {
        resolvedUrl = await resolveRedirects(p.url);
      }

      // Try AliExpress API
      if (isAliUrl(resolvedUrl) || isAliUrl(p.url)) {
        let productId = extractProductId(resolvedUrl);
        if (!productId && resolvedUrl !== p.url) {
          // Already resolved, try again
        }
        if (!productId) {
          // Try resolving again
          const r2 = await resolveRedirects(resolvedUrl);
          productId = extractProductId(r2);
        }

        if (productId) {
          const result = await fetchFromAliApi(productId);
          image = result.image;
          newUrl = result.affiliateLink;
        }
      }

      // Fallback: OG image
      if (!image) {
        image = await fetchOgImage(resolvedUrl);
      }

      if (image) {
        const update = { image };
        if (newUrl) update.url = newUrl;
        const { error: upErr } = await supabase
          .from("products")
          .update(update)
          .eq("id", p.id);
        if (upErr) {
          console.log(`${progress} ❌ ${p.name} — DB error: ${upErr.message}`);
          failed++;
        } else {
          console.log(`${progress} ✅ ${p.name}`);
          success++;
        }
      } else {
        console.log(`${progress} ❌ ${p.name} — no image found`);
        failed++;
      }
    } catch (err) {
      console.log(`${progress} ❌ ${p.name} — ${err.message}`);
      failed++;
    }

    // Rate limit
    await sleep(1500);
  }

  console.log(`\n🎉 Done! ✅ ${success} images fetched, ❌ ${failed} failed`);
}

main().catch(console.error);
