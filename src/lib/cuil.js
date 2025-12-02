// Elimina todo lo que no sea dígito
export function limpiarCuil(cuil) {
  if (!cuil) return "";
  return String(cuil).replace(/\D/g, "");
}

// Formatea un string de 11 dígitos a XX-XXXXXXXX-X
export function formatearCuil11(cuilLimpio) {
  const v = limpiarCuil(cuilLimpio);

  if (v.length !== 11) {
    throw new Error("El CUIL debe tener 11 dígitos.");
  }

  return `${v.slice(0, 2)}-${v.slice(2, 10)}-${v.slice(10)}`;
}
