export async function getProducts() {
  const API_URL = import.meta.env.VITE_API_URL; // https://api.solomigajas.online
  const APP_TOKEN = import.meta.env.VITE_APP_TOKEN;

  const userToken = JSON.parse(localStorage.getItem("usuario")).token;
  if (!userToken) throw new Error("Inicia sesión");

  console.log(`${API_URL}/api/productos`);
  const res = await fetch(`${API_URL}/api/productos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": APP_TOKEN,
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.mensaje || "Error del servidor");
  }

  const data = await res.json();
  return data;
}
