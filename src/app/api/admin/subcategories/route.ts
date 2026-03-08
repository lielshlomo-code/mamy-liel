import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, label, categoryId } = await request.json();

    if (!id || !label || !categoryId) {
      return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });
    }

    // Auto-assign display_order as max + 1 within the category
    let nextOrder = 0;
    const { data: maxRow, error: maxError } = await supabase
      .from("subcategories")
      .select("display_order")
      .eq("category_id", categoryId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();
    if (!maxError) {
      nextOrder = (maxRow?.display_order ?? 0) + 1;
    }

    const insertData: Record<string, unknown> = { id, label, category_id: categoryId };
    if (!maxError) insertData.display_order = nextOrder;

    const { data, error } = await supabase
      .from("subcategories")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "תת-קטגוריה עם מזהה זה כבר קיימת" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת תת-קטגוריה" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, label, categoryId } = await request.json();

    if (!id || !label) {
      return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });
    }

    const updateFields: { label: string; category_id?: string } = { label };
    if (categoryId) {
      updateFields.category_id = categoryId;
    }

    const { data, error } = await supabase
      .from("subcategories")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If category changed, update all products that use this subcategory
    if (categoryId) {
      await supabase
        .from("products")
        .update({ category: categoryId })
        .eq("subcategory", id);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון תת-קטגוריה" }, { status: 500 });
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
        .from("subcategories")
        .update({ display_order: item.display_order })
        .eq("id", item.id);
    }

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

    // Check if any products use this subcategory
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("subcategory", id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `לא ניתן למחוק - ${count} מוצרים משתמשים בתת-קטגוריה זו` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "שגיאה במחיקת תת-קטגוריה";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
