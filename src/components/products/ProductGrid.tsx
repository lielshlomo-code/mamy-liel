"use client";

import { useMemo, useState } from "react";
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

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setActiveSubcategory("all");
  };

  const allSubcategories = useMemo(() => {
    const subs: Subcategory[] = [];
    for (const cat of categories) {
      if (cat.subcategories) subs.push(...cat.subcategories);
    }
    return subs;
  }, [categories]);

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
        activeSubcategory={activeSubcategory}
        onChange={handleCategoryChange}
        onSubcategoryChange={setActiveSubcategory}
      />

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
