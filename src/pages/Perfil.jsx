import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nombre: "Usuario",
    email: "usuario@correo.com",
    foto: "/src/assets/userr.png",
    pedidos: 0,
  });

  // 🔹 Simular progreso basado en pedidos
  const progreso = Math.min((user.pedidos / 10) * 100, 100);

  // 🔹 Cambiar foto de perfil
  const handleChangeFoto = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setUser({ ...user, foto: url });
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Simular obtener datos de usuario (puedes conectar con tu backend)
  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("userData"));
    if (datosGuardados) setUser(datosGuardados);
  }, []);

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-foto">
          <img src={user.foto} alt="Foto de perfil" />
          <label className="cambiar-foto">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleChangeFoto} />
          </label>
        </div>

        <h2>{user.nombre}</h2>
        <p>{user.email}</p>

        {/* 🔹 Barra de progreso */}
        <div className="progreso-container">
          <div
            className="progreso-barra"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <p className="progreso-texto">Pedidos completados: {user.pedidos}/10</p>

        {/* 🔹 Botones */}
        <div className="perfil-botones">
          <button onClick={() => navigate("/compras")}>Ver mis compras</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
