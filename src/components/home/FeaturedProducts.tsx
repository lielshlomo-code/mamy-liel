import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getFeaturedProducts } from "@/lib/content";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Product } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  baby: "לתינוק",
  home: "לבית",
  fashion: "אופנה",
  beauty: "טיפוח",
};

function FeaturedProductCard({
  product,
  index,
  featured = false,
}: {
  product: Product;
  index: number;
  featured?: boolean;
}) {
  return (
    <AnimatedSection delay={index * 0.15} className={featured ? "md:row-span-2" : ""}>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block rounded-3xl overflow-hidden ${
          featured ? "h-[350px] md:h-full" : "h-[280px]"
        }`}
      >
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          {product.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-warm-200 via-rose-100 to-warm-100" />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 text-xs font-bold bg-white/90 backdrop-blur-sm rounded-full">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        {/* External link icon on hover */}
        <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8 z-10">
          <h3
            className={`font-black text-white mb-1 ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {product.name}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2 max-w-sm group-hover:text-white/90 transition-colors duration-300">
            {product.description}
          </p>
        </div>
      </a>
    </AnimatedSection>
  );
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-animated-gradient section-curve-top section-curve-bottom">
      {/* Decorative background elements */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-l from-transparent via-warm-300/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-l from-transparent via-warm-300/60 to-transparent" />
      <div className="absolute -top-10 right-10 w-[350px] h-[350px] bg-rose-200/25 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-warm-200/30 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-text-light mb-3">
              המומלצים שלי
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              מוצרים שאני אוהבת
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Link
              href="/products"
              className="group hidden md:inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            >
              לכל המוצרים
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>

        {/* Magazine-style layout: featured + 2 stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[1fr_1fr] gap-5">
          {products[0] && (
            <FeaturedProductCard
              product={products[0]}
              index={0}
              featured
            />
          )}
          {products.slice(1, 3).map((product, i) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              index={i + 1}
            />
          ))}
        </div>

        <AnimatedSection className="mt-8 md:hidden text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground font-medium rounded-full"
          >
            לכל המוצרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
