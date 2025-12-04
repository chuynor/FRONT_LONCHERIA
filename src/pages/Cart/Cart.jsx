// src/pages/Cart.jsx
import React from "react";
import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

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
                    className="qty-btn qty-minus"
                    onClick={() => decreaseQty(item.id)}
                  >
                    &#8722;
                  </button>

                  <span className="cart-qty">{item.quantity}</span>

                  <button
                    className="qty-btn qty-plus"
                    onClick={() => increaseQty(item.id)}
                  >
                    &#43;
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

          {/* BOTÓN DE PAGO */}
          <button className="btn-pay-now" onClick={() => navigate("/pago")}>
            Proceder al Pago 💳
          </button>
        </div>
      )}
    </div>
  );
}
