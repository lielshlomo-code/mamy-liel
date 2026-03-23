import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSiteConfig } from "@/lib/content";

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

  const { data } = await supabase
    .from("short_links")
    .select("target_url, paint_cookies")
    .eq("code", code)
    .eq("published", true)
    .single();

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

  // If paint_cookies is enabled AND it's a real user AND not rate-limited
  if (data.paint_cookies && !botDetected && !isRateLimited(ip)) {
    const config = getSiteConfig();
    const cookieUrl = config.affiliateCookieUrl;

    if (cookieUrl) {
      const targetUrlJson = JSON.stringify(data.target_url);
      const cookieUrlSafe = cookieUrl
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");

      const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>mamy.liel</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #faf8f5 0%, #f5ebe0 100%);
      color: #3d2c2c;
    }
    .card { text-align: center; padding: 48px 32px; }
    .spinner {
      width: 28px; height: 28px;
      border: 3px solid #e8ddd5; border-top-color: #3d2c2c;
      border-radius: 50%; animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    .text { font-size: 14px; color: #8b7355; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <p class="text">...מעבירה אותך</p>
  </div>
  <iframe src="${cookieUrlSafe}" style="position:absolute;width:0;height:0;border:0;opacity:0" tabindex="-1" aria-hidden="true"></iframe>
  <script>
    setTimeout(function() { window.location.href = ${targetUrlJson}; }, 1500);
  </script>
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

  return NextResponse.redirect(data.target_url);
}
