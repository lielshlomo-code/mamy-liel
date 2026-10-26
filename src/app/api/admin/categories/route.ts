import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, label } = await request.json();

    if (!id || !label) {
      return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });
    }

    // Auto-assign display_order as max + 1
    let nextOrder = 0;
    const { data: maxRow, error: maxError } = await supabase
      .from("categories")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();
    if (!maxError) {
      nextOrder = (maxRow?.display_order ?? 0) + 1;
    }

    const insertData: Record<string, unknown> = { id, label };
    if (!maxError) insertData.display_order = nextOrder;

    const { data, error } = await supabase
      .from("categories")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "קטגוריה עם מזהה זה כבר קיימת" }, { status: 409 });
      }
      throw error;
    }

    revalidateSite();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת קטגוריה" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, label } = await request.json();

    if (!id || !label) {
      return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ label })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidateSite();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון קטגוריה" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    // items: [{ id: string, display_order: number }]

    for (const item of items) {
      await supabase
        .from("categories")
        .update({ display_order: item.display_order })
        .eq("id", item.id);
    }

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון סדר" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    // Check if any products use this category
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `לא ניתן למחוק - ${count} מוצרים משתמשים בקטגוריה זו` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "שגיאה במחיקת קטגוריה";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
