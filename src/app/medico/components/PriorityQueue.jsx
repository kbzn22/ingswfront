// app/medico/components/PriorityQueue.jsx
'use client';

export function PriorityQueue({ cola, onAtender, loading }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-slate-900">
                    Cola de espera por prioridad
                </h2>
                <span className="text-[11px] text-slate-500">
                    {loading ? 'Cargando...' : `${cola.length} pacientes en espera`}
                </span>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Paciente</th>
                        <th className="px-3 py-2 text-left font-medium">CUIL</th>
                        <th className="px-3 py-2 text-left font-medium">Nivel</th>
                        <th className="px-3 py-2 text-left font-medium">Estado</th>
                        <th className="px-3 py-2 text-left font-medium">Ingreso</th>
                        <th className="px-3 py-2 text-right font-medium">Acción</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {cola.length === 0 && !loading && (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-3 py-3 text-center text-slate-400 text-xs"
                            >
                                No hay pacientes en la cola.
                            </td>
                        </tr>
                    )}

                    {cola.map((item) => {
                        const nombre = [item.nombre, item.apellido]
                            .filter(Boolean)
                            .join(' ');
                        const cuil = item.cuilPaciente ?? item.cuil ?? '-';
                        const nivel = item.nivel ?? item.prioridad ?? '-';
                        const estado = item.estado ?? item.estadoIngreso ?? 'PENDIENTE';
                        const fecha =
                            item.fechaIngreso ?? item.fecha ?? '';

                        return (
                            <tr key={item.idIngreso ?? item.id}>
                                <td className="px-3 py-2 text-slate-800">{nombre}</td>
                                <td className="px-3 py-2 text-slate-600">{cuil}</td>
                                <td className="px-3 py-2 text-slate-700">{nivel}</td>
                                <td className="px-3 py-2 text-slate-600">{estado}</td>
                                <td className="px-3 py-2 text-slate-500">{fecha}</td>
                                <td className="px-3 py-2 text-right">
                                    <button
                                        onClick={() => onAtender(item)}
                                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium
                                                   bg-sky-600 text-white hover:bg-sky-700"
                                    >
                                        Atender
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
