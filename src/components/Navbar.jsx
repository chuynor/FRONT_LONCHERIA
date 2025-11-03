import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapeo de rutas a títulos
  const pageTitles = {
    "/": "Inicio",
    "/menu": "Menú",
    "/contacto": "Contacto",
    "/login": "Login",
    "/register": "Registro",
    "/cart": "Carrito",
  };

  // Obtiene el título según la ruta actual
  const currentTitle = pageTitles[location.pathname] || "Página";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/src/assets/logo.png" alt="Logo" className="navbar-logo" />
        <h1 className="navbar-title">{currentTitle}</h1>
      </div>

      <div className="navbar-right">
        <Link to="/" className="nav-link">
          Inicio
        </Link>
        <Link to="/menu" className="nav-link">
          Menú
        </Link>
        <Link to="/contacto" className="nav-link">
          Contacto
        </Link>
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          <ShoppingCart size={22} />
        </button>
        <Link to="/login" className="nav-link login-btn">
          Login
        </Link>
        <Link to="/register" className="nav-link register-btn">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
