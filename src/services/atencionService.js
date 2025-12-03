import { apiPost } from './apiService';

// POST /api/medico/{ingresoId}/iniciar
export async function iniciarAtencion(idIngreso) {
    return apiPost(`/api/medico/${idIngreso}/iniciar`);
}

// POST /api/medico/{ingresoId}/finalizar  (body: { informe })
export async function finalizarAtencion(idIngreso, informe) {
    return apiPost(`/api/medico/${idIngreso}/finalizar`, { informe });
}
