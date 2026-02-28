import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { brandName, contactName, email, type, message } = body;

    // Basic validation
    if (!brandName || !contactName || !email || !type || !message) {
      return NextResponse.json(
        { error: "כל השדות המסומנים הם חובה" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contact_submissions").insert({
      brand_name: brandName,
      contact_name: contactName,
      email,
      phone: body.phone || null,
      type,
      message,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "שגיאה בשליחת הטופס" },
      { status: 500 }
    );
  }
}
