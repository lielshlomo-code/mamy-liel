"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, Megaphone } from "lucide-react";
import type { SocialLink } from "@/lib/types";

const iconOptions = [
  { value: "instagram", label: "אינסטגרם" },
  { value: "messageCircle", label: "ווטסאפ" },
  { value: "heart", label: "לב" },
  { value: "penLine", label: "עט" },
  { value: "handshake", label: "לחיצת יד" },
  { value: "externalLink", label: "קישור חיצוני" },
];

const emptyLink = {
  label: "",
  url: "",
  icon: "externalLink",
  internal: false,
  published: true,
  showInPopup: false,
};

export default function AdminLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => {
    fetch("/api/admin/links")
      .then((r) => r.json())
      .then(setLinks);
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new") === "true") {
      setEditing({ ...emptyLink });
      setIsNew(true);
    }
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/links", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleTogglePublished = async (link: SocialLink) => {
    await fetch("/api/admin/links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: link.id,
        label: link.label,
        url: link.url,
        icon: link.icon,
        internal: link.internal,
        published: !link.published,
        showInPopup: link.showInPopup,
      }),
    });
    load();
  };

  const handleToggleShowInPopup = async (link: SocialLink) => {
    await fetch("/api/admin/links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: link.id,
        label: link.label,
        url: link.url,
        icon: link.icon,
        internal: link.internal,
        published: link.published,
        showInPopup: !link.showInPopup,
      }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את הקישור?")) return;

    await fetch("/api/admin/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">ניהול קישורים</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyLink });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          קישור חדש
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {isNew ? "קישור חדש" : "עריכת קישור"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">טקסט הקישור</label>
              <input
                type="text"
                value={editing.label || ""}
                onChange={(e) =>
                  setEditing({ ...editing, label: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">אייקון</label>
              <select
                value={editing.icon || "externalLink"}
                onChange={(e) =>
                  setEditing({ ...editing, icon: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">כתובת URL</label>
            <input
              type="text"
              dir="ltr"
              value={editing.url || ""}
              onChange={(e) =>
                setEditing({ ...editing, url: e.target.value })
              }
              placeholder="https://... או /path לקישור פנימי"
              className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="internal"
              checked={editing.internal || false}
              onChange={(e) =>
                setEditing({ ...editing, internal: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="internal" className="text-sm">
              קישור פנימי (בתוך האתר)
            </label>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="published"
              checked={editing.published !== false}
              onChange={(e) =>
                setEditing({ ...editing, published: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm">
              מפורסם (גלוי באתר)
            </label>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="showInPopup"
              checked={editing.showInPopup || false}
              onChange={(e) =>
                setEditing({ ...editing, showInPopup: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="showInPopup" className="text-sm">
              הצגה בפופאפ
            </label>
            <span className="text-xs text-text-secondary">
              — יופיע בפופאפ ההנחות בכניסה לאתר
            </span>
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

      {/* Links list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden overflow-x-auto">
        {links.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            אין קישורים עדיין
          </p>
        ) : (
          <table className="w-full text-sm min-w-0">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-right px-4 py-3 font-medium">טקסט</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">
                  כתובת
                </th>
                <th className="text-center px-4 py-3 font-medium w-20">סטטוס</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr
                  key={link.id}
                  className={`border-b border-border last:border-0 ${link.published === false ? 'opacity-60' : ''}`}
                >
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {link.label}
                      {link.published === false && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                          מוסתר
                        </span>
                      )}
                      {link.showInPopup && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                          פופאפ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-text-secondary truncate max-w-[200px]" dir="ltr">
                    {link.url}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleTogglePublished(link)}
                      className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                        link.published === false ? 'text-amber-500' : 'text-green-600'
                      }`}
                      title={link.published === false ? "הפעלה" : "השבתה"}
                    >
                      {link.published === false ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleToggleShowInPopup(link)}
                        className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                          link.showInPopup ? 'text-purple-500' : 'text-text-secondary'
                        }`}
                        title={link.showInPopup ? "הסרה מפופאפ" : "הצגה בפופאפ"}
                      >
                        <Megaphone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing({ ...link });
                          setIsNew(false);
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
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
