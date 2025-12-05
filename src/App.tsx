import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import Products from "./pages/Products";
import Promotions from "./pages/Promotions";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Delivery from "./pages/Delivery";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import AdminPanel from "./pages/AdminPanel";
import { CartProvider } from "@/components/cart/CartContext";

const App = () => (
  <HelmetProvider>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/rootable/admin-panel" element={<AdminPanel />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </HelmetProvider>
);

export default App;
