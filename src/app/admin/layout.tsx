"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PenLine,
  Link2,
  Scissors,
  GraduationCap,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/academy", label: "המכללה", icon: GraduationCap },
  { href: "/admin/users", label: "משתמשים", icon: Users },
  { href: "/admin/mailing", label: "דיוור", icon: Mail },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/blog", label: "הדרכות ומתכונים", icon: PenLine },
  { href: "/admin/links", label: "קישורים", icon: Link2 },
  { href: "/admin/short-links", label: "קיצור לינקים", icon: Scissors },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("סיסמה שגויה");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
    router.push("/admin");
  };

  // Loading
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 flex flex-col gap-5"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold">ממשק ניהול</h1>
            <p className="text-sm text-text-secondary mt-1">mamy.liel</p>
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
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors"
          >
            כניסה
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 start-4 z-50 p-2 bg-white rounded-lg border border-border shadow-sm"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 right-0 h-full w-64 bg-white border-s border-border flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-lg font-bold">
            mamy.liel
          </Link>
          <p className="text-xs text-text-secondary mt-0.5">ממשק ניהול</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-white"
                    : "text-text-secondary hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors w-full px-3 py-2"
          >
            <LogOut className="w-4 h-4" />
            התנתקות
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors w-full px-3 py-2 mt-1"
          >
            חזרה לאתר
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen lg:me-0">
        <div className="pt-16 px-4 pb-6 sm:px-6 lg:pt-8 lg:px-8 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
