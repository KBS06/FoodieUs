import React, { createContext, useContext, useEffect, useState } from 'react';

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => useContext(CartContext);

// Cart Provider
export const CartProvider = ({ children }) => {
  // ✅ Ensure array initialization
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartItems'));
      return Array.isArray(storedCart) ? storedCart : [];
    } catch (err) {
      console.error('Failed to parse cart from localStorage:', err);
      return [];
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item._id === item._id);
      if (existing) {
        return prev.map(ci =>
          ci.item._id === item._id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        return [...prev, { _id: item._id, item, quantity }];
      }
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(ci => ci.item._id !== itemId));
  };

  // ✅ Update quantity
  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(ci =>
        ci.item._id === itemId ? { ...ci, quantity: newQty } : ci
      )
    );
  };

  // ✅ Get total items and total price
  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((sum, ci) => sum + (ci.quantity || 0), 0)
    : 0;

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, ci) => sum + (ci.quantity * (ci.item.price || 0)), 0)
    : 0;

  const clearCart = () => {
    setCartItems([]);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
