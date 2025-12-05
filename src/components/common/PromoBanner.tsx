import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Phone, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromoBanner() {
  const phoneNumber = "+7 (910) 774-52-30";

  return (
    <section aria-label="Доставка и консультация" className="container mt-12">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Доставка и оплата */}
        <Link to="/about" className="block group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg">
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/20 border-primary/20 transition-colors group-hover:from-primary/15 group-hover:to-secondary/25 h-full">
            <div className="flex items-center gap-4">
              <div className="shrink-0 rounded-full bg-primary text-primary-foreground p-3">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-semibold">Доставка и оплата</div>
                <p className="text-muted-foreground text-sm">Быстрая доставка по городу и области, удобные способы оплаты.</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Консультация */}
        <Link to="/contacts" className="block group focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded-lg">
          <Card className="p-6 bg-gradient-to-r from-secondary/10 to-primary/20 border-secondary/20 transition-colors group-hover:from-secondary/15 group-hover:to-primary/25 h-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded-full bg-secondary text-secondary-foreground p-3">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Получить консультацию</div>
                  <p className="text-muted-foreground text-sm">
                    Нужна помощь в выборе? <strong>{phoneNumber}</strong>
                  </p>
                </div>
              </div>
              <PhoneCall className="h-5 w-5 text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
}
