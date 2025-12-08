// app/medico/components/CurrentPatientCard.jsx
"use client";

const NIVEL_INFO = {
    1: { nombre: "Crítica",        color: "#ef4444", bg: "#fee2e2", border: "#fecaca" },
    2: { nombre: "Emergencia",     color: "#f97316", bg: "#ffedd5", border: "#fed7aa" },
    3: { nombre: "Urgencia",       color: "#eab308", bg: "#fef9c3", border: "#fef08a" },
    4: { nombre: "Urgencia menor", color: "#22c55e", bg: "#dcfce7", border: "#bbf7d0" },
    5: { nombre: "Sin urgencia",   color: "#3b82f6", bg: "#dbeafe", border: "#bfdbfe" },
};

export function CurrentPatientCard({
                                       paciente,
                                       detalle,
                                       informe,
                                       onInformeChange,
                                       onFinalizar,
                                       loadingFinalizar,
                                       error,
                                   }) {
    if (!paciente) {
        return (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h2 className="text-base font-semibold text-slate-900 mb-1">
                    Paciente en atención
                </h2>
                <p className="text-sm text-slate-500">
                    No hay ningún paciente en atención en este momento.
                </p>
            </section>
        );
    }

    const d = detalle || {};

    const nombrePaciente =
  (d.nombrePaciente || d.apellidoPaciente)
    ? [d.nombrePaciente, d.apellidoPaciente].filter(Boolean).join(" ")
    : ([paciente.nombre, paciente.apellido].filter(Boolean).join(" ") || "Paciente");   

    const cuilPaciente = d.cuilPaciente ?? paciente.cuil ?? "-";
    const obraSocial = d.obraSocial ?? "-";
    const numeroAfiliado = d.numeroAfiliado ?? "-";

    const nombreEnfermera =
        d.nombreEnfermera || d.apellidoEnfermera
            ? `${d.nombreEnfermera ?? ""} ${d.apellidoEnfermera ?? ""}`.trim()
            : "-";
    const cuilEnfermera = d.cuilEnfermera ?? "-";

    const nivel = d.nivel ?? paciente.nivel ?? "-";
    const nombreNivel = d.nombreNivel ?? "";

    const nivelNumero = Number(nivel);
    const nivelInfo = NIVEL_INFO[nivelNumero] || null;

    const fechaIngreso =
        d.fechaIngreso || paciente.fechaIngreso
            ? new Date(d.fechaIngreso || paciente.fechaIngreso).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "medium",
            })
            : "-";

    const temperatura = d.temperatura ?? "-";
    const fc = d.frecuenciaCardiaca ?? "-";
    const fr = d.frecuenciaRespiratoria ?? "-";
    const sist = d.sistolica ?? "-";
    const diast = d.diastolica ?? "-";

    const informeInicial =
        d.informe && d.informe.trim().length > 0
            ? d.informe
            : paciente.informe && paciente.informe.trim().length > 0
                ? paciente.informe
                : "Sin informe inicial registrado.";

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
            {/* Título + estado/nivel */}
            <header className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Detalle del ingreso
                    </h2>
                    <p className="text-xs text-slate-500">Paciente en atención</p>
                </div>

                {nivelInfo ? (
                    <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-medium"
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
                        {`Nivel ${nivelNumero} · ${nivelInfo.nombre} · En curso`}
          </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
            En curso
          </span>
                )}
            </header>

            {/* PACIENTE */}
            <div className="border-b border-slate-200 pb-2 space-y-1 text-sm">
                <p className="font-semibold text-slate-800">Paciente</p>
                <p>
                    <span className="font-medium">Nombre:</span> {nombrePaciente}
                </p>
                <p>
                    <span className="font-medium">CUIL:</span> {cuilPaciente}
                </p>
                <p>
                    <span className="font-medium">Obra social:</span> {obraSocial}
                    {obraSocial !== "-" && numeroAfiliado !== "-" && <> ({numeroAfiliado})</>}
                </p>
            </div>

            {/* ENFERMERA + NIVEL/FECHA */}
            <div className="border-b border-slate-200 pb-3 text-sm space-y-2">
                <div>
                    <p className="font-semibold text-slate-800">Cargado por</p>
                    <p>
                        <span className="font-medium">Enfermera:</span> {nombreEnfermera}
                    </p>
                    <p>
                        <span className="font-medium">CUIL:</span> {cuilEnfermera}
                    </p>
                </div>

                <div className="flex  gap-4 mt-2 text-sm">

                    <div className="text-left">
                        <p className="font-medium text-slate-700">Fecha ingreso</p>
                        <p className="text-slate-800">{fechaIngreso}</p>
                    </div>
                </div>
            </div>

            {/* SIGNOS VITALES */}
            <div className="border-b border-slate-200 pb-3 text-sm space-y-1">
                <p className="font-semibold text-slate-800">Signos vitales</p>

                <p>
                    <span className="font-semibold">Temperatura:</span> {temperatura} °C
                </p>

                <p>
                    <span className="font-semibold">Frec. cardíaca:</span> {fc} lpm
                </p>

                <p>
                    <span className="font-semibold">Frec. respiratoria:</span> {fr} rpm
                </p>

                <p>
                    <span className="font-semibold">Tensión arterial:</span>{" "}
                    {sist !== "-" && diast !== "-" ? `${sist}/${diast} mmHg` : "-"}
                </p>
            </div>

            {/* MOTIVO / INFORME INICIAL */}
            <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-800">Motivo / informe inicial</p>
                <p className="text-slate-700 whitespace-pre-wrap">{informeInicial}</p>
            </div>

            {/* INFORME FINAL */}
            <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                    Informe de atención (médico)
                </label>
                <textarea
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                     min-h-[70px] max-h-[130px] resize-vertical"
                    placeholder="Escribí aquí el informe final de la atención…"
                    value={informe}
                    onChange={(e) => onInformeChange(e.target.value)}
                />
                {error && (
                    <p className="text-xs text-red-600 mt-1">
                        {error}
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onFinalizar}
                    disabled={loadingFinalizar}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium
                     bg-emerald-600 text-white hover:bg-emerald-700
                     disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loadingFinalizar ? "Finalizando…" : "Finalizar atención"}
                </button>
            </div>
        </section>
    );
}
