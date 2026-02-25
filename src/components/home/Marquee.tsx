"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";

const words = [
  "אמהות",
  "תינוקות",
  "השראה",
  "טיפים",
  "המלצות",
  "חיים טובים",
  "מוצרים",
  "בלוג",
  "אמהות",
  "תינוקות",
  "השראה",
  "טיפים",
  "המלצות",
  "חיים טובים",
  "מוצרים",
  "בלוג",
];

export default function Marquee() {
  return (
    <AnimatedSection>
      <div className="py-8 bg-foreground text-white overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {words.map((word, i) => (
            <span
              key={i}
              className="mx-8 text-sm font-medium tracking-widest uppercase opacity-60"
            >
              {word}
            </span>
          ))}
          {words.map((word, i) => (
            <span
              key={`dup-${i}`}
              className="mx-8 text-sm font-medium tracking-widest uppercase opacity-60"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
