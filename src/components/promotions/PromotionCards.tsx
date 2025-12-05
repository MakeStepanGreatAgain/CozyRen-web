import { Card } from "@/components/ui/card";
import { Percent, Gift, Clock } from "lucide-react";

export default function PromotionCards() {
  const promotions = [
    {
      id: 3,
      title: "Распродажа",
      description: "Остатки коллекций до 50%",
      icon: Clock,
      bgColor: "bg-green-50 dark:bg-green-950/20",
      iconColor: "text-white bg-green-500",
      borderColor: "border-green-200 dark:border-green-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {promotions.map((promo) => {
        const IconComponent = promo.icon;
        return (
          <Card
            key={promo.id}
            className={`p-6 ${promo.bgColor} ${promo.borderColor} transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${promo.iconColor}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{promo.title}</h3>
                <p className="text-muted-foreground text-sm">{promo.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}