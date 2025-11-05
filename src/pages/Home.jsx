import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🔹 Sección superior */}
      <section className="home-top">
        <div className="pedido-card">
          <img src="/src/assets/top.png" alt="Decorativa" className="top-img" />
          <div className="pedido-overlay">
            <h2>¿Cómo quieres pedir?</h2>
            <div className="pedido-options">
              <button className="option tienda">🏠 Tienda</button>
              <button className="option domicilio">🚗 Domicilio</button>
            </div>
          </div>
        </div>

        {/* 🔹 Logo central */}
        <div className="logo-section">
          <img src="/src/assets/logo.png" alt="Logo" className="home-logo" />
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

      {/* 🔹 Sección inferior */}
      <section className="home-bottom">
        <div className="slogan">
          <img
            src="/src/assets/Migajas.png"
            alt="Decorativa"
            className="slogan-img"
          />
          <h1>
            SOLO DEJAS <br />
            <span>MIGAJAS</span>
          </h1>
        </div>
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
