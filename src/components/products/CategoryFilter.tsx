"use client";

import type { ProductCategory } from "@/lib/types";

interface CategoryFilterProps {
  categories: ProductCategory[];
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat.id
              ? "bg-foreground text-white"
              : "bg-muted text-text-secondary hover:bg-border"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
