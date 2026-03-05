"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-warm-gradient">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col items-center gap-4 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <h1 className="text-2xl font-bold">ההרשמה הצליחה!</h1>
          <p className="text-text-secondary">
            שלחנו לך מייל אישור לכתובת <strong dir="ltr">{email}</strong>.
            <br />
            לחצי על הלינק במייל כדי להפעיל את החשבון.
          </p>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
          >
            למסך ההתחברות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-gradient">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col gap-5"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">הרשמה</h1>
          <p className="text-sm text-text-secondary mt-1">
            צרי חשבון כדי לגשת לקורסים
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium">
            שם מלא
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            אימייל
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            dir="ltr"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            סיסמה
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            minLength={6}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            אישור סיסמה
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          הרשמה
        </button>

        <p className="text-sm text-center text-text-secondary">
          כבר יש לך חשבון?{" "}
          <Link
            href="/auth/login"
            className="text-foreground font-medium underline underline-offset-4"
          >
            התחברות
          </Link>
        </p>
      </form>
    </div>
  );
}
