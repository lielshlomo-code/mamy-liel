import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Audience types:
// "all" - all users
// "course" - users with access to specific course(s)
// "no-course" - users without any course access
// "users" - specific user IDs

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, content, audience, courseIds, userIds, replyTo } =
    await request.json();

  if (!subject || !content) {
    return NextResponse.json(
      { error: "subject and content are required" },
      { status: 400 }
    );
  }

  // Get all auth users
  const { data: authData } = await supabase.auth.admin.listUsers();
  const allUsers = authData?.users || [];

  let targetEmails: string[] = [];
  const audienceType = audience || "all";

  if (audienceType === "all") {
    targetEmails = allUsers
      .map((u) => u.email)
      .filter(Boolean) as string[];
  } else if (audienceType === "course" && courseIds?.length > 0) {
    // Users who have access to any of the selected courses
    const { data: accessRecords } = await supabase
      .from("user_course_access")
      .select("user_id")
      .in("course_id", courseIds)
      .not("user_id", "is", null);

    const userIdsWithAccess = [
      ...new Set((accessRecords || []).map((r) => r.user_id)),
    ];

    targetEmails = allUsers
      .filter((u) => userIdsWithAccess.includes(u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];
  } else if (audienceType === "no-course") {
    // Users who don't have access to any paid course
    const { data: accessRecords } = await supabase
      .from("user_course_access")
      .select("user_id")
      .not("user_id", "is", null);

    const userIdsWithAccess = [
      ...new Set((accessRecords || []).map((r) => r.user_id)),
    ];

    targetEmails = allUsers
      .filter((u) => !userIdsWithAccess.includes(u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];
  } else if (audienceType === "has-any-course") {
    // Users who have access to at least one course
    const { data: accessRecords } = await supabase
      .from("user_course_access")
      .select("user_id")
      .not("user_id", "is", null);

    const userIdsWithAccess = [
      ...new Set((accessRecords || []).map((r) => r.user_id)),
    ];

    targetEmails = allUsers
      .filter((u) => userIdsWithAccess.includes(u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];
  } else if (audienceType === "users" && userIds?.length > 0) {
    targetEmails = allUsers
      .filter((u) => userIds.includes(u.id))
      .map((u) => u.email)
      .filter(Boolean) as string[];
  }

  if (targetEmails.length === 0) {
    return NextResponse.json(
      { error: "לא נמצאו נמענים לפי הסינון שנבחר" },
      { status: 400 }
    );
  }

  // Send via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY לא מוגדר" },
      { status: 500 }
    );
  }

  const batchSize = 50;
  let totalSent = 0;
  const errors: string[] = [];

  for (let i = 0; i < targetEmails.length; i += batchSize) {
    const batch = targetEmails.slice(i, i + batchSize);

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        batch.map((email) => ({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "mamy.liel <noreply@resend.dev>",
          to: email,
          reply_to: replyTo || process.env.RESEND_REPLY_TO || undefined,
          subject,
          html: content,
        }))
      ),
    });

    if (res.ok) {
      totalSent += batch.length;
    } else {
      const errData = await res.json().catch(() => ({}));
      errors.push(errData.message || `Batch ${i / batchSize + 1} failed`);
    }
  }

  // Log the mailing
  await supabase.from("mailing_log").insert({
    subject,
    content,
    recipient_count: totalSent,
  });

  return NextResponse.json({
    sent: totalSent,
    total: targetEmails.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// Get mailing history + data for audience picker
export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: logs } = await supabase
    .from("mailing_log")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title");

  // Get user profiles + auth info for user picker
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, full_name")
    .order("created_at", { ascending: false });

  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUsers = authData?.users || [];

  const users = (profiles || []).map((p) => {
    const auth = authUsers.find((u) => u.id === p.id);
    return {
      id: p.id,
      email: auth?.email || "",
      fullName: p.full_name || "",
    };
  });

  return NextResponse.json({
    logs: logs || [],
    courses: courses || [],
    users,
  });
}
