"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Upload,
  Tag,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Eye,
  EyeOff,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Course, CourseLesson } from "@/lib/types";

const emptyCourse = {
  title: "",
  description: "",
  category: "",
  image: "",
  isFree: false,
  price: "",
  paymentUrl: "",
  featured: false,
  published: false,
  orderIndex: 0,
};

const emptyLesson = {
  title: "",
  description: "",
  videoUrl: "",
  duration: "",
  isPreview: false,
  orderIndex: 0,
  published: true,
};

export default function AdminAcademy() {
  const [courses, setCourses] = useState<(Course & { lessonCount?: number })[]>(
    []
  );
  const [categories, setCategories] = useState<
    { id: string; label: string }[]
  >([]);
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lessons state
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [editingLesson, setEditingLesson] =
    useState<Partial<CourseLesson> | null>(null);
  const [isNewLesson, setIsNewLesson] = useState(false);

  // Categories management
  const [showCategories, setShowCategories] = useState(false);
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");

  const load = () => {
    fetch("/api/admin/academy")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || []);
        setCategories(data.categories || []);
      });
  };

  useEffect(() => {
    load();
  }, []);

  // Course CRUD
  const handleSave = async () => {
    if (!editing) return;
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/academy", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את הקורס וכל השיעורים שלו?")) return;
    await fetch("/api/admin/academy", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (expandedCourse === id) {
      setExpandedCourse(null);
      setLessons([]);
    }
    load();
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Lessons CRUD
  const loadLessons = (courseId: string) => {
    fetch(`/api/admin/academy/lessons?course_id=${courseId}`)
      .then((r) => r.json())
      .then(setLessons);
  };

  const toggleLessons = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      setLessons([]);
      setEditingLesson(null);
    } else {
      setExpandedCourse(courseId);
      loadLessons(courseId);
      setEditingLesson(null);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson || !expandedCourse) return;
    const method = isNewLesson ? "POST" : "PUT";
    const body = isNewLesson
      ? { ...editingLesson, courseId: expandedCourse }
      : editingLesson;
    await fetch("/api/admin/academy/lessons", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditingLesson(null);
    setIsNewLesson(false);
    loadLessons(expandedCourse);
    load();
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("למחוק את השיעור?")) return;
    await fetch("/api/admin/academy/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (expandedCourse) loadLessons(expandedCourse);
    load();
  };

  const moveLessonOrder = async (
    lesson: CourseLesson,
    direction: "up" | "down"
  ) => {
    const idx = lessons.findIndex((l) => l.id === lesson.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) return;

    const other = lessons[swapIdx];
    await Promise.all([
      fetch("/api/admin/academy/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lesson, orderIndex: other.orderIndex }),
      }),
      fetch("/api/admin/academy/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...other, orderIndex: lesson.orderIndex }),
      }),
    ]);
    if (expandedCourse) loadLessons(expandedCourse);
  };

  // Categories
  const addCategory = async () => {
    if (!newCatId || !newCatLabel) return;
    const res = await fetch("/api/admin/academy/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newCatId, label: newCatLabel }),
    });
    if (res.ok) {
      setNewCatId("");
      setNewCatLabel("");
      load();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("למחוק את הקטגוריה?")) return;
    const res = await fetch("/api/admin/academy/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      load();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">ניהול המכללה</h1>
        <button
          onClick={() => {
            setEditing({ ...emptyCourse });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          קורס חדש
        </button>
      </div>

      {/* Categories management */}
      <div className="mb-6">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
        >
          <Tag className="w-4 h-4" />
          ניהול קטגוריות
          {showCategories ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        {showCategories && (
          <div className="mt-3 bg-white rounded-xl border border-border p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
                >
                  {cat.label}
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value)}
                placeholder="מזהה (אנגלית)"
                className="flex-1 px-3 py-2 rounded-lg border border-border text-sm"
              />
              <input
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="שם בעברית"
                className="flex-1 px-3 py-2 rounded-lg border border-border text-sm"
              />
              <button
                onClick={addCategory}
                className="px-3 py-2 rounded-lg bg-foreground text-white text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit course form */}
      {editing && (
        <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">
              {isNew ? "קורס חדש" : "עריכת קורס"}
            </h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">שם הקורס</label>
              <input
                value={editing.title || ""}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                placeholder="שם הקורס"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">תיאור</label>
              <textarea
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm min-h-[100px]"
                placeholder="תיאור הקורס"
                dir="rtl"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">קטגוריה</label>
              <select
                value={editing.category || ""}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm"
              >
                <option value="">בחרי קטגוריה</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">סדר תצוגה</label>
              <input
                type="number"
                value={editing.orderIndex || 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    orderIndex: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-border text-sm"
              />
            </div>

            {/* Image */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">תמונת כיסוי</label>
              <div className="flex gap-2">
                <input
                  value={editing.image || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, image: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm"
                  placeholder="לינק לתמונה"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </button>
              </div>
              {editing.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={editing.image}
                  alt=""
                  className="mt-2 w-40 h-24 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Pricing */}
            <div className="sm:col-span-2 bg-muted rounded-lg p-4">
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isFree || false}
                  onChange={(e) =>
                    setEditing({ ...editing, isFree: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">קורס חינמי</span>
              </label>
              {!editing.isFree && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      מחיר (לתצוגה)
                    </label>
                    <input
                      value={editing.price || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, price: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-white"
                      placeholder='לדוג: ₪149'
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      לינק לתשלום
                    </label>
                    <input
                      value={editing.paymentUrl || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, paymentUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-white"
                      placeholder="לינק PayBox / Grow / bit"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Toggles */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured || false}
                onChange={(e) =>
                  setEditing({ ...editing, featured: e.target.checked })
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">קורס מומלץ</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published || false}
                onChange={(e) =>
                  setEditing({ ...editing, published: e.target.checked })
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">מפורסם (גלוי באתר)</span>
            </label>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Save className="w-4 h-4" />
              שמירה
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false); }}
              className="px-5 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Courses list */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-border overflow-hidden"
          >
            {/* Course row */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Image */}
              {course.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5 text-text-light" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">
                    {course.title}
                  </h3>
                  {!course.published && (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                      טיוטה
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-light">
                  {course.lessonCount || 0} שיעורים
                  {" · "}
                  {course.isFree ? "חינם" : course.price || "בתשלום"}
                  {" · "}
                  {categories.find((c) => c.id === course.category)?.label ||
                    course.category}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleLessons(course.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-text-secondary"
                  title="שיעורים"
                >
                  {expandedCourse === course.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditing({ ...course });
                    setIsNew(false);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-text-secondary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded lessons */}
            {expandedCourse === course.id && (
              <div className="border-t border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">שיעורים</h4>
                  <button
                    onClick={() => {
                      setEditingLesson({
                        ...emptyLesson,
                        orderIndex: lessons.length,
                      });
                      setIsNewLesson(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-white text-xs font-medium hover:bg-accent-hover transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    שיעור חדש
                  </button>
                </div>

                {/* Lesson edit form */}
                {editingLesson && (
                  <div className="bg-white rounded-lg border border-border p-4 mb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          value={editingLesson.title || ""}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                          placeholder="שם השיעור"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          value={editingLesson.description || ""}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                          placeholder="תיאור קצר (אופציונלי)"
                        />
                      </div>
                      <div>
                        <input
                          value={editingLesson.videoUrl || ""}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              videoUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                          placeholder="לינק לוידאו (YouTube/Vimeo/MP4)"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <input
                          value={editingLesson.duration || ""}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                          placeholder='אורך (לדוג: 12:30)'
                          dir="ltr"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingLesson.isPreview || false}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              isPreview: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">תצוגה מקדימה (חינם)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingLesson.published !== false}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              published: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">מפורסם</span>
                      </label>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleSaveLesson}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-white text-xs font-medium"
                      >
                        <Save className="w-3 h-3" />
                        שמירה
                      </button>
                      <button
                        onClick={() => {
                          setEditingLesson(null);
                          setIsNewLesson(false);
                        }}
                        className="px-4 py-1.5 rounded-full border border-border text-xs font-medium"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                )}

                {/* Lessons list */}
                {lessons.length === 0 ? (
                  <p className="text-sm text-text-light py-4 text-center">
                    אין שיעורים עדיין
                  </p>
                ) : (
                  <div className="space-y-1">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm"
                      >
                        <GripVertical className="w-3 h-3 text-text-light shrink-0" />
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="truncate block font-medium">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-text-light">
                            {lesson.duration || ""}
                            {lesson.isPreview && " · תצוגה מקדימה"}
                            {!lesson.published && " · טיוטה"}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => moveLessonOrder(lesson, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveLessonOrder(lesson, "down")}
                            disabled={idx === lessons.length - 1}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingLesson({ ...lesson });
                              setIsNewLesson(false);
                            }}
                            className="p-1 rounded hover:bg-muted text-text-secondary"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1 rounded hover:bg-muted text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <PlayCircle className="w-12 h-12 mx-auto mb-3 text-text-light" />
            <p>אין קורסים עדיין</p>
            <p className="text-sm mt-1">לחצי על &quot;קורס חדש&quot; כדי להתחיל</p>
          </div>
        )}
      </div>
    </div>
  );
}
