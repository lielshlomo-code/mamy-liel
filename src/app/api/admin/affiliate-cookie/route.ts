import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getAffiliateCookieUrl, AFFILIATE_COOKIE_URL_KEY } from "@/lib/settings";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = await getAffiliateCookieUrl();
  return NextResponse.json({ url });
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { url } = await request.json();
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: AFFILIATE_COOKIE_URL_KEY,
          value: (url || "").trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון הקישור" }, { status: 500 });
  }
}
