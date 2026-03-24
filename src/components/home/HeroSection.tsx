"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Copy, Check, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import TextReveal from "@/components/ui/TextReveal";

interface Coupon {
  code: string;
  note: string;
}

interface StoreItem {
  name: string;
  url: string;
  coupon?: string;
  coupons?: Coupon[];
  gradient: string;
}

/* Hardcoded fallback — shown immediately while API loads */
const fallbackStores: StoreItem[] = [
  {
    name: "Shiptanbul",
    url: "https://shiptanbul.com/?ref=barshlomo",
    coupons: [
      { code: "liel15", note: "יוון ואנגליה" },
      { code: "liel20", note: "ארה״ב" },
    ],
    gradient: "from-warm-300 to-rose-400",
  },
  {
    name: "סופר פארם",
    url: "https://go.scrmgo.com/23LWNBNG/2QZRGT1/?url=https://shop.super-pharm.co.il/baby",
    gradient: "from-foreground to-foreground/80",
  },
  {
    name: "טרמינל X",
    url: "https://s.humanz.ai/terminalbids/741575/192",
    coupon: "15FS",
    gradient: "from-rose-400 to-rose-500",
  },
  {
    name: "מבצעים אלי אקספרס",
    url: "https://s.click.aliexpress.com/e/_c4lfajWT",
    gradient: "from-warm-200 to-warm-300",
  },
];

interface HomepageLink {
  title: string;
  url: string;
  couponCode: string;
  couponNote: string;
  color: string;
}

export default function HeroSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stores, setStores] = useState<StoreItem[]>(fallbackStores);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    fetch("/api/homepage-links")
      .then((r) => r.json())
      .then((data: HomepageLink[]) => {
        if (data.length === 0) return;
        setStores(
          data.map((link) => ({
            name: link.title,
            url: link.url,
            coupon: link.couponCode || undefined,
            gradient: link.color || "from-warm-300 to-rose-400",
          }))
        );
      })
      .catch(() => {});

    fetch("/api/settings?key=profile_image")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) setProfileImage(data.value);
      })
      .catch(() => {});
  }, []);

  const copyCoupon = (coupon: string, key: string) => {
    navigator.clipboard.writeText(coupon);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-black/[0.02] rounded-full animate-blob"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/[0.03] rounded-full animate-blob"
          style={{ animationDelay: "2s" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-black/[0.02] rounded-full animate-blob"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center pt-20 sm:pt-24"
      >
        {/* Profile avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-foreground text-white flex items-center justify-center text-4xl sm:text-5xl font-black overflow-hidden"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="ליאל שלמה"
              className="w-full h-full object-cover"
            />
          ) : (
            "ל"
          )}
        </motion.div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-6">
          <TextReveal delay={0.3}>ליאל</TextReveal>
          <br />
          <TextReveal delay={0.5}>שלמה</TextReveal>
        </h1>

        {/* Store Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 w-full max-w-md mx-auto"
        >
          <div className="flex flex-col gap-2.5">
            {stores.map((store, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              >
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-black/[0.06] bg-white/60 backdrop-blur-sm hover:bg-white hover:border-black/10 hover:shadow-sm transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${store.gradient} flex items-center justify-center shrink-0`}
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm flex-1 min-w-0 text-right">
                    {store.name}
                  </span>
                  {store.coupons ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {store.coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copyCoupon(c.code, c.code);
                          }}
                          className="flex flex-col items-center px-2.5 py-1 rounded-md bg-black/[0.04] border border-dashed border-black/10 hover:bg-black/[0.08] transition-colors"
                          title={`העתקת קוד ${c.code}`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="text-[11px] font-bold tracking-wider" dir="ltr">
                              {c.code}
                            </span>
                            {copiedKey === c.code ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3 text-text-secondary" />
                            )}
                          </span>
                          <span className="text-[9px] text-text-secondary leading-tight">
                            {c.note}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : store.coupon ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyCoupon(store.coupon!, store.coupon!);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/[0.04] border border-dashed border-black/10 hover:bg-black/[0.08] transition-colors shrink-0"
                      title="העתקת קוד קופון"
                    >
                      <span className="text-[11px] font-bold tracking-wider" dir="ltr">
                        {store.coupon}
                      </span>
                      {copiedKey === store.coupon ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3 text-text-secondary" />
                      )}
                    </button>
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-text-light group-hover:text-foreground transition-colors shrink-0" />
                  )}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
