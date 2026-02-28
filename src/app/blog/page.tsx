import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/content";
import BlogCard from "@/components/blog/BlogCard";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "בלוג",
  description: "טיפים, חוויות ותוכן על אמהות, תינוקות וחיים",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="pt-24">
      <PageHeader
        title="הבלוג"
        subtitle="טיפים, חוויות והמלצות מהחיים שלי כאמא"
        num="02"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary py-24 text-lg">
            פוסטים חדשים בקרוב...
          </p>
        )}
      </div>
    </div>
  );
}
