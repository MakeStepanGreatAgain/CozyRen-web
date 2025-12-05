import SEO from "@/components/common/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPinned
} from "lucide-react";

export default function Delivery() {
  return (
    <>
      <SEO 
        title="Доставка строительных материалов и оплата — Уютный ремонт" 
        description="Условия доставки товаров для ремонта по Владимиру и области. Бесплатная доставка от 2000₽. Способы оплаты: наличные, карты, онлайн."
        keywords={["доставка", "оплата", "условия доставки", "строительные материалы", "Владимир", "бесплатная доставка"]}
        canonical="https://уютный-ремонт.рф/delivery"
      />

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Доставка и оплата</h1>

        {/* Доставка */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Доставка по Веризино
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Бесплатная доставка</span>
                </div>
                <Badge variant="secondary">от 2000 ₽</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Зона доставки</p>
                    <p className="text-sm text-muted-foreground">
                      Микрорайон Веризино и прилегающие территории
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Время доставки</p>
                    <p className="text-sm text-muted-foreground">
                      Ежедневно с 9:00 до 18:00
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Стоимость доставки при заказе менее 2000 ₽:</strong>
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• До 3 км от магазина - 200 ₽</li>
                  <li>• От 3 до 5 км - 350 ₽</li>
                  <li>• Свыше 5 км - договорная</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Самовывоз
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Адрес магазина</p>
                <p className="text-sm text-blue-700">
                  Опольевская ул., 1, корп. 29, г. Владимир
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Режим работы</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Каждый день с 9:00 до 18:00</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">Преимущества самовывоза</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Бесплатно независимо от суммы заказа</li>
                    <li>• Возможность осмотреть товар перед покупкой</li>
                    <li>• Консультация специалистов на месте</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Способы оплаты */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Способы оплаты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full inline-block mb-3">
                  <Banknote className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Наличные</h3>
                <p className="text-sm text-muted-foreground">
                  Оплата наличными при получении товара
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full inline-block mb-3">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Банковская карта</h3>
                <p className="text-sm text-muted-foreground">
                  Оплата картой при получении или в магазине
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full inline-block mb-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Онлайн оплата</h3>
                <p className="text-sm text-muted-foreground">
                  Безопасная оплата на сайте банковской картой
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Остались вопросы */}
        <section aria-labelledby="help" className="container mt-12 md:mt-16 mb-16">
          <Card className="p-6 md:p-10 bg-primary/5 border-primary/20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 id="help" className="text-xl md:text-2xl font-semibold">Остались вопросы?</h2>
              <p className="mt-2 text-muted-foreground">Наши менеджеры помогут выбрать оптимальный способ доставки</p>
              <div className="mt-4 flex flex-col items-center gap-2 text-sm md:text-base">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +7 (910) 774-52-30</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> cozyrenovations@yandex.ru</div>
                <div className="flex items-center gap-2"><MapPinned className="h-4 w-4" /> Владимир, Опольевская улица, 1, корп. 29</div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}