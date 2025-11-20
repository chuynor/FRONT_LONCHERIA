import React from "react";
import "./PagoExitoso.css";
import { useNavigate } from "react-router-dom";

export default function PagoExitoso() {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <img src="/src/assets/pagooo.png" className="success-img" />

      <h3>TU PEDIDO ESTARÁ LISTO EN UNOS MINUTOS</h3>

      <button className="btn-menu" onClick={() => navigate("/menu")}>
        VOLVER A MENÚ
      </button>
    </div>
  );
}
