import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import MegaMenu from "@/components/layout/MegaMenu";

export default function Header() {
  
  const [query, setQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useCart();
  const goSearch = () => {
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const count = state.items.reduce((s, i) => s + i.qty, 0);

  const [cartBlink, setCartBlink] = useState(false);
  const prevCountRef = useRef(count);
  useEffect(() => {
    if (count > prevCountRef.current) {
      setCartBlink(true);
      const t = window.setTimeout(() => setCartBlink(false), 1200);
      return () => window.clearTimeout(t);
    }
    prevCountRef.current = count;
  }, [count]);

  const NavLinks = () => (
    <nav className="flex items-center gap-6">
      <NavLink to="/catalog" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"}>Каталог</NavLink>
      <NavLink to="/promotions" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"}>Акции</NavLink>
      <NavLink to="/contacts" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"}>Контакты</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"}>Доставка и оплата</NavLink>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center group relative overflow-hidden rounded-xl px-3 py-2 transition-all duration-300 hover:bg-primary/5 hover:shadow-lg">
            <div className="relative">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Уютный ремонт
              </span>
              <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Input
              placeholder="Поиск товаров"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goSearch()}
              className="pr-10"
            />
            <button onClick={goSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Поиск">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant={cartBlink ? "default" : "secondary"} onClick={() => navigate('/cart')} className={`relative flex items-center gap-2 px-4 ${cartBlink ? "animate-scale-in" : ""}`} aria-label="Корзина">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Корзина</span>
            {count > 0 && (
              <Badge className="absolute -right-2 -top-2 px-2 py-0 text-xs">{count}</Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="container md:hidden py-3">
        <div className="relative">
          <Input
            placeholder="Поиск товаров"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goSearch()}
            className="pr-12 h-11 text-base"
          />
          <button onClick={goSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1 touch-manipulation" aria-label="Поиск">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      
    </header>
  );
}
