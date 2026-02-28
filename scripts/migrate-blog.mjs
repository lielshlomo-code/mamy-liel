import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "src", "content", "blog");

const supabase = createClient(
  "https://zhqifgoptqqfnkkfiuzq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocWlmZ29wdHFxZm5ra2ZpdXpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5OTUyNiwiZXhwIjoyMDg3ODc1NTI2fQ.3XseL4JlrfH_I5YX80sHSSoBKYTbpcs8gnO59wDOGdQ"
);

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

for (const filename of files) {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs
    .readFileSync(path.join(blogDir, filename), "utf8")
    .replace(/\r\n/g, "\n");

  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.log("Could not parse: " + filename);
    continue;
  }

  const fm = match[1];
  const content = match[2].trim();
  const title = fm.match(/title:\s*"(.+?)"/)?.[1] || "";
  const date = fm.match(/date:\s*"(.+?)"/)?.[1] || "";
  const excerpt = fm.match(/excerpt:\s*"(.+?)"/)?.[1] || "";
  const image = fm.match(/image:\s*"(.+?)"/)?.[1] || null;
  const tagsMatch = fm.match(/tags:\s*\[(.+?)\]/);
  const tags = tagsMatch
    ? tagsMatch[1]
        .match(/"([^"]+)"/g)
        ?.map((t) => t.replace(/"/g, ""))
    : [];

  const { error } = await supabase
    .from("blog_posts")
    .upsert({ slug, title, date, excerpt, image, tags, content });

  if (error) console.log("Error " + slug + ":", error);
  else console.log("Migrated: " + slug);
}
