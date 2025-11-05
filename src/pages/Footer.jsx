import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* 🔹 Redes sociales */}
      <div className="footer-social">
        <a href="#" aria-label="Facebook">
          <Facebook size={20} />
        </a>
        <a href="#" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="#" aria-label="Twitter">
          <Twitter size={20} />
        </a>
        <a href="#" aria-label="YouTube">
          <Youtube size={20} />
        </a>
      </div>

      {/* 🔹 Enlaces legales */}
      <div className="footer-links">
        <a href="#">Accesibilidad Web</a>
        <span>|</span>
        <a href="#">Aviso de Privacidad</a>
        <span>|</span>
        <a href="#">Boletines</a>
        <span>|</span>
        <a href="#">Condiciones de uso</a>
        <span>|</span>
        <a href="#">Mapa del sitio</a>
        <span>|</span>
        <a href="#">Preferencias sobre cookies</a>
      </div>

      {/* 🔹 Derechos reservados */}
      <div className="footer-bottom">
        <p>© 2025. Migajas Coffee Company. Reservados todos los derechos</p>
      </div>
    </footer>
  );
};

export default Footer;
