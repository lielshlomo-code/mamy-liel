"use client";

import { motion } from "framer-motion";

const words = [
  "אמהות",
  "תינוקות",
  "השראה",
  "טיפים",
  "המלצות",
  "חיים טובים",
  "מוצרים",
  "הדרכות",
];

export default function Marquee() {
  const allWords = [...words, ...words, ...words];

  return (
    <div className="py-6 bg-foreground overflow-hidden relative">
      {/* Subtle gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-rose-300/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-rose-300/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="animate-marquee flex whitespace-nowrap items-center">
          {allWords.map((word, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="mx-5 md:mx-8 text-base md:text-xl font-black tracking-wider uppercase text-white/80">
                {word}
              </span>
              <span className="text-rose-300/60 text-xs">✦</span>
            </span>
          ))}
          {allWords.map((word, i) => (
            <span key={`dup-${i}`} className="flex items-center shrink-0">
              <span className="mx-5 md:mx-8 text-base md:text-xl font-black tracking-wider uppercase text-white/80">
                {word}
              </span>
              <span className="text-rose-300/60 text-xs">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
