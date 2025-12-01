// app/medico/medicoApi.js
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function headers() {
    return {
        'Content-Type': 'application/json',
        // acá en el futuro agregás token, cookie, etc.
    };
}

async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'GET',
        headers: headers(),
        cache: 'no-store',
    });

    // Si el back responde 204 (sin contenido), devolvemos null
    if (res.status === 204) return null;

    if (!res.ok) {
        throw new Error(`Error GET ${path}: ${res.status}`);
    }

    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: headers(),
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`Error POST ${path}: ${res.status}`);
    }

    // por si algún endpoint responde 204
    if (res.status === 204) return null;

    return res.json();
}

// ================== INGRESOS (cola / resumen) ==================

// GET /api/ingresos/resumen -> ResumenColaDTO {pendientes, enAtencion, finalizados}
export async function fetchResumen() {
    return apiGet('/api/ingresos/resumen');
}

// GET /api/ingresos/cola -> List<ColaItemDTO>
export async function fetchCola() {
    return apiGet('/api/ingresos/cola');
}

// GET /api/ingresos/en-atencion -> PacienteEnAtencionDTO | null
export async function fetchPacienteEnAtencion() {
    return apiGet('/api/ingresos/en-atencion');
}

// ================== ATENCIÓN (médico) ==================

// POST /api/medico/{ingresoId}/iniciar
export async function iniciarAtencion(idIngreso) {
    return apiPost(`/api/medico/${idIngreso}/iniciar`);
}

// POST /api/medico/{ingresoId}/finalizar  (body: { informe })
export async function finalizarAtencion(idIngreso, informe) {
    return apiPost(`/api/medico/${idIngreso}/finalizar`, { informe });
}
