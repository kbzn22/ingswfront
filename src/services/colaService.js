import { apiGet } from "./apiService";
import { mapColaItem } from "@/models/ColaItem";


export async function obtenerColaIngresos() {
  const data = await apiGet("/api/ingresos/cola");
  console.log("DATA COLA:", data);
  if (!data) return [];
  return data.map(mapColaItem);
}

/**
 * GET /api/ingresos/resumen
 * { pendientes, enAtencion, finalizados }
 */
export async function fetchResumen() {
  return apiGet("/api/ingresos/resumen");
}

/**
 * GET /api/ingresos/en-atencion
 * puede devolver null si 204
 */
export async function fetchPacienteEnAtencion() {
  return apiGet("/api/ingresos/en-atencion");
}
