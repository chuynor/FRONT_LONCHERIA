import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [userFoto, setUserFoto] = useState("/src/assets/userr.png");

  const isLoggedIn = !!localStorage.getItem("usuario");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const pageTitles = {
    "/": "Inicio",
    "/menu": "Menú",
    "/contacto": "Contacto",
    "/login": "Login",
    "/register": "Registro",
    "/cart": "Carrito",
    "/admin": "Administración",
    "/perfil": "Mi Perfil",
    "/compras": "Mis Compras",
  };

  const currentTitle = pageTitles[location.pathname] || "Página";

  // --------------------
  // CARGAR FOTO DEL USUARIO
  // --------------------
  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("userData"));
    if (datosGuardados && datosGuardados.foto) {
      setUserFoto(datosGuardados.foto);
    }
  }, []);

  // Escuchar cambios en localStorage (cuando se cambie la foto en Perfil)
  useEffect(() => {
    const handleStorageChange = () => {
      const datosGuardados = JSON.parse(localStorage.getItem("userData"));
      if (datosGuardados && datosGuardados.foto) {
        setUserFoto(datosGuardados.foto);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // --------------------
  // CERRAR SESIÓN
  // --------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Cerrar menú cuando clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/src/assets/logo.png" className="navbar-logo" />
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

        {isAdmin && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}

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
            <div
              className="profile-circle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={userFoto}
                className="profile-img"
                alt="Foto de usuario"
              />
            </div>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/perfil")}>Perfil</button>
                <button onClick={() => navigate("/compras")}>Compras</button>
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
