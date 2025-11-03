import React from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, addToCart, removeFromCart } = useCart();

  // Calcular total
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Tu Carrito</h2>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío 😔</p>
        ) : (
          cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>${item.price}</p>
              </div>

              <div className="cart-item-controls">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{item.qty || 1}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Total: ${total}</h3>
          <button className="checkout-btn">Proceder al Pago</button>
        </div>
      )}
    </div>
  );
}
