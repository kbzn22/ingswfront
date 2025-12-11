"use client";

export default function DetalleIngreso({ open, ingreso, onClose }) {
  if (!open || !ingreso) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={onClose} // 👈 click en el fondo cierra
    >
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] rounded-xl shadow-xl p-6 space-y-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 👈 evita que el click dentro cierre
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Detalle del ingreso</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Paciente */}
        <section className="space-y-1 border-b pb-3">
          <h3 className="font-semibold text-lg">Paciente</h3>

          <p className="text-sm text-gray-900">
            <span className="font-medium">Nombre:</span>{" "}
            {ingreso.nombrePaciente || "-"} {ingreso.apellidoPaciente || ""}
          </p>

          <p className="text-sm text-gray-900">
            <span className="font-medium">CUIL:</span>{" "}
            {ingreso.cuilPaciente || "-"}
          </p>

          <p className="text-sm text-gray-900">
            <span className="font-medium">Obra social:</span>{" "}
            {ingreso.paciente.afiliado.obraSocial.nombre || "-"}{" "}
            {ingreso.paciente.afiliado.numeroAfiliado && `(${ingreso.paciente.afiliado.numeroAfiliado})`}
          </p>
        </section>

        {/* Enfermera */}
        <section className="space-y-1 border-b pb-3">
          <h3 className="font-semibold text-lg">Cargado por</h3>

          <p className="text-sm text-gray-900">
            <span className="font-medium">Enfermera:</span>{" "}
            {ingreso.nombreEnfermera || "-"} {ingreso.apellidoEnfermera || ""}
          </p>

          <p className="text-sm text-gray-900">
            <span className="font-medium">CUIL:</span>{" "}
            {ingreso.cuilEnfermera || "-"}
          </p>
        </section>

        {/* Datos de ingreso */}
        <section className="grid grid-cols-2 gap-y-2 text-sm border-b pb-3">
          <div>
            <span className="font-medium">Nivel:</span>
            <p>
              {ingreso.nivel} ·{" "}
              <span className="text-gray-700">{ingreso.nombreNivel}</span>
            </p>
          </div>

          <div>
            <span className="font-medium">Estado:</span>
            <p>{ingreso.estado}</p>
          </div>

          <div>
            <span className="font-medium">Fecha ingreso:</span>
            <p>
              {ingreso.fechaIngreso
                ? new Date(ingreso.fechaIngreso).toLocaleString("es-AR")
                : "-"}
            </p>
          </div>
        </section>

        {/* Signos vitales */}
        <section className="space-y-1 border-b pb-3">
          <h3 className="font-semibold text-lg">Signos vitales</h3>

          <p className="text-sm">
            Temperatura: {ingreso.temperatura ?? "-"} °C
          </p>
          <p className="text-sm">
            Frec. cardíaca: {ingreso.frecuenciaCardiaca ?? "-"} lpm
          </p>
          <p className="text-sm">
            Frec. respiratoria: {ingreso.frecuenciaRespiratoria ?? "-"} rpm
          </p>
          <p className="text-sm">
            Tensión arterial:{" "}
            {ingreso.sistolica && ingreso.diastolica
              ? `${ingreso.sistolica}/${ingreso.diastolica} mmHg`
              : "-"}
          </p>
        </section>

        {/* Informe */}
        <section>
          <h3 className="font-semibold text-lg">Motivo / informe</h3>
          <p className="text-sm whitespace-pre-line text-gray-900">
            {ingreso.informe || "-"}
          </p>
        </section>
      </div>
    </div>
  );
}