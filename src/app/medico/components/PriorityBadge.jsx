const NIVEL_LABEL = {
    1: 'Crítica',
    2: 'Emergencia',
    3: 'Urgencia',
    4: 'Urgencia Menor',
};

const NIVEL_STYLE = {
    1: 'bg-red-100 text-red-700 border-red-200',
    2: 'bg-orange-100 text-orange-700 border-orange-200',
    3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export function PriorityBadge({ nivel }) {
    const label = NIVEL_LABEL[nivel] ?? 'Sin dato';
    const style = NIVEL_STYLE[nivel] ?? 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
    );
}
