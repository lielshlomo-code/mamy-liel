import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key) {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();

    return NextResponse.json({ value: data?.value || null });
  }

  const { data } = await supabase.from("site_settings").select("key, value");

  const settings: Record<string, string> = {};
  for (const row of data || []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json(settings);
}
