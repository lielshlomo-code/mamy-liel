import type { Metadata } from "next";
import { getAcademyData } from "@/lib/content";
import CourseGrid from "@/components/academy/CourseGrid";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

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
