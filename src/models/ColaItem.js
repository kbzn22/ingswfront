export function mapColaItem(raw) {
  return {
    idIngreso: raw.idIngreso,
    nombrePaciente: raw.nombrePaciente,
    apellidoPaciente: raw.apellidoPaciente,
    cuilPaciente: raw.cuilPaciente,
    nivel: raw.nivel,
    fechaIngreso: raw.fechaIngreso ? new Date(raw.fechaIngreso) : null,
  };
}
