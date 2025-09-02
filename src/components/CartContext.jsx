/* eslint-disable react/prop-types */
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

  // Add item by ID
  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  // Remove one unit
  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newQty = (prev[itemId] || 0) - 1;
      return {
        ...prev,
        [itemId]: newQty > 0 ? newQty : 0
      };
    });
  };

  // Delete item completely
  const deleteCartItem = (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev };
      delete updated[itemId];
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


// import { createContext, useContext, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart items from localStorage on mount
//   useEffect(() => {
//     const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItems(storedCartItems);
//   }, []);

//   // Save cart items to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item) => {
//     console.log('Adding to cart:', item);
//     const itemId = item.slug || item.id;
//     const price = item.new_price || item.price || 0;
    
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find(
//         (cartItem) => (cartItem.slug || cartItem.id) === itemId
//       );

//       if (existingItem) {
//         return prevItems.map((cartItem) =>
//           (cartItem.slug || cartItem.id) === itemId
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         );
//       } else {
//         return [...prevItems, { ...item, price, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prevItems) =>
//       prevItems.filter((item) => (item.slug || item.id) !== itemId)
//     );
//   };

//   const updateQuantity = (itemId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(itemId);
//       return;
//     }

//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         (item.slug || item.id) === itemId
//           ? { ...item, quantity }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + ((item.new_price || item.price || 0) * item.quantity), 0);
//   };

//   const getCartItemsCount = () => {
//     return cartItems.reduce((count, item) => count + item.quantity, 0);
//   };

//   const getCartItemsByType = (type) => {
//     return cartItems.filter(item => item.type === type);
//   };

//   const getCartTotalByType = (type) => {
//     return cartItems
//       .filter(item => item.type === type)
//       .reduce((total, item) => total + ((item.new_price || item.price || 0) * item.quantity), 0);
//   };

//   const isInCart = (itemId) => {
//     return cartItems.some(item => (item.slug || item.id) === itemId);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotal,
//         getCartItemsCount,
//         getCartItemsByType,
//         getCartTotalByType,
//         isInCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// CartProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
