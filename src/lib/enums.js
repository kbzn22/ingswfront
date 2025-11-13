export const NIVEL_EMERGENCIA = [
  { value: 'CRITICA',        label: 'CRÍTICA',        score: 5, color: 'error' },
  { value: 'EMERGENCIA',     label: 'EMERGENCIA',     score: 4, color: 'warning' },
  { value: 'URGENCIA',       label: 'URGENCIA',       score: 3, color: 'primary' },
  { value: 'URGENCIA_MENOR', label: 'URGENCIA MENOR', score: 2, color: 'info' },
  { value: 'SIN_URGENCIA',   label: 'SIN URGENCIA',   score: 1, color: 'default' }
];

export const NIVEL_BY_VALUE = Object.fromEntries(NIVEL_EMERGENCIA.map(n => [n.value, n]));

export const ESTADO_INGRESO = [
  { value: 'PENDIENTE',  label: 'Pendiente',  color: 'default' },
  { value: 'EN_PROCESO', label: 'En proceso', color: 'info' },
  { value: 'FINALIZADO', label: 'Finalizado', color: 'success' }
];

export const ESTADO_BY_VALUE = Object.fromEntries(ESTADO_INGRESO.map(e => [e.value, e]));

export function ordenarIngresos(a, b) {
  const sa = NIVEL_BY_VALUE[a.nivelEmergencia]?.score ?? 0;
  const sb = NIVEL_BY_VALUE[b.nivelEmergencia]?.score ?? 0;
  if (sa !== sb) return sb - sa;
  return a.fechaIngreso - b.fechaIngreso;
}

export function timeAgo(ms) {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'hace instantes';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}
