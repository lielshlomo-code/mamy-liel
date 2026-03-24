"use client";

import { Instagram, ArrowLeft, Heart, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const floatingIcons = [
  { Icon: Heart, x: "8%", y: "18%", delay: 0, duration: 4.5 },
  { Icon: Sparkles, x: "82%", y: "12%", delay: 1.2, duration: 5 },
  { Icon: Star, x: "12%", y: "72%", delay: 2.5, duration: 4 },
  { Icon: Heart, x: "78%", y: "68%", delay: 0.8, duration: 3.8 },
  { Icon: Sparkles, x: "45%", y: "8%", delay: 1.8, duration: 5.5 },
  { Icon: Star, x: "88%", y: "45%", delay: 3.2, duration: 4.2 },
];

export default function InstagramCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-foreground via-[#151520] to-foreground">
      {/* Floating animated icons */}
      {floatingIcons.map((item, i) => {
        const FloatIcon = item.Icon;
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.08, 0.25, 0.08],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FloatIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-300/40" />
          </motion.div>
        );
      })}

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-rose-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-warm-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
        {/* Glass card */}
        <div className="glass-card rounded-3xl p-10 md:p-16">
          <AnimatedSection>
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-300 flex items-center justify-center mx-auto mb-8"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Instagram className="w-9 h-9 text-white" />
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
              בואו נהיה בקשר
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg text-white/50 max-w-md mx-auto mb-10">
              עקבו אחריי באינסטגרם לעוד תוכן, טיפים והמלצות יומיומיות
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <a
              href="https://instagram.com/mamy.liel"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-400 to-rose-300 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              @mamy.liel
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
