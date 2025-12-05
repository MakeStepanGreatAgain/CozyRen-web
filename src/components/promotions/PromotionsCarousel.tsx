import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Gift, Tag, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromotionsCarousel() {
  const promotions = [
    {
      id: 1,
      title: "Большие скидки на краски",
      subtitle: "До 30% на все лакокрасочные материалы",
      description: "Акриловые краски, грунтовки, эмали и многое другое",
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      icon: Tag,
      cta: "Смотреть акции",
      link: "/promotions"
    },
    {
      id: 2,
      title: "Бесплатная доставка",
      subtitle: "По мкр. Веризино",
      description: "При заказе от 3000 рублей доставляем бесплатно",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      icon: Truck,
      cta: "Заказать",
      link: "/catalog"
    },
    {
      id: 3,
      title: "2+1 в подарок",
      subtitle: "На строительные смеси",
      description: "Цемент, штукатурки, шпаклевки - третий товар в подарок",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: Gift,
      cta: "Выбрать товары",
      link: "/catalog?category=Стройматериалы"
    },
    {
      id: 4,
      title: "Консультация специалиста",
      subtitle: "Бесплатно по телефону",
      description: "Поможем выбрать материалы и рассчитать количество",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: Phone,
      cta: "Получить консультацию",
      link: "/contacts"
    }
  ];

  return (
    <section aria-label="Акции и предложения" className="w-full mt-6">
      <Carousel className="w-full">
        <CarouselContent>
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <CarouselItem key={promo.id}>
                <div className={`relative overflow-hidden rounded-lg ${promo.bgColor} text-white`}>
                  <div className="container relative z-10 py-16 md:py-24">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full bg-white/20 p-3">
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Акция
                        </Badge>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-3">{promo.title}</h2>
                      <p className="text-xl md:text-2xl font-medium mb-4 text-white/90">{promo.subtitle}</p>
                      <p className="text-lg mb-8 text-white/80 max-w-xl">{promo.description}</p>
                      <Link to={promo.link}>
                        <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-white/90">
                          {promo.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}