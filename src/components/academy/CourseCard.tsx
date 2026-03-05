"use client";

import Link from "next/link";
import { PlayCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Course } from "@/lib/types";

export default function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8 }}
    >
      <Link
        href={`/academy/${course.slug}`}
        className="group flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500"
      >
        {/* Image */}
        <div className="aspect-[16/10] bg-gradient-to-b from-warm-100 to-warm-200 flex items-center justify-center relative overflow-hidden">
          {course.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.image}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <PlayCircle className="w-16 h-16 text-black/[0.08] group-hover:scale-125 transition-transform duration-500" />
          )}

          {/* Free / Price badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                course.isFree
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-foreground"
              }`}
            >
              {course.isFree ? "חינם" : course.price || "בתשלום"}
            </span>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              <PlayCircle className="w-7 h-7 text-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-bold text-lg leading-snug group-hover:text-text-secondary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-text-light mt-auto pt-2 border-t border-black/5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {course.lessonCount || 0} שיעורים
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
