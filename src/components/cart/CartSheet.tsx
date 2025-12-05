import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { state, inc, dec, remove, clear } = useCart();
  const total = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex-1 min-h-0">
          {state.items.length === 0 && <p className="text-muted-foreground">Ваша корзина пуста</p>}
          {state.items.length > 0 && (
            <ScrollArea className={state.items.length > 5 ? "h-full pr-3" : ""}>
              <div className="space-y-4">
                {state.items.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.title} loading="lazy" className="size-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">{product.title}</div>
                      <div className="text-sm text-muted-foreground">{product.price.toLocaleString()} ₽</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button size="sm" variant="secondary" onClick={() => dec(product.id)}>-</Button>
                        <span className="min-w-6 text-center">{qty}</span>
                        <Button size="sm" onClick={() => inc(product.id)}>+</Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(product.id)}>Удалить</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Итого</div>
          <div className="text-lg font-semibold">{total.toLocaleString()} ₽</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => { navigate("/checkout"); onOpenChange(false); }}>Оформить</Button>
          <Button variant="secondary" onClick={clear}>Очистить</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
