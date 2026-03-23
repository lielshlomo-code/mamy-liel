import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getWeeklyRandomProducts } from "@/lib/content";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Product } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  gear: "ציוד ואביזרים",
  toys: "צעצועים ומשחקים",
  feeding: "שולחן ואוכל",
  home: "הבית שלנו",
  personal: "לגן ולילדים",
};

function FeaturedProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <AnimatedSection delay={index * 0.08}>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-2xl overflow-hidden h-[260px] md:h-[280px]"
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
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold bg-white/90 backdrop-blur-sm rounded-full">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        {/* External link icon on hover */}
        <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 right-0 left-0 p-4 md:p-5 z-10">
          <h3 className="font-black text-white text-base md:text-lg mb-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-white/60 line-clamp-1 group-hover:text-white/90 transition-colors duration-300">
            {product.description}
          </p>
        </div>
      </a>
    </AnimatedSection>
  );
}

export default async function FeaturedProducts() {
  const products = await getWeeklyRandomProducts(10);

  if (products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 relative overflow-hidden bg-animated-gradient section-curve-top section-curve-bottom">
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

        {/* Grid: 2 columns mobile, 3 columns tablet, 5 columns desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              index={i}
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
