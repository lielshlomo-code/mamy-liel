"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Send,
  Eye,
  History,
  ArrowRight,
  Users,
  BookOpen,
  UserX,
  UserCheck,
  Search,
  X,
} from "lucide-react";

interface MailLog {
  id: string;
  subject: string;
  recipient_count: number;
  sent_at: string;
}

interface CourseRef {
  id: string;
  title: string;
}

interface UserRef {
  id: string;
  email: string;
  fullName: string;
}

type AudienceType = "all" | "course" | "no-course" | "has-any-course" | "users";

const audienceOptions: {
  value: AudienceType;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  {
    value: "all",
    label: "כל המשתמשים",
    description: "שליחה לכל המשתמשים הרשומים",
    icon: Users,
  },
  {
    value: "course",
    label: "לפי קורס",
    description: "משתמשים שיש להם גישה לקורס ספציפי",
    icon: BookOpen,
  },
  {
    value: "has-any-course",
    label: "בעלי קורסים",
    description: "משתמשים שרכשו לפחות קורס אחד",
    icon: UserCheck,
  },
  {
    value: "no-course",
    label: "ללא קורסים",
    description: "משתמשים שעדיין לא רכשו אף קורס",
    icon: UserX,
  },
  {
    value: "users",
    label: "משתמשים ספציפיים",
    description: "בחירה ידנית של משתמשים",
    icon: Users,
  },
];

// Convert plain text to styled HTML
function textToHtml(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" style="color:#c2185b;text-decoration:underline;">$1</a>'
  );

  const paragraphs = html.split(/\n\n+/);

  return paragraphs
    .map((p) => {
      const lines = p.replace(/\n/g, "<br>");
      return `<p style="margin:0 0 16px 0;line-height:1.7;color:#333;font-size:15px;">${lines}</p>`;
    })
    .join("");
}

