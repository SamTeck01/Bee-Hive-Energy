/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider =({ children })=> {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : {};
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  // Add item by ID (increments quantity). Accepts a string id.
  const addToCart = (itemId) => {
    const key = String(itemId);
    setCartItems(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  // Remove one unit; if quantity reaches 0, remove the key entirely
  const removeFromCart = (itemId) => {
    const key = String(itemId);
    setCartItems(prev => {
      const current = prev[key] || 0;
      const newQty = current - 1;
      const updated = { ...prev };
      if (newQty > 0) {
        updated[key] = newQty;
      } else {
        delete updated[key];
      }
      return updated;
    });
  };

  // Delete item completely
  const deleteCartItem = (itemId) => {
    const key = String(itemId);
    setCartItems(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Explicitly set quantity for an item (useful for inputs)
  const updateItemQuantity = (itemId, quantity) => {
    const key = String(itemId);
    setCartItems(prev => {
      const updated = { ...prev };
      if (!quantity || quantity <= 0) {
        delete updated[key];
      } else {
        updated[key] = quantity;
      }
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  };

  // Total quantity
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Get quantity of a specific item
  const getItemQuantity = (itemId) => {
    return cartItems[itemId] || 0;
  };

  // Check if item is in cart
  const isInCart = (itemId) => {
    return cartItems[itemId] > 0;
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
  updateItemQuantity,
    deleteCartItem,
    clearCart,
    getTotalCartItems,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook for consuming the cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};