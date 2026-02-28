import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const country = request.headers.get("x-vercel-ip-country") || null;

    await supabase.from("click_events").insert({
      event_type: "product",
      target_id: productId,
      referrer,
      user_agent: userAgent,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
