"use client";

import Link from "next/link";
import { Heart, PenLine, Handshake, LinkIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const quickLinks = [
  {
    href: "/products",
    label: "מוצרים",
    description: "דברים שאני אוהבת וממליצה",
    icon: Heart,
    num: "01",
  },
  {
    href: "/blog",
    label: "הדרכות ומתכונים",
    description: "הדרכות, מתכונים וטיפים",
    icon: PenLine,
    num: "02",
  },
  {
    href: "/contact",
    label: "שיתופי פעולה",
    description: "בואו נעבוד ביחד",
    icon: Handshake,
    num: "03",
  },
  {
    href: "/links",
    label: "קישורים",
    description: "אינסטגרם, ווטסאפ ועוד",
    icon: LinkIcon,
    num: "04",
  },
];

export default function QuickLinks() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 dot-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <AnimatedSection>
          <p className="text-sm font-medium tracking-widest uppercase text-text-light mb-4">
            מה תמצאו כאן
          </p>
        </AnimatedSection>

        <div className="space-y-0">
          {quickLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.href} delay={i * 0.1}>
                <Link href={item.href} className="group block">
                  <div className="flex items-center justify-between py-8 md:py-10 border-b border-black/10 group-hover:border-black/30 transition-colors">
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className="text-xs text-text-light font-mono">
                        {item.num}
                      </span>
                      <div>
                        <h3 className="text-2xl md:text-4xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                          {item.label}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-white group-hover:border-foreground transition-all duration-300"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <ArrowLeft className="w-5 h-5 text-text-light opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
