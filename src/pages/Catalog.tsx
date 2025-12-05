import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import BreadcrumbSEO from "@/components/common/BreadcrumbSEO";
import { useCategories } from "@/hooks/useCategories";
import { subcategories } from "@/data/subcategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  Building2, 
  Wrench, 
  Zap, 
  Cog,
  Paintbrush,
  Home,
  ShowerHead,
  Grid3x3,
  Layers,
  Square,
  Grid,
  Wallpaper,
  RectangleHorizontal,
  DoorOpen,
  RectangleVertical,
  Layers3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Маппинг иконок
const iconMap: Record<string, any> = {
  "Building2": Building2,
  "ShowerHead": ShowerHead,
  "Wallpaper": Wallpaper,
  "PaintRoller": Paintbrush,
  "Square": Square,
  "Grid": Grid,
  "Layers": Layers,
  "Layers3": Layers3,
  "Grid3x3": Grid3x3,
  "RectangleHorizontal": RectangleHorizontal,
  "DoorOpen": DoorOpen,
  "RectangleVertical": RectangleVertical,
};

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading, error } = useCategories();

  // Фильтрация категорий по поиску
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO 
        title="Каталог товаров для отделки — Уютный ремонт" 
        description="Большой выбор отделочных материалов: сантехника, краски, ламинат, плитка, обои, двери, окна. Доставка по Веризино."
      />

      <div className="container py-8">
        {/* Заголовок и поиск */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Каталог товаров Уютный ремонт</h1>
        </div>

        {/* Основные категории */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-200 rounded-lg h-14 w-14"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              {error}
            </div>
          ) : (
            filteredCategories.map((category) => {
              const IconComponent = iconMap[category.name] || Building2;
              const categorySubcategories = subcategories[category.name] || [];
              
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.products_count} товаров
                        </p>
                      </div>
                      <ChevronRight 
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform",
                          selectedCategory === category.name && "rotate-90"
                        )}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    
                    {/* Подкатегории/бренды */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      selectedCategory === category.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="border-t pt-4 -mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          {categorySubcategories.slice(0, 8).map((subcategory, index) => (
                            <Link
                              key={index}
                              to={`/products?category=${encodeURIComponent(category.name)}&brand=${encodeURIComponent(subcategory)}`}
                              className="text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 p-2 rounded transition-colors"
                            >
                              {subcategory}
                            </Link>
                          ))}
                        </div>
                        
                        {categorySubcategories.length > 8 && (
                          <Link
                            to={`/products?category=${encodeURIComponent(category.name)}`}
                            className="text-sm text-primary hover:underline mt-2 inline-block"
                          >
                            Показать все ({categorySubcategories.length})
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Кнопка перехода к товарам */}
                    <div className="pt-4">
                      <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Смотреть товары
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Блок с популярными брендами */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Популярные бренды</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Grohe", "Hansgrohe", "Kerama Marazzi", "Dulux", "Tikkurila", 
              "Tarkett", "Barlinek", "Estima", "Erismann", "Barrisol",
              "Profil Doors", "Rehau"
            ].map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${encodeURIComponent(brand)}`}
                className="group"
              >
                <Card className="text-center hover:shadow-md transition-all duration-300 hover:border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">
                      {brand}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Информационные блоки */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                <ShowerHead className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Сантехника</h3>
              <p className="text-sm text-muted-foreground">
                Смесители, душевые системы, унитазы от ведущих производителей
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
                <Paintbrush className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Отделочные материалы</h3>
              <p className="text-sm text-muted-foreground">
                Плитка, ламинат, обои, краски для создания уютного интерьера
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="p-3 bg-purple-100 rounded-full inline-block mb-4">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Для дома</h3>
              <p className="text-sm text-muted-foreground">
                Двери, окна, потолки - все для комфортного дома
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}