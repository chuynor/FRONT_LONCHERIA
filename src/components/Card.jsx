import React from "react";
import "./Card.css";

const Card = ({ name, price, image }) => {
  return (
    <div className="card-container">
      <div className="card">
        <img src={image} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p>${price}</p>
        <button className="card-btn">- 1 +</button>
      </div>
    </div>
  );
};

export default Card;
