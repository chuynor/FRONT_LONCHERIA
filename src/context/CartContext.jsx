import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Agregar al carrito
  const addToCart = (item) => {
    // Aquí podemos manejar cantidades si quieres más avanzado
    setCart((prev) => [...prev, item]);
  };

  // Eliminar del carrito
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el carrito
export const useCart = () => useContext(CartContext);
