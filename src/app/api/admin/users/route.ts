import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Create a new user manually
export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, fullName, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "אימייל וסיסמה הם שדות חובה" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "הסיסמה חייבת להכיל לפחות 6 תווים" },
      { status: 400 }
    );
  }

  // Create user via admin API (auto-confirms email)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || "" },
  });

  if (error) {
    const msg =
      error.message === "A user with this email address has already been registered"
        ? "משתמש עם אימייל זה כבר קיים"
        : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ userId: data.user.id });
}

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all user profiles
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false });

  // Get auth users email via admin API
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUsers = authData?.users || [];

  // Get all course access records
  const { data: accessRecords } = await supabase
    .from("user_course_access")
    .select("user_id, course_id, granted_at, access_code");

  // Get all courses for reference
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug");

  // Merge data
  const users = (profiles || []).map((profile) => {
    const authUser = authUsers.find((u) => u.id === profile.id);
    const userAccess = (accessRecords || [])
      .filter((a) => a.user_id === profile.id)
      .map((a) => ({
        courseId: a.course_id,
        courseTitle:
          (courses || []).find((c) => c.id === a.course_id)?.title || "",
        grantedAt: a.granted_at,
      }));

    return {
      id: profile.id,
      email: authUser?.email || "",
      fullName: profile.full_name || "",
      createdAt: profile.created_at,
      courseAccess: userAccess,
    };
  });

  return NextResponse.json({ users, courses: courses || [] });
}
