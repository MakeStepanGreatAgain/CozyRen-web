import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";
import type { Category } from "@/types";

// Товары со скидками
const discountedProducts = [
  {
    id: "promo1",
    title: "Краска акриловая Dulux Professional",
    originalPrice: 1650,
    discountedPrice: 1250,
    discount: 25,
    rating: 4.8,
    image: "/src/assets/product-roller.jpg",
    validUntil: "31 декабря",
    inStock: true,
  },
  {
    id: "promo2", 
    title: "Грунтовка универсальная Ceresit CT 17",
    originalPrice: 590,
    discountedPrice: 450,
    discount: 25,
    rating: 4.8,
    image: "/src/assets/product-bucket-1.jpg",
    validUntil: "31 декабря",
    inStock: true,
  },
];

export default function DiscountedProducts() {
  const { add } = useCart();

  const handleAddToCart = (product: typeof discountedProducts[0]) => {
    // Create a Product object from the discounted product
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.discountedPrice,
      brand: "Уютный ремонт",
      available: product.inStock,
      category: "Краски" as Category,
      images: [product.image],
      shortDescription: product.title,
      description: product.title,
      specs: {},
    };
    
    add(productToAdd);
    toast.success("Товар добавлен в корзину!");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Товары со скидкой</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {discountedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 rounded px-2 py-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
            </div>
            
            <div className="p-4">
              <Link 
                to={`/product/${product.id}`}
                className="font-medium text-sm leading-tight mb-2 block hover:text-primary transition-colors line-clamp-2"
              >
                {product.title}
              </Link>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-bold text-lg">
                  {product.discountedPrice} ₽
                </span>
                <span className="text-muted-foreground line-through text-sm">
                  {product.originalPrice} ₽
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-red-500 text-xs mb-3">
                <Clock className="h-3 w-3" />
                <span>До {product.validUntil}</span>
              </div>
              
              <Button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                В корзину
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
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
    </div>
  );
}