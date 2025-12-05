import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/CartContext";
import SEO from "@/components/common/SEO";

export default function Cart() {
  const { state, inc, dec, remove, clear } = useCart();
  const navigate = useNavigate();
  const [sortByCategories, setSortByCategories] = useState(false);

  const totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (state.items.length === 0) {
    return (
      <>
        <SEO
          title="Корзина - Уютный Ремонт"
          description="Ваша корзина покупок пуста. Добавьте товары из каталога строительных материалов"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Корзина</h1>
          </div>

          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Корзина пуста.</h2>
              <p className="text-muted-foreground mb-6">
                Чтобы пополнить список, воспользуйтесь поиском или{" "}
                <Link to="/catalog" className="text-primary hover:underline">
                  каталогом.
                </Link>
              </p>
            </div>

            <Link to="/catalog">
              <Card className="border-dashed border-2 p-8 mb-6 hover-scale cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 active:scale-95">
                <div className="mb-4">
                  <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2 transition-colors group-hover:text-primary" />
                  <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary">Добавить товар</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Корзина (${state.items.length}) - Уютный Ремонт`}
        description="Оформите заказ строительных материалов в нашем интернет-магазине"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Корзина</h1>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sortByCategories"
                checked={sortByCategories}
                onChange={(e) => setSortByCategories(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="sortByCategories" className="text-sm">
                Сортировать по категориям
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.product.id} className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => dec(item.product.id)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => inc(item.product.id)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">
                            {(item.product.price * item.qty).toLocaleString()} ₽
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(item.product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={clear}>
                Очистить корзину
              </Button>
              <Button variant="outline" asChild>
                <Link to="/catalog">Продолжить покупки</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Итого</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Товары ({state.items.reduce((sum, item) => sum + item.qty, 0)})</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span>Бесплатно</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>К оплате</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Оформить заказ
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}