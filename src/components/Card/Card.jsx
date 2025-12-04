// src/components/Card.jsx
import React from "react";
import "./Card.css";
import { useCart } from "../../context/CartContext.jsx";

function Card({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-image-container">
        <img
          className="card-image"
          src={item.imagen || "/placeholder.jpg"}
          alt={item.nombre}
        />
      </div>

      <h3 className="card-title">{item.nombre}</h3>
      <p className="card-description">{item.descripcion}</p>
      <p className="card-price">${item.precio}</p>

      {item.disponible ? (
        <button className="card-btn" onClick={() => addToCart(item)}>
          Agregar
        </button>
      ) : (
        <button className="card-btn disabled" disabled>
          No disponible
        </button>
      )}
    </div>
  );
}

export default Card;
