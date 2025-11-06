import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import "./index.css";
import Cart from "./pages/Cart.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Perfil from "./pages/Perfil.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
);
