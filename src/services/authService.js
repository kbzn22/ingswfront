const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Llama a /auth/me para verificar si la sesión es válida.
 * Devuelve:
 *   - true si la sesión es válida
 *   - false si no lo es o falla
 */
export async function verificarSesionService() {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return false;
    }

    // Si en algún momento querés usar los datos del usuario:
    // const data = await res.json();
    return true;
  } catch (e) {
    console.error("Error verificando sesión:", e);
    return false;
  }
}
