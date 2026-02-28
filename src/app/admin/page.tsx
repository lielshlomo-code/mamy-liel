"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, PenLine, Link2, Eye } from "lucide-react";

interface Stats {
  products: number;
  posts: number;
  links: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, posts: 0, links: 0 });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "מוצרים",
      count: stats.products,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "הדרכות ומתכונים",
      count: stats.posts,
      href: "/admin/blog",
      icon: PenLine,
    },
    {
      label: "קישורים",
      count: stats.links,
      href: "/admin/links",
      icon: Link2,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">דשבורד</h1>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
        >
          <Eye className="w-4 h-4" />
          צפייה באתר
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-text-secondary" />
                <span className="text-3xl font-bold">{card.count}</span>
              </div>
              <p className="text-sm text-text-secondary">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">פעולות מהירות</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products?new=true"
            className="px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            + מוצר חדש
          </Link>
          <Link
            href="/admin/blog?new=true"
            className="px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            + הדרכה חדשה
          </Link>
          <Link
            href="/admin/links?new=true"
            className="px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            + קישור חדש
          </Link>
        </div>
      </div>
    </div>
  );
}
