"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import type { BlogPost } from "@/lib/types";

const emptyPost = {
  title: "",
  excerpt: "",
  tags: [] as string[],
  content: "",
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<{
    slug?: string;
    title: string;
    excerpt: string;
    tags: string[];
    content: string;
  } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const load = () => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setPosts);
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new") === "true") {
      setEditing({ ...emptyPost });
      setIsNew(true);
    }
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, tags }),
    });

    setEditing(null);
    setIsNew(false);
    setTagsInput("");
    load();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("למחוק את הפוסט?")) return;

    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    load();
  };

  const handleEdit = async (post: BlogPost) => {
    // Fetch full content
    const res = await fetch(`/api/admin/blog/post?slug=${post.slug}`);
    if (res.ok) {
      const data = await res.json();
      setEditing({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags || [],
        content: data.content || "",
      });
      setTagsInput((post.tags || []).join(", "));
      setIsNew(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול פוסטים</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyPost });
            setIsNew(true);
            setTagsInput("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          פוסט חדש
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {isNew ? "פוסט חדש" : "עריכת פוסט"}
            </h2>
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">כותרת</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">תקציר</label>
              <input
                type="text"
                value={editing.excerpt}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                תגיות (מופרדות בפסיק)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="אמהות, טיפים, המלצות"
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                תוכן (Markdown)
              </label>
              <textarea
                rows={12}
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y font-mono"
                dir="rtl"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Save className="w-4 h-4" />
            שמירה
          </button>
        </div>
      )}

      {/* Posts list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            אין פוסטים עדיין
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-right px-4 py-3 font-medium">כותרת</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">
                  תאריך
                </th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.slug}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                    {new Date(post.date).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
