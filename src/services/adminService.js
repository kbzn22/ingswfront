// src/services/adminService.js
import { API_URL, apiPost } from "@/services/apiService";


// Registro de personal (ya lo venías usando)
export async function registrarPersonalAdmin(payload) {
    return apiPost("/api/admin/personal/register", payload);
}

// Exportar ingresos a Excel
export async function exportIngresosLog({ desde, hasta, cuilPaciente, cuilEnfermera }) {
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    if (cuilPaciente) params.append("cuilPaciente", cuilPaciente);
    if (cuilEnfermera) params.append("cuilEnfermera", cuilEnfermera);

    const res = await fetch(`${API_URL}/admin/logs/ingresos/export?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Error al exportar ingresos: ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ingresos_${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}


export async function exportAtencionesLog({ desde, hasta, cuilDoctor, cuilPaciente }) {
    const params = new URLSearchParams();
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);
    if (cuilDoctor) params.append("cuilDoctor", normalizeCuil(cuilDoctor));
    if (cuilPaciente) params.append("cuilPaciente", normalizeCuil(cuilPaciente));

    const res = await fetch(`${API_URL}/admin/logs/atenciones/export?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Error al exportar atenciones: ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atenciones_${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
