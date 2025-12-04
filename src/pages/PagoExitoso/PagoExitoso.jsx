// src/pages/PagoExitoso/PagoExitoso.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx"; // ✔ CORRECTO
import "./PagoExitoso.css";

export default function PagoExitoso() {
  const navigate = useNavigate();
  const [purchaseCode, setPurchaseCode] = useState(null);
  const { clearCart } = useCart(); // limpia carrito

  useEffect(() => {
    // Obtener datos guardados
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const pedidos = userData.pedidos || [];
    const lastOrder = pedidos[pedidos.length - 1] || { metodoPago: "cash" };

    // Generar código aleatorio
    const code = Math.floor(100000 + Math.random() * 900000);
    setPurchaseCode(code);

    // Guardarlo en el pedido
    lastOrder.codigoCompra = code;

    const updatedPedidos = pedidos.length
      ? [...pedidos.slice(0, -1), lastOrder]
      : [lastOrder];

    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, pedidos: updatedPedidos })
    );

    // 🟢 Limpiar carrito al completar compra
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

      <button className="btn-menu" onClick={() => navigate("/menu")}>
        VOLVER A MENÚ
      </button>
    </div>
  );
}
