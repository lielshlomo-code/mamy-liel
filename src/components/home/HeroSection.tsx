"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
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

const stores: StoreItem[] = [
  {
    name: "Shiptanbul",
    url: "https://shiptanbul.com/?ref=barshlomo",
    coupons: [
      { code: "liel15", note: "יוון ואנגליה" },
      { code: "liel20", note: "ארה״ב" },
    ],
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

export default function HeroSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { scrollY } = useScroll();

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
                  rel="noopener noreferrer"
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
                              <Check className="w-3 h-3 text-green-600" />
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
                        <Check className="w-3 h-3 text-green-600" />
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-black/20 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-foreground rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
