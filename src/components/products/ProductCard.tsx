"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  baby: "לתינוק",
  home: "לבית",
  fashion: "אופנה",
  beauty: "טיפוח",
};

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
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

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8 }}
      className="group flex flex-col rounded-2xl bg-muted overflow-hidden"
    >
      {/* Image area */}
      <div className="aspect-[4/5] bg-gradient-to-b from-transparent to-black/[0.03] flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <span className="text-7xl font-black text-black/[0.04] group-hover:scale-125 transition-transform duration-700">
            {product.name.charAt(0)}
          </span>
        )}

        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
          <ExternalLink className="w-4 h-4" />
        </div>

        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 text-xs font-medium bg-white rounded-full shadow-sm">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg group-hover:text-text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>
    </motion.a>
  );
}
