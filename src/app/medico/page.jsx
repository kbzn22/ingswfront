// app/medico/page.jsx
"use client";

import { useEffect, useState } from "react";
import { StatsRow } from "./components/StatsRow";
import { CurrentPatientCard } from "./components/CurrentPatientCard";
import { PriorityQueue } from "./components/PriorityQueue";
import {
    obtenerColaIngresos,
    obtenerResumen,
    fetchPacienteEnAtencion,
} from "@/services/colaService";
import { iniciarAtencion, finalizarAtencion } from "@/services/atencionService";
import { buscarIngresoPorId } from "@/services/ingresoService";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function MedicoPage() {
    const [stats, setStats] = useState(null);
    const [paciente, setPaciente] = useState(null);   // PacienteEnAtencionDTO
    const [detalle, setDetalle] = useState(null);     // DetalleIngresoDTO
    const [cola, setCola] = useState([]);
    const [informe, setInforme] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingFinalizar, setLoadingFinalizar] = useState(false);
    const [error, setError] = useState(null);

    const { usuario, checking } = useRoleGuard(["DOCTOR"]);

    async function cargarDatos() {
        try {
            setLoading(true);
            setError(null);

            const [resumen, colaResp, pacienteActual] = await Promise.all([
                obtenerResumen(),
                obtenerColaIngresos(),
                fetchPacienteEnAtencion(),
            ]);

            setStats(resumen ?? null);
            setCola(colaResp ?? []);
            setPaciente(pacienteActual ?? null);

            if (pacienteActual) {
                const ingresoId = pacienteActual.idIngreso ?? pacienteActual.id;
                if (ingresoId) {
                    const det = await buscarIngresoPorId(ingresoId);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            console.error("Error al iniciar atención:", e);

            const msg = e?.message || "No se pudo iniciar la atención del paciente.";

            if (msg.toLowerCase().includes("el doctor ya tiene un paciente en atencion")) {
                setError("Ya tenés un paciente en atención. Primero finalizá esa atención.");
            } else {
                setError(msg);
            }
        }
    }

    async function handleFinalizar() {
        if (!paciente) return;

        try {
            setError(null);
            setLoadingFinalizar(true);

            if (!informe || informe.trim() === "") {
                setError("El informe no puede estar vacío.");
                return;
            }

            const ingresoId = paciente.idIngreso ?? paciente.id;
            if (!ingresoId) throw new Error("Falta id de ingreso en el paciente en atención");

            await finalizarAtencion(ingresoId, informe);
            await cargarDatos();
        } catch (e) {
            console.error(e);
            setError("No se pudo finalizar la atención.");
        } finally {
            setLoadingFinalizar(false);
        }
    }

    if (checking || !usuario) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50">
                <p>Verificando acceso...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-slate-50">
            <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">



            {/* IZQUIERDA: resumen + paciente en atención */}
                <section className="w-full md:w-1/2 h-full bg-white rounded-2xl shadow-sm p-4 space-y-4">


                <header className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-900">
                            Panel del médico
                        </h1>

                    </header>

                    {/* Stats en la parte superior */}
                    <StatsRow stats={stats} loading={loading} />



                    {/* Paciente actual en una card linda */}
                    <CurrentPatientCard
                        paciente={paciente}
                        detalle={detalle}
                        informe={informe}
                        onInformeChange={setInforme}
                        onFinalizar={handleFinalizar}
                        loadingFinalizar={loadingFinalizar}
                        error={error}
                    />
                </section>

                {/* DERECHA: cola de pacientes */}
                <section className="w-full md:w-3/4 bg-white rounded-2xl shadow-sm p-4 flex flex-col">
                    <div className="flex-1 flex items-start">
                        <PriorityQueue cola={cola} onAtender={handleAtender} loading={loading} />
                    </div>
                </section>
            </div>
        </main>
    );
}
