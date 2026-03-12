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
  let { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  // Fallback if display_order column doesn't exist yet
  if (catError) {
    ({ data: categories } = await supabase.from("categories").select("*").order("id"));
  }

  let { data: subcategories, error: subError } = await supabase
    .from("subcategories")
    .select("*")
    .order("display_order");
  if (subError) {
    ({ data: subcategories } = await supabase.from("subcategories").select("*").order("id"));
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
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
      published: p.published,
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
    .eq("published", true)
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
    published: p.published,
    dateAdded: p.date_added,
  }));
}

// Simple seeded random number generator for deterministic weekly selection
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Get the ISO week number for consistent weekly rotation
function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + now.getFullYear() * 100;
}

export async function getWeeklyRandomProducts(count = 10): Promise<Product[]> {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .not("image", "is", null);

  if (!products || products.length === 0) return [];

  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory || undefined,
    url: p.url,
    image: p.image,
    featured: p.featured,
    published: p.published,
    dateAdded: p.date_added,
  }));

  // Group products by subcategory (use category as fallback if no subcategory)
  const groups: Record<string, Product[]> = {};
  for (const p of mapped) {
    const key = p.subcategory || `_cat_${p.category}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  const rand = seededRandom(getWeekNumber());
  const groupKeys = Object.keys(groups);

  // Shuffle group keys so each week picks from different subcategories first
  for (let i = groupKeys.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [groupKeys[i], groupKeys[j]] = [groupKeys[j], groupKeys[i]];
  }

  // Pick one random product from each subcategory
  const selected: Product[] = [];
  for (const key of groupKeys) {
    if (selected.length >= count) break;
    const group = groups[key];
    const idx = Math.floor(rand() * group.length);
    selected.push(group[idx]);
  }

  // If we still need more products (fewer subcategories than count),
  // pick additional random products from remaining items
  if (selected.length < count) {
    const selectedIds = new Set(selected.map((p) => p.id));
    const remaining = mapped.filter((p) => !selectedIds.has(p.id));
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    for (const p of remaining) {
      if (selected.length >= count) break;
      selected.push(p);
    }
  }

  return selected;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("published", true);
  return (data || []).map((l) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    icon: l.icon,
    internal: l.internal,
    published: l.published,
  }));
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, date, excerpt, image, media_url, tags, content, published")
    .eq("published", true)
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
      published: post.published,
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
    .eq("published", true)
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
    published: data.published,
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
