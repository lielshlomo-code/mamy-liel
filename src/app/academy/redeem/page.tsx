"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function RedeemContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "login">("loading");
  const [courseName, setCourseName] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setErrorMsg("לא סופק קוד גישה");
      return;
    }

    async function redeem() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("login");
        return;
      }

      const res = await fetch("/api/academy/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setCourseName(data.courseTitle);
        setCourseSlug(data.courseSlug);
        setStatus("success");
      } else {
        setErrorMsg(data.error || "שגיאה במימוש הקוד");
        setStatus("error");
      }
    }

    redeem();
  }, [code]);

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col items-center gap-4 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 animate-spin text-foreground" />
          <h1 className="text-xl font-bold">מפעיל קוד גישה...</h1>
        </>
      )}

      {status === "login" && (
        <>
          <XCircle className="w-12 h-12 text-amber-500" />
          <h1 className="text-xl font-bold">נדרשת התחברות</h1>
          <p className="text-text-secondary text-sm">
            כדי לממש את קוד הגישה, יש להתחבר או להירשם קודם
          </p>
          <Link
            href={`/auth/login?next=${encodeURIComponent(`/academy/redeem?code=${code}`)}`}
            className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
          >
            התחברות / הרשמה
          </Link>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <h1 className="text-xl font-bold">הגישה הופעלה!</h1>
          <p className="text-text-secondary text-sm">
            יש לך עכשיו גישה מלאה לקורס <strong>{courseName}</strong>
          </p>
          <Link
            href={`/academy/${courseSlug}`}
            className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
          >
            לצפייה בקורס
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-xl font-bold">שגיאה</h1>
          <p className="text-text-secondary text-sm">{errorMsg}</p>
          <Link
            href="/academy"
            className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
          >
            חזרה למכללה
          </Link>
        </>
      )}
    </div>
  );
}

export default function RedeemPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-gradient">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-foreground" />
            <h1 className="text-xl font-bold">טוען...</h1>
          </div>
        }
      >
        <RedeemContent />
      </Suspense>
    </div>
  );
}
