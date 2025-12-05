import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import { PhoneCall, ExternalLink } from "lucide-react";
import Map from "@/components/Map";

export default function Contacts() {
  const phoneNumber = "+7 (910) 774-52-30";

  return (
    <>
      <SEO 
        title="Контакты магазина товаров для ремонта — Уютный ремонт"
        description="Контакты магазина Уютный ремонт: адрес, телефон +7 (910) 774-52-30, email, график работы. Владимир, Опольевская ул., 1, корп. 29."
        keywords={["контакты", "телефон", "адрес", "график работы", "Владимир", "магазин ремонта"]}
        canonical="https://уютный-ремонт.рф/contacts"
      />
      <section className="container mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Контакты</h1>
          <ul className="space-y-2 text-foreground/80">
            <li>Телефон: {phoneNumber}</li>
            <li>E-mail: cozyrenovations@yandex.ru</li>
            <li>Адрес: Опольевская ул., 1, корп. 29, г. Владимир</li>
            <li>Время работы: Каждый день с 9:00 до 18:00</li>
          </ul>

          <div className="mt-6 space-y-3 text-sm">
            <div className="font-medium">Услуги и удобства</div>
            <ul className="list-disc pl-5 text-foreground/80 space-y-1">
              <li>Бесплатная доставка</li>
              <li>Оплата картой</li>
              <li>Есть парковка</li>
              <li>Есть Wi‑Fi</li>
              <li>Есть Самовывоз</li>
              <li>Шоу‑рум</li>
              <li>Доставка</li>
              <li>Посещение с животными: разрешено с собаками до 35 см</li>
            </ul>
            <div className="font-medium mt-4">Способы оплаты</div>
            <div className="text-foreground/80">дисконтная система скидок, предоплата, постоплата, наличными, оплата картой, банковским переводом, оплата кредитной картой</div>
          </div>
        </div>
        <div className="space-y-4">
          <Map 
            className="w-full h-[320px]"
            center={[56.168070, 40.383611]}
            zoom={16}
            markers={[{
              lng: 40.383611,
              lat: 56.168070,
              title: "Уютный ремонт",
              description: "Опольевская ул., 1, корп. 29"
            }]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`tel:${phoneNumber}`} className="block">
              <Button size="lg" className="w-full flex items-center justify-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Позвонить в магазин
              </Button>
            </a>
            <a 
              href="https://yandex.ru/maps/192/vladimir/?ll=40.411452%2C56.150782&mode=poi&poi%5Bpoint%5D=40.383611%2C56.168070&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D160417136607&z=13.42"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" variant="outline" className="w-full flex items-center justify-center gap-2 text-sm px-2">
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">На Яндекс Картах</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
