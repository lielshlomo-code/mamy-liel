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
    paintCookies: link.paint_cookies || false,
    title: link.title,
    clicks: link.clicks,
    createdAt: link.created_at,
    published: link.published,
    showInPopup: link.show_in_popup || false,
    showOnHomepage: link.show_on_homepage || false,
    couponCode: link.coupon_code || "",
    couponNote: link.coupon_note || "",
    color: link.color || "",
  }));

  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { targetUrl, title, code: customCode, published, paintCookies, showInPopup, showOnHomepage, couponCode, couponNote, color } = await request.json();

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
        paint_cookies: paintCookies || false,
        title: title || null,
        published: published !== false,
        show_in_popup: showInPopup || false,
        show_on_homepage: showOnHomepage || false,
        coupon_code: couponCode || null,
        coupon_note: couponNote || null,
        color: color || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      code: data.code,
      targetUrl: data.target_url,
      paintCookies: data.paint_cookies || false,
      title: data.title,
      clicks: data.clicks,
      createdAt: data.created_at,
      published: data.published,
      showInPopup: data.show_in_popup || false,
      showOnHomepage: data.show_on_homepage || false,
      couponCode: data.coupon_code || "",
      couponNote: data.coupon_note || "",
      color: data.color || "",
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
    const { id, targetUrl, title, published, paintCookies, showInPopup, showOnHomepage, couponCode, couponNote, color } = await request.json();

    const { error } = await supabase
      .from("short_links")
      .update({
        target_url: targetUrl,
        paint_cookies: paintCookies || false,
        title: title || null,
        published: published !== false,
        show_in_popup: showInPopup || false,
        show_on_homepage: showOnHomepage || false,
        coupon_code: couponCode || null,
        coupon_note: couponNote || null,
        color: color || null,
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
