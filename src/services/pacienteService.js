// src/services/pacienteService.js
import { apiGet, apiPost } from "@/services/apiService";

export async function buscarPacientePorCuil(cuilFormateado) {
  // backend: GET /api/pacientes/{cuil}
  try {
    return await apiGet(`/api/pacientes/${cuilFormateado}`);
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function registrarPacienteService(formPaciente) {
  const body = {
    cuilPaciente: formPaciente.cuil,
    nombre: formPaciente.nombre,
    apellido: formPaciente.apellido,
    email: formPaciente.email,
    calle: formPaciente.calle,
    numero: parseInt(formPaciente.numero),
    localidad: formPaciente.localidad,
    ...(formPaciente.codigo && { idObraSocial: formPaciente.codigo }),
    ...(formPaciente.codigo && { numeroAfiliado: formPaciente.numeroAfiliado }),
  };

  return apiPost("/api/pacientes", body);
}
