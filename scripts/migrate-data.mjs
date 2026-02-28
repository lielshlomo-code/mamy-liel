import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "..", "src", "content");

const supabase = createClient(
  "https://zhqifgoptqqfnkkfiuzq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocWlmZ29wdHFxZm5ra2ZpdXpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5OTUyNiwiZXhwIjoyMDg3ODc1NTI2fQ.3XseL4JlrfH_I5YX80sHSSoBKYTbpcs8gnO59wDOGdQ"
);

async function migrate() {
  console.log("Starting data migration...\n");

  // 1. Migrate categories
  const productsData = JSON.parse(
    fs.readFileSync(path.join(contentDir, "products.json"), "utf8")
  );
  const categories = productsData.categories.filter((c) => c.id !== "all");
  const { error: catErr } = await supabase.from("categories").upsert(categories);
  if (catErr) console.error("Categories error:", catErr);
  else console.log(`Migrated ${categories.length} categories`);

  // 2. Migrate products
  const products = productsData.products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    url: p.url,
    image: p.image || null,
    featured: p.featured || false,
    date_added: p.dateAdded,
  }));
  const { error: prodErr } = await supabase.from("products").upsert(products);
  if (prodErr) console.error("Products error:", prodErr);
  else console.log(`Migrated ${products.length} products`);

  // 3. Migrate social links
  const linksData = JSON.parse(
    fs.readFileSync(path.join(contentDir, "social-links.json"), "utf8")
  );
  const links = linksData.links.map((l) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    icon: l.icon,
    internal: l.internal || false,
  }));
  const { error: linkErr } = await supabase.from("social_links").upsert(links);
  if (linkErr) console.error("Links error:", linkErr);
  else console.log(`Migrated ${links.length} social links`);

  // 4. Migrate blog posts
  const blogDir = path.join(contentDir, "blog");
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(blogDir, filename), "utf8");

    // Parse frontmatter manually
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.error(`Could not parse ${filename}`);
      continue;
    }

    const frontmatter = match[1];
    const content = match[2].trim();

    const title = frontmatter.match(/title:\s*"(.+?)"/)?.[1] || "";
    const date = frontmatter.match(/date:\s*"(.+?)"/)?.[1] || "";
    const excerpt = frontmatter.match(/excerpt:\s*"(.+?)"/)?.[1] || "";
    const image = frontmatter.match(/image:\s*"(.+?)"/)?.[1] || null;
    const tagsMatch = frontmatter.match(/tags:\s*\[(.+?)\]/);
    const tags = tagsMatch
      ? tagsMatch[1].match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, "")) || []
      : [];

    const { error: blogErr } = await supabase.from("blog_posts").upsert({
      slug,
      title,
      date,
      excerpt,
      image,
      tags,
      content,
    });
    if (blogErr) console.error(`Blog error (${slug}):`, blogErr);
    else console.log(`Migrated blog post: ${slug}`);
  }

  console.log("\nMigration complete!");
}

migrate().catch(console.error);
