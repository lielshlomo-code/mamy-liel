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

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <AnimatedSection delay={index * 0.15}>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm shadow-warm-200/30 border border-warm-300/20"
      >
        {/* Image area */}
        <div className="aspect-[4/5] bg-gradient-to-b from-black/[0.02] to-black/[0.06] flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <span className="text-8xl font-black text-black/[0.04] group-hover:scale-110 transition-transform duration-700">
              {(index + 1).toString().padStart(2, "0")}
            </span>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />

          {/* External link icon */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ExternalLink className="w-4 h-4" />
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 text-xs font-medium bg-white/90 rounded-full">
              {categoryLabels[product.category] || product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg group-hover:text-text-secondary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-100/15 rounded-full blur-3xl pointer-events-none" />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, i) => (
            <FeaturedProductCard key={product.id} product={product} index={i} />
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
