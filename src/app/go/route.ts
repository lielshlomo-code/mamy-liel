import { NextResponse } from "next/server";
import { getAffiliateCookieUrl } from "@/lib/settings";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userAgent = request.headers.get("user-agent") || null;

  if (!isBot(userAgent)) {
    const cookieUrl = await getAffiliateCookieUrl();

    if (cookieUrl) {
      const targetUrlJson = JSON.stringify(targetUrl);
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

  return NextResponse.redirect(targetUrl);
}
