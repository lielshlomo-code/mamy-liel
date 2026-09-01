import type { Metadata } from "next";
import { getAcademyData } from "@/lib/content";
import CourseGrid from "@/components/academy/CourseGrid";
import PageHeader from "@/components/ui/PageHeader";

// Cached for a day. This page has no per-user state, and the five-minute window
// it used to sit on regenerated six pages 288 times a day — most of the team's
// 4h/month Vercel Fluid CPU allowance, and running out pauses every site.
// Admin edits don't wait for the window; they call revalidateSite() themselves.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "המכללה הדיגיטלית",
  description: "קורסים דיגיטליים מוקלטים — למדי בקצב שלך, מכל מקום",
};

export default async function AcademyPage() {
  const { courses, categories } = await getAcademyData();

  return (
    <div className="pt-24 relative">
      <PageHeader
        title="המכללה הדיגיטלית"
        subtitle="קורסים מוקלטים שתוכלי ללמוד בקצב שלך, מכל מקום ובכל זמן"
      />

      <div className="relative overflow-hidden bg-warm-gradient-reverse min-h-[60vh]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-rose-100/25 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-40 -left-20 w-[400px] h-[400px] bg-warm-200/35 rounded-full blur-3xl pointer-events-none animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
          {courses.length > 0 ? (
            <CourseGrid courses={courses} categories={categories} />
          ) : (
            <p className="text-center text-text-secondary py-24 text-lg">
              קורסים חדשים בקרוב...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
