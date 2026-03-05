"use client";

import { PlayCircle, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { CourseLesson } from "@/lib/types";

interface LessonListProps {
  lessons: CourseLesson[];
  hasAccess: boolean;
  activeLesson: string | null;
  onSelect: (lesson: CourseLesson) => void;
}

export default function LessonList({
  lessons,
  hasAccess,
  activeLesson,
  onSelect,
}: LessonListProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-bold text-lg mb-3">
        תוכן הקורס ({lessons.length} שיעורים)
      </h3>

      {lessons.map((lesson, i) => {
        const canWatch = hasAccess || lesson.isPreview;
        const isActive = activeLesson === lesson.id;

        return (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => canWatch && onSelect(lesson)}
            disabled={!canWatch}
            className={`w-full text-right flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-foreground text-white"
                : canWatch
                ? "bg-white hover:bg-muted cursor-pointer"
                : "bg-white/50 text-text-light cursor-not-allowed"
            }`}
          >
            {/* Number */}
            <span
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-muted text-text-secondary"
              }`}
            >
              {i + 1}
            </span>

            {/* Title & meta */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-sm truncate ${
                  isActive ? "text-white" : ""
                }`}
              >
                {lesson.title}
              </p>
              {lesson.duration && (
                <p
                  className={`text-xs mt-0.5 ${
                    isActive ? "text-white/70" : "text-text-light"
                  }`}
                >
                  {lesson.duration}
                </p>
              )}
            </div>

            {/* Icon */}
            <div className="shrink-0">
              {!canWatch ? (
                <Lock className="w-4 h-4" />
              ) : lesson.isPreview && !hasAccess ? (
                <Eye className="w-4 h-4" />
              ) : (
                <PlayCircle
                  className={`w-4 h-4 ${isActive ? "text-white" : ""}`}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
