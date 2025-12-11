import { API_URL, apiPost } from "@/services/apiService";

export async function registrarPersonalAdmin(payload) {
    return apiPost("/api/admin/personal/register", payload);
}

export async function exportIngresosLog({ desde, hasta, cuilPaciente, cuilEnfermera }) {
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    if (cuilPaciente) params.append("cuilPaciente", cuilPaciente);
    if (cuilEnfermera) params.append("cuilEnfermera", cuilEnfermera);

    const res = await fetch(
        `${API_URL}/api/admin/logs/ingresos/export?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
        }
    );
    // ...
}

export async function exportAtencionesLog({ desde, hasta, cuilDoctor, cuilPaciente }) {
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    if (cuilDoctor) params.append("cuilDoctor", normalizeCuil(cuilDoctor));
    if (cuilPaciente) params.append("cuilPaciente", normalizeCuil(cuilPaciente));

    const res = await fetch(
        `${API_URL}/api/admin/logs/atenciones/export?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
        }
    );
    // ...
}
