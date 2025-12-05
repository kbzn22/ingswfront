// src/app/admin/components/ExportLogsSection.jsx
"use client";

import { useState } from "react";
import { API_URL } from "@/services/apiService";

export function ExportLogsSection() {
    const [tipo, setTipo] = useState("ingresos"); // "ingresos" | "atenciones"
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [cuilPaciente, setCuilPaciente] = useState("");
    const [cuilEnfermera, setCuilEnfermera] = useState("");
    const [cuilDoctor, setCuilDoctor] = useState("");
    const [error, setError] = useState("");

    async function handleExport(e) {
        e.preventDefault();
        setError("");

        if (!desde || !hasta) {
            setError("Debés indicar fechas desde y hasta.");
            return;
        }

        const params = new URLSearchParams({
            desde,
            hasta,
        });

        if (tipo === "ingresos") {
            if (cuilPaciente) params.append("cuilPaciente", cuilPaciente);
            if (cuilEnfermera) params.append("cuilEnfermera", cuilEnfermera);
        } else {
            if (cuilDoctor) params.append("cuilDoctor", cuilDoctor);
            if (cuilPaciente) params.append("cuilPaciente", cuilPaciente);
        }

        const url = `${API_URL}/admin/logs/${tipo}?${params.toString()}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) {
                throw new Error("Error al generar el archivo");
            }

            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download =
                (tipo === "ingresos" ? "ingresos_" : "atenciones_") +
                desde +
                "_" +
                hasta +
                ".csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (e) {
            console.error(e);
            setError(e.message || "No se pudo descargar el archivo.");
        }
    }

    return (
        <section className="mt-8 bg-white rounded-xl shadow-sm p-4 space-y-4">
            <h2 className="text-lg font-semibold">Exportar logs</h2>

            <div className="flex gap-3 text-sm">
                <button
                    type="button"
                    onClick={() => setTipo("ingresos")}
                    className={`px-3 py-1 rounded-full border ${
                        tipo === "ingresos"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300"
                    }`}
                >
                    Ingresos
                </button>
                <button
                    type="button"
                    onClick={() => setTipo("atenciones")}
                    className={`px-3 py-1 rounded-full border ${
                        tipo === "atenciones"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300"
                    }`}
                >
                    Atenciones
                </button>
            </div>

            <form onSubmit={handleExport} className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-3">
                    <div>
                        <label className="block text-xs text-slate-600 mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-600 mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>

                {/* Filtros según tipo */}
                {tipo === "ingresos" ? (
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">
                                CUIL paciente (opcional)
                            </label>
                            <input
                                type="text"
                                value={cuilPaciente}
                                onChange={(e) => setCuilPaciente(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">
                                CUIL enfermera (opcional)
                            </label>
                            <input
                                type="text"
                                value={cuilEnfermera}
                                onChange={(e) => setCuilEnfermera(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">
                                CUIL doctor (opcional)
                            </label>
                            <input
                                type="text"
                                value={cuilDoctor}
                                onChange={(e) => setCuilDoctor(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 mb-1">
                                CUIL paciente (opcional)
                            </label>
                            <input
                                type="text"
                                value={cuilPaciente}
                                onChange={(e) => setCuilPaciente(e.target.value)}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                )}

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                    type="submit"
                    className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                >
                    Descargar CSV
                </button>
            </form>
        </section>
    );
}
