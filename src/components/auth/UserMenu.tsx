"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        התחברות
      </Link>
    );
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "משתמש";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted transition-colors text-sm font-medium"
      >
        <div className="w-7 h-7 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold">
          {displayName.charAt(0)}
        </div>
        <span className="hidden sm:inline">{displayName}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl border border-border shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-text-light truncate" dir="ltr">
              {user.email}
            </p>
          </div>

          <Link
            href="/academy"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-muted transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            הקורסים שלי
          </Link>

          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.push("/");
              router.refresh();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-muted transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            התנתקות
          </button>
        </div>
      )}
    </div>
  );
}
