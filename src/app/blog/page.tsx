import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/content";
import BlogCard from "@/components/blog/BlogCard";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "הדרכות ומתכונים",
  description: "הדרכות, מתכונים וטיפים על אמהות, תינוקות וחיים",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="pt-24 relative">
      <PageHeader
        title="הדרכות ומתכונים"
        subtitle="הדרכות, מתכונים וטיפים מהחיים שלי כאמא"
      />
      <div className="relative overflow-hidden bg-warm-gradient-reverse min-h-[60vh]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-warm-200/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-rose-100/25 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-24 text-lg">
              הדרכות ומתכונים חדשים בקרוב...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
