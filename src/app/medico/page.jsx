// app/medico/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { StatsRow } from './components/StatsRow';
import { CurrentPatientCard } from './components/CurrentPatientCard';
import { PriorityQueue } from './components/PriorityQueue';
import {
    fetchResumen,
    fetchCola,
    fetchPacienteEnAtencion,
} from '@/services/colaService';

import {
    iniciarAtencion,
    finalizarAtencion,
} from '@/services/atencionService';

export default function MedicoPage() {
    const [stats, setStats] = useState(null);           // {pendientes, enAtencion, finalizados}
    const [paciente, setPaciente] = useState(null);     // PacienteEnAtencionDTO | null
    const [cola, setCola] = useState([]);               // List<ColaItemDTO>
    const [informe, setInforme] = useState('');         // texto para finalizar atención
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
        } catch (e) {
            console.error(e);
            setError('No se pudieron cargar los datos del médico.');
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
            // tolerante a id vs idIngreso
            const ingresoId = itemCola.idIngreso ?? itemCola.id;
            if (!ingresoId) {
                throw new Error('Falta id de ingreso en el item de la cola');
            }

            await iniciarAtencion(ingresoId);
            setInforme('');
            await cargarDatos();
        } catch (e) {
            console.error(e);
            setError('No se pudo iniciar la atención del paciente.');
        }
    }

    async function handleFinalizar() {
        if (!paciente) return;
        try {
            setError(null);
            setLoadingFinalizar(true);

            const ingresoId = paciente.idIngreso ?? paciente.id;
            if (!ingresoId) {
                throw new Error('Falta id de ingreso en el paciente en atención');
            }

            await finalizarAtencion(ingresoId, informe || '');
            setInforme('');
            await cargarDatos();
        } catch (e) {
            console.error(e);
            setError('No se pudo finalizar la atención.');
        } finally {
            setLoadingFinalizar(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Panel del médico
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión de pacientes en urgencias y cola de prioridad.
                        </p>
                    </div>
                    <button
                        onClick={cargarDatos}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium
                       border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                    >
                        Actualizar
                    </button>
                </header>

                {error && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        {error}
                    </div>
                )}

                {/* Estadísticas */}
                <StatsRow stats={stats} loading={loading} />

                {/* Paciente en atención */}
                <CurrentPatientCard
                    paciente={paciente}
                    informe={informe}
                    onInformeChange={setInforme}
                    onFinalizar={handleFinalizar}
                    loadingFinalizar={loadingFinalizar}
                />

                {/* Cola de prioridad */}
                <PriorityQueue
                    cola={cola}
                    onAtender={handleAtender}
                    loading={loading}
                />
            </div>
        </div>
    );
}
