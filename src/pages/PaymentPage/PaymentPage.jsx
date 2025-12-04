// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx"; // Asegúrate de tener CartContext
import "./PaymentPage.css";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || "";

const getAuthHeaders = (needsAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
    "x-app-token": APP_TOKEN,
  };

  if (needsAuth) {
    const stored = localStorage.getItem("usuario") || localStorage.getItem("user") || "{}";
    let user = {};
    try { user = JSON.parse(stored); } catch { user = {}; }
    const token = user?.token || user?.accessToken || localStorage.getItem("token");
    if (token) {
      headers["authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

async function apiFetch(path, opts = {}, needsAuth = false) {
  const url = `${API_BASE}${path}`;
  const headers = getAuthHeaders(needsAuth);

  const init = {
    ...opts,
    headers: { ...(opts.headers || {}), ...headers },
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const err = new Error(json?.mensaje || text || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  const [method, setMethod] = useState("card"); // tarjeta por defecto
  const [loading, setLoading] = useState(false);
  const [tipoPedido, setTipoPedido] = useState("domicilio");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoPedido") || "domicilio";
    setTipoPedido(tipo);
  }, []);

  const validateCardDate = (date) => {
    if (!/^\d{4}$/.test(date)) return false;
    const mm = parseInt(date.substring(0, 2));
    const yy = parseInt(date.substring(2, 4));
    const minMonth = 11;
    const minYear = 15;
    return yy > minYear || (yy === minYear && mm >= minMonth);
  };

  // Función para descontar stock de cada producto vendido
  const descontarStockProductos = async () => {
    try {
      // Intentar descontar stock para cada producto en el carrito
      for (const item of cart) {
        try {
          // Si el producto tiene _id (viene de la API), usamos ese endpoint
          if (item._id) {
            await apiFetch(
              `/api/productos/${item._id}/vender`,
              {
                method: "POST",
                body: JSON.stringify({ cantidad: item.quantity }),
              },
              true // needsAuth
            );
          }
        } catch (err) {
          // Log pero no detener el proceso de compra - podría ser producto local
          console.log(`No se pudo descontar stock para ${item.nombre}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Error descuantando stock:", err);
      // No lanzar error, permitir que la compra continúe
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const cardNumber = form.cardNumber?.value;
    const date = form.cardDate?.value;
    const cvv = form.cardCvv?.value;

    // Validaciones si es tarjeta y domicilio
    if (method === "card" && tipoPedido === "domicilio") {
      if (!/^\d{16}$/.test(cardNumber)) {
        alert("El número de tarjeta debe tener 16 dígitos.");
        setLoading(false);
        return;
      }
      if (!validateCardDate(date)) {
        alert("La fecha debe ser válida y posterior a 11/2015.");
        setLoading(false);
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        alert("El CVV debe tener 3 dígitos.");
        setLoading(false);
        return;
      }
    }

    // Descontar stock antes de guardar el pedido
    await descontarStockProductos();

    // Guardamos el pedido en localStorage
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const nuevosPedidos = [
      ...(userData.pedidos || []),
      { cart, tipoPedido, metodoPago: method, fecha: new Date() },
    ];
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, pedidos: nuevosPedidos })
    );

    // Limpiar carrito después de procesar la compra
    clearCart();

    setTimeout(() => {
      setLoading(false);
      navigate("/pago-exitoso");
    }, 2000);
  };

  return (
    <div className="payment-page container-fluid">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Procesando pago...</p>
        </div>
      )}

      {/* BOTONES TIPO DE PEDIDO */}
      <div className="tipo-pedido-buttons">
        <button
          className={tipoPedido === "tienda" ? "active" : ""}
          onClick={() => setTipoPedido("tienda")}
        >
          🏠 Tienda
        </button>
        <button
          className={tipoPedido === "domicilio" ? "active" : ""}
          onClick={() => setTipoPedido("domicilio")}
        >
          🚗 Domicilio
        </button>
      </div>

      <div className="row h-100">
        {/* IZQUIERDA */}
        <div className="col-md-6 left-section d-flex flex-column justify-content-center align-items-center">
          <img src="/src/assets/pago.png" className="pay-image" alt="Pago" />

          {/* BOTONES MÉTODO DE PAGO */}
          <div className="buttons-container mt-4">
            <button
              className={`btn-pay-method ${method === "card" ? "active" : ""}`}
              onClick={() => setMethod("card")}
            >
              Tarjeta
            </button>
            <button
              className={`btn-pay-method cash ${
                method === "cash" ? "active" : ""
              }`}
              onClick={() => setMethod("cash")}
            >
              Efectivo
            </button>
          </div>
        </div>

        {/* DERECHA */}
        <div className="col-md-6 right-section">
          {/* RESUMEN DEL CARRITO */}
          {cart.length > 0 && (
            <div className="cart-summary">
              <h4>Resumen del pedido</h4>
              {cart.map((item) => (
                <p key={item.id}>
                  {item.nombre} x {item.quantity} - $
                  {Number(item.precio * item.quantity).toFixed(2)}
                </p>
              ))}
              <p>Total: ${total}</p>
            </div>
          )}

          {/* FORMULARIO TARJETA / DOMICILIO */}
          {method === "card" && tipoPedido === "domicilio" && (
            <form className="form-payment" onSubmit={handlePay}>
              <h3>Datos de la tarjeta</h3>
              <label>Email</label>
              <input type="email" placeholder="Ingresa tu email" required />

              <label>Número de tarjeta</label>
              <input
                name="cardNumber"
                type="text"
                placeholder="Número de tarjeta"
                required
                maxLength={16}
                inputMode="numeric"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />

              <div className="row">
                <div className="col-6">
                  <label>MMAA</label>
                  <input
                    name="cardDate"
                    type="text"
                    placeholder="MM AA"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>

                <div className="col-6">
                  <label>CVV</label>
                  <input
                    name="cardCvv"
                    type="password"
                    placeholder="CVV"
                    required
                    maxLength={3}
                    inputMode="numeric"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>

              <label>Nombre del titular</label>
              <input type="text" placeholder="Nombre del titular" required />

              <h4 className="mt-4">Domicilio</h4>
              <input type="text" placeholder="Ingresa la dirección" required />

              <button className="btn-pay">Pagar</button>
            </form>
          )}

          {/* FORMULARIO TIENDA */}
          {tipoPedido === "tienda" && (
            <form className="form-payment mt-4" onSubmit={handlePay}>
              <h3>Recoger en tienda</h3>
              <label>Nombre completo</label>
              <input type="text" placeholder="Ingresa tu nombre" required />
              <label>Email</label>
              <input type="email" placeholder="Ingresa tu email" required />
              <button className="btn-pay mt-3">Pagar / Confirmar</button>
            </form>
          )}

          {/* FORMULARIO EFECTIVO / DOMICILIO */}
          {method === "cash" && tipoPedido === "domicilio" && (
            <form className="form-payment mt-4" onSubmit={handlePay}>
              <h3>Pago en efectivo</h3>
              <label>Nombre completo</label>
              <input type="text" placeholder="Ingresa tu nombre" required />
              <label>Teléfono</label>
              <input
                type="text"
                placeholder="Número de teléfono"
                required
                maxLength={10}
                inputMode="numeric"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />
              <label>Dirección</label>
              <input type="text" placeholder="Calle y número" required />
              <label>Número exterior / interior</label>
              <input
                type="text"
                placeholder="Número"
                required
                maxLength={5}
                inputMode="numeric"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />
              <label>Colonia</label>
              <input type="text" placeholder="Ingresa la colonia" required />
              <button className="btn-pay mt-3">Pagar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
