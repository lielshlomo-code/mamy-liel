"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ProductCategory, Subcategory } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

interface ProductGridProps {
  products: Product[];
  categories: ProductCategory[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set());

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenSubs(new Set());
  };

  const toggleSub = (id: string) => {
    setOpenSubs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSubcategories = useMemo(() => {
    const subs: Subcategory[] = [];
    for (const cat of categories) {
      if (cat.subcategories) subs.push(...cat.subcategories);
    }
    return subs;
  }, [categories]);

  const getSubProducts = (catId: string, subId: string) =>
    products.filter((p) => p.category === catId && p.subcategory === subId);

  const activeCat = categories.find((c) => c.id === activeCategory);
  const subcategories = activeCat?.subcategories || [];
  const hasSubcategories = activeCategory !== "all" && subcategories.length > 0;

  const allCatSubcategories = useMemo(() => {
    if (activeCategory !== "all") return [];
    const result: { sub: Subcategory; catId: string }[] = [];
    for (const cat of categories) {
      if (cat.id === "all" || !cat.subcategories) continue;
      for (const sub of cat.subcategories) {
        result.push({ sub, catId: cat.id });
      }
    }
    return result;
  }, [activeCategory, categories]);

  const showAllAccordion = activeCategory === "all" && allCatSubcategories.length > 0;

  const uncategorizedProducts =
    activeCategory !== "all"
      ? products.filter((p) => p.category === activeCategory && !p.subcategory)
      : [];

  return (
    <div className="flex flex-col gap-8">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Accordion for specific category */}
      {hasSubcategories && (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
          {subcategories.map((sub, idx) => {
            const subProducts = getSubProducts(activeCategory, sub.id);
            if (subProducts.length === 0) return null;
            return (
              <AccordionSection
                key={sub.id}
                label={sub.label}
                count={subProducts.length}
                isOpen={openSubs.has(sub.id)}
                onToggle={() => toggleSub(sub.id)}
                products={subProducts}
                allSubcategories={allSubcategories}
                index={idx}
              />
            );
          })}
          {uncategorizedProducts.length > 0 && (
            <AccordionSection
              label="כללי"
              count={uncategorizedProducts.length}
              isOpen={openSubs.has("__uncategorized__")}
              onToggle={() => toggleSub("__uncategorized__")}
              products={uncategorizedProducts}
              allSubcategories={allSubcategories}
              index={subcategories.length}
            />
          )}
        </div>
      )}

      {/* Accordion for "all" */}
      {showAllAccordion && (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
          {allCatSubcategories.map(({ sub, catId }, idx) => {
            const subProducts = getSubProducts(catId, sub.id);
            if (subProducts.length === 0) return null;
            return (
              <AccordionSection
                key={sub.id}
                label={sub.label}
                count={subProducts.length}
                isOpen={openSubs.has(sub.id)}
                onToggle={() => toggleSub(sub.id)}
                products={subProducts}
                allSubcategories={allSubcategories}
                index={idx}
              />
            );
          })}
        </div>
      )}

      {/* Fallback: no subcategories */}
      {!hasSubcategories && !showAllAccordion && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
            {products
              .filter((p) => activeCategory === "all" || p.category === activeCategory)
              .map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} subcategories={allSubcategories} />
              ))}
          </div>
          {products.filter((p) => activeCategory === "all" || p.category === activeCategory).length === 0 && (
            <p className="text-center text-text-secondary py-12">
              אין מוצרים בקטגוריה זו עדיין
            </p>
          )}
        </>
      )}
    </div>
  );
}

function AccordionSection({
  label,
  count,
  isOpen,
  onToggle,
  products,
  allSubcategories,
  index,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  products: Product[];
  allSubcategories: Subcategory[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={`group relative w-full flex items-center justify-between px-6 py-5 transition-all duration-300 overflow-hidden ${
          isOpen
            ? "bg-gradient-to-l from-rose-200/90 via-rose-100/80 to-warm-200/90 shadow-lg"
            : "bg-gradient-to-l from-warm-200/70 via-warm-100/60 to-warm-200/70 hover:from-rose-100/70 hover:via-warm-100/60 hover:to-rose-200/70 hover:shadow-md"
        }`}
      >
        {/* Decorative shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-l from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />

        <div className="relative flex items-center gap-3">
          {/* Animated dot indicator */}
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            isOpen
              ? "bg-rose-400 shadow-[0_0_10px_rgba(244,114,182,0.5)] scale-110"
              : "bg-warm-300 group-hover:bg-rose-300"
          }`} />

          <span className={`font-bold text-lg transition-colors duration-300 ${
            isOpen ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
          }`}>
            {label}
          </span>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 ${
            isOpen
              ? "bg-white/50 text-foreground/70 backdrop-blur-sm"
              : "bg-foreground/8 text-text-secondary group-hover:bg-white/40"
          }`}>
            {count} מוצרים
          </span>
        </div>

        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-white/40 backdrop-blur-sm rotate-180"
            : "bg-foreground/5 group-hover:bg-white/30"
        }`}>
          <svg
            className="w-4 h-4 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-b from-warm-50/80 to-white/40">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    subcategories={allSubcategories}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
