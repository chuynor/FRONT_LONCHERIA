// src/pages/Perfil/Perfil.jsx
import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import fotoPerfil from "/src/assets/perfil.jpg";

export default function Perfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nombre: "Usuario",
    email: "usuario@correo.com",
    foto: fotoPerfil,
    pedidos: [],
  });

  const handleChangeFoto = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      const nuevoUser = { ...user, foto: url };
      setUser(nuevoUser);
      localStorage.setItem("userData", JSON.stringify(nuevoUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("userData"));
    if (datosGuardados) setUser(datosGuardados);
  }, []);

  const progreso = Math.min((user.pedidos.length / 10) * 100, 100);

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {/* FOTO */}
        <div className="perfil-foto">
          <img src={user.foto} alt="Foto de perfil" />
          <label className="cambiar-foto">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleChangeFoto} />
          </label>
        </div>

        {/* NOMBRE + CORREO */}
        <h2>{user.nombre}</h2>
        <p>{user.email}</p>

        {/* PROGRESO */}
        <div className="progreso-container">
          <div
            className="progreso-barra"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <p className="progreso-texto">
          Pedidos completados: {user.pedidos.length}/10
        </p>

        {/* BOTONES */}
        <div className="perfil-botones">
          <button onClick={() => navigate("/compras")}>Ver mis compras</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>

        {/* LISTADO DE PEDIDOS */}
        {user.pedidos.length > 0 && (
          <div className="pedidos-lista">
            <h3>Pedidos recientes</h3>
            {user.pedidos.map((pedido, index) => (
              <div key={index} className="pedido-card">
                <p>
                  <strong>Código:</strong> {pedido.codigoCompra || index + 1}
                </p>
                <p>
                  <strong>Tipo:</strong> {pedido.tipoPedido}
                </p>
                <p>
                  <strong>Método de pago:</strong> {pedido.metodoPago}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(pedido.fecha).toLocaleString()}
                </p>

                <h4>Productos:</h4>
                <ul>
                  {pedido.cart.map((item) => (
                    <li key={item.id}>
                      {item.nombre} x {item.quantity} - $
                      {item.precio * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
