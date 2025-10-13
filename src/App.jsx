import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/menu">Menú</Link> |{" "}
        <Link to="/contacto">Contacto</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
