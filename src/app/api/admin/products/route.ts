import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySession } from "@/lib/auth";
import { getProductsData } from "@/lib/content";

const filePath = path.join(process.cwd(), "src/content/products.json");

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
    if (ogMatch) return ogMatch[1];

    const twitterMatch =
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
      );
    if (twitterMatch) return twitterMatch[1];

    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = getProductsData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await request.json();
    const data = getProductsData();

    product.id = `product-${Date.now()}`;
    product.dateAdded = new Date().toISOString().split("T")[0];

    if (!product.image && product.url) {
      product.image = await fetchOgImage(product.url);
    }

    data.products.push(product);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json(product);
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
    const data = getProductsData();

    const idx = data.products.findIndex((p) => p.id === updated.id);
    if (idx === -1) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    if (!updated.image && updated.url) {
      updated.image = await fetchOgImage(updated.url);
    }

    data.products[idx] = { ...data.products[idx], ...updated };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json(data.products[idx]);
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
    const data = getProductsData();

    data.products = data.products.filter((p) => p.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת מוצר" }, { status: 500 });
  }
}
