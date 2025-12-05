import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/types";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { state, add, inc, dec, remove } = useCart();
  const [pressed, setPressed] = useState(false);
  
  const cartItem = state.items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.qty || 0;
  return (
    <Card className="overflow-hidden group flex flex-col h-full motion-safe:hover:shadow-xl transition-all duration-300 rounded-xl border-0 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm">
      <div className="block">
        <div className="relative overflow-hidden rounded-t-xl">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, idx) => (
                <CarouselItem key={idx} className="p-0">
                  <img
                    src={img}
                    alt={`${product.title} — изображение ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-48 sm:h-52 object-cover select-none motion-safe:group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border-0 motion-safe:hover:scale-110 transition-transform" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border-0 motion-safe:hover:scale-110 transition-transform" />
          </Carousel>
          <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            ТОП
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <a href={`/product/${product.id}`} className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors duration-200 mb-2">
          {product.title}
        </a>
        <div className="text-xs sm:text-sm text-muted-foreground mb-3">{product.brand}</div>
        <div className="mt-auto space-y-3">
          <div className="text-xl font-bold text-primary">{product.price.toLocaleString()} ₽</div>
          
          {!isInCart ? (
            <Button
              className={`w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-2.5 rounded-xl shadow-lg motion-safe:hover:scale-105 motion-safe:hover:shadow-xl transition-all duration-300 ${pressed ? "animate-scale-in" : ""}`}
              onClick={() => {
                if (!product.available) return;
                setPressed(true);
                add(product);
                setTimeout(() => setPressed(false), 200);
              }}
              disabled={!product.available}
            >
              {product.available ? "В корзину" : "Нет в наличии"}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center bg-muted/50 rounded-xl p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dec(product.id)}
                  className="h-8 w-8 p-0 hover:bg-background rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center font-medium text-sm px-2">{quantity} шт.</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => inc(product.id)}
                  className="h-8 w-8 p-0 hover:bg-background rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(product.id)}
                className="w-full h-9 rounded-xl"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
