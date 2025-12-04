// src/pages/Compras.jsx
import React from "react";
import "./Compras.css";

export default function Compras() {
  // Recuperamos los datos del usuario
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const pedidos = userData.pedidos || [];

  if (pedidos.length === 0) {
    return (
      <div className="compras-container">
        <h2>Mis compras</h2>
        <p>Aún no tienes compras registradas.</p>
      </div>
    );
  }

  return (
    <div className="compras-container">
      <h2>Mis compras</h2>
      {pedidos.map((pedido, index) => (
        <div key={index} className="pedido-card">
          <p>
            <strong>Tipo de pedido:</strong> {pedido.tipoPedido}
          </p>
          <p>
            <strong>Método de pago:</strong> {pedido.metodoPago}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}
          </p>
          <p>
            <strong>Productos:</strong>
          </p>
          <ul>
            {pedido.cart.map((item) => (
              <li key={item.id}>
                {item.nombre} x {item.quantity} - $
                {Number(item.precio * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
