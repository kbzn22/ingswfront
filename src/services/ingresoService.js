import { apiGet, apiPost } from "./apiService";
import { mapIngresoDetalle } from "@/models/Ingreso";

export async function registrarIngresoService(dto) {
  try {
    return await apiPost("/api/ingresos", dto);
  } catch (e) {
    if (!e.message) {
      throw new Error("Error al registrar ingreso.");
    }
    throw e;
  }
}

export async function cargarObrasSocialesService() {
  try {
    return await apiGet("/api/obras-sociales");
  } catch (e) {
    if (!e.message) {
      throw new Error("Error al cargar obras sociales.");
    }
    throw e;
  }
}

export async function buscarIngresoPorId(id) {
  const data = await apiGet(`/api/ingresos/${id}/detalle`);
  if (!data) return null;
  return mapIngresoDetalle(data);
}