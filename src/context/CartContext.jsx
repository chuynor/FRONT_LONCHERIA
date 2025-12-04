// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tipoPedido, setTipoPedido] = useState(
    localStorage.getItem("tipoPedido") || ""
  );

  // Cargar carrito de localStorage al iniciar
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (_id) => {
    setCart((prev) =>
      prev.map((p) => (_id === p._id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const decreaseQty = (_id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          _id === p._id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (_id) => {
    setCart((prev) => prev.filter((p) => p._id !== _id));
  };

  // 🟢 LIMPIAR CARRITO
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart, // ← IMPORTANTE
        total,
        tipoPedido,
        setTipoPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
