import React, { useState } from "react";
import "./Contacto.css";

function Contacto() {
  const [infoVisible, setInfoVisible] = useState(null);

  const toggleInfo = (section) => {
    setInfoVisible(infoVisible === section ? null : section);
  };

  return (
    <div className="contacto-container">
      {/* 🔹 Sección Sucursal */}
      <section className="sucursal-section">
        <div className="sucursal-left">
          <img
            src="/src/assets/Sucursal.png"
            alt="Sucursal"
            className="sucursal-img"
          />
        </div>
        <div className="sucursal-right">
          <h2>Sucursal</h2>
          <p>
            Nuestra sucursal principal se encuentra en la zona centro de la
            ciudad, rodeada de historia, cultura y vida local.
            <br />
            Un lugar ideal para disfrutar un desayuno tranquilo, un almuerzo en
            compañía o una cena especial bajo el encanto del centro histórico.
            <br />
            <strong>Dirección sugerida:</strong> Calle Principal #123, Zona
            Centro. (Puedes cambiarla según la ubicación real que desees.)
          </p>
        </div>
      </section>

      {/* 🔹 Historia de Solo Migajas */}
      <section className="historia-section">
        <div className="historia-left">
          <h2>Historia de Solo Migajas</h2>
          <p>
            “Solo Migajas” nació del amor por la comida casera, el pan recién
            horneado y los sabores que nos hacen sentir como en casa. Todo
            comenzó con una pequeña panadería familiar en el corazón de la
            ciudad, donde el aroma del pan atraía a vecinos y visitantes desde
            temprano. Con el tiempo, aquella panadería se transformó en un
            restaurante que mantiene la esencia artesanal, pero con un toque
            moderno y acogedor.
            <br />
            Hoy, “Solo Migajas” es sinónimo de sabor auténtico, atención cercana
            y pasión por compartir momentos inolvidables alrededor de la mesa.
          </p>
        </div>
        <div className="historia-right">
          <img
            src="/src/assets/Historia.png"
            alt="Panadería"
            className="historia-img"
          />
        </div>
      </section>

      {/* 🔹 Quiénes somos */}
      <section className="quienes-section">
        <div className="quienes-left">
          <img
            src="/src/assets/logo.png"
            alt="Logo Solo Migajas"
            className="quienes-logo"
          />
        </div>
        <div className="quienes-right">
          <h2>¿Quiénes somos?</h2>
          <p>
            En “Solo Migajas” nos dedicamos a preparar lonches llenos de sabor y
            tradición. Comenzamos con la idea de ofrecer comida sencilla, pero
            hecha con pasión, ingredientes frescos y ese toque casero que nos
            distingue.
            <br />
            Cada lonche se prepara al momento, cuidando cada detalle para que
            disfrutes una experiencia auténtica, rápida y deliciosa.
            <br />
            Porque en “Solo Migajas”, aunque el nombre diga poco, te llevas
            mucho sabor en cada bocado.
          </p>
        </div>
      </section>

      {/* 🔹 Visión, Misión, Valores */}
      <section className="vmv-section">
        {/* VISIÓN */}
        <div className="vmv-card">
          <img src="/src/assets/vision.png" alt="Visión" />
          <h3>Visión</h3>
          <button onClick={() => toggleInfo("vision")}>Ver más</button>
          {infoVisible === "vision" && (
            <p className="vmv-text">
              Nuestra visión es consolidarnos como el referente principal de
              comida artesanal y tradicional, manteniendo siempre el toque
              casero que nos distingue y creando momentos inolvidables en cada
              bocado.
            </p>
          )}
        </div>

        {/* MISIÓN */}
        <div className="vmv-card">
          <img src="/src/assets/mision.png" alt="Misión" />
          <h3>Misión</h3>
          <button onClick={() => toggleInfo("mision")}>Ver más</button>
          {infoVisible === "mision" && (
            <p className="vmv-text">
              Nuestra misión es ofrecer alimentos elaborados con ingredientes
              frescos y de calidad, brindando un servicio cálido y atento que
              haga sentir a cada cliente como en casa.
            </p>
          )}
        </div>

        {/* VALORES */}
        <div className="vmv-card">
          <img src="/src/assets/valores.png" alt="Valores" />
          <h3>Valores</h3>
          <button onClick={() => toggleInfo("valores")}>Ver más</button>
          {infoVisible === "valores" && (
            <ul className="vmv-text">
              <li>Pasión por lo que hacemos</li>
              <li>Compromiso con la calidad</li>
              <li>Respeto y honestidad</li>
              <li>Trabajo en equipo</li>
              <li>Calidez humana</li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contacto;
