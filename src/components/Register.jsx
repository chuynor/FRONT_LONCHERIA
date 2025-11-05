import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const hasStartedTyping = password.length > 0;

  // 🔹 URL y Token de la API
  const API_URL = "https://api.solomigajas.online/api/usuarios/register";
  const APP_TOKEN =
    "bjwcgwudjwnwlcjowciw.bcjgcgjcbwchbwcwlcbkwbckwcbwbkwbcwkcb95855nkwhdcwg";

  // 🔹 Validaciones de contraseña
  const requirements = {
    length: password.length >= 8 && password.length <= 12,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    numberOrSpecial:
      /[0-9]/.test(password) || /[!@#$%^&*(),.?\":{}|<>]/.test(password),
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      setMensaje("⚠️ El nombre es obligatorio.");
      return;
    }

    if (password !== confirmar) {
      setMensaje("❌ Las contraseñas no coinciden.");
      return;
    }

    if (
      !requirements.length ||
      !requirements.case ||
      !requirements.numberOrSpecial
    ) {
      setMensaje("⚠️ La contraseña no cumple con los requisitos.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-token": APP_TOKEN,
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const text = await response.text();

      if (!response.ok) {
        setMensaje(
          `❌ Error ${response.status}: ${text || "Error desconocido"}`
        );
        return;
      }

      const data = text ? JSON.parse(text) : {};
      setMensaje("✅ Usuario registrado correctamente");

      // Redirigir al login
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("🚫 No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img
          src="/src/assets/Register.png"
          alt="Registro"
          className="register-image"
        />
      </div>

      <div className="register-right">
        <h2>Crear cuenta</h2>
        <p>Ingresa tus datos para registrarte</p>

        <form className="form-register" onSubmit={handleRegister}>
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 🔹 Requisitos de contraseña */}
          <ul className="password-requirements">
            <li
              className={
                hasStartedTyping
                  ? requirements.length
                    ? "valid"
                    : "invalid"
                  : ""
              }
            >
              Entre 8 y 12 caracteres
            </li>
            <li
              className={
                hasStartedTyping
                  ? requirements.case
                    ? "valid"
                    : "invalid"
                  : ""
              }
            >
              Incluye mayúsculas y minúsculas
            </li>
            <li
              className={
                hasStartedTyping
                  ? requirements.numberOrSpecial
                    ? "valid"
                    : "invalid"
                  : ""
              }
            >
              Al menos un número o carácter especial
            </li>
          </ul>

          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <button className="btn-register-form" type="submit">
            Registrar
          </button>
        </form>

        {mensaje && (
          <p
            style={{
              marginTop: "15px",
              color: mensaje.includes("✅") ? "#4a8d35" : "#d9534f",
            }}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
