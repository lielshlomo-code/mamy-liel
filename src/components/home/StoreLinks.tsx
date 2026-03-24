"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface StoreLink {
  name: string;
  url: string;
  coupon?: string;
  couponNote?: string;
  gradient: string;
}

const stores: StoreLink[] = [
  {
    name: "Shiptanbul",
    url: "https://shiptanbul.com/?ref=barshlomo",
    coupon: "liel15",
    couponNote: "יוון ואנגליה",
    gradient: "from-orange-400 to-rose-400",
  },
  {
    name: "Shiptanbul",
    url: "https://shiptanbul.com/?ref=barshlomo",
    coupon: "liel20",
    couponNote: "ארה״ב",
    gradient: "from-orange-400 to-rose-400",
  },
  {
    name: "סופר פארם",
    url: "https://go.scrmgo.com/23LWNBNG/2QZRGT1/?url=https://shop.super-pharm.co.il/baby",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    name: "טרמינל X",
    url: "https://s.humanz.ai/terminalbids/741575/192",
    coupon: "15FS",
    gradient: "from-violet-400 to-purple-500",
  },
];

interface PopupLink {
  title: string;
  url: string;
}

export default function StoreLinks() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [extraLinks, setExtraLinks] = useState<PopupLink[]>([]);

  useEffect(() => {
    fetch("/api/popup-links")
      .then((r) => r.json())
      .then((data: PopupLink[]) => setExtraLinks(data))
      .catch(() => {});
  }, []);

  const copyCoupon = (coupon: string, index: number) => {
    navigator.clipboard.writeText(coupon);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-medium text-rose-600">
              החנויות שלי
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            הנחות וקופונים
          </h2>
          <p className="text-text-secondary mt-2 text-sm">
            הקישורים הכי שווים שלי עם הנחות בלעדיות
          </p>
        </motion.div>

        {/* Store Links */}
        <div className="flex flex-col gap-3">
          {stores.map((store, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl border border-warm-300/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${store.gradient} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm block">
                    {store.name}
                  </span>
                  {store.couponNote && (
                    <span className="text-xs text-text-secondary">
                      {store.couponNote}
                    </span>
                  )}
                </div>

                {/* Coupon badge */}
                {store.coupon && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      copyCoupon(store.coupon!, i);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 border border-dashed border-foreground/20 hover:bg-foreground/10 transition-colors shrink-0"
                    title="העתקת קוד קופון"
                  >
                    <span className="text-xs font-bold tracking-wider" dir="ltr">
                      {store.coupon}
                    </span>
                    {copiedIndex === i ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-text-secondary" />
                    )}
                  </button>
                )}

                <ExternalLink className="w-4 h-4 text-text-light group-hover:text-foreground transition-colors shrink-0" />
              </a>
            </motion.div>
          ))}

          {/* Extra links from API (previously popup links) */}
          {extraLinks.map((link, i) => (
            <motion.div
              key={`extra-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: (stores.length + i) * 0.08,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl border border-warm-300/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shrink-0 shadow-sm">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-sm flex-1 min-w-0 truncate">
                  {link.title}
                </span>
                <ExternalLink className="w-4 h-4 text-text-light group-hover:text-foreground transition-colors shrink-0" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
