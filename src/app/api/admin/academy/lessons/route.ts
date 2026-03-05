import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id");

  if (!courseId) {
    return NextResponse.json({ error: "חסר course_id" }, { status: 400 });
  }

  const { data } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");

  return NextResponse.json(
    (data || []).map((l) => ({
      id: l.id,
      courseId: l.course_id,
      title: l.title,
      description: l.description,
      videoUrl: l.video_url,
      duration: l.duration,
      isPreview: l.is_preview,
      orderIndex: l.order_index,
      published: l.published,
    }))
  );
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lesson = await request.json();
    const id = `lesson-${Date.now()}`;

    const { data, error } = await supabase
      .from("course_lessons")
      .insert({
        id,
        course_id: lesson.courseId,
        title: lesson.title,
        description: lesson.description || null,
        video_url: lesson.videoUrl || "",
        duration: lesson.duration || null,
        is_preview: lesson.isPreview || false,
        order_index: lesson.orderIndex || 0,
        published: lesson.published !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      courseId: data.course_id,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      duration: data.duration,
      isPreview: data.is_preview,
      orderIndex: data.order_index,
      published: data.published,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה בהוספת שיעור" }, { status: 500 });
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
      .from("course_lessons")
      .update({
        title: updated.title,
        description: updated.description || null,
        video_url: updated.videoUrl || "",
        duration: updated.duration || null,
        is_preview: updated.isPreview || false,
        order_index: updated.orderIndex || 0,
        published: updated.published !== false,
      })
      .eq("id", updated.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "שיעור לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      courseId: data.course_id,
      title: data.title,
      description: data.description,
      videoUrl: data.video_url,
      duration: data.duration,
      isPreview: data.is_preview,
      orderIndex: data.order_index,
      published: data.published,
    });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון שיעור" }, { status: 500 });
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
      .from("course_lessons")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת שיעור" }, { status: 500 });
  }
}
