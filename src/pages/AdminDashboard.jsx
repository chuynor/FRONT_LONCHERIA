export default function AdminDashboard() {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-success fw-bold">Panel de Administrador</h2>

      {/* CARDS DE ESTADÍSTICAS */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Ventas del día</h5>
            <h3 className="text-success mt-2">0</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Productos registrados</h5>
            <h3 className="text-success mt-2">--</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Ingredientes en stock</h5>
            <h3 className="text-success mt-2">--</h3>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE ACCIONES */}
      <h4 className="mt-5 mb-3 fw-semibold">Acciones rápidas</h4>

      <div className="row g-3">
        <div className="col-md-4">
          <button className="btn btn-success w-100 p-3 fs-5">
            ➕ Agregar Producto
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-outline-success w-100 p-3 fs-5">
            🍞 Gestionar Ingredientes
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-outline-dark w-100 p-3 fs-5">
            📦 Ver Inventario
          </button>
        </div>
      </div>
    </div>
  );
}
