import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
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

export function getProductsData(): ProductsData {
  const raw = fs.readFileSync(path.join(contentDir, "products.json"), "utf8");
  return JSON.parse(raw);
}

export function getProducts(): Product[] {
  return getProductsData().products.sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured);
}

export function getSocialLinks(): SocialLink[] {
  const raw = fs.readFileSync(
    path.join(contentDir, "social-links.json"),
    "utf8"
  );
  return JSON.parse(raw).links;
}

const blogDir = path.join(contentDir, "blog");

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(blogDir, filename), "utf8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        excerpt: data.excerpt || "",
        image: data.image,
        tags: data.tags,
        readingTime: stats.text.replace("read", "קריאה"),
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getBlogPost(slug: string): BlogPost & { content: string } {
  const raw = fs.readFileSync(path.join(blogDir, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || "",
    date: data.date || "",
    excerpt: data.excerpt || "",
    image: data.image,
    tags: data.tags,
    readingTime: stats.text.replace("read", "קריאה"),
    content,
  };
}
