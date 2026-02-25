"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center pt-24"
      >
        {/* Small tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase border border-black/10 rounded-full">
            יוצרת תוכן · אמהות · השראה
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-6">
          <TextReveal delay={0.3}>ליאל</TextReveal>
          <br />
          <TextReveal delay={0.5}>שלמה</TextReveal>
        </h1>

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-24 h-[2px] bg-foreground mx-auto mb-8 origin-center"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-lg md:text-xl text-text-secondary max-w-lg mx-auto mb-4"
        >
          אמא של מיה ורנה
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-base text-text-light max-w-md mx-auto mb-12"
        >
          משתפת דברים שטובים לי ולבית שלי
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-white font-medium rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              מוצרים שאני אוהבת
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-accent-hover transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
          </Link>

          <Link
            href="/links"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-foreground font-medium rounded-full overflow-hidden hover:text-white transition-colors duration-300"
          >
            <span className="relative z-10">כל הקישורים</span>
            <span className="absolute inset-0 bg-foreground transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300" />
          </Link>
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
