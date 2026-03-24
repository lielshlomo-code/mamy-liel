import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase.from("social_links").select("*");

  return NextResponse.json(
    (data || []).map((l) => ({
      id: l.id,
      label: l.label,
      url: l.url,
      icon: l.icon,
      internal: l.internal,
      published: l.published,
      showInPopup: l.show_in_popup || false,
      paintCookies: l.paint_cookies || false,
    }))
  );
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const link = await request.json();
    const id = `link-${Date.now()}`;

    const { data, error } = await supabase
      .from("social_links")
      .insert({
        id,
        label: link.label,
        url: link.url,
        icon: link.icon,
        internal: link.internal || false,
        published: link.published !== false,
        show_in_popup: link.showInPopup || false,
        paint_cookies: link.paintCookies || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת קישור" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await request.json();

    const { data, error } = await supabase
      .from("social_links")
      .update({
        label: updated.label,
        url: updated.url,
        icon: updated.icon,
        internal: updated.internal,
        published: updated.published !== false,
        show_in_popup: updated.showInPopup || false,
        paint_cookies: updated.paintCookies || false,
      })
      .eq("id", updated.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "קישור לא נמצא" }, { status: 404 });
    }

    return NextResponse.json(data);
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
      .from("social_links")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת קישור" }, { status: 500 });
  }
}
