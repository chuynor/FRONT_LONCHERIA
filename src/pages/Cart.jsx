// src/pages/Cart.jsx
import React from "react";
import "./Cart.css";

export default function Cart() {
  return (
    <div className="cart-container">
      <h2 className="cart-title">Tu Carrito</h2>

      <div className="cart-items">
        {/* Example item */}
        <div className="cart-item">
          <img
            src="/src/assets/taco.png"
            alt="Taco"
            className="cart-item-img"
          />
          <div className="cart-item-info">
            <h4>Taco de Birria</h4>
            <p>$25.00</p>
          </div>
          <div className="cart-item-controls">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>
        </div>
      </div>

      <div className="cart-summary">
        <h3>Total: $25.00</h3>
        <button className="checkout-btn">Proceder al Pago</button>
      </div>
    </div>
  );
}
