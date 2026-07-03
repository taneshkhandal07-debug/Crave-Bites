"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  restaurantId: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, restaurantInfo: { id: string; name: string }) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cravebite_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setRestaurantId(parsed.restaurantId || null);
        setRestaurantName(parsed.restaurantName || null);
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newItems: CartItem[], newRestId: string | null, newRestName: string | null) => {
    setItems(newItems);
    setRestaurantId(newRestId);
    setRestaurantName(newRestName);
    localStorage.setItem(
      "cravebite_cart",
      JSON.stringify({ items: newItems, restaurantId: newRestId, restaurantName: newRestName })
    );
  };

  const addToCart = (item: Omit<CartItem, "quantity">, restaurantInfo: { id: string; name: string }) => {
    // If adding from a different restaurant, return false to trigger user confirmation
    if (restaurantId && restaurantId !== restaurantInfo.id && items.length > 0) {
      return false;
    }

    const existingItemIndex = items.findIndex((i) => i.id === item.id);
    let newItems = [...items];

    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += 1;
    } else {
      newItems.push({ ...item, quantity: 1, restaurantId: restaurantInfo.id });
    }

    saveCart(newItems, restaurantInfo.id, restaurantInfo.name);
    return true;
  };

  const removeFromCart = (itemId: string) => {
    const newItems = items.filter((i) => i.id !== itemId);
    const newRestId = newItems.length === 0 ? null : restaurantId;
    const newRestName = newItems.length === 0 ? null : restaurantName;
    saveCart(newItems, newRestId, newRestName);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newItems = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    saveCart(newItems, restaurantId, restaurantName);
  };

  const clearCart = () => {
    saveCart([], null, null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
