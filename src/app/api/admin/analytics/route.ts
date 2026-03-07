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
  let daysBack: number;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "today") {
    since = startOfToday;
    daysBack = 0;
  } else if (range === "yesterday") {
    since = new Date(startOfToday);
    since.setDate(since.getDate() - 1);
    until = startOfToday;
    daysBack = 1;
  } else {
    const days = parseInt(range, 10) || 30;
    since = new Date();
    since.setDate(since.getDate() - days);
    daysBack = days;
  }

  const sinceISO = since.toISOString();
  const untilISO = until ? until.toISOString() : null;

  // Helper: add upper-bound filter for bounded ranges (e.g. yesterday)
  function clickEventsQuery(eventType: string) {
    let q = supabase
      .from("click_events")
      .select("created_at")
      .eq("event_type", eventType)
      .gte("created_at", sinceISO);
    if (untilISO) q = q.lt("created_at", untilISO);
    return q.order("created_at", { ascending: true });
  }

  function contactsTimeQuery() {
    let q = supabase
      .from("contact_submissions")
      .select("created_at")
      .gte("created_at", sinceISO);
    if (untilISO) q = q.lt("created_at", untilISO);
    return q.order("created_at", { ascending: true });
  }

  const [
    shortLinkClicks,
    productClicks,
    topShortLinks,
    topProducts,
    contactSubmissions,
    recentContacts,
    totalShortLinkClicks,
    totalProductClicks,
    totalContacts,
    recentActivity,
  ] = await Promise.all([
    clickEventsQuery("short_link"),

    clickEventsQuery("product"),

    supabase
      .from("short_links")
      .select("code, title, clicks")
      .order("clicks", { ascending: false })
      .limit(10),

    supabase.rpc("get_top_products_by_clicks", { days_back: daysBack }),

    contactsTimeQuery(),

    supabase
      .from("contact_submissions")
      .select("id, brand_name, contact_name, email, type, created_at")
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "short_link"),

    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "product"),

    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("click_events")
      .select("id, event_type, target_id, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  function groupByDay(
    rows: { created_at: string }[] | null
  ): Record<string, number> {
    const map: Record<string, number> = {};
    for (const row of rows || []) {
      const day = row.created_at.split("T")[0];
      map[day] = (map[day] || 0) + 1;
    }
    return map;
  }

  function buildDailySeries(grouped: Record<string, number>) {
    const series: { date: string; count: number }[] = [];
    const current = new Date(sinceISO);
    const end = until ? new Date(until) : new Date();
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      series.push({ date: dateStr, count: grouped[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }
    return series;
  }

  const shortLinkDaily = buildDailySeries(
    groupByDay(shortLinkClicks.data)
  );
  const productDaily = buildDailySeries(groupByDay(productClicks.data));
  const contactDaily = buildDailySeries(
    groupByDay(contactSubmissions.data)
  );

  return NextResponse.json({
    shortLinks: {
      daily: shortLinkDaily,
      top: (topShortLinks.data || []).map(
        (l: { code: string; title: string; clicks: number }) => ({
          code: l.code,
          title: l.title,
          clicks: l.clicks,
        })
      ),
      total: totalShortLinkClicks.count || 0,
    },
    products: {
      daily: productDaily,
      top: (topProducts.data || []).map(
        (p: {
          product_id: string;
          product_name: string;
          click_count: number;
        }) => ({
          productId: p.product_id,
          productName: p.product_name,
          clickCount: Number(p.click_count),
        })
      ),
      total: totalProductClicks.count || 0,
    },
    contacts: {
      daily: contactDaily,
      recent: (recentContacts.data || []).map(
        (c: {
          id: string;
          brand_name: string;
          contact_name: string;
          email: string;
          type: string;
          created_at: string;
        }) => ({
          id: c.id,
          brandName: c.brand_name,
          contactName: c.contact_name,
          email: c.email,
          type: c.type,
          createdAt: c.created_at,
        })
      ),
      total: totalContacts.count || 0,
    },
    activity: (recentActivity.data || []).map(
      (e: {
        id: string;
        event_type: string;
        target_id: string;
        created_at: string;
      }) => ({
        id: e.id,
        type: e.event_type,
        targetId: e.target_id,
        createdAt: e.created_at,
      })
    ),
  });
}
