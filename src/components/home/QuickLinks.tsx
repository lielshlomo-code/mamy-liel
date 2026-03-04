"use client";

import Link from "next/link";
import { Heart, PenLine, Handshake, LinkIcon, ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const quickLinks = [
  {
    href: "/products",
    label: "מוצרים",
    description: "דברים שאני אוהבת וממליצה עליהם",
    icon: Heart,
    gradient: "from-rose-100 via-rose-50 to-warm-50",
    iconBg: "bg-rose-200/60",
  },
  {
    href: "/blog",
    label: "הדרכות ומתכונים",
    description: "הדרכות, מתכונים וטיפים שימושיים",
    icon: PenLine,
    gradient: "from-warm-200 via-warm-100 to-warm-50",
    iconBg: "bg-warm-300/60",
  },
  {
    href: "/contact",
    label: "שיתופי פעולה",
    description: "בואו נעבוד ביחד על משהו מדהים",
    icon: Handshake,
    gradient: "from-warm-100 via-rose-50 to-warm-50",
    iconBg: "bg-warm-200/60",
  },
  {
    href: "/links",
    label: "קישורים",
    description: "אינסטגרם, ווטסאפ וכל הרשתות",
    icon: LinkIcon,
    gradient: "from-rose-50 via-warm-100 to-rose-50",
    iconBg: "bg-rose-100/70",
  },
];

export default function QuickLinks() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-text-light mb-4">
            מה תמצאו כאן
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            הכל במקום אחד
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quickLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.href} delay={i * 0.1}>
                <Link href={item.href} className="group block">
                  <div
                    className={`relative bg-gradient-to-br ${item.gradient} rounded-3xl p-8 md:p-10 min-h-[220px] overflow-hidden card-lift`}
                  >
                    {/* Decorative large icon watermark */}
                    <div className="absolute -bottom-8 -left-8 opacity-[0.06] pointer-events-none">
                      <Icon className="w-44 h-44" strokeWidth={0.8} />
                    </div>

                    {/* Icon container */}
                    <div
                      className={`w-14 h-14 ${item.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-foreground/80" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
                      {item.label}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-base max-w-xs">
                      {item.description}
                    </p>

                    {/* Hover arrow */}
                    <div className="absolute bottom-8 left-8 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
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
