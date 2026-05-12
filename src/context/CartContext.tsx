"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId: number;

  name: string;
  image: string;
  price: number;

  quantity: number;

  options: {
    ice: "less" | "normal";
    sugar: "0" | "25" | "50" | "75" | "100";
    size: "S" | "M" | "L";
  };
};

type CartContextType = {
  items: CartItem[];

  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;

  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;

  clearCart: () => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart_items";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "id" | "quantity">) => {
    const id =
      item.productId +
      "-" +
      item.options.size +
      "-" +
      item.options.ice +
      "-" +
      item.options.sugar;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);

      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prev, { ...item, id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const increaseQty = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decreaseQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };
  const clearCart = () => setItems([]);

  const getTotalPrice = () => {
    return items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
