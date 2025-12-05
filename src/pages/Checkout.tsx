import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, MapPin, User, Package, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart/CartContext";
import SEO from "@/components/common/SEO";
import { useToast } from "@/hooks/use-toast";
import { generateOrderPDF } from "@/utils/generateOrderPDF";
import { useCreateOrder } from "@/hooks/useOrders";

type Step = "contact" | "delivery" | "payment" | "success";

export default function Checkout() {
  const { state, clear } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();
  
  const [step, setStep] = useState<Step>("contact");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<{
    items: typeof state.items;
    totalPrice: number;
    itemsCount: number;
  } | null>(null);
  
  // Дополнительные услуги доставки
  const [deliveryServices, setDeliveryServices] = useState({
    largeItem: false,
    liftToFloor: false,
    eveningDelivery: false,
    smsNotification: false,
    furnitureAssembly: false
  });
  
  // Form data
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: ""
  });
  
  const [deliveryData, setDeliveryData] = useState({
    address: "",
    entrance: "",
    floor: "",
    apartment: "",
    date: "",
    time: ""
  });

  const totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const itemsCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  const handleNextStep = async () => {
    if (step === "contact") {
      if (!contactData.name || !contactData.phone) {
        toast({
          title: "Заполните обязательные поля",
          description: "Имя и телефон обязательны для оформления заказа",
          variant: "destructive"
        });
        return;
      }
      setStep("delivery");
    } else if (step === "delivery") {
      if (deliveryType === "delivery" && !deliveryData.address) {
        toast({
          title: "Укажите адрес доставки",
          description: "Для доставки необходимо указать адрес",
          variant: "destructive"
        });
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      await handleCreateOrder();
    }
  };

  const handleCreateOrder = async () => {
    try {
      const orderItems = state.items.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.qty
      }));

      const orderData = {
        email: contactData.email || `guest-${Date.now()}@example.com`,
        fullName: contactData.name,
        phone: contactData.phone,
        deliveryMethod: deliveryType,
        deliveryAddress: deliveryType === "delivery" ? 
          `${deliveryData.address}, подъезд ${deliveryData.entrance}, этаж ${deliveryData.floor}, кв. ${deliveryData.apartment}` : 
          undefined,
        paymentMethod: paymentMethod,
        items: orderItems,
        totalAmount: totalPrice
      };

      const result = await createOrderMutation.mutateAsync(orderData);

      if (result.success) {
        // Сохраняем данные заказа перед очисткой корзины
        const orderDataToSave = {
          items: state.items,
          totalPrice: totalPrice,
          itemsCount: itemsCount
        };
        setOrderData(orderDataToSave);
        setOrderNumber(result.orderId || `UR-${Date.now().toString().slice(-6)}`);

        if (result.paymentUrl && (paymentMethod === "sberpay" || paymentMethod === "sbp")) {
          // Redirect to Sberbank payment
          window.open(result.paymentUrl, '_blank');
        }

        setStep("success");
        clear(); // Очищаем корзину
        
        toast({
          title: "Заказ успешно создан!",
          description: `Номер заказа: ${result.orderId}`,
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка при создании заказа",
        description: error instanceof Error ? error.message : "Попробуйте еще раз",
        variant: "destructive"
      });
    }
  };

  const handlePrevStep = () => {
    if (step === "delivery") setStep("contact");
    else if (step === "payment") setStep("delivery");
  };

  const isStepCompleted = (currentStep: Step) => {
    if (currentStep === "contact") return step !== "contact";
    if (currentStep === "delivery") return step === "payment" || step === "success";
    if (currentStep === "payment") return step === "success";
    return false;
  };

  if (state.items.length === 0 && step !== "success") {
    return (
      <>
        <SEO
          title="Оформление заказа - Уютный Ремонт"
          description="Корзина пуста. Добавьте товары для оформления заказа."
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Корзина пуста</h1>
            <p className="text-muted-foreground mb-6">
              Добавьте товары в корзину для оформления заказа
            </p>
            <Button asChild>
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <SEO
          title="Заказ оформлен - Уютный Ремонт"
          description={`Ваш заказ ${orderNumber} успешно оформлен`}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Заказ успешно оформлен!</h1>
              <p className="text-lg text-muted-foreground">
                Номер заказа: <span className="font-semibold text-foreground">{orderNumber}</span>
              </p>
            </div>

            <Card className="text-left mb-6">
              <CardHeader>
                <CardTitle>Товары в заказе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderData?.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.qty} × {item.product.price.toLocaleString()} ₽
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {(item.product.price * item.qty).toLocaleString()} ₽
                      </p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары ({orderData?.itemsCount})</span>
                    <span>{orderData?.totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого к оплате:</span>
                  <span>{orderData?.totalPrice.toLocaleString()} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-left mb-6">
              <CardHeader>
                <CardTitle>Детали заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Способ получения:</span>
                  <span className="font-medium">
                    {deliveryType === "pickup" ? "Самовывоз" : 
                     deliveryType === "delivery" ? "Курьерская доставка" : "Транспортная компания"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Способ оплаты:</span>
                  <span className="font-medium">
                    {paymentMethod === "cash" ? "Наличными" : 
                     paymentMethod === "sberpay" ? "SberPay" : "СБП"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={async () => {
                  if (orderData) {
                    try {
                      await generateOrderPDF({
                        orderNumber,
                        items: orderData.items,
                        totalPrice: orderData.totalPrice,
                        itemsCount: orderData.itemsCount,
                        contactData,
                        deliveryType,
                        deliveryData,
                        paymentMethod
                      });
                      toast({
                        title: "PDF создан",
                        description: "Заказ сохранен в PDF файл"
                      });
                    } catch (error) {
                      toast({
                        title: "Ошибка",
                        description: "Не удалось создать PDF",
                        variant: "destructive"
                      });
                    }
                  }
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Скачать PDF
              </Button>
              <Button asChild variant="outline">
                <Link to="/">На главную</Link>
              </Button>
              <Button asChild>
                <Link to="/catalog">Продолжить покупки</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Оформление заказа - Уютный Ремонт"
        description="Оформите заказ строительных материалов. Выберите способ доставки и оплаты."
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
          <h1 className="text-3xl font-bold">Оформление заказа</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "contact" ? "bg-primary text-primary-foreground" : 
              isStepCompleted("contact") ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              {isStepCompleted("contact") ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="ml-2 text-sm font-medium">Контакты</span>
          </div>
          
          <div className="w-16 h-0.5 bg-muted mx-4"></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "delivery" ? "bg-primary text-primary-foreground" : 
              isStepCompleted("delivery") ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              {isStepCompleted("delivery") ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className="ml-2 text-sm font-medium">Доставка</span>
          </div>
          
          <div className="w-16 h-0.5 bg-muted mx-4"></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "payment" ? "bg-primary text-primary-foreground" : 
              isStepCompleted("payment") ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              {isStepCompleted("payment") ? <Check className="h-4 w-4" /> : "3"}
            </div>
            <span className="ml-2 text-sm font-medium">Оплата</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Contact Step */}
            {step === "contact" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Контактные данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Имя <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Введите ваше имя"
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон <span className="text-destructive">*</span></Label>
                      <Input
                        id="phone"
                        placeholder="+7 (___) ___-__-__"
                        value={contactData.phone}
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Textarea
                      id="comment"
                      placeholder="Дополнительная информация..."
                      value={contactData.comment}
                      onChange={(e) => setContactData({...contactData, comment: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Step */}
            {step === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Способ получения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                    {/* Курьерская доставка */}
                    <div className="border rounded-lg">
                      <div className="flex items-center space-x-2 p-4">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                          <div className="font-medium text-green-600">Курьерская доставка</div>
                          <div className="text-sm text-muted-foreground">
                            Доставим по городу и области
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Бесплатно от 5 000 ₽ · До 5 000 ₽ — 300 ₽
                          </div>
                          <div className="text-sm text-muted-foreground">
                            📅 1-2 дня
                          </div>
                        </Label>
                      </div>
                      
                      {deliveryType === "delivery" && (
                        <div className="p-4 pt-0 space-y-4">
                          <div>
                            <Label htmlFor="address">Адрес доставки <span className="text-destructive">*</span></Label>
                            <Input
                              id="address"
                              placeholder="Улица, дом"
                              value={deliveryData.address}
                              onChange={(e) => setDeliveryData({...deliveryData, address: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="entrance">Подъезд</Label>
                              <Input
                                id="entrance"
                                placeholder="1"
                                value={deliveryData.entrance}
                                onChange={(e) => setDeliveryData({...deliveryData, entrance: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="floor">Этаж</Label>
                              <Input
                                id="floor"
                                placeholder="2"
                                value={deliveryData.floor}
                                onChange={(e) => setDeliveryData({...deliveryData, floor: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="apartment">Квартира</Label>
                              <Input
                                id="apartment"
                                placeholder="15"
                                value={deliveryData.apartment}
                                onChange={(e) => setDeliveryData({...deliveryData, apartment: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date">Дата доставки</Label>
                              <Input
                                id="date"
                                type="date"
                                value={deliveryData.date}
                                onChange={(e) => setDeliveryData({...deliveryData, date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="time">Время</Label>
                              <Input
                                id="time"
                                placeholder="с 10:00 до 18:00"
                                value={deliveryData.time}
                                onChange={(e) => setDeliveryData({...deliveryData, time: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          {/* Дополнительные услуги */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Дополнительные услуги:</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="largeItem"
                                  checked={deliveryServices.largeItem}
                                  onCheckedChange={(checked) => 
                                    setDeliveryServices({...deliveryServices, largeItem: checked as boolean})
                                  }
                                />
                                <Label htmlFor="largeItem" className="text-sm">
                                  Крупногабаритный товар (+500 ₽)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="liftToFloor"
                                  checked={deliveryServices.liftToFloor}
                                  onCheckedChange={(checked) => 
                                    setDeliveryServices({...deliveryServices, liftToFloor: checked as boolean})
                                  }
                                />
                                <Label htmlFor="liftToFloor" className="text-sm">
                                  Подъем на этаж (+200 ₽/этаж)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="eveningDelivery"
                                  checked={deliveryServices.eveningDelivery}
                                  onCheckedChange={(checked) => 
                                    setDeliveryServices({...deliveryServices, eveningDelivery: checked as boolean})
                                  }
                                />
                                <Label htmlFor="eveningDelivery" className="text-sm">
                                  Вечерняя доставка 18:00-22:00 (+300 ₽)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="smsNotification"
                                  checked={deliveryServices.smsNotification}
                                  onCheckedChange={(checked) => 
                                    setDeliveryServices({...deliveryServices, smsNotification: checked as boolean})
                                  }
                                />
                                <Label htmlFor="smsNotification" className="text-sm">
                                  SMS-уведомления (бесплатно)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="furnitureAssembly"
                                  checked={deliveryServices.furnitureAssembly}
                                  onCheckedChange={(checked) => 
                                    setDeliveryServices({...deliveryServices, furnitureAssembly: checked as boolean})
                                  }
                                />
                                <Label htmlFor="furnitureAssembly" className="text-sm">
                                  Сборка мебели (+1000 ₽)
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Самовывоз */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium">Самовывоз</div>
                        <div className="text-sm text-muted-foreground">
                          Заберите товар из нашего магазина
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Всегда бесплатно · Владимир, Опольевская улица, 1, корп. 29
                        </div>
                        <div className="text-sm text-muted-foreground">
                          📅 Сегодня
                        </div>
                      </Label>
                    </div>

                    {/* Транспортная компания */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="transport" id="transport" />
                      <Label htmlFor="transport" className="flex-1 cursor-pointer">
                        <div className="font-medium">Транспортная компания</div>
                        <div className="text-sm text-muted-foreground">
                          Доставка в регионы России
                        </div>
                        <div className="text-sm text-muted-foreground">
                          По тарифу ТК · Расчет при оформлении
                        </div>
                        <div className="text-sm text-muted-foreground">
                          📅 3-7 дней
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Способ оплаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-medium">Наличными</div>
                        <div className="text-sm text-muted-foreground">
                          • При получении товара
                        </div>
                        <div className="text-sm text-muted-foreground">
                          • Курьеру или в магазине
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="sberpay" id="sberpay" />
                      <Label htmlFor="sberpay" className="flex-1 cursor-pointer">
                        <div className="font-medium">SberPay</div>
                        <div className="text-sm text-muted-foreground">
                          • Оплата на сайте
                        </div>
                        <div className="text-sm text-muted-foreground">
                          • SberPay, СБП (Система быстрых платежей)
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="sbp" id="sbp" />
                      <Label htmlFor="sbp" className="flex-1 cursor-pointer">
                        <div className="font-medium">СБП</div>
                        <div className="text-sm text-muted-foreground">
                          • Система быстрых платежей
                        </div>
                        <div className="text-sm text-muted-foreground">
                          • Мгновенный перевод по номеру телефона
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between">
              {step !== "contact" && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Назад
                </Button>
              )}
              <Button 
                onClick={handleNextStep}
                className={step === "contact" ? "ml-auto" : ""}
                disabled={createOrderMutation.isLoading}
              >
                {createOrderMutation.isLoading ? "Обработка..." :
                 step === "payment" ? "Оформить заказ" : "Далее"}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.qty} × {item.product.price.toLocaleString()} ₽
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {(item.product.price * item.qty).toLocaleString()} ₽
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары ({itemsCount})</span>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span className="text-green-600">Бесплатно</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}