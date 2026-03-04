import type { Metadata } from "next";
import { getProductsData } from "@/lib/content";
import ProductGrid from "@/components/products/ProductGrid";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מוצרים שאני אוהבת",
  description: "המוצרים שאני משתפת וממליצה עליהם",
};

export default async function ProductsPage() {
  const { products, categories } = await getProductsData();

  const sorted = [...products].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  return (
    <div className="pt-24 relative">
      <PageHeader
        title="מוצרים שאני אוהבת"
        subtitle="דברים שאני משתמשת בהם ובאמת אוהבת — הכל נבדק ומומלץ אישית"
        num="06"
      />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 cross-hatch opacity-40 pointer-events-none" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-black/[0.015] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
          <ProductGrid products={sorted} categories={categories} />
        </div>
      </div>
    </div>
  );
}
