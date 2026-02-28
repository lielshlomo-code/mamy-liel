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

  // Increment click count (fire and forget)
  supabase.rpc("increment_short_link_clicks", { link_code: code }).then(() => {});

  return NextResponse.redirect(data.target_url);
}
