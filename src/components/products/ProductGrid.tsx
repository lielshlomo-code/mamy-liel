"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type { Product, ProductCategory, Subcategory } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

interface ProductGridProps {
  products: Product[];
  categories: ProductCategory[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setActiveSubcategory("all");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSubcategories = useMemo(() => {
    const subs: Subcategory[] = [];
    for (const cat of categories) {
      if (cat.subcategories) subs.push(...cat.subcategories);
    }
    return subs;
  }, [categories]);

  const activeCategory_ = categories.find((c) => c.id === activeCategory);
  const subcategories = activeCategory_?.subcategories || [];
  const hasSubcategories = subcategories.length > 0;

  const activeSubLabel =
    activeSubcategory === "all"
      ? "כל התת-קטגוריות"
      : subcategories.find((s) => s.id === activeSubcategory)?.label || "בחירה";

  const filtered = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (activeSubcategory !== "all" && p.subcategory !== activeSubcategory) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Subcategory dropdown */}
      {hasSubcategories && (
        <div className="relative max-w-xs" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-warm-100/80 hover:bg-warm-100 border border-warm-200/50 text-sm font-medium transition-colors"
          >
            <span className="truncate">{activeSubLabel}</span>
            <svg
              className={`w-4 h-4 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto rounded-xl bg-white shadow-lg border border-warm-200/50 py-1">
              <button
                onClick={() => {
                  setActiveSubcategory("all");
                  setDropdownOpen(false);
                }}
                className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                  activeSubcategory === "all"
                    ? "bg-warm-100 font-semibold text-foreground"
                    : "hover:bg-warm-50 text-text-secondary"
                }`}
              >
                הכל
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubcategory(sub.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                    activeSubcategory === sub.id
                      ? "bg-warm-100 font-semibold text-foreground"
                      : "hover:bg-warm-50 text-text-secondary"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} subcategories={allSubcategories} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-secondary py-12">
          אין מוצרים בקטגוריה זו עדיין
        </p>
      )}
    </div>
  );
}
