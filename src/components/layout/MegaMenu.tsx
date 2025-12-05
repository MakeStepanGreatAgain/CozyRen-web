import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { icons as lucideIcons } from "lucide-react";
import { categories } from "@/data/categories";
import { subcategories } from "@/data/subcategories";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  const [active, setActive] = useState<Category>(categories[0]?.key);
  const navigate = useNavigate();
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open && categories[0]) setActive(categories[0].key);
  }, [open]);

  if (!open) return null;

  const brands = subcategories[active] ?? [];

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeTimer.current = window.setTimeout(() => {
      onClose();
    }, 120);
  };

  return (
    <div
      role="menu"
      aria-label="Категории каталога"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="hidden md:block fixed inset-x-0 top-16 z-50 bg-background border-b shadow-sm"
    >
      <div className="grid grid-cols-12">
        {/* Left: categories */}
        <aside className="col-span-3 border-r">
          <ul className="divide-y">
            {categories.map((cat) => {
              const Icon = (lucideIcons as any)[cat.icon];
              const isActive = active === cat.key;
              return (
                <li key={cat.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(cat.key)}
                    onFocus={() => setActive(cat.key)}
                    className={cn(
                      "w-full text-left px-6 py-4 flex items-center gap-3 transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                    <span className="text-sm font-medium">{cat.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right: subcategories / brands */}
        <section className="col-span-9">
          <div className="px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Популярные бренды</h3>
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => navigate(`/products?category=${encodeURIComponent(active)}`)}
              >
                Все товары в «{active}»
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <NavLink
                    key={brand}
                    to={`/products?category=${encodeURIComponent(active)}&brand=${encodeURIComponent(brand)}`}
                    className="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span>{brand}</span>
                    {/* Simple chevron using SVG to avoid extra deps */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
                  </NavLink>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Скоро добавим бренды для раздела «{active}»</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
