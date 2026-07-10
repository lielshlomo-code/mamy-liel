// Single source of truth for the static WhatsApp landing pages.
// Each page's CTA redirects through /s/<code>; the group link itself is an
// editable short_links row (managed from admin/landing-pages). `defaultWhatsapp`
// is only the first-run value the /s route auto-provisions the row with, and
// `label` is the fallback display name until a custom name is saved.

export interface LandingPage {
  slug: string; // public/<slug>.html and the analytics "page" key
  label: string;
  description: string;
  path: string;
  code: string; // short_links.code the CTA points at (/s/<code>)
  defaultWhatsapp: string;
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "ofertas",
    label: "Ofertas WhatsApp (ספרדית)",
    description: "דף נחיתה לקבוצת ווטסאפ - מבצעים לאמהות",
    path: "/ofertas.html",
    code: "wa-ofertas",
    defaultWhatsapp: "https://chat.whatsapp.com/LWfnDZ6hKyV414XT1YKHwX?mode=gi_t",
  },
  {
    slug: "whatsapp-il",
    label: "קבוצת WhatsApp (עברית)",
    description: "דף נחיתה לקבוצת ווטסאפ - עברית",
    path: "/whatsapp-il.html",
    code: "wa-il",
    defaultWhatsapp: "https://chat.whatsapp.com/EV9OARjJdWR5lGCBrd0HpS",
  },
  {
    slug: "mivtzaim",
    label: "מבצעים WhatsApp (עברית)",
    description: "דף נחיתה לקבוצת ווטסאפ - עברית (פיקסל נפרד)",
    path: "/mivtzaim.html",
    code: "wa-mivtzaim",
    defaultWhatsapp: "https://chat.whatsapp.com/EV9OARjJdWR5lGCBrd0HpS",
  },
];

// code -> default WhatsApp URL, consumed by the /s/[code] auto-provision fallback.
export const LANDING_WA_DEFAULTS: Record<string, string> = Object.fromEntries(
  LANDING_PAGES.map((p) => [p.code, p.defaultWhatsapp])
);
