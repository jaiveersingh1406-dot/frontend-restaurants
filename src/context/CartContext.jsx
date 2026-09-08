import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS, parsePrice } from "../config/constants";

const CartContext = createContext(null);

function loadCart() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.CART);
    const parsed = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.name &&
        item.key !== undefined &&
        item.key !== null
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    const price = parsePrice(product.price);
    const key = product.id ?? product.name;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);

      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...prev,
        { key, id: product.id ?? null, name: product.name, price, qty: 1 },
      ];
    });
  };

  const updateQty = (key, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((item) => item.key !== key)
        : prev.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = items.reduce((sum, item) => sum + item.qty, 0);

    return { items, total, count, addItem, updateQty, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
