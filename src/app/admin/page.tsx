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
  Camera,
  Loader2,
  Briefcase,
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
  activeClients: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    posts: 0,
    links: 0,
    shortLinks: 0,
    totalClicks: 0,
    contactSubmissions: 0,
    activeClients: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});

    fetch("/api/settings?key=profile_image")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) setProfileImage(data.value);
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await uploadRes.json();
      if (!url) throw new Error("Upload failed");

      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "profile_image", value: url }),
      });

      setProfileImage(url);
    } catch {
      alert("שגיאה בהעלאת התמונה");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

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
          <DateRangeSelector value={range} onChange={setRange} />
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

      {/* Profile image */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-8">
        <h3 className="font-semibold mb-4">תמונת פרופיל (דף הבית)</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full bg-foreground text-white flex items-center justify-center text-2xl font-black overflow-hidden shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="פרופיל" className="w-full h-full object-cover" />
            ) : (
              "ל"
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
              {uploadingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              {uploadingImage ? "מעלה..." : profileImage ? "החלפת תמונה" : "העלאת תמונה"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
            <p className="text-xs text-text-secondary">
              מומלץ תמונה מרובעת, עד 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
        <StatCard label="לקוחות פעילים" value={stats.activeClients} icon={Briefcase} />
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
          value={
            analytics
              ? analytics.shortLinks.total + analytics.products.total
              : stats.totalClicks
          }
          icon={MousePointerClick}
        />
        <StatCard
          label="פניות"
          value={analytics ? analytics.contacts.total : stats.contactSubmissions}
          icon={Mail}
        />
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
                  href="/admin/clients"
                  className="px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors text-center"
                >
                  ניהול לקוחות
                </Link>
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
