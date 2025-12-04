import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || "";

const getAuthHeaders = (needsAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
    "x-app-token": APP_TOKEN,
  };

  if (needsAuth) {
    // aceptar tanto "usuario" como "user" en localStorage
    const stored = localStorage.getItem("usuario") || localStorage.getItem("user") || "{}";
    let user = {};
    try { user = JSON.parse(stored); } catch { user = {}; }
    const token = user?.token || user?.accessToken || localStorage.getItem("token");
    if (!token) throw new Error("Falta el token de autorización del administrador");
    // backend espera header en minúsculas
    headers["authorization"] = `Bearer ${token}`;
  }

  return headers;
};

async function apiFetch(path, opts = {}, needsAuth = false) {
  const url = `${API_BASE}${path}`;
  const headers = getAuthHeaders(needsAuth);

  const init = {
    ...opts,
    headers: { ...(opts.headers || {}), ...headers },
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const err = new Error(json?.mensaje || text || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export default function AdminDashboard() {
  // aceptar tanto "usuario" como "user" en localStorage
  const storedUser = localStorage.getItem("usuario") || localStorage.getItem("user") || "{}";
  let parsedUser = {};
  try { parsedUser = JSON.parse(storedUser); } catch { parsedUser = {}; }
  const user = parsedUser;
  const isAdmin = !!user?.isAdmin || user?.rol === "admin";

  if (!APP_TOKEN) {
    return (
      <div className="container py-4">
        <h2 className="mb-4 text-danger">
          Falta variable de entorno: VITE_APP_TOKEN
        </h2>
        <p>
          El header <code>x-app-token</code> no está configurado. Crea un
          archivo <code>.env</code> con:
        </p>
        <pre style={{ background: "#f8f9fa", padding: 12 }}>
          VITE_API_URL=https://api.solomigajas.online
          {"\n"}
          VITE_APP_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb25jaGVyaWEtc29sby1taWdhamFz...
        </pre>
      </div>
    );
  }

  const [ingredientes, setIngredientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingIng, setLoadingIng] = useState(false);
  const [loadingProd, setLoadingProd] = useState(false);
  const [error, setError] = useState("");
  const [addingProd, setAddingProd] = useState(false);
  const [addingIng, setAddingIng] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const [sales, setSales] = useState(
    JSON.parse(localStorage.getItem("ventas") || "[]")
  );

  const [newIngrediente, setNewIngrediente] = useState({
    nombre: "",
    unidad: "kg",
    cantidad: 0,
    descripcion: "",
  });

  const [newProducto, setNewProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    ingredientes: [],
  });

  const [sellingProduct, setSellingProduct] = useState(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);
  const [sellError, setSellError] = useState("");

  // load ingredientes then productos (await to avoid race conditions)
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const ingrList = await fetchIngredientes(); // returns list
        await fetchProductos(ingrList);
      } catch (err) {
        // fetchIngredientes/fetchProductos already set errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // fetchIngredientes ahora devuelve la lista para uso inmediato
  const fetchIngredientes = async () => {
    setLoadingIng(true);
    setError("");
    try {
      const res = await apiFetch("/api/ingredientes");
      const list = Array.isArray(res) ? res : res?.data || [];
      setIngredientes(list);
      return list;
    } catch (err) {
      setError(err.message || "Error cargando ingredientes");
      return [];
    } finally {
      setLoadingIng(false);
    }
  };

  // fetchProductos acepta optional cachedIngredientes para mapping seguro
  const fetchProductos = async (cachedIngredientes = null) => {
    setLoadingProd(true);
    setError("");
    try {
      const res = await apiFetch("/api/productos?populate=true");
      const productosArr = Array.isArray(res) ? res : res?.data || [];
      const ingrSource = Array.isArray(cachedIngredientes) ? cachedIngredientes : ingredientes;

      const productosPop = productosArr.map((p) => {
        const mappedIngredientes = (p.ingredientes || []).map((it) => {
          // if backend returned populated ingredient object, use it
          if (it.ingrediente && typeof it.ingrediente === "object" && it.ingrediente._id) {
            return { ...it, ingrediente: it.ingrediente };
          }
          // otherwise try to find in cached ingredientes
          const found = (ingrSource || []).find((i) => String(i._id) === String(it.ingrediente));
          if (found) return { ...it, ingrediente: found };
          // fallback: keep id and null stock to avoid NaN
          return { ...it, ingrediente: { _id: it.ingrediente, nombre: "Desconocido", cantidad: null, unidad: "" } };
        });
        return { ...p, ingredientes: mappedIngredientes };
      });

      setProductos(productosPop);
    } catch (err) {
      setError(err.message || "Error cargando productos");
    } finally {
      setLoadingProd(false);
    }
  };

  // ================== INGREDIENTES ==================
  const createIngrediente = async (e) => {
    e.preventDefault();
    if (!newIngrediente.nombre)
      return setError("Nombre de ingrediente requerido");

    setAddingIng(true);
    try {
      const payload = {
        nombre: newIngrediente.nombre.trim(),
        unidad: newIngrediente.unidad,
        cantidad: Number(newIngrediente.cantidad) || 0,
        descripcion: newIngrediente.descripcion || undefined,
      };

      await apiFetch(
        "/api/ingredientes",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );

      setNewIngrediente({
        nombre: "",
        unidad: "kg",
        cantidad: 0,
        descripcion: "",
      });

      const ingrList = await fetchIngredientes();
      await fetchProductos(ingrList);
      setError("");
    } catch (err) {
      setError(err.body?.mensaje || err.message || "Error creando ingrediente");
    } finally {
      setAddingIng(false);
    }
  };

  const recargarStock = async (id) => {
    const cantidadStr = prompt("Cantidad a recargar (número positivo):", "1");
    if (cantidadStr === null) return;

    const cantidad = Number(cantidadStr);
    if (isNaN(cantidad) || cantidad <= 0) return alert("Cantidad inválida");

    try {
      await apiFetch(
        `/api/ingredientes/${id}/stock`,
        {
          method: "POST",
          body: JSON.stringify({ cantidad }),
        },
        true
      );

      const ingrList = await fetchIngredientes();
      await fetchProductos(ingrList);
    } catch (err) {
      alert(err.body?.mensaje || err.message || "Error al recargar stock");
    }
  };

  const deleteIngrediente = async (id) => {
    if (!window.confirm("¿Eliminar ingrediente? Esto puede afectar productos.")) return;

    try {
      await apiFetch(`/api/ingredientes/${id}`, { method: "DELETE" }, true);
      const ingrList = await fetchIngredientes();
      await fetchProductos(ingrList);
    } catch (err) {
      alert(err.body?.mensaje || "Error eliminando ingrediente");
    }
  };

  // ================== PRODUCTOS ==================
  const toggleIngredSeleccion = (id) => {
    setNewProducto((prev) => {
      const exists = prev.ingredientes.find((i) => i.ingrediente === id);
      if (exists) {
        return {
          ...prev,
          ingredientes: prev.ingredientes.filter((i) => i.ingrediente !== id),
        };
      } else {
        return {
          ...prev,
          ingredientes: [
            ...prev.ingredientes,
            { ingrediente: id, cantidad: "" },
          ],
        };
      }
    });
  };

  const setIngredCantidad = (id, cantidad) => {
    setNewProducto((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.map((i) =>
        i.ingrediente === id ? { ...i, cantidad } : i
      ),
    }));
  };

  const createProducto = async (e) => {
    e.preventDefault();
    if (!newProducto.nombre) return setError("Nombre de producto requerido");
    if (!newProducto.precio || Number(newProducto.precio) <= 0)
      return setError("Precio inválido");
    if (newProducto.ingredientes.length === 0)
      return setError("Selecciona al menos un ingrediente");
    for (const it of newProducto.ingredientes) {
      if (!it.cantidad || Number(it.cantidad) <= 0)
        return setError("Todas las cantidades deben ser > 0");
    }

    setAddingProd(true);
    try {
      const payload = {
        nombre: newProducto.nombre,
        precio: Number(newProducto.precio),
        categoria: newProducto.categoria || "sin-categoria",
        ingredientes: newProducto.ingredientes.map((i) => ({
          ingrediente: i.ingrediente,
          cantidad: Number(i.cantidad),
        })),
      };

      await apiFetch(
        "/api/productos",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );

      setNewProducto({
        nombre: "",
        precio: "",
        categoria: "",
        ingredientes: [],
      });
      const ingrList = await fetchIngredientes();
      await fetchProductos(ingrList);
      setError("");
    } catch (err) {
      setError(err.body?.mensaje || "Error creando producto");
    } finally {
      setAddingProd(false);
    }
  };

  const deleteProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await apiFetch(`/api/productos/${id}`, { method: "DELETE" }, true);
      await fetchProductos(await fetchIngredientes());
    } catch (err) {
      alert(err.body?.mensaje || "Error eliminando producto");
    }
  };

  // ================== VENTA ==================
  const openSell = (producto) => {
    setSellingProduct(producto);
    setSellQty(1);
    setSellError("");
  };

  const submitSell = async (e) => {
    e.preventDefault();
    const cantidad = Number(sellQty);
    if (!cantidad || cantidad <= 0) return setSellError("Cantidad inválida");

    setSellLoading(true);
    try {
      await apiFetch(
        `/api/productos/${sellingProduct._id}/vender`,
        {
          method: "POST",
          body: JSON.stringify({ cantidad }),
        },
        true
      );

      const v = {
        producto: sellingProduct.nombre,
        cantidad,
        fecha: new Date().toISOString(),
      };
      const all = [v, ...sales];
      setSales(all);
      localStorage.setItem("ventas", JSON.stringify(all));

      const ingrList = await fetchIngredientes();
      await fetchProductos(ingrList);
      setSellingProduct(null);
    } catch (err) {
      setSellError(err.body?.mensaje || err.message || "Error procesando venta");
    } finally {
      setSellLoading(false);
    }
  };

  // ================== ESTADÍSTICAS ==================
  const totalProducts = productos.length;
  const totalSales = sales.length;
  const totalStock = ingredientes.reduce(
    (acc, i) => acc + (Number(i.cantidad) || 0),
    0
  );

  function buildSalesByWeekday(ventasArr) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    ventasArr.forEach((v) => {
      const d = new Date(v.fecha);
      if (isNaN(d)) return;
      const day = d.getDay();
      counts[day === 0 ? 6 : day - 1] += 1;
    });
    return counts;
  }

  const salesChartData =
    totalSales > 0
      ? {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            {
              label: "Ventas",
              data: buildSalesByWeekday(sales),
              backgroundColor: "#28a745",
              borderRadius: 5,
            },
          ],
        }
      : null;

  const categories = [
    ...new Set(productos.map((p) => p.categoria || "Sin categoría")),
  ];
  const stockChartData =
    totalProducts > 0
      ? {
          labels: categories,
          datasets: [
            {
              label: "Stock por categoría",
              data: categories.map((cat) =>
                productos
                  .filter((p) => (p.categoria || "Sin categoría") === cat)
                  .reduce(
                    (a, b) =>
                      a +
                      (b.ingredientes?.reduce(
                        (s, it) => s + (it.ingrediente?.cantidad || 0),
                        0
                      ) || 0),
                    0
                  )
              ),
              backgroundColor: [
                "#ff9f40",
                "#ffcd56",
                "#4bc0c0",
                "#36a2eb",
                "#9966ff",
              ],
            },
          ],
        }
      : null;

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Acceso denegado</h2>
        <p>Este panel es solo para administradores.</p>
      </div>
    );
  }

  // helper para mostrar stock seguro
  const formatStock = (ingr) => {
    if (!ingr || ingr.cantidad == null || isNaN(Number(ingr.cantidad))) return "N/A";
    return Number(ingr.cantidad).toFixed(3);
  };
  // SECCIÓN: HELPERS (agregar DESPUÉS de la función formatStock y ANTES de los useState de filtros)

