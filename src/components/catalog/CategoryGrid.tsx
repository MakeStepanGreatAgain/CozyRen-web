import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import Reveal from "@/components/common/Reveal";
import { useCategories } from "@/hooks/useCategories";
import { Link } from "react-router-dom";

// Маппинг иконок для категорий
const iconMap: { [key: string]: string } = {
  "Сантехника": "ShowerHead",
  "Отделочные материалы": "Wallpaper", 
  "Краски": "PaintRoller",
  "Электроинструменты": "Zap",
  "Ручной инструмент": "Wrench",
  "Крепежные изделия": "Nut",
  "Электрика": "Zap",
  "Плитка": "Grid3x3",
  "Ламинат": "Layers3",
  "Паркет": "Grid",
  "Обои": "Wallpaper",
  "Двери": "DoorOpen",
  "Окна": "RectangleVertical"
};

export default function CategoryGrid() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section aria-labelledby="catalog-categories" className="container mt-12">
        <Reveal>
          <h2 id="catalog-categories" className="text-2xl font-semibold mb-4">Категории</h2>
        </Reveal>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Reveal key={index} delay={index * 100}>
              <Card className="p-3 sm:p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px] animate-pulse">
                <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-labelledby="catalog-categories" className="container mt-12">
        <Reveal>
          <h2 id="catalog-categories" className="text-2xl font-semibold mb-4">Категории</h2>
        </Reveal>
        <div className="text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="catalog-categories" className="container mt-12">
      <Reveal>
        <h2 id="catalog-categories" className="text-2xl font-semibold mb-4">Категории</h2>
      </Reveal>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category, index) => {
          const iconName = iconMap[category.name] || "Box";
          const Icon = (Icons as any)[iconName] ?? Icons.Box;
          return (
            <Reveal key={category.id} delay={index * 100}>
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="block h-full group">
                <Card className="p-3 sm:p-4 hover:shadow-md transition-all duration-300 h-full flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px] motion-safe:hover:scale-105 motion-safe:hover:ring-2 motion-safe:hover:ring-primary/20 motion-reduce:transform-none will-change-transform">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2 sm:mb-3 motion-safe:group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-medium text-xs sm:text-sm leading-tight">{category.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {category.products_count} товаров
                  </div>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
