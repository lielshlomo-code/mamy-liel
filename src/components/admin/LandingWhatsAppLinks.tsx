"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Tag,
  Save,
  Loader2,
} from "lucide-react";

import { LANDING_PAGES } from "@/lib/landing-pages";

interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  title: string | null;
  published: boolean;
  paintCookies: boolean;
  showInPopup: boolean;
  showOnHomepage: boolean;
  couponCode: string;
  couponNote: string;
  color: string;
}

export default function LandingWhatsAppLinks() {
  const [linksByCode, setLinksByCode] = useState<Record<string, ShortLink>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/short-links")
      .then((r) => r.json())
      .then((links: ShortLink[]) => {
        const codes = new Set(LANDING_PAGES.map((p) => p.code));
        const byCode: Record<string, ShortLink> = {};
        for (const l of links || []) {
          if (codes.has(l.code)) byCode[l.code] = l;
        }
        const nextNames: Record<string, string> = {};
        const nextUrls: Record<string, string> = {};
        for (const p of LANDING_PAGES) {
          nextNames[p.code] = byCode[p.code]?.title ?? p.label;
          nextUrls[p.code] = byCode[p.code]?.targetUrl ?? p.defaultWhatsapp;
        }
        setLinksByCode(byCode);
        setNames(nextNames);
        setUrls(nextUrls);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyLink = (slug: string, path: string) => {
    navigator.clipboard.writeText(`https://www.mamy-liel.com${path}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const save = async (code: string, fallbackLabel: string) => {
    const targetUrl = (urls[code] || "").trim();
    const name = (names[code] || "").trim() || fallbackLabel;
    if (!targetUrl) return;
    setSavingCode(code);
    setSavedCode(null);
    const existing = linksByCode[code];
    const payload = existing
      ? {
          id: existing.id,
          targetUrl,
          title: name,
          published: existing.published,
          paintCookies: existing.paintCookies,
          showInPopup: existing.showInPopup,
          showOnHomepage: existing.showOnHomepage,
          couponCode: existing.couponCode,
          couponNote: existing.couponNote,
          color: existing.color,
        }
      : { code, targetUrl, title: name, published: true, paintCookies: true };
    try {
      const res = await fetch("/api/admin/short-links", {
        method: existing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated: ShortLink = existing
        ? { ...existing, targetUrl, title: name }
        : await res.json();
      setLinksByCode((m) => ({ ...m, [code]: updated }));
      setSavedCode(code);
      setTimeout(() => setSavedCode((c) => (c === code ? null : c)), 2500);
    } catch {
      alert("השמירה נכשלה, נסה שוב");
    } finally {
      setSavingCode(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-8">
      <h3 className="font-semibold mb-1">דפי נחיתה פעילים</h3>
      <p className="text-xs text-text-secondary mb-4">
        לכל דף אפשר לתת שם ולעדכן את קישור קבוצת הווטסאפ — השינוי מיידי, בלי העלאה מחדש
      </p>

      <div className="flex flex-col gap-3">
        {LANDING_PAGES.map((lp) => {
          const stored = linksByCode[lp.code];
          const nameVal = names[lp.code] ?? "";
          const urlVal = urls[lp.code] ?? "";
          const dirty =
            urlVal.trim() !== (stored?.targetUrl ?? "") ||
            nameVal.trim() !== (stored?.title ?? "");
          return (
            <div
              key={lp.slug}
              className="flex flex-col gap-3 p-3 rounded-lg border border-border"
            >
              {/* Top: page path + open/copy */}
              <div className="flex items-center justify-between gap-3">
                <p
                  className="text-xs text-text-light font-mono min-w-0 flex-1 truncate"
                  dir="ltr"
                >
                  mamy-liel.com{lp.path}
                </p>
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

              {/* Name field */}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  type="text"
                  value={nameVal}
                  placeholder="שם לדף (לזיהוי פנימי)"
                  onChange={(e) =>
                    setNames((m) => ({ ...m, [lp.code]: e.target.value }))
                  }
                  disabled={loading}
                  className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>

              {/* WhatsApp link field + save */}
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                <input
                  type="url"
                  dir="ltr"
                  value={urlVal}
                  placeholder="https://chat.whatsapp.com/..."
                  onChange={(e) =>
                    setUrls((m) => ({ ...m, [lp.code]: e.target.value }))
                  }
                  disabled={loading}
                  className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-left focus:outline-none focus:ring-2 focus:ring-green-500/40"
                />
                <button
                  onClick={() => save(lp.code, lp.label)}
                  disabled={loading || savingCode === lp.code || !dirty}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {savingCode === lp.code ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : savedCode === lp.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      נשמר
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      שמור
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
