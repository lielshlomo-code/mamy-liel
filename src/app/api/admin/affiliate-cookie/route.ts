import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  getAffiliateCookieUrl,
  AFFILIATE_COOKIE_URL_KEY,
  AFFILIATE_ACCOUNT_KEY,
  AFFILIATE_TRACKING_ID_KEY,
} from "@/lib/settings";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = await getAffiliateCookieUrl();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [AFFILIATE_ACCOUNT_KEY, AFFILIATE_TRACKING_ID_KEY]);

  const map: Record<string, string> = {};
  for (const row of data || []) map[row.key] = row.value;

  return NextResponse.json({
    url,
    account: map[AFFILIATE_ACCOUNT_KEY] || "",
    trackingId: map[AFFILIATE_TRACKING_ID_KEY] || "",
  });
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { url, account, trackingId } = await request.json();
    const updatedAt = new Date().toISOString();
    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: AFFILIATE_COOKIE_URL_KEY, value: (url || "").trim(), updated_at: updatedAt },
        { key: AFFILIATE_ACCOUNT_KEY, value: (account || "").trim(), updated_at: updatedAt },
        { key: AFFILIATE_TRACKING_ID_KEY, value: (trackingId || "").trim(), updated_at: updatedAt },
      ],
      { onConflict: "key" }
    );
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון הקישור" }, { status: 500 });
  }
}
