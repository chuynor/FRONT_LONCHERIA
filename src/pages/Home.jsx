import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🔹 Sección superior */}
      <section className="home-top">
        <div className="pedido-container">
          <div className="pedido-text">
            <h2>¿Cómo quieres pedir?</h2>
            <div className="pedido-options">
              <button className="option tienda">🏠 Tienda</button>
              <button className="option domicilio">🚗 Domicilio</button>
            </div>
          </div>

          <div className="logo-box">
            <img
              src="/src/assets/Home-top.png"
              alt="Logo Migajas"
              className="home-logo"
            />
          </div>
        </div>
      </section>

      {/* 🔹 Sección del pan dividida en dos mitades */}
      <section className="home-mid">
        <div className="home-mid-left">
          <img src="/src/assets/pan.png" alt="Pan" className="pan-image" />
        </div>
        <div className="home-mid-right">
          <p className="frase">“Despierta sonrisas, comparte migajas.”</p>
        </div>
      </section>

      {/* 🔹 Sección inferior (solo lado derecho moderno) */}
      <section className="home-bottom">
        <div className="bottom-container">
          <div className="bottom-right">
            <img
              src="/src/assets/Desayuno.png"
              alt="Desayuno"
              className="food-img"
            />
            <button className="order-btn" onClick={() => navigate("/menu")}>
              Pedir Ahora
            </button>
          </div>
        </div>
      </section>

      {/* 🔹 Sección Noticias y Promociones */}
      <section className="news-section">
        <div className="news-card noticias">
          <h2>NOTICIAS MIGAJAS</h2>
          <p>Consulta los eventos más recientes.</p>
          <button className="news-btn">VER MÁS</button>
        </div>

        <div className="news-card promociones">
          <h2>PROMOCIONES MIGAJAS</h2>
          <p>Términos y condiciones.</p>
          <button className="news-btn">VER MÁS</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
