"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/order";

const CART_KEY = "roast-biryani-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(CART_KEY);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setItems(readCart());
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function setQuantity(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((current) => {
      const nextQuantity = Math.max(0, Math.min(20, quantity));
      const withoutItem = current.filter(
        (cartItem) => cartItem.menuItemId !== item.menuItemId
      );

      if (nextQuantity === 0) {
        return withoutItem;
      }

      return [...withoutItem, { ...item, quantity: nextQuantity }];
    });
  }

  function clearCart() {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_KEY);
    }
  }

  return {
    items,
    ready,
    totalQuantity,
    totalPrice,
    setQuantity,
    clearCart
  };
}
