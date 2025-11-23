export function crearIngresoDTO({
  cuilPaciente,
  informe,
  temperatura,
  frecuenciaCardiaca,
  frecuenciaRespiratoria,
  frecuenciaSistolica,
  frecuenciaDiastolica,
  nivel
}) {
  return {
    cuilPaciente,
    informe,
    temperatura: temperatura !== "" ? parseFloat(temperatura) : null,
    frecuenciaCardiaca: frecuenciaCardiaca !== "" ? parseFloat(frecuenciaCardiaca) : null,
    frecuenciaRespiratoria: frecuenciaRespiratoria !== "" ? parseFloat(frecuenciaRespiratoria) : null,
    frecuenciaSistolica: frecuenciaSistolica !== "" ? parseFloat(frecuenciaSistolica) : null,
    frecuenciaDiastolica: frecuenciaDiastolica !== "" ? parseFloat(frecuenciaDiastolica) : null,
    nivel: parseInt(nivel)
  };
}
