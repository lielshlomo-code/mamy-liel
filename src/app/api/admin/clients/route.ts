import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get payment summaries for each client
  const { data: payments } = await supabase
    .from("client_payments")
    .select("client_id, amount, status");

  // Get upcoming content counts
  const today = new Date().toISOString().split("T")[0];
  const { data: upcomingContent } = await supabase
    .from("client_content_schedule")
    .select("client_id, status")
    .gte("scheduled_date", today);

  const paymentsByClient: Record<string, { total: number; paid: number; pending: number }> = {};
  (payments || []).forEach((p) => {
    if (!paymentsByClient[p.client_id]) {
      paymentsByClient[p.client_id] = { total: 0, paid: 0, pending: 0 };
    }
    paymentsByClient[p.client_id].total += Number(p.amount);
    if (p.status === "paid") paymentsByClient[p.client_id].paid += Number(p.amount);
    else if (p.status === "pending" || p.status === "overdue") paymentsByClient[p.client_id].pending += Number(p.amount);
  });

  const contentByClient: Record<string, number> = {};
  (upcomingContent || []).forEach((c) => {
    contentByClient[c.client_id] = (contentByClient[c.client_id] || 0) + 1;
  });

  return NextResponse.json({
    clients: (clients || []).map((c) => ({
      id: c.id,
      clientName: c.client_name,
      companyName: c.company_name,
      contactEmail: c.contact_email,
      contactPhone: c.contact_phone,
      collaborationType: c.collaboration_type,
      monthlyVideos: c.monthly_videos,
      monthlyStories: c.monthly_stories,
      monthlyReels: c.monthly_reels,
      monthlyPosts: c.monthly_posts,
      paymentAmount: c.payment_amount,
      paymentDay: c.payment_day,
      currency: c.currency,
      status: c.status,
      notes: c.notes,
      startDate: c.start_date,
      endDate: c.end_date,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      paymentSummary: paymentsByClient[c.id] || { total: 0, paid: 0, pending: 0 },
      upcomingContent: contentByClient[c.id] || 0,
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
      .from("clients")
      .insert({
        client_name: body.clientName,
        company_name: body.companyName,
        contact_email: body.contactEmail || null,
        contact_phone: body.contactPhone || null,
        collaboration_type: body.collaborationType || "monthly",
        monthly_videos: body.monthlyVideos || 0,
        monthly_stories: body.monthlyStories || 0,
        monthly_reels: body.monthlyReels || 0,
        monthly_posts: body.monthlyPosts || 0,
        payment_amount: body.paymentAmount || 0,
        payment_day: body.paymentDay || null,
        currency: body.currency || "ILS",
        status: body.status || "active",
        notes: body.notes || null,
        start_date: body.startDate || null,
        end_date: body.endDate || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת לקוח" }, { status: 500 });
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
      .from("clients")
      .update({
        client_name: body.clientName,
        company_name: body.companyName,
        contact_email: body.contactEmail || null,
        contact_phone: body.contactPhone || null,
        collaboration_type: body.collaborationType,
        monthly_videos: body.monthlyVideos,
        monthly_stories: body.monthlyStories,
        monthly_reels: body.monthlyReels,
        monthly_posts: body.monthlyPosts,
        payment_amount: body.paymentAmount,
        payment_day: body.paymentDay || null,
        currency: body.currency,
        status: body.status,
        notes: body.notes || null,
        start_date: body.startDate || null,
        end_date: body.endDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון לקוח" }, { status: 500 });
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
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת לקוח" }, { status: 500 });
  }
}
