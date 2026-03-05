import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: categories } = await supabase
    .from("course_categories")
    .select("*")
    .order("id");

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("order_index")
    .order("date_added", { ascending: false });

  const courseIds = (courses || []).map((c) => c.id);

  let lessonCounts: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: lessons } = await supabase
      .from("course_lessons")
      .select("course_id")
      .in("course_id", courseIds);

    for (const l of lessons || []) {
      lessonCounts[l.course_id] = (lessonCounts[l.course_id] || 0) + 1;
    }
  }

  return NextResponse.json({
    categories: (categories || []),
    courses: (courses || []).map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      category: c.category,
      image: c.image,
      isFree: c.is_free,
      price: c.price,
      paymentUrl: c.payment_url,
      featured: c.featured,
      published: c.published,
      dateAdded: c.date_added,
      orderIndex: c.order_index,
      lessonCount: lessonCounts[c.id] || 0,
    })),
  });
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await request.json();
    const id = `course-${Date.now()}`;
    const dateAdded = new Date().toISOString().split("T")[0];

    const slug =
      course.title
        .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase() || `course-${Date.now()}`;

    const { data, error } = await supabase
      .from("courses")
      .insert({
        id,
        title: course.title,
        slug,
        description: course.description || "",
        category: course.category || "",
        image: course.image || null,
        is_free: course.isFree || false,
        price: course.price || null,
        payment_url: course.paymentUrl || null,
        featured: course.featured || false,
        published: course.published || false,
        date_added: dateAdded,
        order_index: course.orderIndex || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category,
      image: data.image,
      isFree: data.is_free,
      price: data.price,
      paymentUrl: data.payment_url,
      featured: data.featured,
      published: data.published,
      dateAdded: data.date_added,
      orderIndex: data.order_index,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה ביצירת קורס" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await request.json();

    const { data, error } = await supabase
      .from("courses")
      .update({
        title: updated.title,
        description: updated.description || "",
        category: updated.category || "",
        image: updated.image || null,
        is_free: updated.isFree || false,
        price: updated.price || null,
        payment_url: updated.paymentUrl || null,
        featured: updated.featured || false,
        published: updated.published || false,
        order_index: updated.orderIndex || 0,
      })
      .eq("id", updated.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category,
      image: data.image,
      isFree: data.is_free,
      price: data.price,
      paymentUrl: data.payment_url,
      featured: data.featured,
      published: data.published,
      dateAdded: data.date_added,
      orderIndex: data.order_index,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון קורס" }, { status: 500 });
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
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת קורס" }, { status: 500 });
  }
}
