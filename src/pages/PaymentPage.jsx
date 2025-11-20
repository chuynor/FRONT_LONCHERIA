// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateCardDate = (date) => {
    if (!/^\d{4}$/.test(date)) return false;
    const mm = parseInt(date.substring(0, 2));
    const yy = parseInt(date.substring(2, 4));
    const minMonth = 11;
    const minYear = 15;
    return yy > minYear || (yy === minYear && mm >= minMonth);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const cardNumber = form.cardNumber?.value;
    const date = form.cardDate?.value;
    const cvv = form.cardCvv?.value;

    if (method === "card") {
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

    // 🔹 Aumentar pedidos del usuario
    const datosGuardados = JSON.parse(localStorage.getItem("userData")) || {};
    const nuevosPedidos = (datosGuardados.pedidos || 0) + 1;
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...datosGuardados, pedidos: nuevosPedidos })
    );

    // 🔹 Simular procesamiento de pago
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

      <div className="row h-100">
        {/* IZQUIERDA */}
        <div className="col-md-6 left-section d-flex flex-column justify-content-center align-items-center">
          <img src="/src/assets/pago.png" className="pay-image" alt="Pago" />

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
          {method === "card" && (
            <>
              <h3>Datos de la tarjeta</h3>
              <form className="form-payment" onSubmit={handlePay}>
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
                    <label>Código de seguridad</label>
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
                <input
                  type="text"
                  placeholder="Ingresa la dirección"
                  required
                />

                <button className="btn-pay">Pagar</button>
              </form>
            </>
          )}

          {method === "cash" && (
            <>
              <h3>Pago en efectivo</h3>
              <form className="form-payment mt-4" onSubmit={handlePay}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
