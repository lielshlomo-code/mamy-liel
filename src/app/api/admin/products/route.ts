import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
