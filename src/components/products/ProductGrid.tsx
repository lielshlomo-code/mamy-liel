"use client";

import { useState } from "react";
import type { Product, ProductCategory } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

interface ProductGridProps {
  products: Product[];
  categories: ProductCategory[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
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
