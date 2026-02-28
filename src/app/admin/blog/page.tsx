"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ImageIcon, Upload, Loader2 } from "lucide-react";
import type { BlogPost } from "@/lib/types";

const emptyPost = {
  title: "",
  excerpt: "",
  image: "",
  mediaUrl: "",
  tags: [] as string[],
  content: "",
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<{
    slug?: string;
    title: string;
    excerpt: string;
    image: string;
    mediaUrl: string;
    tags: string[];
    content: string;
  } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState<"image" | "media" | null>(null);

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
    if (!confirm("למחוק את ההדרכה?")) return;

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
        image: post.image || "",
        mediaUrl: data.mediaUrl || "",
        tags: post.tags || [],
        content: data.content || "",
      });
      setTagsInput((post.tags || []).join(", "));
      setIsNew(false);
    }
  };

  const handleUpload = async (field: "image" | "media") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(field);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url && editing) {
          if (field === "image") {
            setEditing({ ...editing, image: data.url });
          } else {
            setEditing({ ...editing, mediaUrl: data.url });
          }
        } else {
          alert(data.error || "שגיאה בהעלאה");
        }
      } catch {
        alert("שגיאה בהעלאת הקובץ");
      }
      setUploading(null);
    };
    input.click();
  };

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov)(\?|$)/i.test(url) ||
      /youtube\.com|youtu\.be|vimeo\.com|instagram\.com\/(?:reel|p|tv)\//i.test(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול הדרכות ומתכונים</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyPost });
            setIsNew(true);
            setTagsInput("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          הדרכה חדשה
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {isNew ? "הדרכה חדשה" : "עריכת הדרכה"}
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

            {/* Cover image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">תמונת נושא</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  dir="ltr"
                  placeholder="קישור לתמונה או העלאה מהמחשב"
                  value={editing.image}
                  onChange={(e) =>
                    setEditing({ ...editing, image: e.target.value })
                  }
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <button
                  type="button"
                  onClick={() => handleUpload("image")}
                  disabled={uploading === "image"}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {uploading === "image" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  העלאה
                </button>
              </div>
              {editing.image && (
                <div className="mt-2 relative w-40 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editing.image}
                    alt="תמונת נושא"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
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

            {/* Media at end of tutorial */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">תמונה / סרטון בסוף ההדרכה</label>
              <p className="text-xs text-text-secondary">קישור לתמונה או סרטון (YouTube, mp4 וכו&#39;) או העלאת תמונה מהמחשב</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://example.com/video.mp4 או קישור YouTube"
                  value={editing.mediaUrl}
                  onChange={(e) =>
                    setEditing({ ...editing, mediaUrl: e.target.value })
                  }
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <button
                  type="button"
                  onClick={() => handleUpload("media")}
                  disabled={uploading === "media"}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {uploading === "media" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  העלאה
                </button>
              </div>
              {editing.mediaUrl && (
                <div className="mt-2">
                  {isVideoUrl(editing.mediaUrl) ? (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      סרטון יוצג בסוף ההדרכה
                    </p>
                  ) : (
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={editing.mediaUrl}
                        alt="מדיה בסוף ההדרכה"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
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
            אין הדרכות עדיין
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
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      {post.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-text-secondary" />
                        </div>
                      )}
                      {post.title}
                    </div>
                  </td>
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
