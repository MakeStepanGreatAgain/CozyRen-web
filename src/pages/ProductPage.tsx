import { useParams, Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import BreadcrumbSEO from "@/components/common/BreadcrumbSEO";
import { useProduct, useProductsByCategory } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/cart/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: categoryProducts = [] } = useProductsByCategory(product?.category);
  const { add } = useCart();

  const similar = categoryProducts.filter((p) => p.id !== product?.id);

  if (isLoading) {
    return (
      <div className="container mt-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <section className="container mt-8">
        <h1 className="text-2xl font-semibold mb-4">Товар не найден</h1>
        <Link to="/catalog" className="underline">Вернуться в каталог</Link>
      </section>
    );
  }

  return (
    <>
      <SEO 
        title={`${product.title} - купить в магазине Уютный ремонт`}
        description={`${product.title} по выгодной цене ${product.price} ₽. ${product.shortDescription} Доставка по России. Гарантия качества.`}
        type="product"
        keywords={[product.title, product.brand, product.category, "купить", "цена", "доставка"]}
        canonical={`https://уютный-ремонт.рф/product/${product.id}`}
        image={product.images[0]}
        product={{
          price: product.price.toString(),
          currency: "RUB",
          brand: product.brand,
          category: product.category,
          availability: "InStock"
        }}
      />
      <BreadcrumbSEO 
        className="container mt-4"
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: product.category, href: `/catalog?category=${product.category}` },
          { label: product.title }
        ]}
      />
      <article className="container mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((src, i) => (
              <img key={i} src={src} alt={`${product.title} фото ${i + 1}`} loading="lazy" className="w-full h-28 object-cover rounded-md" />
            ))}
          </div>
          <img src={product.images[0]} alt={product.title} loading="lazy" className="w-full mt-4 rounded-lg object-cover" />
        </section>
        <section>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <div className="text-muted-foreground mb-4">{product.brand}</div>
          <div className="text-2xl font-semibold mb-4">{product.price.toLocaleString()} ₽</div>
          <p className="mb-4 text-foreground/80">{product.description}</p>
          <Button onClick={() => add(product)} disabled={!product.available}>
            {product.available ? "Добавить в корзину" : "Нет в наличии"}
          </Button>

          <h2 className="mt-8 mb-2 text-xl font-semibold">Характеристики</h2>
          <ul className="text-sm text-foreground/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(product.specs).map(([k, v]) => (
              <li key={k} className="flex justify-between border rounded-md p-2"><span>{k.replace(/_/g, ' ')}</span><span className="font-medium">{v as any}</span></li>
            ))}
          </ul>
        </section>
      </article>

      {similar.length > 0 && (
        <section className="container mt-12">
          <h2 className="text-xl font-semibold mb-4">Похожие товары</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similar.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <Link to={`/product/${p.id}`}>
                  <img src={p.images[0]} alt={p.title} loading="lazy" className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <div className="font-medium line-clamp-2">{p.title}</div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
