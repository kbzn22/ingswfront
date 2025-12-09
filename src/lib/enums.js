export const NIVEL_EMERGENCIA = [
  { value: "CRITICA",        label: "CRÍTICA",         numero: 1 },
  { value: "EMERGENCIA",     label: "EMERGENCIA",   numero: 2 },
  { value: "URGENCIA",       label: "URGENCIA",    numero: 3 },
  { value: "URGENCIA_MENOR", label: "URGENCIA MENOR", numero: 4 },
  { value: "SIN_URGENCIA",   label: "SIN URGENCIA",    numero: 5 },
];

// Colores de la GUI por número
const NIVEL_COLORS = {
  1: { color: "#ef4444", bg: "#fee2e2", border: "#fecaca" },
  2: { color: "#f97316", bg: "#ffedd5", border: "#fed7aa" },
  3: { color: "#eab308", bg: "#fef9c3", border: "#fef08a" },
  4: { color: "#22c55e", bg: "#dcfce7", border: "#bbf7d0" },
  5: { color: "#3b82f6", bg: "#dbeafe", border: "#bfdbfe" },
};

// Mapa numero → info completa (enum + colores)
export const NIVEL_EMERGENCIA_INFO = NIVEL_EMERGENCIA.reduce((acc, nivel) => {
  acc[nivel.numero] = {
    ...nivel,              // value, label, numero
    ...NIVEL_COLORS[nivel.numero],
  };
  return acc;
}, {});

// Helper opcional, por si querés buscar por numero
export function getNivelEmergenciaInfo(numero) {
  return NIVEL_EMERGENCIA_INFO[numero] ?? null;
}
