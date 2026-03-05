"use client";

import { useState } from "react";
import type { Course, CourseCategory } from "@/lib/types";
import CourseCard from "./CourseCard";

interface CourseGridProps {
  courses: Course[];
  categories: CourseCategory[];
}

export default function CourseGrid({ courses, categories }: CourseGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="flex flex-col gap-8">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-foreground text-white"
                : "bg-white text-text-secondary hover:bg-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-secondary py-16 text-lg">
          אין קורסים בקטגוריה זו עדיין
        </p>
      )}
    </div>
  );
}
