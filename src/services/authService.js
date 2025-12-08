
import { apiGet, apiPost } from "@/services/apiService";

export async function loginService(username, password) {
  await apiPost("/auth/login", { username, password });
}

export async function obtenerUsuarioActualService() {
  const data = await apiGet("/auth/me");
  return data;
}

export async function logoutService() {
  return apiPost("/auth/logout");
}

