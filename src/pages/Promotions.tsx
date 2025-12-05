import SEO from "@/components/common/SEO";
import ConsultationBanner from "@/components/common/ConsultationBanner";
import PromotionCards from "@/components/promotions/PromotionCards";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Promotions() {
  return (
    <>
      <SEO 
        title="Акции и скидки на товары для ремонта — Уютный ремонт" 
        description="Актуальные скидки до 50% и специальные предложения на инструменты, стройматериалы и товары для ремонта. Выгодные акции каждую неделю."
        keywords={["акции", "скидки", "распродажа", "товары для ремонта", "выгодные предложения"]}
        canonical="https://уютный-ремонт.рф/promotions"
      />
      
      <section className="container mt-8">
        <h1 className="text-3xl font-bold mb-2">Текущие акции</h1>
        <p className="text-muted-foreground mb-8">Следите за выгодными предложениями каждую неделю.</p>
        
        <PromotionCards />
        
        {/* Креативный призыв к действию */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Откройте мир возможностей
            </h3>
            
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Тысячи товаров для создания дома вашей мечты ждут вас в нашем каталоге. 
              От инструментов до отделочных материалов — всё для идеального ремонта!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/catalog">
                <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-white px-8 py-3">
                  <span className="relative z-10 flex items-center gap-2">
                    Открыть каталог
                    <div className="transition-transform group-hover:translate-x-1">
                      →
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Более 5000 товаров</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mb-8">
        <ConsultationBanner />
      </div>
    </>
  );
}
