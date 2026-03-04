"use client";

import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  num?: string;
}

export default function PageHeader({ title, subtitle, num }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 radial-glow-bottom pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-l from-transparent via-black/5 to-transparent" />

      {/* Large background number */}
      {num && (
        <div className="absolute top-0 left-6 md:left-10 pointer-events-none select-none">
          <span className="text-[12rem] md:text-[16rem] font-black text-black/[0.02] leading-none">
            {num}
          </span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-8">
        {num && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-text-light mb-4 block"
          >
            {num}
          </motion.span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
          <TextReveal>{title}</TextReveal>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-16 h-[2px] bg-foreground mb-4 origin-right"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-lg text-text-secondary max-w-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
