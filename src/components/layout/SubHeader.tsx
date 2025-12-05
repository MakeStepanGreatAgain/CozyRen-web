import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Library, Tag, MapPin, Truck, Navigation } from "lucide-react";

export default function SubHeader() {
  const navItems = [
    { to: "/catalog", label: "Каталог", icon: Library },
    { to: "/promotions", label: "Акции", icon: Tag },
    { to: "/contacts", label: "Контакты", icon: MapPin },
    { to: "/about", label: "Доставка и оплата", icon: Truck },
    { href: "https://yandex.ru/maps/org/uyutny_remont/160417136607/?ll=40.383611,56.168070&z=17.03", label: "Как добраться", icon: Navigation, external: true },
  ];

  return (
    <div className="border-b bg-muted/30">
      <div className="container">
        <nav className="py-2">
          <div className="grid grid-cols-2 md:flex md:items-center md:justify-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              
              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm px-2 py-3"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </a>
                );
              }

              return (
                <NavLink key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm px-2 py-3"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}