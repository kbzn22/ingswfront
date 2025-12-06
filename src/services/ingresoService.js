const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
import { apiGet, apiPost } from "./apiService";
import { mapIngresoDetalle } from "@/models/Ingreso";

/**
 * Registra un ingreso en el backend.
 * dto: objeto ya armado por crearIngresoDTO
 * Devuelve el ingreso creado (JSON).
 */
export async function registrarIngresoService(dto) {
  const res = await fetch(`${BASE_URL}/ingresos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // importante si usás cookie de sesión
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    let msg = "Error al registrar ingreso.";
    try {
      const err = await res.json();
      if (err && err.message) {
        msg = err.message;
      }
    } catch (_) {
      // ignoramos error de parseo
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function cargarObrasSocialesService() {
  const res = await fetch(`${BASE_URL}/obras-sociales`, {
    method: "GET",
    // credentials: "include", // si algún día lo protegés con cookie, lo activás
  });

  if (!res.ok) {
    let msg = "Error al cargar obras sociales.";
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        msg = errorData.message;
      }
    } catch (_) {
      // ignoramos error al parsear JSON
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function buscarIngresoPorId(id) {
  const data = await apiGet(`/api/ingresos/${id}/detalle`); // 👈 OJO: sin /detalle
  if (!data) return null;
  return mapIngresoDetalle(data);
}
