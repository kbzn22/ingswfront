
import { apiGet, apiPost } from "@/services/apiService";

export async function obtenerUsuarioActualService() {
  return apiGet("/auth/me");
}

export async function logoutService() {
  return apiPost("/auth/logout");
}

// ya tenías algo así:
export async function verificarSesionService() {
  try {
    await apiGet("/auth/verificar");
    return true;
  } catch {
    return false;
  }
}
