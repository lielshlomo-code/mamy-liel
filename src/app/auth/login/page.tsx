"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/academy";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "אימייל או סיסמה שגויים"
          : error.message
      );
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col gap-5"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">התחברות</h1>
        <p className="text-sm text-text-secondary mt-1">
          התחברי כדי לצפות בקורסים
        </p>
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
        התחברות
      </button>

      <p className="text-sm text-center text-text-secondary">
        אין לך חשבון?{" "}
        <Link
          href="/auth/register"
          className="text-foreground font-medium underline underline-offset-4"
        >
          הרשמה
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-gradient">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
