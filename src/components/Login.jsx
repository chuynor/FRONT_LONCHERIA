import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Token de aplicación
  const APP_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb25jaGVyaWEtc29sby1taWdhamFzIiwic3ViIjoiY2xpZW50ZS1maWVsLTAwMSIsImF1ZCI6ImFwaS5zb2xvbWlnYWphcy5teCIsImlhdCI6MTczMDc4MDgwMCwiZXhwIjoxNzMwNzg0NDAwLCJub21icmUiOiJNYXJcdTAwZWRhIExcdTAwZjNwZXoiLCJlbWFpbCI6Im1hcmlhQGVqZW1wbG8uY29tIiwicm9sIjoiY2xpZW50ZV92aXAiLCJsb25jaGVyaWEiOiJTb2xvIE1pZ2FqYXMgXHUwZjI4XHVkY2RkIiwicGVkaWRvX2ZhdiI6IlRvcnRhIGRlIG1pbGFuZXphIiwiZGVzY3VlbnRvIjoiMTUlIGVuIHRvZGFzIGxvcyBwbGF0aWxsb3MiLCJwdW50b3MiOjI1MH0.uW4XU5lC1q9y3f7k8p0LmN2xZ6vB9rTqYhG5jK3mN7o";

  // 🔹 Enviar datos al servidor
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.solomigajas.online/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-token": APP_TOKEN,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Inicio de sesión exitoso");

        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Redirigir a Home.jsx (ruta "/")
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMensaje(data.mensaje || "❌ Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("🚫 No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 🔹 Lado izquierdo con imagen */}
      <div className="login-left">
        <img src="/src/assets/Login.png" alt="Login" className="login-image" />
      </div>

      {/* 🔹 Lado derecho con formulario */}
      <div className="login-right">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta para continuar</p>

        <form className="form-login" onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Ej: usuario@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="forgot">
            ¿Olvidaste tu contraseña?
          </a>

          <div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Conectando..." : "Ingresar"}
            </button>
            <button
              type="button"
              className="btn-register"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </div>
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

export default Login;
