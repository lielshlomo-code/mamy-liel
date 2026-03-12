import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function generateCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("short_links")
    .select("*")
    .order("created_at", { ascending: false });

  const links = (data || []).map((link) => ({
    id: link.id,
    code: link.code,
    targetUrl: link.target_url,
    title: link.title,
    clicks: link.clicks,
    createdAt: link.created_at,
    published: link.published,
  }));

  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { targetUrl, title, code: customCode, published } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: "כתובת URL נדרשת" }, { status: 400 });
    }

    let code = customCode?.trim() || generateCode();

    // Verify code is unique
    const { data: existing } = await supabase
      .from("short_links")
      .select("code")
      .eq("code", code)
      .single();

    if (existing) {
      if (customCode) {
        return NextResponse.json({ error: "הקוד כבר בשימוש" }, { status: 400 });
      }
      // Auto-generated collision, try again
      code = generateCode(8);
    }

    const { data, error } = await supabase
      .from("short_links")
      .insert({
        code,
        target_url: targetUrl,
        title: title || null,
        published: published !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      code: data.code,
      targetUrl: data.target_url,
      title: data.title,
      clicks: data.clicks,
      createdAt: data.created_at,
      published: data.published,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה ביצירת קישור מקוצר" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, targetUrl, title, published } = await request.json();

    const { error } = await supabase
      .from("short_links")
      .update({
        target_url: targetUrl,
        title: title || null,
        published: published !== false,
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון קישור" }, { status: 500 });
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
      .from("short_links")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת קישור" }, { status: 500 });
  }
}