export default function AdminMailingPage() {
  const [subject, setSubject] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    total: number;
    errors?: string[];
  } | null>(null);
  const [preview, setPreview] = useState(false);
  const [logs, setLogs] = useState<MailLog[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Audience
  const [audience, setAudience] = useState<AudienceType>("all");
  const [courses, setCourses] = useState<CourseRef[]>([]);
  const [users, setUsers] = useState<UserRef[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/mailing")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setCourses(data.courses || []);
        setUsers(data.users || []);
      })
      .catch(() => {});
  }, []);

  const wrapInTemplate = (bodyHtml: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e8e3dc;">
      <h1 style="margin:0 0 20px 0;font-size:22px;color:#1a1a1a;">${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1>
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:#999;font-size:12px;margin-top:24px;">
      mamy.liel - המכללה הדיגיטלית
    </p>
  </div>
</body>
</html>`;

  const getAudienceLabel = () => {
    const opt = audienceOptions.find((o) => o.value === audience);
    if (audience === "course" && selectedCourseIds.length > 0) {
      const names = courses
        .filter((c) => selectedCourseIds.includes(c.id))
        .map((c) => c.title);
      return `${opt?.label}: ${names.join(", ")}`;
    }
    if (audience === "users" && selectedUserIds.length > 0) {
      return `${selectedUserIds.length} משתמשים נבחרו`;
    }
    return opt?.label || "";
  };

  const canSend = () => {
    if (!subject.trim() || !content.trim()) return false;
    if (audience === "course" && selectedCourseIds.length === 0) return false;
    if (audience === "users" && selectedUserIds.length === 0) return false;
    return true;
  };

  const handleSend = async () => {
    if (!canSend()) return;

    if (!confirm(`לשלוח את המייל ל: ${getAudienceLabel()}?`)) return;

    setSending(true);
    setResult(null);

    const htmlContent = wrapInTemplate(textToHtml(content));

    const res = await fetch("/api/admin/mailing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        content: htmlContent,
        audience,
        courseIds: selectedCourseIds,
        userIds: selectedUserIds,
        replyTo: replyTo.trim() || undefined,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setResult(data);
      const logsRes = await fetch("/api/admin/mailing");
      const logsData = await logsRes.json();
      setLogs(logsData.logs || []);
    } else {
      alert(data.error || "שגיאה בשליחה");
    }

    setSending(false);
  };

  const toggleCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">דיוור</h1>
          <p className="text-sm text-text-secondary mt-1">
            שליחת מייל למשתמשים
          </p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
        >
          <History className="w-4 h-4" />
          היסטוריה
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
          <p className="font-bold text-emerald-700">
            נשלח בהצלחה ל-{result.sent} מתוך {result.total} משתמשים
          </p>
          {result.errors && result.errors.length > 0 && (
            <p className="text-red-600 mt-1">
              שגיאות: {result.errors.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* History */}
      {showHistory && (
        <div className="mb-6 bg-white rounded-xl border border-border p-4">
          <h2 className="font-bold text-sm mb-3">היסטוריית שליחות</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-text-secondary">אין היסטוריה</p>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{log.subject}</p>
                    <p className="text-xs text-text-light">
                      {new Date(log.sent_at).toLocaleString("he-IL")}
                    </p>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {log.recipient_count} נמענים
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compose */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex flex-col gap-5">
          {/* Audience selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">קהל יעד</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {audienceOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = audience === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setAudience(opt.value);
                      setSelectedCourseIds([]);
                      setSelectedUserIds([]);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? "border-foreground bg-foreground text-white"
                        : "border-border bg-white hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-light">
              {audienceOptions.find((o) => o.value === audience)?.description}
            </p>
          </div>

          {/* Course picker */}
          {audience === "course" && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs font-bold text-text-secondary">
                בחרי קורסים:
              </p>
              <div className="flex flex-wrap gap-2">
                {courses.map((course) => {
                  const selected = selectedCourseIds.includes(course.id);
                  return (
                    <button
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selected
                          ? "bg-foreground text-white"
                          : "bg-white border border-border hover:bg-muted"
                      }`}
                    >
                      {course.title}
                    </button>
                  );
                })}
              </div>
              {selectedCourseIds.length === 0 && (
                <p className="text-xs text-amber-600">
                  יש לבחור לפחות קורס אחד
                </p>
              )}
            </div>
          )}

          {/* User picker */}
          {audience === "users" && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs font-bold text-text-secondary">
                בחרי משתמשים:
              </p>

              {/* Selected users pills */}
              {selectedUserIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {selectedUserIds.map((id) => {
                    const u = users.find((u) => u.id === id);
                    return (
                      <span
                        key={id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-white text-xs font-medium"
                      >
                        {u?.fullName || u?.email || id}
                        <button
                          onClick={() => toggleUser(id)}
                          className="hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="חיפוש משתמש..."
                  className="w-full pr-8 pl-3 py-2 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>

              {/* User list */}
              <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                {filteredUsers.map((user) => {
                  const selected = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-right text-xs transition-colors ${
                        selected
                          ? "bg-foreground/10 font-bold"
                          : "hover:bg-white"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          selected
                            ? "bg-foreground border-foreground text-white"
                            : "border-border"
                        }`}
                      >
                        {selected && (
                          <svg
                            className="w-2.5 h-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 truncate">
                        {user.fullName || "ללא שם"}
                      </span>
                      <span className="text-text-light truncate" dir="ltr">
                        {user.email}
                      </span>
                    </button>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <p className="text-xs text-text-light py-2 text-center">
                    לא נמצאו משתמשים
                  </p>
                )}
              </div>

              {selectedUserIds.length === 0 && (
                <p className="text-xs text-amber-600">
                  יש לבחור לפחות משתמש אחד
                </p>
              )}
            </div>
          )}

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">נושא</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="נושא המייל..."
              className="px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
            />
          </div>

          {/* Reply-to */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">כתובת לתשובות (reply-to)</label>
            <input
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="your@email.com"
              dir="ltr"
              className="px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
            />
            <p className="text-xs text-text-light">
              כשמישהו עונה למייל, התשובה תגיע לכתובת הזו. אם ריק - ישתמש בכתובת ברירת המחדל.
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">תוכן</label>
              <button
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-foreground transition-colors"
              >
                {preview ? (
                  <>
                    <ArrowRight className="w-3 h-3" />
                    עריכה
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    תצוגה מקדימה
                  </>
                )}
              </button>
            </div>

            {preview ? (
              <div
                className="min-h-[300px] rounded-lg border border-border overflow-hidden"
                style={{ background: "#faf8f5" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: wrapInTemplate(textToHtml(content)),
                  }}
                />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  "היי!\n\nרצינו לעדכן אותך על קורס חדש שהעלינו למכללה.\n\nלפרטים נוספים:\nhttps://example.com\n\nנשמח לראות אותך שם!"
                }
                className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm min-h-[300px] resize-y leading-relaxed"
              />
            )}

            <p className="text-xs text-text-light">
              פשוט כתבי טקסט רגיל. שורה ריקה = פסקה חדשה. קישורים יהפכו
              ללחיצים אוטומטית.
            </p>
          </div>

          {/* Send */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSend}
              disabled={sending || !canSend()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              שליחה
            </button>
            <span className="text-xs text-text-light">{getAudienceLabel()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
