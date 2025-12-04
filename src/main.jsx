import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home/Home.jsx";
import Menu from "./pages/Menu/Menu.jsx";
import Contacto from "./pages/Contacto/Contacto.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import "./index.css";
import Cart from "./pages/Cart/Cart.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import PaymentPage from "./pages/PaymentPage/PaymentPage.jsx";
import PagoExitoso from "./pages/PagoExitoso/PagoExitoso.jsx";
import Compras from "./pages/Compras/Compras.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pago" element={<PaymentPage />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/compras" element={<Compras />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
);
