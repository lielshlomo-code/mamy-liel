"use client";

import { motion } from "framer-motion";

interface Shape {
  className: string;
  x: string;
  y: string;
  size: string;
  duration: number;
  delay: number;
}

const defaultShapes: Shape[] = [
  { className: "bg-rose-200/40", x: "10%", y: "20%", size: "180px", duration: 8, delay: 0 },
  { className: "bg-warm-200/50", x: "75%", y: "15%", size: "220px", duration: 10, delay: 2 },
  { className: "bg-rose-100/30", x: "60%", y: "70%", size: "160px", duration: 7, delay: 4 },
  { className: "bg-warm-100/40", x: "20%", y: "75%", size: "200px", duration: 12, delay: 1 },
  { className: "bg-rose-200/20", x: "45%", y: "40%", size: "280px", duration: 14, delay: 3 },
];

export default function FloatingShapes({
  shapes = defaultShapes,
  className = "",
}: {
  shapes?: Shape[];
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${shape.className}`}
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 10, -5, 8, 0],
            scale: [1, 1.08, 0.95, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
