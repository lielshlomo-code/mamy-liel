import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("short_links")
    .select("code, title, coupon_code, coupon_note, color")
    .eq("published", true)
    .eq("show_on_homepage", true)
    .order("created_at", { ascending: false });

  const links = (data || []).map((link) => ({
    title: link.title || "",
    url: `/s/${link.code}`,
    couponCode: link.coupon_code || "",
    couponNote: link.coupon_note || "",
    color: link.color || "from-warm-300 to-rose-400",
  }));

  return NextResponse.json(links);
}
