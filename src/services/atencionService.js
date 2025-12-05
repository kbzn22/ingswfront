import { apiPost, apiGet } from './apiService';

// POST /api/medico/{ingresoId}/iniciar
export async function iniciarAtencion(idIngreso) {
    return apiPost(`/api/medico/${idIngreso}/iniciar`);
}

// POST /api/medico/{ingresoId}/finalizar  (body: { informe })
export async function finalizarAtencion(idIngreso, informe) {
    return apiPost(`/api/medico/${idIngreso}/finalizar`, { informe });
}
export async function obtenerAtencionDetalleService(idAtencion) {
    return apiGet(`/api/medico/${idAtencion}`);
}
export async function buscarAtencionPorId(id) {
    return apiGet(`/api/medico/atenciones/${id}`);
}