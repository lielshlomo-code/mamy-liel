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

    const { data, error } = await supabase
      .from("course_categories")
      .insert({ id, label })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "קטגוריה עם מזהה זה כבר קיימת" },
          { status: 409 }
        );
      }
      throw error;
    }

    revalidateSite();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "שגיאה בהוספת קטגוריה" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, label } = await request.json();

    const { data, error } = await supabase
      .from("course_categories")
      .update({ label })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidateSite();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "שגיאה בעדכון קטגוריה" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const { count } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("category", id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `לא ניתן למחוק - ${count} קורסים משתמשים בקטגוריה זו` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("course_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "שגיאה במחיקת קטגוריה";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
