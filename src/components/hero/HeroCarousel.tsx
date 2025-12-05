import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import banner1 from "@/assets/hero-banner-1.jpg";
import banner2 from "@/assets/hero-banner-2.jpg";
import banner3 from "@/assets/hero-banner-3.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    { 
      src: banner1, 
      title: "Бесплатная доставка", 
      subtitle: "по мкр. Веризино", 
      accent: "от 2000₽",
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      link: "/delivery"
    },
    { 
      src: banner2, 
      title: "Скидки до 20%", 
      subtitle: "каждый день", 
      accent: "",
      color: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    { 
      src: banner3, 
      title: "Консультация", 
      subtitle: "специалиста", 
      accent: "бесплатно",
      color: "bg-gradient-to-r from-blue-500 to-purple-600",
      link: "/contacts"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section aria-label="Главные предложения" className="container mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-hidden">
        {banners.map((banner, index) => (
          banner.link ? (
            <Link 
              key={index}
              to={banner.link}
              className={cn(
                "relative w-full sm:flex-1 min-h-[140px] sm:min-h-[160px] rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-500 transform block motion-reduce:transform-none",
                currentSlide === index 
                  ? "motion-safe:scale-105 shadow-xl ring-2 ring-primary/20" 
                  : "motion-safe:scale-100 sm:opacity-80 motion-safe:hover:opacity-100 motion-safe:hover:scale-102"
              )}
              onClick={() => setCurrentSlide(index)}
            >
            
            <div className={cn("absolute inset-0", banner.color)} />
            <div className="absolute inset-0 bg-black/20" />
            <img 
              src={banner.src} 
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:animate-ken-burns"
            />
            
            <div className="relative h-full p-4 sm:p-6 flex flex-col justify-center text-white">
              <div className="text-sm font-medium opacity-90 mb-1">
                {banner.accent}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                {banner.title}
              </h3>
              <p className="text-sm sm:text-base opacity-90">
                {banner.subtitle}
              </p>
            </div>
            
            {/* Active indicator */}
            <div className={cn(
              "absolute bottom-2 left-4 sm:left-6 w-6 sm:w-8 h-1 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-white" : "bg-white/40"
            )} />
            </Link>
          ) : (
            <div 
              key={index}
              className={cn(
                "relative w-full sm:flex-1 min-h-[140px] sm:min-h-[160px] rounded-lg sm:rounded-xl overflow-hidden transition-all duration-500 transform motion-reduce:transform-none",
                currentSlide === index 
                  ? "motion-safe:scale-105 shadow-xl ring-2 ring-primary/20" 
                  : "motion-safe:scale-100 sm:opacity-80"
              )}
              onClick={() => setCurrentSlide(index)}
            >
              <div className={cn("absolute inset-0", banner.color)} />
              <div className="absolute inset-0 bg-black/20" />
              <img 
                src={banner.src} 
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 motion-safe:animate-ken-burns"
              />
              
              <div className="relative h-full p-4 sm:p-6 flex flex-col justify-center text-white">
                {banner.accent && (
                  <div className="text-sm font-medium opacity-90 mb-1">
                    {banner.accent}
                  </div>
                )}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                  {banner.title}
                </h3>
                <p className="text-sm sm:text-base opacity-90">
                  {banner.subtitle}
                </p>
              </div>
              
              {/* Active indicator */}
              <div className={cn(
                "absolute bottom-2 left-4 sm:left-6 w-6 sm:w-8 h-1 rounded-full transition-all duration-300",
                currentSlide === index ? "bg-white" : "bg-white/40"
              )} />
            </div>
          )
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              currentSlide === index 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
