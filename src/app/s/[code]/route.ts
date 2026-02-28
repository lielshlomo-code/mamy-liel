import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data } = await supabase
    .from("short_links")
    .select("target_url")
    .eq("code", code)
    .single();

  if (!data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Record click event with metadata (fire and forget)
  const referrer = request.headers.get("referer") || null;
  const userAgent = request.headers.get("user-agent") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;

  supabase
    .rpc("record_short_link_click", {
      link_code: code,
      click_referrer: referrer,
      click_user_agent: userAgent,
      click_country: country,
    })
    .then(() => {});

  return NextResponse.redirect(data.target_url);
}
