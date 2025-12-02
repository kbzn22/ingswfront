const BASE_URL = "http://localhost:8080/api";

import { mapColaItem } from "@/models/ColaItem";

export async function fetchCola() {
  const res = await fetch(`${BASE_URL}/ingresos/cola`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al obtener la cola de ingresos.");
  }

  const data = await res.json();
  return data.map(mapColaItem);
}
