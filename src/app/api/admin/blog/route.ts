import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySession } from "@/lib/auth";
import { getAllBlogPosts, getBlogPost } from "@/lib/content";

const blogDir = path.join(process.cwd(), "src/content/blog");

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = getAllBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, excerpt, tags, content } = await request.json();

    const slug = title
      .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()
      || `post-${Date.now()}`;

    const date = new Date().toISOString().split("T")[0];
    const tagsLine = tags && tags.length > 0
      ? `tags: [${tags.map((t: string) => `"${t}"`).join(", ")}]`
      : "";

    const mdx = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
${tagsLine}
---

${content}
`;

    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    fs.writeFileSync(path.join(blogDir, `${slug}.mdx`), mdx, "utf8");

    return NextResponse.json({ slug, title, date });
  } catch {
    return NextResponse.json({ error: "שגיאה ביצירת פוסט" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, title, excerpt, tags, content } = await request.json();

    const post = getBlogPost(slug);
    const tagsLine = tags && tags.length > 0
      ? `tags: [${tags.map((t: string) => `"${t}"`).join(", ")}]`
      : "";

    const mdx = `---
title: "${title}"
date: "${post.date}"
excerpt: "${excerpt}"
${tagsLine}
---

${content}
`;

    fs.writeFileSync(path.join(blogDir, `${slug}.mdx`), mdx, "utf8");

    return NextResponse.json({ slug, title });
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון פוסט" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    const filePath = path.join(blogDir, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקת פוסט" }, { status: 500 });
  }
}
