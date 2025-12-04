import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card.jsx";
import "../../components/Card/Card.css";
import { getProducts } from "../../api/products";
import { useCart } from "../../context/CartContext.jsx";
import "./Menu.css";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("jugos");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setTipoPedido } = useCart();

  const categories = ["tortas", "quesadillas", "sandwiches", "chocos", "jugos"];

  useEffect(() => {
    getProducts()
      .then((productos) => {
        setMenuItems(productos || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Cargando menú... </p>;
  if (error) return <p className="error"> {error}</p>;

  const filteredItems = menuItems.filter(
    (item) => item?.categoria?.toLowerCase() === selectedCategory
  );

  return (
    <div className="menu-page">
      <h2 className="menu-title">Menú del Día</h2>

      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <Card key={item._id} item={item} />)
        ) : (
          <p className="empty-text">
            No hay {selectedCategory} disponibles ahora 😋
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
