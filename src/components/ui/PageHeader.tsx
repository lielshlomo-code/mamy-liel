"use client";

import { motion } from "framer-motion";
import TextReveal from "./TextReveal";
import FloatingShapes from "./FloatingShapes";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  num?: string;
}

export default function PageHeader({ title, subtitle, num }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-animated-gradient">
      {/* Animated floating shapes */}
      <FloatingShapes
        shapes={[
          { className: "bg-rose-200/30", x: "5%", y: "10%", size: "200px", duration: 9, delay: 0 },
          { className: "bg-warm-200/40", x: "70%", y: "5%", size: "250px", duration: 11, delay: 1 },
          { className: "bg-rose-100/25", x: "50%", y: "60%", size: "180px", duration: 8, delay: 3 },
        ]}
      />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-[3]" />

      {/* Large background number */}
      {num && (
        <div className="absolute top-0 left-6 md:left-10 pointer-events-none select-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[12rem] md:text-[16rem] font-black text-warm-300/40 leading-none block"
          >
            {num}
          </motion.span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-14">
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
