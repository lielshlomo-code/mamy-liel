"use client";

import { Instagram, ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function InstagramCTA() {
  return (
    <section className="py-24 md:py-32 bg-foreground text-white noise-bg relative overflow-hidden">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[20vw] font-black text-white/[0.03] tracking-tighter select-none">
          FOLLOW
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
        <AnimatedSection>
          <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-8">
            <Instagram className="w-8 h-8" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            בואו נהיה בקשר
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-lg text-white/60 max-w-md mx-auto mb-10">
            עקבו אחריי באינסטגרם לעוד תוכן, טיפים והמלצות יומיומיות
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <a
            href="https://instagram.com/mamy.liel"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-foreground font-bold rounded-full hover:scale-105 transition-transform duration-300"
          >
            <Instagram className="w-5 h-5" />
            @mamy.liel
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
