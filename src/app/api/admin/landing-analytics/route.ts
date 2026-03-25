import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "30";

  let since: Date;
  let until: Date | null = null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "today") {
    since = startOfToday;
  } else if (range === "yesterday") {
    since = new Date(startOfToday);
    since.setDate(since.getDate() - 1);
    until = startOfToday;
  } else {
    const days = parseInt(range, 10) || 30;
    since = new Date();
    since.setDate(since.getDate() - days);
  }

  const sinceISO = since.toISOString();
  const untilISO = until ? until.toISOString() : null;

  function queryEvents(eventType: string) {
    let q = supabase
      .from("click_events")
      .select("created_at, target_id, referrer, country")
      .eq("event_type", eventType)
      .gte("created_at", sinceISO);
    if (untilISO) q = q.lt("created_at", untilISO);
    return q.order("created_at", { ascending: true });
  }

  const [viewsRes, leadsRes] = await Promise.all([
    queryEvents("landing_view"),
    queryEvents("landing_lead"),
  ]);

  const viewRows = viewsRes.data || [];
  const leadRows = leadsRes.data || [];

  function groupByDay(rows: { created_at: string }[]) {
    const map: Record<string, number> = {};
    for (const row of rows) {
      const day = row.created_at.split("T")[0];
      map[day] = (map[day] || 0) + 1;
    }
    return map;
  }

  function groupByPage(rows: { target_id: string }[]) {
    const map: Record<string, number> = {};
    for (const row of rows) {
      map[row.target_id] = (map[row.target_id] || 0) + 1;
    }
    return map;
  }

  function groupByCountry(rows: { country: string | null }[]) {
    const map: Record<string, number> = {};
    for (const row of rows) {
      const c = row.country || "Unknown";
      map[c] = (map[c] || 0) + 1;
    }
    return map;
  }

  function buildDailySeries(grouped: Record<string, number>) {
    const series: { date: string; count: number }[] = [];
    const current = new Date(sinceISO);
    const end = until || new Date();
    while (until ? current < end : current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      series.push({ date: dateStr, count: grouped[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }
    return series;
  }

  const viewsByPage = groupByPage(viewRows);
  const leadsByPage = groupByPage(leadRows);

  // Build per-page stats
  const allPages = new Set([...Object.keys(viewsByPage), ...Object.keys(leadsByPage)]);
  const pages = Array.from(allPages).map((page) => {
    const views = viewsByPage[page] || 0;
    const leads = leadsByPage[page] || 0;
    return {
      page,
      views,
      leads,
      conversionRate: views > 0 ? Math.round((leads / views) * 1000) / 10 : 0,
    };
  });

  // Build daily series for views and leads
  const viewsDaily = buildDailySeries(groupByDay(viewRows));
  const leadsDaily = buildDailySeries(groupByDay(leadRows));

  // Merge into combined daily series
  const daily = viewsDaily.map((v, i) => ({
    date: v.date,
    views: v.count,
    leads: leadsDaily[i]?.count || 0,
  }));

  // Countries
  const countries = Object.entries(groupByCountry(viewRows))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  return NextResponse.json({
    totalViews: viewRows.length,
    totalLeads: leadRows.length,
    conversionRate:
      viewRows.length > 0
        ? Math.round((leadRows.length / viewRows.length) * 1000) / 10
        : 0,
    daily,
    pages,
    countries,
  });
}
