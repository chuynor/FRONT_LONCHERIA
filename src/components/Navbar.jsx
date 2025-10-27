import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/src/assets/logoPaloma.png"
          alt="Logo"
          className="navbar-logo"
        />
        <h1 className="navbar-title">Menu</h1>
      </div>

      <div className="navbar-right">
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          <ShoppingCart size={22} />
        </button>
        <Link to="/" className="nav-link">
          Inicio
        </Link>
        <Link to="/menu" className="nav-link">
          Menú
        </Link>
        <Link to="/contacto" className="nav-link">
          Contacto
        </Link>
        <Link to="/login" className="nav-link login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
