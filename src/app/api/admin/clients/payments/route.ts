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
    .from("client_payments")
    .select("*")
    .order("due_date", { ascending: false });

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    payments: (data || []).map((p) => ({
      id: p.id,
      clientId: p.client_id,
      amount: p.amount,
      currency: p.currency,
      dueDate: p.due_date,
      paidDate: p.paid_date,
      status: p.status,
      invoiceNumber: p.invoice_number,
      notes: p.notes,
      createdAt: p.created_at,
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
      .from("client_payments")
      .insert({
        client_id: body.clientId,
        amount: body.amount,
        currency: body.currency || "ILS",
        due_date: body.dueDate,
        paid_date: body.paidDate || null,
        status: body.status || "pending",
        invoice_number: body.invoiceNumber || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת תשלום" }, { status: 500 });
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
      .from("client_payments")
      .update({
        amount: body.amount,
        currency: body.currency,
        due_date: body.dueDate,
        paid_date: body.paidDate || null,
        status: body.status,
        invoice_number: body.invoiceNumber || null,
        notes: body.notes || null,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון תשלום" }, { status: 500 });
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
      .from("client_payments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת תשלום" }, { status: 500 });
  }
}
