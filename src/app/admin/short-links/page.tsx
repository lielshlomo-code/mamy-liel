"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Copy, Check, ExternalLink } from "lucide-react";
import type { ShortLink } from "@/lib/types";

const emptyLink = {
  targetUrl: "",
  title: "",
  code: "",
};

export default function AdminShortLinks() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [editing, setEditing] = useState<{
    targetUrl: string;
    title: string;
    code: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://mamy-liel.com";

  const load = () => {
    fetch("/api/admin/short-links")
      .then((r) => r.json())
      .then(setLinks)
      .catch(() => {});
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new") === "true") {
      setEditing({ ...emptyLink });
    }
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setError("");

    if (!editing.targetUrl) {
      setError("יש להזין כתובת URL");
      return;
    }

    const res = await fetch("/api/admin/short-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "שגיאה ביצירת קישור");
      return;
    }

    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את הקישור המקוצר?")) return;

    await fetch("/api/admin/short-links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(`${siteUrl}/s/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">קיצור לינקים</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyLink });
            setError("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          קישור חדש
        </button>
      </div>

      {/* Create form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">קישור מקוצר חדש</h2>
            <button onClick={() => setEditing(null)}>
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                כתובת URL מלאה <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                dir="ltr"
                value={editing.targetUrl}
                onChange={(e) =>
                  setEditing({ ...editing, targetUrl: e.target.value })
                }
                placeholder="https://mamy-liel.com/blog/..."
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">שם / תיאור</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="למשל: מתכון שוקולד חמה"
                  className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  קוד מותאם אישית{" "}
                  <span className="text-text-secondary font-normal">
                    (אופציונלי)
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary whitespace-nowrap" dir="ltr">
                    /s/
                  </span>
                  <input
                    type="text"
                    dir="ltr"
                    value={editing.code}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        code: e.target.value
                          .replace(/[^a-zA-Z0-9-]/g, "")
                          .toLowerCase(),
                      })
                    }
                    placeholder="abc123"
                    className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Save className="w-4 h-4" />
            יצירת קישור
          </button>
        </div>
      )}

      {/* Links list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {links.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            אין קישורים מקוצרים עדיין
          </p>
        ) : (
          <div className="divide-y divide-border">
            {links.map((link) => (
              <div key={link.id} className="p-3 sm:p-4 flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {link.title && (
                      <span className="font-medium text-sm">
                        {link.title}
                      </span>
                    )}
                    <span className="text-xs text-text-secondary bg-muted px-2 py-0.5 rounded-full">
                      {link.clicks} לחיצות
                    </span>
                  </div>
                  <div
                    className="text-xs sm:text-sm font-mono text-foreground truncate"
                    dir="ltr"
                  >
                    {siteUrl}/s/{link.code}
                  </div>
                  <div
                    className="text-xs text-text-secondary truncate mt-0.5"
                    dir="ltr"
                  >
                    → {link.targetUrl}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    onClick={() => copyToClipboard(link.code, link.id)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="העתקת קישור"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="פתיחת היעד"
                  >
                    <ExternalLink className="w-4 h-4 text-text-secondary" />
                  </a>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="מחיקה"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
