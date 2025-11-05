import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
