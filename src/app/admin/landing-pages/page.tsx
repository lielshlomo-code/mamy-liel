"use client";

import { useEffect, useState } from "react";
import { Eye, MousePointerClick, Percent, ExternalLink, Copy, Check } from "lucide-react";

import StatCard from "@/components/admin/analytics/StatCard";
import ChartCard from "@/components/admin/analytics/ChartCard";
import TopList from "@/components/admin/analytics/TopList";
import DateRangeSelector from "@/components/admin/analytics/DateRangeSelector";

interface LandingDaily {
  date: string;
  views: number;
  leads: number;
}

interface LandingPage {
  page: string;
  views: number;
  leads: number;
  conversionRate: number;
}

interface CountryData {
  country: string;
  count: number;
}

interface LandingAnalytics {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  daily: LandingDaily[];
  pages: LandingPage[];
  countries: CountryData[];
}

// Inline dual-area chart for views + leads
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
}

function LandingChart({ data }: { data: LandingDaily[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-12 text-center">
        אין נתונים עדיין
      </p>
    );
  }

  return (
    <div className="h-48 sm:h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: "#555" }}
            tickLine={false}
            axisLine={{ stroke: "#e0e0e0" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#555" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={30}
          />
          <Tooltip
            labelFormatter={(v) => formatDate(String(v))}
            formatter={(value, name) => [
              value ?? 0,
              name === "views" ? "צפיות" : "לידים",
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              fontSize: "13px",
              direction: "rtl",
            }}
          />
          <Legend
            formatter={(value) => (value === "views" ? "צפיות" : "לידים")}
            wrapperStyle={{ fontSize: "12px", direction: "rtl" }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradViews)"
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#gradLeads)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const LANDING_PAGES = [
  {
    slug: "ofertas",
    label: "Ofertas WhatsApp (ספרדית)",
    description: "דף נחיתה לקבוצת ווטסאפ - מבצעים לאמהות",
    path: "/ofertas.html",
  },
  {
    slug: "whatsapp-il",
    label: "קבוצת WhatsApp (עברית)",
    description: "דף נחיתה לקבוצת ווטסאפ - עברית",
    path: "/whatsapp-il.html",
  },
];

const PAGE_LABELS: Record<string, string> = {};
for (const p of LANDING_PAGES) PAGE_LABELS[p.slug] = p.label;

export default function LandingPagesAdmin() {
  const [analytics, setAnalytics] = useState<LandingAnalytics | null>(null);
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const copyLink = (slug: string, path: string) => {
    const url = `https://www.mamy-liel.com${path}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/landing-analytics?range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">דפי נחיתה</h1>
        <DateRangeSelector value={range} onChange={setRange} />
      </div>

      {/* Landing pages list */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-8">
        <h3 className="font-semibold mb-4">דפי נחיתה פעילים</h3>
        <div className="flex flex-col gap-3">
          {LANDING_PAGES.map((lp) => (
            <div
              key={lp.slug}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{lp.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{lp.description}</p>
                <p className="text-xs text-text-light mt-0.5 font-mono" dir="ltr">
                  mamy-liel.com{lp.path}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyLink(lp.slug, lp.path)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  {copiedSlug === lp.slug ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">הועתק!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      העתק קישור
                    </>
                  )}
                </button>
                <a
                  href={lp.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-white text-xs font-medium hover:bg-accent-hover transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  פתח
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading || !analytics ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <StatCard label="צפיות" value={analytics.totalViews} icon={Eye} />
            <StatCard label="לידים" value={analytics.totalLeads} icon={MousePointerClick} />
            <div className="bg-white rounded-xl border border-border p-3 sm:p-5">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
                <span className="text-xl sm:text-3xl font-bold">
                  {analytics.conversionRate}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary">אחוז המרה</p>
            </div>
          </div>

          {/* Daily chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <ChartCard
                title="צפיות ולידים לפי יום"
                subtitle={`${analytics.totalViews} צפיות, ${analytics.totalLeads} לידים`}
              >
                <LandingChart data={analytics.daily} />
              </ChartCard>
            </div>
            <ChartCard title="מדינות מובילות">
              <TopList
                items={analytics.countries.map((c) => ({
                  label: c.country,
                  value: c.count,
                }))}
                valueLabel="צפיות"
              />
            </ChartCard>
          </div>

          {/* Per-page breakdown */}
          <ChartCard title="ביצועים לפי דף">
            {analytics.pages.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">
                אין נתונים עדיין
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-secondary">
                      <th className="py-2 text-start font-medium">דף</th>
                      <th className="py-2 text-center font-medium">צפיות</th>
                      <th className="py-2 text-center font-medium">לידים</th>
                      <th className="py-2 text-center font-medium">המרה</th>
                      <th className="py-2 text-end font-medium">קישור</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.pages.map((p) => (
                      <tr key={p.page} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium">
                          {PAGE_LABELS[p.page] || p.page}
                        </td>
                        <td className="py-3 text-center">{p.views.toLocaleString("he-IL")}</td>
                        <td className="py-3 text-center">{p.leads.toLocaleString("he-IL")}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.conversionRate >= 10
                                ? "bg-green-100 text-green-700"
                                : p.conversionRate >= 5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          <a
                            href={`/${p.page}.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-text-secondary hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </>
      )}
    </div>
  );
}
