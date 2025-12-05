import { useSearchParams, Link } from "react-router-dom";
import { X, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/common/SEO";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <SEO
        title="Ошибка оплаты - Уютный Ремонт"
        description="Произошла ошибка при оплате заказа"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-red-700">Ошибка оплаты</h1>
            <p className="text-lg text-muted-foreground">
              К сожалению, произошла ошибка при обработке платежа
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mt-2">
                Номер заказа: <span className="font-semibold">{orderId}</span>
              </p>
            )}
          </div>

          <Card className="text-left mb-6">
            <CardHeader>
              <CardTitle className="text-center">Возможные причины</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm">Недостаточно средств на карте</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm">Технические неполадки банка</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm">Превышен лимит операций</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm">Карта заблокирована или просрочена</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-left mb-6">
            <CardHeader>
              <CardTitle className="text-center">Что делать?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Проверьте данные карты</p>
                    <p className="text-sm text-muted-foreground">
                      Убедитесь, что карта действительна и на ней достаточно средств
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Попробуйте еще раз</p>
                    <p className="text-sm text-muted-foreground">
                      Оформите заказ заново или выберите другой способ оплаты
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Свяжитесь с нами</p>
                    <p className="text-sm text-muted-foreground">
                      Наши менеджеры помогут оформить заказ по телефону
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
              <Link to="/checkout">
                <RefreshCw className="mr-2 h-4 w-4" />
                Попробовать снова
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться в корзину
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}