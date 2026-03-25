import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { page, event } = await request.json();

    if (!page || !event || !["view", "lead"].includes(event)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const country = request.headers.get("x-vercel-ip-country") || null;

    await supabase.from("click_events").insert({
      event_type: event === "view" ? "landing_view" : "landing_lead",
      target_id: page,
      referrer,
      user_agent: userAgent,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
