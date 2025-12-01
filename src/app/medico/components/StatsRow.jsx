// app/medico/components/StatsRow.jsx
'use client';

export function StatsRow({ stats, loading }) {
    const pendientes  = stats?.pendientes  ?? 0;
    const enAtencion  = stats?.enAtencion  ?? 0;
    const finalizados = stats?.finalizados ?? 0;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
                label="En espera"
                value={loading ? '...' : pendientes}
            />
            <StatCard
                label="En atención"
                value={loading ? '...' : enAtencion}
            />
            <StatCard
                label="Finalizados hoy"
                value={loading ? '...' : finalizados}
            />
        </section>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-lg font-semibold text-slate-900">{value}</span>
        </div>
    );
}
