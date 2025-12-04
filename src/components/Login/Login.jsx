// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "https://api.solomigajas.online/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const APP_TOKEN = import.meta.env.VITE_APP_TOKEN;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-token": APP_TOKEN,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje("❌ Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // Guardar datos del usuario en localStorage
      const userLocalStorage = {
        id: data.usuario._id,
        nombre: data.usuario.nombre,
        email: data.usuario.email,
        rol: data.usuario.rol,
        token: data.token,
      };
      localStorage.setItem("usuario", JSON.stringify(userLocalStorage));

      // Guardar rol para el Navbar/Admin
      if (data.usuario.rol === "admin" || email === "admin@example.com") {
        localStorage.setItem("role", "admin");
      } else {
        localStorage.setItem("role", data.usuario.rol || "user");
      }

      setMensaje("✅ Inicio de sesión exitoso");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error:", error);
      setMensaje("🚫 Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/src/assets/Login.png" alt="login" className="login-image" />
      </div>

      <div className="login-right">
        <h2>Iniciar Sesión</h2>

        <form className="form-login" onSubmit={handleLogin}>
          <label>Correo</label>
          <input
            type="email"
            placeholder="usuario@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-login" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {mensaje && (
          <p style={{ color: mensaje.includes("✅") ? "green" : "red" }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
