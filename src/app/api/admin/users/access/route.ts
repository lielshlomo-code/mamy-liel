import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

// Grant access to a course
export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, courseId } = await request.json();

  if (!userId || !courseId) {
    return NextResponse.json(
      { error: "userId and courseId are required" },
      { status: 400 }
    );
  }

  // Check if already has access
  const { data: existing } = await supabase
    .from("user_course_access")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "למשתמש כבר יש גישה לקורס זה" },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("user_course_access").insert({
    user_id: userId,
    course_id: courseId,
    granted_by: "admin",
    access_code: randomUUID(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Remove access from a course
export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, courseId } = await request.json();

  if (!userId || !courseId) {
    return NextResponse.json(
      { error: "userId and courseId are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_course_access")
    .delete()
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
