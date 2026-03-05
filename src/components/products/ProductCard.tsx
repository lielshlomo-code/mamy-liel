"use client";

import { motion } from "framer-motion";
import type { Product, Subcategory } from "@/lib/types";

export default function ProductCard({
  product,
  index = 0,
  subcategories,
}: {
  product: Product;
  index?: number;
  subcategories?: Subcategory[];
}) {
  const handleClick = () => {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track/product-click",
        new Blob([JSON.stringify({ productId: product.id })], {
          type: "application/json",
        })
      );
    } else {
      fetch("/api/track/product-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
        keepalive: true,
      });
    }
  };

  const subcategoryLabel = product.subcategory
    ? subcategories?.find((s) => s.id === product.subcategory)?.label
    : null;

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group flex items-center gap-4 rounded-2xl bg-warm-100/60 p-4 sm:p-5 hover:bg-warm-100 transition-colors"
    >
      {/* Text content */}
      <div className="flex-1 flex flex-col items-center text-center gap-3">
        <h3 className="font-bold text-base sm:text-lg leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}

        {subcategoryLabel && (
          <span className="text-xs text-text-secondary/70">
            {subcategoryLabel}
          </span>
        )}

        <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-rose-300 text-white text-sm font-medium group-hover:bg-rose-400 transition-colors">
          מעבר לאתר
        </span>
      </div>

      {/* Image - small thumbnail */}
      {product.image && (
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
    </motion.a>
  );
}
