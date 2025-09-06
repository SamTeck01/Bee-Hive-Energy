/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider =({ children })=> {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      // migrate legacy format where values were numbers: { id: qty }
      if (typeof parsed === 'object' && parsed !== null) {
        const migrated = Object.entries(parsed).reduce((acc, [k, v]) => {
          if (typeof v === 'number') {
            acc[k] = { qty: v, type: null };
          } else if (v && typeof v === 'object' && ('qty' in v || 'quantity' in v)) {
            // support { qty } or { quantity }
            acc[k] = { qty: v.qty ?? v.quantity ?? 0, type: v.type ?? null };
          } else {
            acc[k] = v;
          }
          return acc;
        }, {});
        return migrated;
      }
      return {};
    } catch {
      return {};
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item by ID (increments quantity). Accepts a string id.
  // addToCart accepts (itemId, type?) -> increments qty and stores type
  const addToCart = (itemId, type = null) => {
    const key = String(itemId);
    setCartItems(prev => {
      const existing = prev[key] || { qty: 0, type: null };
      return {
        ...prev,
        [key]: { qty: (existing.qty || 0) + 1, type: type ?? existing.type ?? null }
      };
    });
  };

  // Remove one unit; if quantity reaches 0, remove the key entirely
  const removeFromCart = (itemId) => {
    const key = String(itemId);
    setCartItems(prev => {
      const existing = prev[key] || { qty: 0 };
      const newQty = (existing.qty || 0) - 1;
      const updated = { ...prev };
      if (newQty > 0) {
        updated[key] = { ...existing, qty: newQty };
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
        const existing = prev[key] || { qty: 0, type: null };
        updated[key] = { ...existing, qty: quantity };
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
    return Object.values(cartItems).reduce((sum, v) => {
      const qty = (v && typeof v === 'object') ? (v.qty || 0) : (Number(v) || 0);
      return sum + qty;
    }, 0);
  };

  // Get quantity of a specific item
  const getItemQuantity = (itemId) => {
    const val = cartItems[String(itemId)];
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return val.qty || 0;
  };

  // Check if item is in cart
  const isInCart = (itemId) => {
    return getItemQuantity(itemId) > 0;
  };

  const getItemType = (itemId) => {
    const val = cartItems[String(itemId)];
    if (!val) return null;
    return (typeof val === 'object') ? (val.type ?? null) : null;
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
  getItemType,
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