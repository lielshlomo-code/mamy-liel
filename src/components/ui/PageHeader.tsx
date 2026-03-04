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
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-8">
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
  );
}
