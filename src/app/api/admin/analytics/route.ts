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

  // Helper: add date range filter
  function clickEventsQuery(eventType: string) {
    let q = supabase
      .from("click_events")
      .select("created_at, target_id")
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
    shortLinksMetadata,
    productsMetadata,
    contactSubmissions,
    recentContacts,
    recentActivity,
  ] = await Promise.all([
    clickEventsQuery("short_link"),

    clickEventsQuery("product"),

    // Short links metadata for display names
    supabase.from("short_links").select("code, title"),

    // Products metadata for display names
    supabase.from("products").select("id, name"),

    contactsTimeQuery(),

    // Recent contacts – filtered by date
    (() => {
      let q = supabase
        .from("contact_submissions")
        .select("id, brand_name, contact_name, email, type, created_at")
        .gte("created_at", sinceISO);
      if (untilISO) q = q.lt("created_at", untilISO);
      return q.order("created_at", { ascending: false }).limit(10);
    })(),

    // Recent activity – filtered by date
    (() => {
      let q = supabase
        .from("click_events")
        .select("id, event_type, target_id, created_at")
        .gte("created_at", sinceISO);
      if (untilISO) q = q.lt("created_at", untilISO);
      return q.order("created_at", { ascending: false }).limit(20);
    })(),
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
    const end = until || new Date();
    while (until ? current < end : current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      series.push({ date: dateStr, count: grouped[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }
    return series;
  }

  const shortLinkRows = shortLinkClicks.data || [];
  const productRows = productClicks.data || [];
  const contactRows = contactSubmissions.data || [];

  const shortLinkDaily = buildDailySeries(groupByDay(shortLinkRows));
  const productDaily = buildDailySeries(groupByDay(productRows));
  const contactDaily = buildDailySeries(groupByDay(contactRows));

  // Compute top items from filtered click events
  function topByTarget(rows: { target_id: string }[], limit = 10) {
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.target_id] = (counts[r.target_id] || 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  // Build short-link title/code lookup
  const slMeta: Record<string, { code: string; title: string }> = {};
  for (const s of shortLinksMetadata.data || []) slMeta[s.code] = s;

  // Build product name lookup
  const prodMeta: Record<string, string> = {};
  for (const p of (productsMetadata.data || []) as { id: string; name: string }[])
    prodMeta[p.id] = p.name;

  return NextResponse.json({
    shortLinks: {
      daily: shortLinkDaily,
      top: topByTarget(shortLinkRows).map(([code, clicks]) => ({
        code,
        title: slMeta[code]?.title || "",
        clicks,
      })),
      total: shortLinkRows.length,
    },
    products: {
      daily: productDaily,
      top: topByTarget(productRows).map(([id, count]) => ({
        productId: id,
        productName: prodMeta[id] || id,
        clickCount: count,
      })),
      total: productRows.length,
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
      total: contactRows.length,
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
