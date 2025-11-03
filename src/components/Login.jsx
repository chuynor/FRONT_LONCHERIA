import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src="/src/assets/Login.png"
          alt="Illustration"
          className="login-image"
        />
      </div>

      <div className="login-right">
        <h2>
          Te damos la Bienvenida
          <br />a Solo Migajas
        </h2>
        <p>
          Inicia sesión <br />Y disfruta la experiencia
        </p>

        <form className="form-login">
          <label>Correo electrónico</label>
          <input type="email" placeholder="Email" />

          <label>Contraseña</label>
          <input type="password" placeholder="********" />

          <a href="#" className="forgot">
            Olvidé mi contraseña
          </a>

          <button className="btn-login">Iniciar Sesión</button>
          <button className="btn-register">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
