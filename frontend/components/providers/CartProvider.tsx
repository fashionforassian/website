"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

type AddItemInput = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (input: AddItemInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "fashion-asia-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

function buildLineId(input: AddItemInput): string {
  return `${input.productId}-${input.size ?? "default"}-${input.color ?? "default"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      cartCount,
      subtotal,
      addToCart: (input) => {
        const quantity = Math.max(1, input.quantity ?? 1);
        const lineId = buildLineId(input);

        setItems((current) => {
          const existing = current.find((item) => item.lineId === lineId);

          if (existing) {
            return current.map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }

          return [
            ...current,
            {
              lineId,
              productId: input.productId,
              slug: input.slug,
              name: input.name,
              image: input.image,
              price: input.price,
              size: input.size,
              color: input.color,
              quantity,
            },
          ];
        });
      },
      updateQuantity: (lineId, quantity) => {
        const normalized = Math.max(1, quantity);
        setItems((current) =>
          current.map((item) =>
            item.lineId === lineId ? { ...item, quantity: normalized } : item,
          ),
        );
      },
      removeFromCart: (lineId) => {
        setItems((current) => current.filter((item) => item.lineId !== lineId));
      },
      clearCart: () => {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export type { CartItem };
