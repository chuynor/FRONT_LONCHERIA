// src/components/Cart.jsx
import React from "react";
import "./Cart.css";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();

  return (
    <div className="cart-container">
      <h2 className="cart-title">Tu Carrito</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">Tu carrito está vacío 🛒</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.imagen} alt={item.nombre} className="cart-img" />

              <div className="cart-info">
                <h3>{item.nombre}</h3>
                <p>${item.precio}</p>

                <div className="cart-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.id)}
                  >
                    -
                  </button>

                  <span className="cart-qty">{item.quantity}</span>

                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h3>Total: ${total}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
