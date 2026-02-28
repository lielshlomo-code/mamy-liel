import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllBlogPosts, getBlogPost } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import InstagramEmbed from "@/components/blog/InstagramEmbed";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  try {
    const post = await getBlogPost(slug);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return { title: "הדרכה לא נמצאה" };
  }
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function isInstagramUrl(url: string): boolean {
  return /instagram\.com\/(?:reel|p|tv)\//i.test(url);
}

function isVideoUrl(url: string): boolean {
  return (
    /\.(mp4|webm|mov)(\?|$)/i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com|instagram\.com\/(?:reel|p|tv)\//i.test(url)
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  let post;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  const youtubeEmbed = post.mediaUrl ? getYouTubeEmbedUrl(post.mediaUrl) : null;
  const isInstagram = post.mediaUrl ? isInstagramUrl(post.mediaUrl) : false;

  return (
    <article className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-12"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          חזרה להדרכות
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-text-light mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("he-IL")}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-muted px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="w-16 h-[2px] bg-foreground mt-8" />
        </header>

        {/* Cover image */}
        {post.image && (
          <div className="mb-12 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-base prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-strong:text-foreground prose-li:text-text-secondary prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-ul:my-6 prose-li:my-1">
          {content}
        </div>

        {/* Media at end of tutorial */}
        {post.mediaUrl && (
          <div className="mt-12 rounded-2xl overflow-hidden">
            {youtubeEmbed ? (
              <div className="aspect-video">
                <iframe
                  src={youtubeEmbed}
                  title={post.title}
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : isInstagram ? (
              <InstagramEmbed url={post.mediaUrl} />
            ) : isVideoUrl(post.mediaUrl) ? (
              <video
                src={post.mediaUrl}
                controls
                className="w-full rounded-2xl"
                preload="metadata"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.mediaUrl}
                alt="תמונה נוספת"
                className="w-full h-auto object-cover rounded-2xl"
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-black/5 mt-16 pt-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            חזרה לכל ההדרכות
          </Link>
        </div>
      </div>
    </article>
  );
}
