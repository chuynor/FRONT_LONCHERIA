import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  // 🔹 Estados para los campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Validación simple de email y password
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // 🔹 Iniciar sesión solo si es válido
  const handleLogin = (e) => {
    e.preventDefault();

    if (!isFormValid) return; // evita avanzar si está vacío

    // Aquí podrías agregar validaciones reales con backend
    navigate("/"); // 🔹 redirige al Home
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register"); // 🔹 redirige al Register
  };

  return (
    <div className="login-page">
      {/* 🔹 Sección izquierda con imagen */}
      <div className="login-left">
        <img
          src="/src/assets/Login.png"
          alt="Illustration"
          className="login-image"
        />
      </div>

      {/* 🔹 Sección derecha con formulario */}
      <div className="login-right">
        <h2>
          Te damos la Bienvenida
          <br /> a Solo Migajas
        </h2>
        <p>
          Inicia sesión <br /> y disfruta la experiencia
        </p>

        <form className="form-login" onSubmit={handleLogin}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Email"
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

          <a href="#" className="forgot">
            Olvidé mi contraseña
          </a>

          <button
            className="btn-login"
            type="submit"
            disabled={!isFormValid} // 🔹 Desactiva si no está completo
          >
            Iniciar Sesión
          </button>

          <button className="btn-register" onClick={handleRegister}>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
