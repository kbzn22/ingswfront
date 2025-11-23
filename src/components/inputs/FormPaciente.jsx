"use client";

export default function FormPaciente({
  formPaciente,
  setFormPaciente,
  obrasSociales,
  obrasFiltradas,
  busquedaOS,
  setBusquedaOS,
  onSubmit
}) {
  return (
    <div className="border rounded p-3 bg-neutral-50 space-y-2">
      <p className="font-medium">Registrar nuevo paciente</p>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="CUIL"
          className="border rounded px-2 py-1 col-span-2"
          value={formPaciente.cuil}
          onChange={(e) => setFormPaciente({ ...formPaciente, cuil: e.target.value })}
        />

        <input
          type="text"
          placeholder="Nombre"
          className="border rounded px-2 py-1"
          value={formPaciente.nombre}
          onChange={(e) => setFormPaciente({ ...formPaciente, nombre: e.target.value })}
        />

        <input
          type="text"
          placeholder="Apellido"
          className="border rounded px-2 py-1"
          value={formPaciente.apellido}
          onChange={(e) => setFormPaciente({ ...formPaciente, apellido: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded px-2 py-1 col-span-2"
          value={formPaciente.email}
          onChange={(e) => setFormPaciente({ ...formPaciente, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Calle"
          className="border rounded px-2 py-1"
          value={formPaciente.calle}
          onChange={(e) => setFormPaciente({ ...formPaciente, calle: e.target.value })}
        />

        <input
          type="number"
          placeholder="Número"
          className="border rounded px-2 py-1"
          value={formPaciente.numero}
          onChange={(e) => setFormPaciente({ ...formPaciente, numero: e.target.value })}
        />

        <input
          type="text"
          placeholder="Localidad"
          className="border rounded px-2 py-1 col-span-2"
          value={formPaciente.localidad}
          onChange={(e) => setFormPaciente({ ...formPaciente, localidad: e.target.value })}
        />

        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium">Obra Social (opcional)</p>

          <input
            type="text"
            placeholder="Buscar obra social..."
            className="border rounded px-2 py-1 w-full"
            value={busquedaOS}
            onChange={(e) => setBusquedaOS(e.target.value)}
          />

          <select
            className="border rounded px-2 py-1 w-full"
            value={formPaciente.codigo}
            onChange={(e) => {
              const id = e.target.value;
              setFormPaciente((prev) => ({ ...prev, codigo: id }));
            }}
          >
            <option value="">Sin obra social</option>
            {obrasFiltradas.map((os) => (
              <option key={os.id} value={os.id}>
                {os.nombre}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Número Afiliado"
          className="border rounded px-2 py-1 col-span-2"
          value={formPaciente.numeroAfiliado}
          onChange={(e) =>
            setFormPaciente({ ...formPaciente, numeroAfiliado: e.target.value })
          }
        />
      </div>

      <button
        onClick={onSubmit}
        className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Registrar Paciente
      </button>
    </div>
  );
}
