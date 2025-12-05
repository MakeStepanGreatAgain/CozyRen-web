import SEO from "@/components/common/SEO";
import HeroCarousel from "@/components/hero/HeroCarousel";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import ProductGrid from "@/components/products/ProductGrid";
import Reveal from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <>
      <SEO 
        title="Уютный ремонт — Товары для ремонта и строительства"
        description="Широкий выбор товаров для ремонта: инструменты, стройматериалы, сантехника, электрика. Быстрая доставка по России, выгодные цены и акции."
        keywords={["товары для ремонта", "инструменты", "стройматериалы", "сантехника", "электрика", "доставка", "ремонт дома"]}
        canonical="https://уютный-ремонт.рф/"
      />
      <div className="container">
        <main>
          <HeroCarousel />
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="sr-only">Категории товаров</h2>
            <CategoryGrid />
          </section>
          
          {/* Delivery Questions Section */}
          <Reveal delay={200}>
            <section className="container my-12">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                  Остались вопросы о доставке?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Наши менеджеры помогут выбрать оптимальный способ доставки
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Связаться с менеджером
                </Button>
              </div>
            </section>
          </Reveal>

          <Reveal delay={300}>
            <section aria-labelledby="featured-products-heading">
              <h2 id="featured-products-heading" className="sr-only">Рекомендуемые товары</h2>
              <ProductGrid products={products.slice(0, 8)} isLoading={isLoading} />
            </section>
          </Reveal>

          {/* World of Possibilities Section */}
          <Reveal delay={400}>
            <section className="container my-16">
              <div className="bg-gradient-to-br from-green-50 via-green-25 to-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                {/* Cart Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4" />
                  </svg>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-600">
                  Откройте мир возможностей
                </h2>
                
                <div className="space-y-2 mb-8">
                  <p className="text-lg md:text-xl text-gray-700">
                    Тысячи товаров для создания дома вашей мечты ждут вас в нашем каталоге.
                  </p>
                  <p className="text-lg md:text-xl text-gray-700">
                    От инструментов до отделочных материалов — всё для идеального ремонта!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/catalog">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-full">
                      Открыть каталог
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg">Более 5000 товаров</span>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        </main>
      </div>
    </>
  );
};

export default Index;
