"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Link2,
  Copy,
  Check,
  UserPlus,
  X,
} from "lucide-react";

interface CourseAccess {
  courseId: string;
  courseTitle: string;
  grantedAt: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  courseAccess: CourseAccess[];
}

interface CourseRef {
  id: string;
  title: string;
  slug: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setCourses(data.courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const grantAccess = async (userId: string, courseId: string) => {
    setActionLoading(`grant-${userId}-${courseId}`);
    const res = await fetch("/api/admin/users/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId }),
    });
    if (res.ok) {
      await fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || "שגיאה");
    }
    setActionLoading(null);
  };

  const revokeAccess = async (userId: string, courseId: string) => {
    if (!confirm("להסיר גישה לקורס זה?")) return;
    setActionLoading(`revoke-${userId}-${courseId}`);
    const res = await fetch("/api/admin/users/access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId }),
    });
    if (res.ok) {
      await fetchUsers();
    }
    setActionLoading(null);
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail,
        fullName: newName,
        password: newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setShowAddUser(false);
      await fetchUsers();
    } else {
      setAddError(data.error || "שגיאה ביצירת משתמש");
    }
    setAddLoading(false);
  };

  const generateLink = async (courseId: string) => {
    setActionLoading(`link-${courseId}`);
    const res = await fetch("/api/admin/users/generate-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (res.ok) {
      const { accessCode } = await res.json();
      const link = `${window.location.origin}/academy/redeem?code=${accessCode}`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(courseId);
      setTimeout(() => setCopiedLink(null), 3000);
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
          <p className="text-sm text-text-secondary mt-1">
            {users.length} משתמשים רשומים
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          {showAddUser ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showAddUser ? "ביטול" : "הוספת משתמש"}
        </button>
      </div>

      {/* Add user form */}
      {showAddUser && (
        <form
          onSubmit={addUser}
          className="mb-6 p-4 bg-white rounded-xl border border-border flex flex-col gap-3"
        >
          <h2 className="font-bold text-sm">יצירת משתמש חדש</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-secondary">שם מלא</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="שם מלא"
                className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-secondary">אימייל *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                dir="ltr"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-secondary">סיסמה *</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="לפחות 6 תווים"
                className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                dir="ltr"
                minLength={6}
                required
              />
            </div>
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <button
            type="submit"
            disabled={addLoading}
            className="self-start flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {addLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            יצירת משתמש
          </button>
        </form>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
        <input
          type="text"
          placeholder="חיפוש לפי שם או אימייל..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
        />
      </div>

      {/* Generate access link section */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-border">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          יצירת לינק גישה (ללא משתמש ספציפי)
        </h2>
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => generateLink(course.id)}
              disabled={actionLoading === `link-${course.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-foreground hover:text-white transition-colors disabled:opacity-50"
            >
              {actionLoading === `link-${course.id}` ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : copiedLink === course.id ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {course.title}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-light mt-2">
          לחצי על קורס כדי ליצור לינק גישה ייחודי ולהעתיק אותו
        </p>
      </div>

      {/* Users list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="text-center text-text-secondary py-8">
            לא נמצאו משתמשים
          </p>
        )}

        {filtered.map((user) => {
          const isExpanded = expandedUser === user.id;
          const accessedCourseIds = user.courseAccess.map((a) => a.courseId);
          const unAccessedCourses = courses.filter(
            (c) => !accessedCourseIds.includes(c.id)
          );

          return (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              {/* User row */}
              <button
                onClick={() =>
                  setExpandedUser(isExpanded ? null : user.id)
                }
                className="w-full flex items-center gap-4 px-4 py-3 text-right hover:bg-muted/50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {(user.fullName || user.email).charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user.fullName || "ללא שם"}
                  </p>
                  <p className="text-xs text-text-light truncate" dir="ltr">
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {user.courseAccess.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                      {user.courseAccess.length} קורסים
                    </span>
                  )}
                  <span className="text-xs text-text-light hidden sm:block">
                    {new Date(user.createdAt).toLocaleDateString("he-IL")}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-text-light" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-light" />
                  )}
                </div>
              </button>

              {/* Expanded section */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  {/* Current access */}
                  {user.courseAccess.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-text-secondary mb-2">
                        גישה לקורסים:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.courseAccess.map((access) => (
                          <div
                            key={access.courseId}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
                          >
                            {access.courseTitle}
                            <button
                              onClick={() =>
                                revokeAccess(user.id, access.courseId)
                              }
                              disabled={
                                actionLoading ===
                                `revoke-${user.id}-${access.courseId}`
                              }
                              className="hover:text-red-600 transition-colors"
                              title="הסרת גישה"
                            >
                              {actionLoading ===
                              `revoke-${user.id}-${access.courseId}` ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grant access */}
                  {unAccessedCourses.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-text-secondary mb-2">
                        הוספת גישה:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {unAccessedCourses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => grantAccess(user.id, course.id)}
                            disabled={
                              actionLoading ===
                              `grant-${user.id}-${course.id}`
                            }
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-text-secondary text-xs font-medium hover:bg-foreground hover:text-white transition-colors disabled:opacity-50"
                          >
                            {actionLoading ===
                            `grant-${user.id}-${course.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            {course.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
