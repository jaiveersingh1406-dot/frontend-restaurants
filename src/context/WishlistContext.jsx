import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "../config/constants";

const WishlistContext = createContext(null);

function loadWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const isWishlisted = (id) =>
    items.some((item) => String(item.id) === String(id));

  const toggleWishlist = (product) => {
    setItems((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));

      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating ?? 0,
          description: product.description ?? "",
        },
      ];
    });
  };

  const removeItem = (id) =>
    setItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );

  const value = useMemo(
    () => ({ items, count: items.length, isWishlisted, toggleWishlist, removeItem }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}