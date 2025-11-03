import React, { useState } from "react";
import Card from "../components/Card";
import { menuItems } from "../data/menuData";
import "./Menu.css";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tortas");

  const categories = ["Tortas", "Desayunos", "Bebidas", "Postres"];

  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div className="menu-page">
      <h2 className="menu-title">Menú</h2>

      {/* Category bar */}
      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="menu-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <Card key={item.id} item={item} />)
        ) : (
          <p className="empty-text">
            No hay productos en esta categoría todavía ☕
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
