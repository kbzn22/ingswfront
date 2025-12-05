// app/medico/page.jsx
"use client";

import { useEffect, useState } from "react";
import { StatsRow } from "./components/StatsRow";
import { CurrentPatientCard } from "./components/CurrentPatientCard";
import { PriorityQueue } from "./components/PriorityQueue";
import {
    fetchResumen,
    fetchCola,
    fetchPacienteEnAtencion,
} from "@/services/colaService";
import {
    iniciarAtencion,
    finalizarAtencion,
} from "@/services/atencionService";
import { obtenerIngresoDetalleService } from "@/services/ingresoService";

export default function MedicoPage() {
    const [stats, setStats] = useState(null);
    const [paciente, setPaciente] = useState(null);   // PacienteEnAtencionDTO
    const [detalle, setDetalle] = useState(null);     // <-- DetalleIngresoDTO
    const [cola, setCola] = useState([]);
    const [informe, setInforme] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingFinalizar, setLoadingFinalizar] = useState(false);
    const [error, setError] = useState(null);

    async function cargarDatos() {
        try {
            setLoading(true);
            setError(null);

            const [resumen, colaResp, pacienteActual] = await Promise.all([
                fetchResumen(),
                fetchCola(),
                fetchPacienteEnAtencion(),
            ]);

            setStats(resumen ?? null);
            setCola(colaResp ?? []);
            setPaciente(pacienteActual ?? null);

            // 👉 si hay paciente en atención, traigo el detalle completo
            if (pacienteActual) {
                const ingresoId = pacienteActual.idIngreso ?? pacienteActual.id;
                if (ingresoId) {
                    const det = await obtenerIngresoDetalleService(ingresoId);
                    setDetalle(det);
                } else {
                    setDetalle(null);
                }
            } else {
                setDetalle(null);
            }
        } catch (e) {
            console.error(e);
            setError("No se pudieron cargar los datos del médico.");
            setDetalle(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    async function handleAtender(itemCola) {
        try {
            setError(null);
            const ingresoId = itemCola.idIngreso ?? itemCola.id;
            if (!ingresoId) throw new Error("Falta id de ingreso en el item de la cola");

            await iniciarAtencion(ingresoId);
            setInforme("");
            await cargarDatos();
        } catch (e) {
            console.error(e);
            setError("No se pudo iniciar la atención del paciente.");
        }
    }

    async function handleFinalizar() {
        if (!paciente) return;
        try {
            setError(null);
            setLoadingFinalizar(true);

            const ingresoId = paciente.idIngreso ?? paciente.id;
            if (!ingresoId) throw new Error("Falta id de ingreso en el paciente en atención");

            await finalizarAtencion(ingresoId, informe || "");
            setInforme("");
            await cargarDatos();
        } catch (e) {
            console.error(e);
            setError("No se pudo finalizar la atención.");
        } finally {
            setLoadingFinalizar(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* header, errores y StatsRow los dejás igual */}

                <StatsRow stats={stats} loading={loading} />

                {/* Paciente en atención con ficha de detalle */}
                <CurrentPatientCard
                    paciente={paciente}
                    detalle={detalle}
                    informe={informe}
                    onInformeChange={setInforme}
                    onFinalizar={handleFinalizar}
                    loadingFinalizar={loadingFinalizar}
                />

                <PriorityQueue cola={cola} onAtender={handleAtender} loading={loading} />
            </div>
        </div>
    );
}
