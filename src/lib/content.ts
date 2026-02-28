import fs from "fs";
import path from "path";
import readingTime from "reading-time";
import { supabase } from "./supabase";
import type {
  ProductsData,
  Product,
  SocialLink,
  SiteConfig,
  BlogPost,
} from "./types";

const contentDir = path.join(process.cwd(), "src/content");

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(path.join(contentDir, "site-config.json"), "utf8");
  return JSON.parse(raw);
}

export async function getProductsData(): Promise<ProductsData> {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("date_added", { ascending: false });

  const allCategory = { id: "all", label: "הכל" };

  return {
    categories: [allCategory, ...(categories || [])],
    products: (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      url: p.url,
      image: p.image,
      featured: p.featured,
      dateAdded: p.date_added,
    })),
  };
}

export async function getProducts(): Promise<Product[]> {
  const data = await getProductsData();
  return data.products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("date_added", { ascending: false });

  return (products || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    url: p.url,
    image: p.image,
    featured: p.featured,
    dateAdded: p.date_added,
  }));
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase.from("social_links").select("*");
  return (data || []).map((l) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    icon: l.icon,
    internal: l.internal,
  }));
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, date, excerpt, image, media_url, tags, content")
    .order("date", { ascending: false });

  return (data || []).map((post) => {
    const stats = readingTime(post.content || "");
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      image: post.image,
      mediaUrl: post.media_url,
      tags: post.tags,
      readingTime: stats.text.replace("read", "קריאה"),
    };
  });
}

export async function getBlogPost(
  slug: string
): Promise<BlogPost & { content: string }> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) throw new Error(`Blog post not found: ${slug}`);

  const stats = readingTime(data.content || "");

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    image: data.image,
    mediaUrl: data.media_url,
    tags: data.tags,
    readingTime: stats.text.replace("read", "קריאה"),
    content: data.content,
  };
}
