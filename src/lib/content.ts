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
  AcademyData,
  Course,
  CourseLesson,
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

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("id");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("date_added", { ascending: false });

  const allCategory = { id: "all", label: "הכל" };

  const categoriesWithSubs = (categories || []).map((cat) => ({
    id: cat.id,
    label: cat.label,
    subcategories: (subcategories || [])
      .filter((s) => s.category_id === cat.id)
      .map((s) => ({ id: s.id, label: s.label, categoryId: s.category_id })),
  }));

  return {
    categories: [allCategory, ...categoriesWithSubs],
    products: (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || undefined,
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
    subcategory: p.subcategory || undefined,
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

// User course access

export async function getUserCourseAccess(
  userId: string,
  courseId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_course_access")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  return !!data;
}

// Academy

export async function getAcademyData(): Promise<AcademyData> {
  const { data: categories } = await supabase
    .from("course_categories")
    .select("*")
    .order("id");

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("order_index")
    .order("date_added", { ascending: false });

  const courseIds = (courses || []).map((c) => c.id);

  let lessonCounts: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: lessons } = await supabase
      .from("course_lessons")
      .select("course_id")
      .in("course_id", courseIds)
      .eq("published", true);

    for (const l of lessons || []) {
      lessonCounts[l.course_id] = (lessonCounts[l.course_id] || 0) + 1;
    }
  }

  const allCategory = { id: "all", label: "הכל" };

  return {
    categories: [allCategory, ...(categories || [])],
    courses: (courses || []).map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      category: c.category,
      image: c.image,
      isFree: c.is_free,
      price: c.price,
      paymentUrl: c.payment_url,
      featured: c.featured,
      published: c.published,
      dateAdded: c.date_added,
      orderIndex: c.order_index,
      lessonCount: lessonCounts[c.id] || 0,
    })),
  };
}

export async function getCourseBySlug(
  slug: string
): Promise<Course> {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) throw new Error(`Course not found: ${slug}`);

  const { count } = await supabase
    .from("course_lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", data.id)
    .eq("published", true);

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category,
    image: data.image,
    isFree: data.is_free,
    price: data.price,
    paymentUrl: data.payment_url,
    featured: data.featured,
    published: data.published,
    dateAdded: data.date_added,
    orderIndex: data.order_index,
    lessonCount: count || 0,
  };
}

export async function getCourseLessons(
  courseId: string
): Promise<CourseLesson[]> {
  const { data } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("published", true)
    .order("order_index");

  return (data || []).map((l) => ({
    id: l.id,
    courseId: l.course_id,
    title: l.title,
    description: l.description,
    videoUrl: l.video_url,
    duration: l.duration,
    isPreview: l.is_preview,
    orderIndex: l.order_index,
    published: l.published,
  }));
}
