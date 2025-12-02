const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export async function buscarPacientePorCuil(cuilFormateado) {
  const res = await fetch(`${BASE_URL}/pacientes/${cuilFormateado}`, {
    credentials: "include",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${res.status} al buscar paciente.`);
  }

  return res.json();
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

  const res = await fetch(`${BASE_URL}/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al registrar paciente.");
  }

  return res.json();
}
