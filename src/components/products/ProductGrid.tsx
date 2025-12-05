import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGrid({ products, isLoading }: { products: Product[]; isLoading?: boolean }) {
  return (
    <section aria-label="Товары" className="container mt-12">
      <h2 className="text-2xl font-semibold mb-4">Популярные товары</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>
    </section>
  );
}
