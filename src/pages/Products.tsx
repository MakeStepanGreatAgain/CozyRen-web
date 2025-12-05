import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import { useProducts } from "@/hooks/useProducts";
import { categories } from "@/data/categories";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  X, 
  ChevronRight,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Products() {
  const { data: allProducts = [], isLoading } = useProducts();
  const [params, setParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  
  // Фильтры
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 50000 });
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const search = params.get("search") || "";
  const categoryParam = params.get("category") || "";
  const brandParam = params.get("brand") || "";

  // Инициализация фильтров из URL
  useMemo(() => {
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
    if (brandParam && !selectedBrands.includes(brandParam)) {
      setSelectedBrands([brandParam]);
    }
  }, [categoryParam, brandParam]);

  // Получаем уникальные бренды
  const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort();

  // Фильтрация и сортировка продуктов
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Поиск
      if (search && !product.title.toLowerCase().includes(search.toLowerCase()) && 
          !product.shortDescription.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Выбранные категории
      const categoriesToCheck = categoryParam ? [categoryParam] : selectedCategories;
      if (categoriesToCheck.length > 0 && !categoriesToCheck.includes(product.category)) {
        return false;
      }

      // Выбранные бренды
      const brandsToCheck = brandParam ? [brandParam] : selectedBrands;
      if (brandsToCheck.length > 0 && !brandsToCheck.includes(product.brand)) {
        return false;
      }

      // Цена
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      // Только в наличии
      if (onlyAvailable && !product.available) {
        return false;
      }

      return true;
    });

    // Сортировка
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "popularity":
      default:
        break;
    }

    return filtered;
  }, [
    allProducts,
    search, 
    categoryParam,
    brandParam,
    selectedCategories, 
    selectedBrands, 
    priceRange, 
    onlyAvailable, 
    sortBy
  ]);

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50000 });
    setOnlyAvailable(false);
    setParams({});
  };

  return (
    <>
      <SEO 
        title="Товары для отделки — Уютный ремонт" 
        description="Качественные отделочные материалы с доставкой по Веризино. Керамогранит, ламинат, плитка, краски, сантехника."
      />

      {/* Хлебные крошки */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/catalog" className="hover:text-foreground">Каталог</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Товары</span>
          {categoryParam && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">
                {categories.find(c => c.key === categoryParam)?.title}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Заголовок и поиск */}
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">
            {categoryParam 
              ? categories.find(c => c.key === categoryParam)?.title || "Товары"
              : "Все товары"
            }
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setParams({ ...Object.fromEntries(params), search: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Фильтры
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">по популярности</SelectItem>
                  <SelectItem value="price_asc">по цене ↑</SelectItem>
                  <SelectItem value="price_desc">по цене ↓</SelectItem>
                  <SelectItem value="name_asc">по названию ↑</SelectItem>
                  <SelectItem value="name_desc">по названию ↓</SelectItem>
                </SelectContent>
              </Select>

              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="container py-6">
        <div className="flex gap-8">
          {/* Боковые фильтры */}
          <aside className={cn(
            "w-80 space-y-6 transition-all",
            showMobileFilters ? "block" : "hidden lg:block"
          )}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Сбросить
              </Button>
            </div>

            {/* Категории (только если не задана в URL) */}
            {!categoryParam && (
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-medium">Категории</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category) => {
                    const categoryProductsCount = allProducts.filter(p => p.category === category.key).length;
                    return (
                      <div key={category.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.key}
                          checked={selectedCategories.includes(category.key)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.key]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category.key));
                            }
                          }}
                        />
                        <label 
                          htmlFor={category.key} 
                          className="text-sm flex-1 cursor-pointer flex justify-between"
                        >
                          <span>{category.title}</span>
                          <span className="text-muted-foreground">({categoryProductsCount})</span>
                        </label>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Цена */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-medium">Цена, ₽</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="от"
                    value={priceRange.min || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="до"
                    value={priceRange.max || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 50000 })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Бренды (только если не задан в URL) */}
            {!brandParam && (
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-medium">Бренд</h3>
                </CardHeader>
                <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                  {brands.map((brand) => {
                    const brandProductsCount = allProducts.filter(p => p.brand === brand).length;
                    return (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <label 
                          htmlFor={brand} 
                          className="text-sm flex-1 cursor-pointer flex justify-between"
                        >
                          <span>{brand}</span>
                          <span className="text-muted-foreground">({brandProductsCount})</span>
                        </label>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Дополнительные фильтры */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-medium">Наличие</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={onlyAvailable}
                    onCheckedChange={(checked) => setOnlyAvailable(checked === true)}
                  />
                  <label htmlFor="available" className="text-sm cursor-pointer">
                    Только в наличии
                  </label>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Основной контент */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Найдено товаров: <span className="font-medium text-foreground">{filteredProducts.length}</span>
              </p>
            </div>

            {isLoading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить параметры поиска или сбросить фильтры
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}