"use client";

export default function BuscarPaciente({ cuil, onCuilChange, onBuscar, error }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ingrese CUIL sin guiones"
          className="border rounded px-2 py-1 flex-1"
          value={cuil}
          onChange={onCuilChange}
        />
        <button
          onClick={onBuscar}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
