import SEO from "@/components/common/SEO";
import ConsultationBanner from "@/components/common/ConsultationBanner";
import { Card } from "@/components/ui/card";
import { Truck, MapPin, Package, Banknote, CreditCard, ShieldCheck, Clock, Phone, Mail, MapPinned } from "lucide-react";

export default function About() {
  return (
    <>
      <SEO
        title="Доставка и оплата товаров для ремонта — Уютный ремонт"
        description="Удобные способы доставки и оплаты товаров для ремонта: курьерская доставка, самовывоз, транспортная компания. Наличные, банковские карты и онлайн-оплата."
        keywords={["доставка", "оплата", "курьер", "самовывоз", "транспортная компания", "способы оплаты"]}
        canonical="https://уютный-ремонт.рф/delivery"
      />
      

      {/* Hero */}
      <section aria-labelledby="page-title" className="w-full bg-gradient-to-r from-primary to-primary/80">
        <div className="container py-12 md:py-20 text-primary-foreground">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/10">
              <Truck className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 id="page-title" className="text-3xl md:text-5xl font-bold">Доставка и оплата</h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-primary-foreground/90">Удобные способы доставки и оплаты для вашего комфорта</p>
          </div>
        </div>
      </section>

      <main>
        {/* Способы доставки */}
        <section aria-labelledby="delivery" className="container mt-10 md:mt-14">
          <h2 id="delivery" className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Способы доставки</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 text-primary p-3">
                  <Truck aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Курьерская доставка</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Доставим по городу и области по договоренности с менеджером</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary/10 text-secondary-foreground p-3">
                  <MapPin aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Самовывоз</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Заберите товар из нашего магазина</p>
                  <div className="mt-4 inline-flex items-center rounded-md bg-secondary/10 px-3 py-1 text-sm text-secondary-foreground">
                    Всегда бесплатно · Владимир, Опольевская улица, 1, корп. 29
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> Сегодня
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-muted p-3 text-foreground">
                  <Package aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Транспортная компания</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Отправка в регионы России</p>
                  <div className="mt-4 inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm text-foreground/80">
                    По тарифу ТК · Расчет при оформлении
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> 3–7 дней
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Способы оплаты */}
        <section aria-labelledby="payment" className="container mt-12 md:mt-16">
          <h2 id="payment" className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Способы оплаты</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 text-primary p-3">
                  <Banknote aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Наличными</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>При получении товара</li>
                    <li>Курьеру или в магазине</li>
                    <li>Без дополнительных комиссий</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary/10 text-secondary-foreground p-3">
                  <CreditCard aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Банковской картой</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>При получении товара</li>
                    <li>Visa, MasterCard, МИР</li>
                    <li>Безналичный расчет</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-muted p-3 text-foreground">
                  <ShieldCheck aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Онлайн оплата</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Оплата на сайте</li>
                    <li>SberPay, СБП (Система быстрых платежей)</li>
                    <li>Мгновенное зачисление</li>
                    <li>Защищенные платежи</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* График доставки */}
        <section aria-labelledby="schedule" className="container mt-12 md:mt-16">
          <Card className="p-6 md:p-8">
            <h2 id="schedule" className="text-xl md:text-2xl font-semibold text-center">График доставки</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 font-medium"><Truck className="h-4 w-4" /> Курьерская доставка</div>
                <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <dt>Ежедневно:</dt><dd>9:00 – 18:00</dd>
                </dl>
              </div>
              <div>
                <div className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4" /> Самовывоз из магазина</div>
                <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <dt>Ежедневно:</dt><dd>9:00 – 18:00</dd>
                </dl>
              </div>
            </div>
          </Card>
        </section>

        {/* Вопросы */}
        <section aria-labelledby="help" className="container mt-12 md:mt-16 mb-16">
          <Card className="p-6 md:p-10 bg-primary/5 border-primary/20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 id="help" className="text-xl md:text-2xl font-semibold">Остались вопросы о доставке?</h2>
              <p className="mt-2 text-muted-foreground">Наши менеджеры помогут выбрать оптимальный способ доставки</p>
              <div className="mt-4 flex flex-col items-center gap-2 text-sm md:text-base">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +7 (910) 774-52-30</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> cozyrenovations@yandex.ru</div>
                <div className="flex items-center gap-2"><MapPinned className="h-4 w-4" /> Владимир, Опольевская улица, 1, корп. 29</div>
              </div>
            </div>
          </Card>
        </section>
      </main>
      
      <ConsultationBanner />
    </>
  );
}
