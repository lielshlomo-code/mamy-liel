"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  PenLine,
  Link2,
  Scissors,
  Eye,
  MousePointerClick,
  Mail,
} from "lucide-react";
import type { AnalyticsData } from "@/lib/types";

import StatCard from "@/components/admin/analytics/StatCard";
import ChartCard from "@/components/admin/analytics/ChartCard";
import ClicksChart from "@/components/admin/analytics/ClicksChart";
import TopList from "@/components/admin/analytics/TopList";
import ActivityFeed from "@/components/admin/analytics/ActivityFeed";
import DateRangeSelector from "@/components/admin/analytics/DateRangeSelector";

interface Stats {
  products: number;
  posts: number;
  links: number;
  shortLinks: number;
  totalClicks: number;
  contactSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    posts: 0,
    links: 0,
    shortLinks: 0,
    totalClicks: 0,
    contactSubmissions: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [days]);

  const typeLabels: Record<string, string> = {
    sponsored: "הדרכה ממומנת",
    review: "סקירת מוצר",
    ambassador: "שגרירות מותג",
    other: "אחר",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">דשבורד</h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DateRangeSelector value={days} onChange={setDays} />
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
            צפייה באתר
          </Link>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="מוצרים" value={stats.products} icon={Package} />
        <StatCard label="הדרכות" value={stats.posts} icon={PenLine} />
        <StatCard label="קישורים" value={stats.links} icon={Link2} />
        <StatCard
          label="לינקים מקוצרים"
          value={stats.shortLinks}
          icon={Scissors}
        />
        <StatCard
          label="סה״כ לחיצות"
          value={stats.totalClicks}
          icon={MousePointerClick}
        />
        <StatCard label="פניות" value={stats.contactSubmissions} icon={Mail} />
      </div>

      {loading || !analytics ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Short link clicks chart + Top links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <ChartCard
                title="לחיצות על לינקים מקוצרים"
                subtitle={`${analytics.shortLinks.total} לחיצות סה״כ`}
              >
                <ClicksChart
                  data={analytics.shortLinks.daily}
                  label="לחיצות"
                />
              </ChartCard>
            </div>
            <ChartCard title="לינקים מובילים">
              <TopList
                items={analytics.shortLinks.top.map((l) => ({
                  label: l.title || l.code,
                  value: l.clicks,
                  sublabel: `/s/${l.code}`,
                }))}
              />
            </ChartCard>
          </div>

          {/* Product clicks chart + Top products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <ChartCard
                title="לחיצות על מוצרים"
                subtitle={`${analytics.products.total} לחיצות סה״כ`}
              >
                <ClicksChart
                  data={analytics.products.daily}
                  color="#555555"
                  label="לחיצות"
                />
              </ChartCard>
            </div>
            <ChartCard title="מוצרים מובילים">
              <TopList
                items={analytics.products.top.map((p) => ({
                  label: p.productName,
                  value: p.clickCount,
                }))}
              />
            </ChartCard>
          </div>

          {/* Contact submissions chart + Recent contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <ChartCard
                title="פניות לשיתופי פעולה"
                subtitle={`${analytics.contacts.total} פניות סה״כ`}
              >
                <ClicksChart
                  data={analytics.contacts.daily}
                  color="#999999"
                  label="פניות"
                />
              </ChartCard>
            </div>
            <ChartCard title="פניות אחרונות">
              <div className="flex flex-col divide-y divide-border">
                {analytics.contacts.recent.length === 0 ? (
                  <p className="text-sm text-text-secondary py-4 text-center">
                    אין פניות עדיין
                  </p>
                ) : (
                  analytics.contacts.recent.slice(0, 5).map((c) => (
                    <div key={c.id} className="py-2.5 first:pt-0 last:pb-0">
                      <p className="text-sm font-medium">{c.brandName}</p>
                      <p className="text-xs text-text-secondary">
                        {c.contactName} &middot;{" "}
                        {typeLabels[c.type] || c.type}
                      </p>
                      <p className="text-xs text-text-light">
                        {new Date(c.createdAt).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ChartCard>
          </div>

          {/* Activity feed + Quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ChartCard title="פעילות אחרונה" subtitle="לחיצות ופניות">
                <ActivityFeed
                  clickEvents={analytics.activity}
                  recentContacts={analytics.contacts.recent}
                />
              </ChartCard>
            </div>
            <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
              <h3 className="font-semibold mb-4">פעולות מהירות</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/admin/products?new=true"
                  className="px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors text-center"
                >
                  + מוצר חדש
                </Link>
                <Link
                  href="/admin/blog?new=true"
                  className="px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors text-center"
                >
                  + הדרכה חדשה
                </Link>
                <Link
                  href="/admin/short-links?new=true"
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors text-center"
                >
                  + לינק מקוצר
                </Link>
                <Link
                  href="/admin/links?new=true"
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors text-center"
                >
                  + קישור חדש
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
