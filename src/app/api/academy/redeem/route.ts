import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "קוד גישה חסר" }, { status: 400 });
  }

  // Get authenticated user
  const serverSupabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "יש להתחבר קודם" }, { status: 401 });
  }

  // Find the access record by code
  const { data: access } = await supabase
    .from("user_course_access")
    .select("*")
    .eq("access_code", code)
    .single();

  if (!access) {
    return NextResponse.json(
      { error: "קוד גישה לא תקין או שכבר מומש" },
      { status: 404 }
    );
  }

  // If already assigned to a user, check if it's the same user
  if (access.user_id && access.user_id !== user.id) {
    return NextResponse.json(
      { error: "קוד הגישה כבר מומש על ידי משתמש אחר" },
      { status: 403 }
    );
  }

  // If not yet assigned, assign it to this user
  if (!access.user_id) {
    const { error } = await supabase
      .from("user_course_access")
      .update({ user_id: user.id })
      .eq("id", access.id);

    if (error) {
      return NextResponse.json(
        { error: "שגיאה בהפעלת הגישה" },
        { status: 500 }
      );
    }
  }

  // Get course details
  const { data: course } = await supabase
    .from("courses")
    .select("title, slug")
    .eq("id", access.course_id)
    .single();

  return NextResponse.json({
    courseTitle: course?.title || "",
    courseSlug: course?.slug || "",
  });
}
