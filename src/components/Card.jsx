import React from "react";
import "./Card.css";
import { useCart } from "../context/CartContext";

function Card({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-image-container">
        <img className="card-image" src={item.image} alt={item.name} />
      </div>

      <h3 className="card-title">{item.name}</h3>
      <p className="card-price">${item.price}</p>

      <button className="card-btn" onClick={() => addToCart(item)}>
        Agregar
      </button>
    </div>
  );
}

export default Card;
