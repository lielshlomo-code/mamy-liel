"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/types";

const emptyProduct = {
  name: "",
  description: "",
  category: "baby",
  url: "",
  image: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [fetchingImage, setFetchingImage] = useState(false);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories((data.categories || []).filter((c: { id: string }) => c.id !== "all"));
      });
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new") === "true") {
      setEditing({ ...emptyProduct });
      setIsNew(true);
    }
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את המוצר?")) return;

    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const fetchImage = async () => {
    if (!editing?.url) return;
    setFetchingImage(true);
    try {
      const res = await fetch("/api/admin/og-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editing.url }),
      });
      const data = await res.json();
      if (data.image) {
        const updates: Partial<typeof editing> = { image: data.image };
        // If AliExpress API returned an affiliate link, replace the URL
        if (data.affiliateLink) {
          updates.url = data.affiliateLink;
        }
        setEditing({ ...editing, ...updates });
      } else {
        alert("לא נמצאה תמונה בקישור הזה. אפשר להדביק לינק לתמונה ידנית.");
      }
    } catch {
      alert("שגיאה בשליפת תמונה");
    }
    setFetchingImage(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ניהול מוצרים</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyProduct });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          מוצר חדש
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {isNew ? "מוצר חדש" : "עריכת מוצר"}
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
              <label className="text-sm font-medium">שם המוצר</label>
              <input
                type="text"
                value={editing.name || ""}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">קטגוריה</label>
              <select
                value={editing.category || "baby"}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">תיאור</label>
            <input
              type="text"
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">קישור למוצר</label>
            <input
              type="url"
              dir="ltr"
              value={editing.url || ""}
              onChange={(e) =>
                setEditing({ ...editing, url: e.target.value })
              }
              className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">תמונת מוצר</label>
            <div className="flex gap-2">
              <input
                type="url"
                dir="ltr"
                placeholder="קישור לתמונה (או לחצי על שליפה אוטומטית)"
                value={editing.image || ""}
                onChange={(e) =>
                  setEditing({ ...editing, image: e.target.value })
                }
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <button
                type="button"
                onClick={fetchImage}
                disabled={!editing.url || fetchingImage}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {fetchingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                שליפה מהקישור
              </button>
            </div>
            {editing.image && (
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editing.image}
                  alt="תצוגה מקדימה"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="featured"
              checked={editing.featured || false}
              onChange={(e) =>
                setEditing({ ...editing, featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm">
              מוצר מומלץ (יוצג בדף הבית)
            </label>
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

      {/* Products list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {products.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            אין מוצרים עדיין
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-right px-4 py-3 font-medium">שם</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">
                  קטגוריה
                </th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">
                  מומלץ
                </th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-text-secondary" />
                        </div>
                      )}
                      {p.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {p.featured ? "✓" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditing({ ...p });
                          setIsNew(false);
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
