"use client";

import { motion } from "framer-motion";
import type { Product, Subcategory } from "@/lib/types";

export default function ProductCard({
  product,
  index = 0,
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

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl border border-warm-100/60 transition-all duration-500 card-lift"
    >
      {/* Image */}
      {product.image ? (
        <div className="relative aspect-square overflow-hidden bg-warm-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Floating CTA on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <span className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold shadow-lg">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              לצפייה במוצר
            </span>
          </div>
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-warm-100 to-rose-50 flex items-center justify-center">
          <svg className="w-10 h-10 text-warm-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-text-secondary line-clamp-1">
            {product.description}
          </p>
        )}
        {/* Mobile-visible link indicator */}
        <div className="flex items-center gap-1 mt-auto pt-1.5 md:hidden">
          <span className="text-[10px] text-rose-400 font-medium">לצפייה</span>
          <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}
