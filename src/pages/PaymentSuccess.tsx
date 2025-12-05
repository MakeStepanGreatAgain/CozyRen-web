import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/common/SEO";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      console.log("Payment successful for order:", orderId);
    }
  }, [orderId]);

  return (
    <>
      <SEO
        title="Оплата успешно завершена - Уютный Ремонт"
        description="Ваш заказ успешно оплачен и принят в обработку"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-700">Оплата прошла успешно!</h1>
            <p className="text-lg text-muted-foreground">
              Ваш заказ успешно оплачен и принят в обработку
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mt-2">
                Номер заказа: <span className="font-semibold">{orderId}</span>
              </p>
            )}
          </div>

          <Card className="text-left mb-6">
            <CardHeader>
              <CardTitle className="text-center">Что дальше?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Подтверждение заказа</p>
                    <p className="text-sm text-muted-foreground">
                      Мы свяжемся с вами в течение 30 минут для подтверждения деталей заказа
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Подготовка к отправке</p>
                    <p className="text-sm text-muted-foreground">
                      Мы подготовим ваш заказ и уведомим о готовности к отправке
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Доставка</p>
                    <p className="text-sm text-muted-foreground">
                      Получите ваш заказ удобным для вас способом
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Время работы: каждый день с 9:00 до 18:00
            </p>
            <p className="text-sm text-muted-foreground">
              Телефон: +7 (123) 456-78-90
            </p>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                На главную
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/catalog">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Продолжить покупки
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}