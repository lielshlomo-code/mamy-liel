"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingCart,
  BookOpen,
  PlayCircle,
  LogIn,
} from "lucide-react";
import type { Course, CourseLesson } from "@/lib/types";
import VideoPlayer from "@/components/academy/VideoPlayer";
import LessonList from "@/components/academy/LessonList";

interface CoursePageClientProps {
  course: Course;
  lessons: CourseLesson[];
  isLoggedIn: boolean;
  hasAccess: boolean;
}

export default function CoursePageClient({
  course,
  lessons,
  isLoggedIn,
  hasAccess,
}: CoursePageClientProps) {
  const firstAvailable = lessons.find(
    (l) => hasAccess || l.isPreview
  );
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(
    firstAvailable || null
  );

  const handleSelectLesson = (lesson: CourseLesson) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <article className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Back link */}
        <Link
          href="/academy"
          className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-8"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          חזרה למכללה
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            {activeLesson ? (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <VideoPlayer
                  url={activeLesson.videoUrl}
                  title={activeLesson.title}
                />
                <div className="mt-4 mb-8">
                  <h2 className="font-bold text-xl">{activeLesson.title}</h2>
                  {activeLesson.description && (
                    <p className="text-text-secondary text-sm mt-1">
                      {activeLesson.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : course.image ? (
              <div className="aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center mb-8">
                <PlayCircle className="w-20 h-20 text-black/10" />
              </div>
            )}

            {/* Course info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
                {course.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                    course.isFree
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {course.isFree ? "חינם" : course.price || "בתשלום"}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <BookOpen className="w-4 h-4" />
                  {lessons.length} שיעורים
                </span>
              </div>

              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {course.description}
              </p>

              {/* CTA: Login required */}
              {!isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-6 rounded-2xl bg-gradient-to-l from-blue-50 to-warm-100 border border-blue-100"
                >
                  <h3 className="font-bold text-lg mb-2">
                    רוצה לצפות בקורס?
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    התחברי או הירשמי כדי לגשת לתכני הקורס
                  </p>
                  <Link
                    href={`/auth/login?next=/academy/${course.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    התחברות / הרשמה
                  </Link>
                </motion.div>
              )}

              {/* CTA: Payment required for paid courses */}
              {isLoggedIn && !hasAccess && !course.isFree && course.paymentUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-6 rounded-2xl bg-gradient-to-l from-rose-50 to-warm-100 border border-rose-100"
                >
                  <h3 className="font-bold text-lg mb-2">
                    רוצה גישה לכל השיעורים?
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    רכשי את הקורס המלא וקבלי גישה לכל {lessons.length} השיעורים
                  </p>
                  <a
                    href={course.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {course.price
                      ? `רכישת הקורס - ${course.price}`
                      : "לרכישת הקורס"}
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Lesson list */}
          {lessons.length > 0 && (
            <div className="lg:w-[340px] shrink-0">
              <div className="lg:sticky lg:top-28">
                <LessonList
                  lessons={lessons}
                  hasAccess={hasAccess}
                  activeLesson={activeLesson?.id || null}
                  onSelect={handleSelectLesson}
                />

                {/* Mobile login CTA */}
                {!isLoggedIn && (
                  <div className="mt-4 lg:hidden">
                    <Link
                      href={`/auth/login?next=/academy/${course.slug}`}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      התחברות / הרשמה
                    </Link>
                  </div>
                )}

                {/* Mobile payment CTA */}
                {isLoggedIn && !hasAccess && !course.isFree && course.paymentUrl && (
                  <div className="mt-4 lg:hidden">
                    <a
                      href={course.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {course.price
                        ? `רכישת הקורס - ${course.price}`
                        : "לרכישת הקורס"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
