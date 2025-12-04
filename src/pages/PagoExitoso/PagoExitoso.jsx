// src/pages/PagoExitoso/PagoExitoso.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./PagoExitoso.css";

export default function PagoExitoso() {
  const navigate = useNavigate();
  const [purchaseCode, setPurchaseCode] = useState(null);
  const { clearCart } = useCart();

  // 🔹 Obtener último pedido para mostrar resumen
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const lastOrder = userData?.pedidos?.[userData.pedidos.length - 1] || {
    metodoPago: "cash",
    tipoPedido: "Mostrador",
    total: 0,
    fecha: "Hoy",
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const pedidos = userData.pedidos || [];
    const lastOrder = pedidos[pedidos.length - 1] || { metodoPago: "cash" };

    // Generar código de compra
    const code = Math.floor(100000 + Math.random() * 900000);
    setPurchaseCode(code);

    // Guardarlo en el último pedido
    lastOrder.codigoCompra = code;

    const updatedPedidos = pedidos.length
      ? [...pedidos.slice(0, -1), lastOrder]
      : [lastOrder];

    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, pedidos: updatedPedidos })
    );

    // Vaciar carrito
    clearCart();
  }, []);

  return (
    <div className="success-container">
      {purchaseCode && (
        <div className="cash-code-box">
          <p>Tu código de compra es:</p>
          <h2 className="cash-code">{purchaseCode}</h2>
        </div>
      )}

      <img
        src="/src/assets/pagooo.png"
        className="success-img"
        alt="Pago exitoso"
      />

      <h3>TU PEDIDO ESTARÁ LISTO EN UNOS MINUTOS</h3>

      {/* 🟢 RESUMEN DEL PEDIDO */}
      <div className="order-summary">
        <h3>Resumen de tu Pedido</h3>

        <div className="order-box">
          <div className="order-item">
            <span className="order-label">Método de pago:</span>
            <span className="order-value">{lastOrder.metodoPago}</span>
          </div>

          <div className="order-item">
            <span className="order-label">Tipo de pedido:</span>
            <span className="order-value">{lastOrder.tipoPedido}</span>
          </div>

          <div className="order-item">
            <span className="order-label">Total:</span>
            <span className="order-value">${lastOrder.total}</span>
          </div>

          <div className="order-item">
            <span className="order-label">Fecha:</span>
            <span className="order-value">{lastOrder.fecha}</span>
          </div>
        </div>
      </div>

      <button className="btn-menu" onClick={() => navigate("/menu")}>
        VOLVER A MENÚ
      </button>
    </div>
  );
}
