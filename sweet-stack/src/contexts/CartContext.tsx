import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Sweet } from '@/data/mockData';

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncWithSweets: (sweets: Sweet[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sweetshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('sweetshop_cart', JSON.stringify(items));
  };

  const syncWithSweets = (sweets: Sweet[]) => {
    if (sweets.length > 0 && cartItems.length > 0) {
      setCartItems(prev => {
        const updated = prev.map(item => {
          const updatedSweet = sweets.find(s => s.id === item.sweet.id);
          if (updatedSweet) {
            // If quantity in cart exceeds available stock, adjust it
            if (item.quantity > updatedSweet.quantity) {
              return { ...item, sweet: updatedSweet, quantity: updatedSweet.quantity };
            }
            return { ...item, sweet: updatedSweet };
          }
          return item;
        }).filter(item => {
          // Remove items that no longer exist
          return sweets.some(s => s.id === item.sweet.id);
        });
        
        if (JSON.stringify(updated) !== JSON.stringify(prev)) {
          saveCart(updated);
          return updated;
        }
        return prev;
      });
    }
  };

  const addToCart = (sweet: Sweet, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.sweet.id === sweet.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > sweet.quantity) {
          return prev; // Don't add if exceeds stock
        }
        const updated = prev.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: newQuantity, sweet }
            : item
        );
        saveCart(updated);
        return updated;
      } else {
        if (quantity > sweet.quantity) {
          return prev; // Don't add if exceeds stock
        }
        const updated = [...prev, { sweet, quantity }];
        saveCart(updated);
        return updated;
      }
    });
  };

  const removeFromCart = (sweetId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.sweet.id !== sweetId);
      saveCart(updated);
      return updated;
    });
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }

    setCartItems(prev => {
      const item = prev.find(i => i.sweet.id === sweetId);
      if (item && quantity > item.sweet.quantity) {
        return prev; // Don't update if exceeds stock
      }
      
      const updated = prev.map(item =>
        item.sweet.id === sweetId
          ? { ...item, quantity }
          : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.sweet.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      syncWithSweets,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
