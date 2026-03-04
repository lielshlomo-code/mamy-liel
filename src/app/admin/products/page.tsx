"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, ImageIcon, Upload, Tag, ChevronDown, ChevronUp } from "lucide-react";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category management state
  const [showCategories, setShowCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; label: string } | null>(null);
  const [newCategory, setNewCategory] = useState<{ id: string; label: string } | null>(null);
  const [categoryError, setCategoryError] = useState("");

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

  // Category CRUD handlers
  const handleSaveCategory = async (category: { id: string; label: string }, isNewCat: boolean) => {
    setCategoryError("");
    const method = isNewCat ? "POST" : "PUT";
    const res = await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      const data = await res.json();
      setCategoryError(data.error || "שגיאה בשמירת קטגוריה");
      return;
    }

    setEditingCategory(null);
    setNewCategory(null);
    load();
  };

  const handleDeleteCategory = async (id: string) => {
    setCategoryError("");
    if (!confirm("למחוק את הקטגוריה?")) return;

    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setCategoryError(data.error || "שגיאה במחיקת קטגוריה");
      return;
    }

    load();
  };

  const ALI_API_URL =
    "https://aliexpress-services-2-barshlom95.onrender.com/api/ali/product-info";

  const extractProductId = (url: string): string | null => {
    const match =
      url.match(/\/item\/(\d+)\.html/i) ||
      url.match(/\/(\d{10,})\.html/i) ||
      url.match(/productId=(\d+)/i) ||
      url.match(/[\/?&](\d{10,})/);
    return match?.[1] || null;
  };

  const fetchImage = async () => {
    if (!editing?.url) return;
    setFetchingImage(true);
    try {
      const url = editing.url;
      const isAli = /aliexpress\.com|aliexpress\.us|ali\.ski|s\.click\.aliexpress/i.test(url);

      if (isAli) {
        // Call AliExpress API directly from browser (no Vercel timeout)
        let productId = extractProductId(url);

        // If no ID found, use server-side redirect resolution (CORS blocks browser redirects)
        if (!productId) {
          try {
            const resolveRes = await fetch("/api/admin/resolve-ali", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url }),
            });
            const resolveData = await resolveRes.json();
            productId = resolveData.productId || null;
          } catch {
            // resolve failed
          }
        }

        if (productId) {
          const res = await fetch(ALI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, reviews: false }),
          });
          const data = await res.json();
          const item = Array.isArray(data) ? data[0] : data;
          const image = item?.productInfo?.product_main_image_url;
          const affiliateLink = item?.affiliateLink;

          if (image) {
            setEditing({
              ...editing,
              image,
              url: affiliateLink || editing.url,
            });
            setFetchingImage(false);
            return;
          }
        }
        alert("לא נמצא מוצר. בדקי שהלינק תקין.");
      } else {
        // Non-AliExpress: use server-side OG image extraction
        const res = await fetch("/api/admin/og-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.image) {
          setEditing({ ...editing, image: data.image });
        } else {
          alert("לא נמצאה תמונה בקישור הזה. אפשר להדביק לינק לתמונה ידנית.");
        }
      }
    } catch {
      alert("שגיאה בשליפת תמונה");
    }
    setFetchingImage(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setEditing({ ...editing, image: data.url });
      } else {
        alert(data.error || "שגיאה בהעלאת התמונה");
      }
    } catch {
      alert("שגיאה בהעלאת התמונה");
    }
    setUploadingImage(false);
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">ניהול מוצרים</h1>
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

      {/* Category Management Section */}
      <div className="bg-white rounded-xl border border-border mb-6">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-semibold hover:bg-muted/50 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            ניהול קטגוריות
          </div>
          {showCategories ? (
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          )}
        </button>

        {showCategories && (
          <div className="px-3 sm:px-6 pb-5 border-t border-border pt-4">
            {categoryError && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm">
                {categoryError}
              </div>
            )}

            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50"
                >
                  {editingCategory?.id === cat.id ? (
                    <>
                      <span className="text-xs text-text-secondary font-mono min-w-[60px]" dir="ltr">
                        {cat.id}
                      </span>
                      <input
                        type="text"
                        value={editingCategory.label}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, label: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveCategory(editingCategory, false)}
                        className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                        title="שמירה"
                      >
                        <Save className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="ביטול"
                      >
                        <X className="w-4 h-4 text-text-secondary" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-text-secondary font-mono min-w-[60px]" dir="ltr">
                        {cat.id}
                      </span>
                      <span className="flex-1 text-sm">{cat.label}</span>
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title="עריכה"
                      >
                        <Pencil className="w-3.5 h-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="מחיקה"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add new category */}
            {newCategory ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 py-2 mt-2 rounded-lg border border-dashed border-border">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="מזהה (אנגלית)"
                  value={newCategory.id}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })
                  }
                  className="w-full sm:w-24 px-3 py-1.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 font-mono"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="שם הקטגוריה"
                  value={newCategory.label}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, label: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <div className="flex items-center gap-2 self-end">
                  <button
                    onClick={() => handleSaveCategory(newCategory, true)}
                    disabled={!newCategory.id || !newCategory.label}
                    className="p-1.5 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-40"
                    title="שמירה"
                  >
                    <Save className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => setNewCategory(null)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    title="ביטול"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setNewCategory({ id: "", label: "" })}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-text-secondary hover:bg-muted/50 hover:text-foreground transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                קטגוריה חדשה
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
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
            <textarea
              rows={10}
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">קישור למוצר</label>
            <input
              type="url"
              dir="ltr"
              placeholder="הדביקי לינק לאלי אקספרס או לאתר אחר"
              value={editing.url || ""}
              onChange={(e) =>
                setEditing({ ...editing, url: e.target.value })
              }
              className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm font-medium">תמונת מוצר</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={fetchImage}
                disabled={!editing.url || fetchingImage}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {fetchingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                שליפת תמונה מהלינק
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                העלאה מהמחשב
              </button>
            </div>
            <input
              type="url"
              dir="ltr"
              placeholder="או הדביקי קישור ישיר לתמונה"
              value={editing.image || ""}
              onChange={(e) =>
                setEditing({ ...editing, image: e.target.value })
              }
              className="px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
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
      <div className="bg-white rounded-xl border border-border overflow-hidden overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            אין מוצרים עדיין
          </p>
        ) : (
          <table className="w-full text-sm min-w-0">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-right px-2 sm:px-4 py-3 font-medium">שם</th>
                <th className="text-right px-2 sm:px-4 py-3 font-medium hidden sm:table-cell">
                  קטגוריה
                </th>
                <th className="text-right px-2 sm:px-4 py-3 font-medium hidden md:table-cell">
                  מומלץ
                </th>
                <th className="px-2 sm:px-4 py-3 w-20 sm:w-24"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-3 sm:px-4 py-3 font-medium max-w-[200px] sm:max-w-none">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {p.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-text-secondary" />
                        </div>
                      )}
                      <span className="truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-text-secondary">
                    {categories.find((c) => c.id === p.category)?.label || p.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {p.featured ? "✓" : ""}
                  </td>
                  <td className="px-2 sm:px-4 py-3">
                    <div className="flex items-center gap-1 sm:gap-2 justify-end">
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
