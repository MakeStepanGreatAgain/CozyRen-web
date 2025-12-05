import Header from "./Header";
import Footer from "./Footer";
import SubHeader from "./SubHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    window.scrollTo(0, 0);
    const t = setTimeout(() => setRouteLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top progress bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full">
        <div className={`h-full bg-primary transition-[width] duration-500 ${routeLoading ? "w-full" : "w-0"}`} />
      </div>
      <Header />
      <SubHeader />
      <main className="flex-1">
        <div 
          key={pathname} 
          className="motion-safe:animate-fade-in motion-reduce:opacity-100"
        >
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
