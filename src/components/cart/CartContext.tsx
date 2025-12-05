import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "INC"; productId: string }
  | { type: "DEC"; productId: string }
  | { type: "CLEAR" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, qty: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.product.id !== action.productId) };
    case "INC":
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DEC":
      return {
        items: state.items
          .map((i) => (i.product.id === action.productId ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  add: (p: Product) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartState) : { items: [] };
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      add: (p: Product) => dispatch({ type: "ADD", product: p }),
      remove: (id: string) => dispatch({ type: "REMOVE", productId: id }),
      inc: (id: string) => dispatch({ type: "INC", productId: id }),
      dec: (id: string) => dispatch({ type: "DEC", productId: id }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
