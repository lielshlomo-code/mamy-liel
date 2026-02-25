import type { Metadata } from "next";
import { getProductsData } from "@/lib/content";
import ProductGrid from "@/components/products/ProductGrid";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "מוצרים שאני אוהבת",
  description: "המוצרים שאני משתפת וממליצה עליהם",
};

export default function ProductsPage() {
  const { products, categories } = getProductsData();

  const sorted = [...products].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  return (
    <div className="pt-24">
      <PageHeader
        title="מוצרים שאני אוהבת"
        subtitle="דברים שאני משתמשת בהם ובאמת אוהבת — הכל נבדק ומומלץ אישית"
        num="06"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <ProductGrid products={sorted} categories={categories} />
      </div>
    </div>
  );
}
