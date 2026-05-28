"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "@/helper/api.helper";
import { CartItem, CartResponse, CartSummary, CheckoutApiResponse } from "@/types";
import {toast} from "sonner";

type CheckoutInfo = {
  order_type: "DINEIN" | "TAKEAWAY";
  table_id?: number;
  notes?: string;
};

type CartContextType = {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;

  refreshCart: () => Promise<void>;

  addToCart: (payload: {
    product_id: number;
    quantity: number;
    variants?: {
      variant_group_id: number;
      variant_option_id: number;
    }[];
  }) => Promise<void>;

  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  increaseQty: (itemId: number) => Promise<void>;
  decreaseQty: (itemId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;

  checkout: (payment_method: "CASH" | "KHQR") => Promise<CheckoutApiResponse>;

  getTotalPrice: () => number;
  getTotalItems: () => number;

  checkoutInfo: CheckoutInfo | null;
  setCheckoutInfo: (data: CheckoutInfo | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
                               children,
                             }: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);

  const refreshCart = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<CartResponse>("get", "/cart");

      setItems(res.cart.items);
      setSummary(res.summary);
    } catch (err) {
      console.error("refreshCart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (payload: {
    product_id: number;
    quantity: number;
    variants?: {
      variant_group_id: number;
      variant_option_id: number;
    }[];
  }) => {
    const loadingToast = toast.loading("Adding to cart...", {
      position: "top-right",
    });
    try {
      await apiRequest("post", "/cart/addToCart", {
        product_id: Number(payload.product_id),
        quantity: Number(payload.quantity),
        variants: payload.variants ?? [],
      });

      await refreshCart();
      toast.success("Added to cart ", {
        id: loadingToast,
        position: "top-right",
      });
    } catch (err) {
      console.error("addToCart failed:", err);
      toast.error("Failed to add item to cart", {
        id: loadingToast,
        position: "top-right",
      });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await apiRequest("patch", `/cart/items/${itemId}`, {
        quantity,
      });

      await refreshCart();
    } catch (err) {
      console.error("updateQuantity failed:", err);
    }
  };

  const increaseQty = async (itemId: number) => {
    try {
      await apiRequest("patch", `/cart/items/${itemId}/increase`);
      await refreshCart();
    } catch (err) {
      console.error("increaseQty failed:", err);
    }
  };

  const decreaseQty = async (itemId: number) => {
    try {
      await apiRequest("patch", `/cart/items/${itemId}/decrease`);
      await refreshCart();
    } catch (err) {
      console.error("decreaseQty failed:", err);
    }
  };

  const removeItem = async (itemId: number) => {
    const loadingToast = toast.loading("Removing item...", { position: "top-right" });

    try {
      await apiRequest("delete", `/cart/items/${itemId}`);
      await refreshCart();

      toast.success("Item removed from cart", {
        id: loadingToast,
        position: "top-right",
      });
    } catch (err) {
      console.error("removeItem failed:", err);

      toast.error("Failed to remove item", {
        id: loadingToast,
        position: "top-right",
      });
    }
  };

  const clearCart = async () => {
    const loadingToast = toast.loading("Clearing cart..." , { position: "top-right" });

    try {
      await apiRequest("delete", "/cart/clear");
      await refreshCart();

      toast.success("Cart cleared successfully", {
        id: loadingToast,
        position: "top-right",
      });
    } catch (err) {
      console.error("clearCart failed:", err);

      toast.error("Failed to clear cart", {
        id: loadingToast,
        position: "top-right",
      });
    }
  };

  const checkout = async (
      payment_method: "CASH" | "KHQR"
  ): Promise<CheckoutApiResponse> => {
    const loadingToast = toast.loading("Processing checkout...", { position: "top-right" }) ;

    try {
      if (!checkoutInfo) {
        throw new Error("Missing checkout info (order_type, table_id, notes)");
      }

      const payload = {
        ...checkoutInfo,
        payment_method,
      };

      const res = await apiRequest<CheckoutApiResponse>(
          "post",
          "/cart/checkout",
          payload
      );

      await refreshCart();
      setCheckoutInfo(null);

      toast.success("Order placed successfully ", {
        id: loadingToast,
        position: "top-right",
      });

      return res;
    } catch (err) {
      console.error("checkout failed:", err);

      toast.error("Checkout failed. Please try again.", {
        id: loadingToast,
        position: "top-right",
      });

      throw err;
    }
  };

  const getTotalPrice = () => {
    return summary?.grand_total ?? 0;
  };

  const getTotalItems = () => {
    return summary?.quantity_total ?? 0;
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
      <CartContext.Provider
          value={{
            items,
            summary,
            loading,

            refreshCart,

            addToCart,
            updateQuantity,
            increaseQty,
            decreaseQty,

            removeItem,
            clearCart,

            checkout,

            getTotalPrice,
            getTotalItems,

            setCheckoutInfo,
            checkoutInfo,
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