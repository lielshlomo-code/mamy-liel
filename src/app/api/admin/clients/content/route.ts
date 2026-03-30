import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  let query = supabase
    .from("client_content_schedule")
    .select("*")
    .order("scheduled_date", { ascending: true });

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    content: (data || []).map((c) => ({
      id: c.id,
      clientId: c.client_id,
      contentType: c.content_type,
      title: c.title,
      description: c.description,
      scheduledDate: c.scheduled_date,
      scheduledTime: c.scheduled_time,
      platform: c.platform,
      status: c.status,
      notes: c.notes,
      createdAt: c.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("client_content_schedule")
      .insert({
        client_id: body.clientId,
        content_type: body.contentType || "video",
        title: body.title || null,
        description: body.description || null,
        scheduled_date: body.scheduledDate,
        scheduled_time: body.scheduledTime || null,
        platform: body.platform || "instagram",
        status: body.status || "pending",
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת תוכן" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("client_content_schedule")
      .update({
        content_type: body.contentType,
        title: body.title || null,
        description: body.description || null,
        scheduled_date: body.scheduledDate,
        scheduled_time: body.scheduledTime || null,
        platform: body.platform,
        status: body.status,
        notes: body.notes || null,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון תוכן" }, { status: 500 });
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
      .from("client_content_schedule")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת תוכן" }, { status: 500 });
  }
}
