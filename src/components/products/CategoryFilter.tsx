"use client";

import type { ProductCategory } from "@/lib/types";

interface CategoryFilterProps {
  categories: ProductCategory[];
  active: string;
  activeSubcategory: string;
  onChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  activeSubcategory,
  onChange,
  onSubcategoryChange,
}: CategoryFilterProps) {
  const activeCategory = categories.find((c) => c.id === active);
  const subcategories = activeCategory?.subcategories || [];

  return (
    <div className="flex flex-col gap-3">
      {/* Main categories */}
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

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => onSubcategoryChange("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeSubcategory === "all"
                ? "bg-foreground/80 text-white"
                : "bg-muted/70 text-text-secondary hover:bg-border"
            }`}
          >
            הכל
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubcategoryChange(sub.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeSubcategory === sub.id
                  ? "bg-foreground/80 text-white"
                  : "bg-muted/70 text-text-secondary hover:bg-border"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
