import { useState, useEffect } from "react";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  useEffect(() => {
    console.log("password:", password);
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      user,
      password,
    };

    console.log("Enviar:", loginData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mi Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario: </label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
