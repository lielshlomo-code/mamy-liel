"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({
  post,
  index = 0,
}: {
  post: BlogPost;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block relative"
      >
        {/* Cover image */}
        <div className="aspect-[16/10] rounded-2xl bg-muted overflow-hidden mb-5 relative">
          {post.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.08] group-hover:to-black/[0.15] transition-colors duration-500" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.04] group-hover:to-black/[0.08] transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10rem] font-black text-black/[0.03] group-hover:scale-110 transition-transform duration-700 select-none">
                  {post.title.charAt(0)}
                </span>
              </div>
            </>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-4 right-4 flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-white/90 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-text-light mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString("he-IL")}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-text-secondary transition-colors mb-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Read more */}
        <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
          קראו עוד
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
}
