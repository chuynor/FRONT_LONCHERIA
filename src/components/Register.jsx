import { useState } from "react";
import "./Register.css";

function Register() {
  const [password, setPassword] = useState("");
  const hasStartedTyping = password.length > 0;

  const requirements = {
    length: password.length >= 8 && password.length <= 12,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    numberOrSpecial:
      /[0-9]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img
          src="/src/assets/Register.png"
          alt="Illustration"
          className="register-image"
        />
      </div>

      <div className="register-right">
        <h2>Tus datos</h2>
        <p>Ingresa tus datos para registrarte y obtén beneficios infinitos</p>

        <form className="form-register">
          <label>Correo electrónico</label>
          <input type="email" placeholder="Email" required />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
              Debe tener entre 8 y 12 caracteres
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
              Debe incluir mayúsculas y minúsculas
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
              Debe incluir al menos un número o un carácter especial
            </li>
          </ul>

          <label>Confirmar contraseña</label>
          <input type="password" placeholder="********" required />

          <a href="#" className="forgot">
            Olvidé mi contraseña
          </a>

          <button className="btn-register-form" type="submit">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
