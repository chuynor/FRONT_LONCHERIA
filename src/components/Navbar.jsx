import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔹 Verifica si el usuario está logueado
  const isLoggedIn = !!localStorage.getItem("token");

  // Mapeo de rutas a títulos
  const pageTitles = {
    "/": "Inicio",
    "/menu": "Menú",
    "/contacto": "Contacto",
    "/login": "Login",
    "/register": "Registro",
    "/cart": "Carrito",
  };

  const currentTitle = pageTitles[location.pathname] || "Página";

  // 🔹 Cierra sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setMenuOpen(false);
  };

  // 🔹 Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link login-btn">
              Login
            </Link>
            <Link to="/register" className="nav-link register-btn">
              Register
            </Link>
          </>
        ) : (
          <div className="profile-menu" ref={menuRef}>
            {/* 🔹 Icono circular del perfil */}
            <div
              className="profile-circle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src="/src/assets/userr.png"
                alt="Perfil"
                className="profile-img"
              />
            </div>

            {/* 🔹 Menú desplegable */}
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/perfil")}>Ver perfil</button>
                <button onClick={() => navigate("/compras")}>
                  Mis compras
                </button>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
