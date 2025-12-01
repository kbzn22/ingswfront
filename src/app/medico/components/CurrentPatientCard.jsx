// app/medico/components/CurrentPatientCard.jsx
'use client';

export function CurrentPatientCard({
                                       paciente,
                                       informe,
                                       onInformeChange,
                                       onFinalizar,
                                       loadingFinalizar,
                                   }) {
    const hayPaciente = !!paciente;

    const nombreCompleto = hayPaciente
        ? [paciente.nombre, paciente.apellido].filter(Boolean).join(' ')
        : 'Sin paciente en atención';

    const nivel = hayPaciente ? paciente.nivel ?? paciente.prioridad ?? '-' : '-';
    const estado = hayPaciente ? paciente.estado ?? 'EN_PROCESO' : '-';
    const cuil = hayPaciente ? (paciente.cuil ?? paciente.cuilPaciente ?? '-') : '-';
    const fecha = hayPaciente
        ? (paciente.fechaIngreso ?? paciente.fecha ?? '')
        : '';

    return (
        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Paciente en atención
                    </h2>
                    <p className="text-base font-medium text-slate-800">
                        {nombreCompleto}
                    </p>
                    <p className="text-xs text-slate-500">
                        CUIL: {cuil}
                    </p>
                    <p className="text-xs text-slate-500">
                        Nivel de urgencia: {nivel} · Estado: {estado}
                    </p>
                    {fecha && (
                        <p className="text-xs text-slate-400">
                            Ingreso: {fecha}
                        </p>
                    )}
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                    {hayPaciente ? 'En curso' : 'Sin paciente'}
                </span>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                    Informe de atención
                </label>
                <textarea
                    value={informe}
                    onChange={(e) => onInformeChange(e.target.value)}
                    placeholder={
                        hayPaciente
                            ? 'Escribí aquí el informe para finalizar la atención...'
                            : 'No hay paciente en atención.'
                    }
                    disabled={!hayPaciente || loadingFinalizar}
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 outline-none
                               disabled:bg-slate-50 disabled:text-slate-400
                               focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                    rows={3}
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onFinalizar}
                    disabled={!hayPaciente || loadingFinalizar}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium
                               bg-emerald-600 text-white hover:bg-emerald-700
                               disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {loadingFinalizar ? 'Finalizando...' : 'Finalizar atención'}
                </button>
            </div>
        </section>
    );
}
