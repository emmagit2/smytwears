import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

const FREE_DELIVERY_THRESHOLD = 50000;

const getDeliveryFee = (state = '', subtotal = 0) => {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  const s = state.toLowerCase().trim();
  if (s === 'lagos')           return 2500;
  if (s === 'fct' || s === 'abuja') return 3000;
  return 3500;
};

export function CartProvider({ children }) {
  const [items,        setItems]        = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const addToCart = useCallback((product, size, color, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, size, color, quantity, cartId: Date.now() }];
    });
    showToast(`${product.name} added to cart ✓`);
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, quantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal  = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      itemCount, subtotal, toastMessage,
      getDeliveryFee: (state) => getDeliveryFee(state, subtotal),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);