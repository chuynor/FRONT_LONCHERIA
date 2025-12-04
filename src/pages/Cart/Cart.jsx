// src/pages/Cart/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();

  if (cart.length === 0)
    return <p className="empty-cart">Tu carrito está vacío 😢</p>;

  const handlePay = () => {
    navigate("/pago");
  };

  return (
    <div className="cart-container">
      <h2>Mi Carrito</h2>

      {cart.map((item) => (
        <div key={item._id} className="cart-item">
          <img
            src={item.imagen || "/placeholder.jpg"}
            alt={item.nombre}
            className="cart-img"
          />

          <div className="cart-info">
            <h3>{item.nombre}</h3>
            <p>${item.precio}</p>

            <div className="cart-controls">
              <button className="qty-btn" onClick={() => decreaseQty(item._id)}>
                -
              </button>
              <span className="cart-qty">{item.quantity}</span>
              <button className="qty-btn" onClick={() => increaseQty(item._id)}>
                +
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">Total: ${total}</div>

      <button className="btn-pay-now" onClick={handlePay}>
        Pagar ahora
      </button>
    </div>
  );
};

export default Cart;
