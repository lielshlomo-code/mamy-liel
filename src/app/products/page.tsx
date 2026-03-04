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
      <div className="relative overflow-hidden bg-warm-gradient-reverse">
        <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-warm-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 -left-20 w-[400px] h-[400px] bg-warm-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-warm-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
          <ProductGrid products={sorted} categories={categories} />
        </div>
      </div>
    </div>
  );
}
