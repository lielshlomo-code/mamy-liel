import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourseLessons,
  getUserCourseAccess,
} from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CoursePageClient from "./CoursePageClient";

// No force-dynamic here. The course-access check below reads the session
// cookie, which already makes this route render per request; declaring it
// again only opted the data fetches out of caching as well. The academy is
// idle right now, and crawlers are kept off /academy in robots.txt so an
// unused page stops spending the shared Vercel Fluid CPU allowance.

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  try {
    const course = await getCourseBySlug(slug);
    return {
      title: course.title,
      description: course.description,
    };
  } catch {
    return { title: "קורס לא נמצא" };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  let course;
  try {
    course = await getCourseBySlug(slug);
  } catch {
    notFound();
  }

  const lessons = await getCourseLessons(course.id);

  // Check user session and course access
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  let hasAccess = false;

  if (user) {
    if (course.isFree) {
      // Free courses: any logged-in user has access
      hasAccess = true;
    } else {
      // Paid courses: check user_course_access table
      hasAccess = await getUserCourseAccess(user.id, course.id);
    }
  }

  return (
    <CoursePageClient
      course={course}
      lessons={lessons}
      isLoggedIn={isLoggedIn}
      hasAccess={hasAccess}
    />
  );
}