// ========== HELPER 1: Calcular ingresos totales ==========
const calcularIngresosTotales = () => {
  return sales.reduce((total, venta) => {
    const producto = productos.find(p => p.nombre === venta.producto);
    return total + (producto?.precio || 0) * venta.cantidad;
  }, 0);
};

// ========== HELPER 2: Calcular ingresos por categoría ==========
const calcularIngresosPorCategoria = () => {
  const ingresos = {};
  sales.forEach((venta) => {
    const producto = productos.find(p => p.nombre === venta.producto);
    if (producto) {
      const cat = producto.categoria || "Sin categoría";
      ingresos[cat] = (ingresos[cat] || 0) + (producto.precio * venta.cantidad);
    }
  });
  return ingresos;
};

// ========== HELPER 3: Obtener ingredientes con stock bajo ==========
const obtenerStockBajo = () => {
  return ingredientes.filter(ing => ing.cantidad < (ing.stockMinimo || 5));
};

// ========== HELPER 4: Formatear fecha y hora ==========
const formatearFecha = (fechaIso) => {
  try {
    const d = new Date(fechaIso);
    return d.toLocaleDateString("es-MX") + " " + d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "N/A";
  }
};

// ========== HELPER 5: Exportar ventas a CSV ==========
const exportarVentasCSV = () => {
  const headers = ["Fecha", "Producto", "Cantidad", "Precio Unitario", "Total"];
  const rows = sales.map((v) => {
    const prod = productos.find(p => p.nombre === v.producto);
    const precio = prod?.precio || 0;
    const total = precio * v.cantidad;
    return [
      formatearFecha(v.fecha),
      v.producto,
      v.cantidad,
      `$${precio}`,
      `$${total.toFixed(2)}`
    ];
  });

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ventas_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ========== FIN HELPERS ==========
// Estado para filtros de historial
const [filterProducto, setFilterProducto] = useState("");
const [filterFecha, setFilterFecha] = useState("");

// Filtrar ventas según criterios
const ventasFiltradas = sales.filter((venta) => {
  const matchProducto = !filterProducto || venta.producto.toLowerCase().includes(filterProducto.toLowerCase());
  const matchFecha = !filterFecha || venta.fecha.startsWith(filterFecha);
  return matchProducto && matchFecha;
});

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-success fw-bold">Panel de Administrador</h2>

      <div className="alert alert-info mb-3">
        <strong>Estado:</strong> Admin conectado como{" "}
        <code>{user?.email || "desconocido"}</code>
        {user?.token?.includes("dev-admin") && (
          <span className="badge bg-warning ms-2">Modo Desarrollo</span>
        )}
        <div className="form-check form-switch d-inline ms-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="useMockSwitch"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
          />
          <label className="form-check-label ms-2" htmlFor="useMockSwitch">
            Usar mock local
          </label>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Ventas registradas</h5>
            <h3 className="mt-2 text-success">{totalSales}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Productos en catálogo</h5>
            <h3 className="mt-2 text-success">{totalProducts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h5 className="text-muted">Stock total (ingredientes)</h5>
            <h3 className="mt-2 text-success">{Number(totalStock).toFixed(3)}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      {(totalSales > 0 || totalProducts > 0) && (
        <div className="row g-4 mb-4">
          {salesChartData && (
            <div className="col-md-6">
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="fw-semibold mb-3">Ventas por día de la semana</h5>
                <Bar data={salesChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
          )}
          {stockChartData && (
            <div className="col-md-6">
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="fw-semibold mb-3">Stock por categoría</h5>
                <Doughnut data={stockChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALERTAS DE STOCK BAJO */}
      <div className="row g-4 mb-4">
        <div className="col-md-12">
          <div className="bg-white p-4 rounded shadow-sm border border-warning">
            <h5 className="fw-semibold mb-3 text-warning">⚠️ Ingredientes con Stock Bajo</h5>
            {obtenerStockBajo().length === 0 ? (
              <p className="text-success mb-0">✅ Todos los ingredientes tienen stock adecuado</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Ingrediente</th>
                      <th>Stock Actual</th>
                      <th>Stock Mínimo</th>
                      <th>Unidad</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obtenerStockBajo().map((ing) => {
                      const porcentaje = (ing.cantidad / (ing.stockMinimo || 5)) * 100;
                      const badge = ing.cantidad === 0 ? "danger" : porcentaje < 50 ? "danger" : "warning";
                      return (
                        <tr key={ing._id}>
                          <td><strong>{ing.nombre}</strong></td>
                          <td>{Number(ing.cantidad).toFixed(3)}</td>
                          <td>{ing.stockMinimo || 5}</td>
                          <td>{ing.unidad}</td>
                          <td>
                            <span className={`badge bg-${badge}`}>
                              {ing.cantidad === 0 ? "CRÍTICO" : "BAJO"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => recargarStock(ing._id)}
                            >
                              Recargar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESUMEN DE INGRESOS */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5 className="fw-semibold mb-3">💰 Ingresos Totales</h5>
            <h3 className="text-success mb-0">${Number(calcularIngresosTotales()).toFixed(2)}</h3>
            <small className="text-muted">Desde {sales.length > 0 ? "el inicio" : "sin ventas"}</small>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-white p-4 rounded shadow-sm border">
            <h5 className="fw-semibold mb-3">📊 Ingresos por Categoría</h5>
            {Object.keys(calcularIngresosPorCategoria()).length === 0 ? (
              <p className="text-muted mb-0">Sin ventas registradas</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {Object.entries(calcularIngresosPorCategoria()).map(([cat, ing]) => (
                  <li key={cat} className="d-flex justify-content-between mb-2">
                    <span>{cat}:</span>
                    <strong className="text-success">${Number(ing).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* HISTORIAL DE VENTAS */}
      <div className="row g-4 mb-4">
        <div className="col-md-12">
          <div className="bg-white p-4 rounded shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0">📝 Historial de Ventas</h5>
              {sales.length > 0 && (
                <button className="btn btn-sm btn-outline-primary" onClick={exportarVentasCSV}>
                  📥 Descargar CSV
                </button>
              )}
            </div>

            {/* Filtros */}
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filtrar por producto..."
                  value={filterProducto}
                  onChange={(e) => setFilterProducto(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filterFecha}
                  onChange={(e) => setFilterFecha(e.target.value)}
                />
              </div>
            </div>

            {/* Tabla de ventas */}
            {ventasFiltradas.length === 0 ? (
              <p className="text-muted text-center mb-0">
                {sales.length === 0 ? "Sin ventas registradas" : "No hay ventas que coincidan con los filtros"}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "20%" }}>Fecha y Hora</th>
                      <th style={{ width: "35%" }}>Producto</th>
                      <th style={{ width: "10%" }} className="text-center">Cantidad</th>
                      <th style={{ width: "15%" }} className="text-end">Precio Unit.</th>
                      <th style={{ width: "15%" }} className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasFiltradas.map((venta, idx) => {
                      const prod = productos.find(p => p.nombre === venta.producto);
                      const precio = prod?.precio || 0;
                      const total = precio * venta.cantidad;
                      return (
                        <tr key={idx}>
                          <td>
                            <small>{formatearFecha(venta.fecha)}</small>
                          </td>
                          <td>
                            <strong>{venta.producto}</strong>
                            {prod && <div className="small text-muted">{prod.categoria}</div>}
                          </td>
                          <td className="text-center">{venta.cantidad}</td>
                          <td className="text-end">${Number(precio).toFixed(2)}</td>
                          <td className="text-end">
                            <strong className="text-success">${Number(total).toFixed(2)}</strong>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Fila de totales */}
                    <tr className="table-light fw-bold">
                      <td colSpan="2">TOTAL ({ventasFiltradas.length} ventas)</td>
                      <td className="text-center">{ventasFiltradas.reduce((a, v) => a + v.cantidad, 0)}</td>
                      <td></td>
                      <td className="text-end text-success">
                        ${Number(ventasFiltradas.reduce((a, v) => {
                          const prod = productos.find(p => p.nombre === v.producto);
                          return a + ((prod?.precio || 0) * v.cantidad);
                        }, 0)).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productos list rendering uses formatStock */}
      <div className="row g-4 mt-4">
        <div className="col-md-7">
          <h4>Productos</h4>
          {loadingProd ? (
            <p>Cargando...</p>
          ) : productos.length === 0 ? (
            <p className="text-muted">No hay productos.</p>
          ) : (
            productos.map((p) => (
              <div
                key={p._id}
                className="list-group-item d-flex justify-content-between mb-2"
              >
                <div>
                  <strong>{p.nombre}</strong>
                  <div className="small text-muted">
                    {p.categoria} • Precio: ${p.precio}
                  </div>
                  <div className="small mt-1">
                    Ingredientes:
                    <ul className="mb-0">
                      {(p.ingredientes || []).map((it) => {
                        const ingrObj = it.ingrediente;
                        const nombre = ingrObj?.nombre || "Desconocido";
                        const unidad = ingrObj?.unidad || "";
                        return (
                          <li key={ingrObj?._id || it.ingrediente}>
                            {nombre} — necesita {Number(it.cantidad).toFixed(3)} {unidad} — stock: {formatStock(ingrObj)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => openSell(p)}
                  >
                    Vender
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteProducto(p._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* right column with forms (unchanged) */}
        <div className="col-md-5">
          <h4>Crear ingrediente</h4>
          <form onSubmit={createIngrediente}>
            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={newIngrediente.nombre}
              onChange={(e) =>
                setNewIngrediente({ ...newIngrediente, nombre: e.target.value })
              }
            />
            <div className="mb-2 d-flex gap-2">
              <select
                className="form-select"
                value={newIngrediente.unidad}
                onChange={(e) =>
                  setNewIngrediente({
                    ...newIngrediente,
                    unidad: e.target.value,
                  })
                }
              >
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="pieza">pieza</option>
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Cantidad inicial"
                value={newIngrediente.cantidad}
                onChange={(e) =>
                  setNewIngrediente({
                    ...newIngrediente,
                    cantidad: e.target.value,
                  })
                }
              />
            </div>
            <input
              className="form-control mb-2"
              placeholder="Descripción (opcional)"
              value={newIngrediente.descripcion}
              onChange={(e) =>
                setNewIngrediente({
                  ...newIngrediente,
                  descripcion: e.target.value,
                })
              }
            />
            <button className="btn btn-primary w-100" disabled={addingIng}>
              {addingIng ? "Creando..." : "Crear ingrediente"}
            </button>
          </form>

          <hr />

          <h4>Crear producto</h4>
          <form onSubmit={createProducto}>
            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={newProducto.nombre}
              onChange={(e) =>
                setNewProducto({ ...newProducto, nombre: e.target.value })
              }
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Precio"
              value={newProducto.precio}
              onChange={(e) =>
                setNewProducto({ ...newProducto, precio: e.target.value })
              }
            />
            <input
              className="form-control mb-2"
              placeholder="Categoría"
              value={newProducto.categoria}
              onChange={(e) =>
                setNewProducto({ ...newProducto, categoria: e.target.value })
              }
            />

            <div
              style={{
                maxHeight: 220,
                overflow: "auto",
                border: "1px solid #eee",
                padding: 8,
                borderRadius: 6,
              }}
            >
              {loadingIng ? (
                <p>Cargando ingredientes...</p>
              ) : ingredientes.length === 0 ? (
                <p>No hay ingredientes</p>
              ) : (
                ingredientes.map((i) => {
                  const selected = newProducto.ingredientes.find(
                    (x) => x.ingrediente === i._id
                  );
                  return (
                    <div
                      key={i._id}
                      className="d-flex align-items-center mb-2"
                      style={{ gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => toggleIngredSeleccion(i._id)}
                      />
                      <div style={{ flex: 1 }}>
                        <strong>{i.nombre}</strong> <small>({i.unidad})</small>{" "}
                        — Stock: {Number(i.cantidad).toFixed(3)}
                      </div>
                      <input
                        disabled={!selected}
                        type="number"
                        step="0.001"
                        placeholder="cantidad"
                        style={{ width: 100 }}
                        className="form-control"
                        value={selected?.cantidad || ""}
                        onChange={(e) =>
                          setIngredCantidad(i._id, e.target.value)
                        }
                      />
                    </div>
                  );
                })
              )}
            </div>
            <button
              className="btn btn-success w-100 mt-2"
              disabled={addingProd}
            >
              {addingProd ? "Creando..." : "Crear producto"}
            </button>
          </form>
        </div>
      </div>

      {/* Ingredientes existentes list (unchanged) and sell modal unchanged */}
      <hr />
      <h4>Ingredientes existentes</h4>
      <div className="list-group">
        {ingredientes.map((i) => (
          <div
            key={i._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              {i.nombre} — Stock: {Number(i.cantidad).toFixed(3)} {i.unidad}
            </div>
            <div>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => recargarStock(i._id)}
              >
                Recargar
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteIngrediente(i._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sell Modal */}
      {sellingProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
          }}
        >
          <div className="bg-white p-4 rounded" style={{ width: 320 }}>
            <h5>Vender {sellingProduct.nombre}</h5>
            {sellError && <div className="alert alert-danger">{sellError}</div>}
            <form onSubmit={submitSell}>
              <input
                type="number"
                min={1}
                className="form-control mb-2"
                value={sellQty}
                onChange={(e) => setSellQty(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success flex-fill"
                  disabled={sellLoading}
                >
                  {sellLoading ? "Procesando..." : "Vender"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill"
                  onClick={() => setSellingProduct(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}