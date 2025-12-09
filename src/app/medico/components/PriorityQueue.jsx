"use client";

const NIVEL_INFO = {
    1: { nombre: "Crítica", color: "#ef4444", bg: "#fee2e2", border: "#fecaca" },
    2: { nombre: "Emergencia", color: "#f97316", bg: "#ffedd5", border: "#fed7aa" },
    3: { nombre: "Urgencia", color: "#eab308", bg: "#fef9c3", border: "#fef08a" },
    4: { nombre: "Urgencia menor", color: "#22c55e", bg: "#dcfce7", border: "#bbf7d0" },
    5: { nombre: "Sin urgencia", color: "#3b82f6", bg: "#dbeafe", border: "#bfdbfe" },
};

export function PriorityQueue({ cola, onAtender, loading }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-slate-900">
                    Cola de espera por prioridad
                </h2>
                <span className="text-[11px] text-slate-500">
                    {loading ? "Cargando..." : `${cola.length} pacientes en espera`}
                </span>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="min-w-full text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Paciente</th>
                        <th className="px-3 py-2 text-left font-medium">CUIL</th>
                        <th className="px-3 py-2 text-left font-medium">Nivel</th>
                        <th className="px-3 py-2 text-left font-medium">Ingreso</th>
                        <th className="px-3 py-2 text-right font-medium">Acción</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {cola.length === 0 && !loading && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-3 py-3 text-center text-slate-400 text-xs"
                            >
                                No hay pacientes en la cola.
                            </td>
                        </tr>
                    )}

                    {cola.map((item, index) => {
                        const nombre = [item.nombre, item.apellido]
                            .filter(Boolean)
                            .join(" ");

                        const cuil = item.cuilPaciente ?? item.cuil ?? "-";

                        const nivelNumero = Number(item.nivel ?? item.prioridad);
                        const nivelInfo = NIVEL_INFO[nivelNumero] || null;

                        const fecha = item.fechaIngreso
                            ? new Date(item.fechaIngreso).toLocaleString("es-AR", {
                                dateStyle: "short",
                                timeStyle: "short",
                            })
                            : "-";

                        return (
                            <tr key={item.idIngreso ?? item.id}>
                                {/* PACIENTE */}
                                <td className="px-3 py-2 text-slate-800">{nombre}</td>

                                {/* CUIL */}
                                <td className="px-3 py-2 text-slate-600">{cuil}</td>

                                {/* NIVEL */}
                                <td className="px-3 py-2">
                                    {nivelInfo ? (
                                        <div className="space-y-1">
                                            {/* PILL DE NIVEL */}
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px]"
                                                style={{
                                                    backgroundColor: nivelInfo.bg,
                                                    borderColor: nivelInfo.border,
                                                    color: "#0f172a",
                                                }}
                                            >
                                                    <span
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: "999px",
                                                            backgroundColor: nivelInfo.color,
                                                        }}
                                                    />
                                                {`Nivel ${nivelNumero} · ${nivelInfo.nombre}`}
                                                </span>


                                        </div>
                                    ) : (
                                        <span className="text-slate-500">-</span>
                                    )}
                                </td>

                                {/* FECHA INGRESO */}
                                <td className="px-3 py-2 text-slate-500">{fecha}</td>

                                {/* ACCIÓN */}
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