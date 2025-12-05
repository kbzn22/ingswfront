// src/app/admin/page.jsx
"use client";

import { useState } from "react";
import {
    registrarPersonalAdmin,
    exportIngresosLog,
    exportAtencionesLog,
} from "@/services/adminService";
import { logoutService } from "@/services/authService";
import { buscarIngresoPorId } from "@/services/ingresoService";
import { buscarAtencionPorId } from "@/services/atencionService";

function formatFecha(fecha) {
    if (!fecha) return "-";
    try {
        return new Date(fecha).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "medium",
        });
    } catch {
        return fecha;
    }
}

export default function AdminPage() {
    // ---------- Registro de personal ----------
    const [form, setForm] = useState({
        cuil: "",
        nombre: "",
        apellido: "",
        email: "",
        matricula: "",
        rol: "DOCTOR",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [usuarioGenerado, setUsuarioGenerado] = useState(null);

    // ---------- Export logs ----------
    const [filtrosLog, setFiltrosLog] = useState({
        tipo: "INGRESOS", // INGRESOS | ATENCIONES
        desde: "",
        hasta: "",
        cuilPaciente: "",
        cuilEnfermera: "",
        cuilDoctor: "",
    });
    const [exportError, setExportError] = useState("");
    const [exportLoading, setExportLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleFiltrosChange(e) {
        const { name, value } = e.target;
        setFiltrosLog((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMensaje("");
        setUsuarioGenerado(null);
        setLoading(true);

        try {
            const payload = {
                cuil: form.cuil,
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
                matricula: form.matricula,
                rol: form.rol,
                password: form.password,
            };

            const resp = await registrarPersonalAdmin(payload);

            const usernameBackend = resp?.username;
            const usernameFallback =
                `${form.apellido?.toLowerCase() ?? ""}${
                    form.nombre?.[0]?.toLowerCase() ?? ""
                }`;
            const username = usernameBackend || usernameFallback;

            setUsuarioGenerado(username);
            setMensaje("Personal registrado correctamente.");

            alert(
                `Usuario creado correctamente.\n\n` +
                `Usuario: ${username}\n` +
                `Contraseña: ${form.password}`
            );

            // limpio form
            setForm({
                cuil: "",
                nombre: "",
                apellido: "",
                email: "",
                matricula: "",
                rol: "DOCTOR",
                password: "",
            });

            // logout + redirect login
            await logoutService();
            window.location.href = "/login";
        } catch (e) {
            console.error(e);
            setError(e.message || "No se pudo registrar el personal.");
        } finally {
            setLoading(false);
        }
    }

    async function handleExport(e) {
        e.preventDefault();
        setExportError("");
        setExportLoading(true);

        try {
            if (filtrosLog.tipo === "INGRESOS") {
                await exportIngresosLog({
                    desde: filtrosLog.desde,
                    hasta: filtrosLog.hasta,
                    cuilPaciente: filtrosLog.cuilPaciente,
                    cuilEnfermera: filtrosLog.cuilEnfermera,
                });
            } else {
                await exportAtencionesLog({
                    desde: filtrosLog.desde,
                    hasta: filtrosLog.hasta,
                    cuilDoctor: filtrosLog.cuilDoctor,
                });
            }
        } catch (e) {
            console.error(e);
            setExportError(e.message || "No se pudo exportar el log.");
        } finally {
            setExportLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 flex justify-center py-8">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* ---------- REGISTRO DE PERSONAL ---------- */}
                <section>
                    <header className="border-b border-slate-200 pb-3 mb-4">
                        <h1 className="text-xl font-semibold text-slate-900">
                            Panel de administración
                        </h1>
                        <p className="text-sm text-slate-500">
                            Registrar nuevo personal (médicos y enfermeras).
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* CUIL */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-700">
                                CUIL
                            </label>
                            <input
                                type="text"
                                name="cuil"
                                value={form.cuil}
                                onChange={handleChange}
                                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="20-12345678-9"
                                required
                            />
                        </div>

                        {/* Nombre / Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={form.apellido}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Apellido"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email / Matrícula */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="correo@hospital.com"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Matrícula
                                </label>
                                <input
                                    type="text"
                                    name="matricula"
                                    value={form.matricula}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="MP-1234 / ME-5678"
                                    required
                                />
                            </div>
                        </div>

                        {/* Rol / Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Rol
                                </label>
                                <select
                                    name="rol"
                                    value={form.rol}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="ENFERMERA">Enfermera</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contraseña inicial"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mensajes */}
                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}
                        {mensaje && (
                            <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                                {mensaje}
                            </p>
                        )}
                        {usuarioGenerado && (
                            <p className="text-xs text-slate-600">
                                Usuario generado:&nbsp;
                                <span className="font-semibold">
                                    {usuarioGenerado}
                                </span>
                            </p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium
                                    bg-blue-600 text-white hover:bg-blue-700
                                    disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Registrando..."
                                    : "Registrar personal"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ---------- EXPORTAR LOGS ---------- */}
                <section className="border-t border-slate-200 pt-4">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">
                        Exportar logs
                    </h2>
                    <p className="text-xs text-slate-500 mb-3">
                        Descargá en Excel los ingresos o atenciones filtrando
                        por rango de fechas y CUIL.
                    </p>

                    <form onSubmit={handleExport} className="space-y-4">
                        {/* Tipo de log */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Tipo de log
                                </label>
                                <select
                                    name="tipo"
                                    value={filtrosLog.tipo}
                                    onChange={handleFiltrosChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="INGRESOS">
                                        Ingresos
                                    </option>
                                    <option value="ATENCIONES">
                                        Atenciones
                                    </option>
                                </select>
                            </div>

                            {/* Rango de fechas */}
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm font-medium text-slate-700">
                                    Desde / Hasta
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        name="desde"
                                        value={filtrosLog.desde}
                                        onChange={handleFiltrosChange}
                                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="date"
                                        name="hasta"
                                        value={filtrosLog.hasta}
                                        onChange={handleFiltrosChange}
                                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    Ambos campos son opcionales. Si no indicás
                                    nada, se exportan todos los registros.
                                </span>
                            </div>
                        </div>

                        {/* Filtros por CUIL según tipo */}
                        {filtrosLog.tipo === "INGRESOS" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-slate-700">
                                        CUIL paciente
                                    </label>
                                    <input
                                        type="text"
                                        name="cuilPaciente"
                                        value={filtrosLog.cuilPaciente}
                                        onChange={handleFiltrosChange}
                                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Opcional"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-slate-700">
                                        CUIL enfermera
                                    </label>
                                    <input
                                        type="text"
                                        name="cuilEnfermera"
                                        value={filtrosLog.cuilEnfermera}
                                        onChange={handleFiltrosChange}
                                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Opcional"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-700">
                                    CUIL doctor
                                </label>
                                <input
                                    type="text"
                                    name="cuilDoctor"
                                    value={filtrosLog.cuilDoctor}
                                    onChange={handleFiltrosChange}
                                    className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Opcional"
                                />
                            </div>
                        )}

                        {exportError && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                                {exportError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={exportLoading}
                            className="w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium
                                bg-emerald-600 text-white hover:bg-emerald-700
                                disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {exportLoading
                                ? "Generando archivo..."
                                : "Exportar a Excel"}
                        </button>
                    </form>
                </section>

                {/* ---------- BUSCAR POR ID ---------- */}
                <section className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">
                        Buscar ingreso o atención por ID
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                        Ingresá el UUID exacto del ingreso o de la atención para
                        ver la ficha completa.
                    </p>

                    <BusquedaPorId />
                </section>
            </div>
        </main>
    );
}

/* ========== COMPONENTE DE BÚSQUEDA POR ID ========== */

function BusquedaPorId() {
    const [tipo, setTipo] = useState("INGRESO"); // INGRESO | ATENCION
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultado, setResultado] = useState(null);

    async function buscar() {
        setLoading(true);
        setError("");
        setResultado(null);

        try {
            let data;
            if (tipo === "INGRESO") {
                data = await buscarIngresoPorId(id);
            } else {
                data = await buscarAtencionPorId(id);
            }
            setResultado({ tipo, data });
        } catch (e) {
            console.error(e);
            setError(e.message || "No se encontró el registro.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Selector + input + botón */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                        Tipo
                    </label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="INGRESO">Ingreso</option>
                        <option value="ATENCION">Atención</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                        ID (UUID)
                    </label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="c5f9e3f3-7878-4452-8725-61a41479d2e5"
                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={buscar}
                        disabled={loading || !id}
                        className="px-4 py-2 rounded-md text-sm font-medium
                            bg-indigo-600 text-white hover:bg-indigo-700
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {error}
                </p>
            )}

            {/* Resultado como ficha linda */}
            {resultado && resultado.tipo === "INGRESO" && (
                <FichaIngreso ingreso={resultado.data} />
            )}

            {resultado && resultado.tipo === "ATENCION" && (
                <FichaAtencion atencion={resultado.data} />
            )}
        </div>
    );
}

/* ========== FICHA INGRESO (IngresoDetalleDTO) ========== */

function FichaIngreso({ ingreso }) {
    if (!ingreso) return null;

    const nombrePaciente = [
        ingreso.nombrePaciente,
        ingreso.apellidoPaciente,
    ]
        .filter(Boolean)
        .join(" ");

    const nombreEnfermera = [
        ingreso.nombreEnfermera,
        ingreso.apellidoEnfermera,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="border rounded-xl bg-slate-50 p-4 shadow-sm text-sm space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Ingreso
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        {ingreso.idIngreso}
                    </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                    <p>
                        Nivel:{" "}
                        <span className="font-semibold">
                            {ingreso.nivel} · {ingreso.nombreNivel || "-"}
                        </span>
                    </p>
                    <p>
                        Estado:{" "}
                        <span className="font-semibold">
                            {ingreso.estado || "-"}
                        </span>
                    </p>
                    <p className="mt-1">
                        Fecha ingreso:{" "}
                        <span className="font-medium">
                            {formatFecha(ingreso.fechaIngreso)}
                        </span>
                    </p>
                </div>
            </div>

            {/* Paciente */}
            <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Paciente
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                        {nombrePaciente || "-"}
                    </p>
                    <p className="text-xs text-slate-600">
                        CUIL:{" "}
                        <span className="font-mono">
                            {ingreso.cuilPaciente || "-"}
                        </span>
                    </p>
                    <p className="text-xs text-slate-600">
                        Obra social:{" "}
                        <span className="font-medium">
                            {ingreso.obraSocial || "-"}
                        </span>
                    </p>
                    <p className="text-xs text-slate-600">
                        Nº afiliado:{" "}
                        <span className="font-medium">
                            {ingreso.numeroAfiliado || "-"}
                        </span>
                    </p>
                </div>

                {/* Enfermera */}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Enfermera responsable
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                        {nombreEnfermera || "-"}
                    </p>
                    <p className="text-xs text-slate-600">
                        CUIL:{" "}
                        <span className="font-mono">
                            {ingreso.cuilEnfermera || "-"}
                        </span>
                    </p>
                </div>
            </div>

            {/* Signos vitales */}
            <div className="border-t border-slate-200 pt-2 grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Signos vitales
                    </p>
                    <p className="text-xs text-slate-700">
                        <span className="font-semibold">Temperatura:</span>{" "}
                        {ingreso.temperatura ?? "-"} °C
                    </p>
                    <p className="text-xs text-slate-700">
                        <span className="font-semibold">Frec. cardíaca:</span>{" "}
                        {ingreso.frecuenciaCardiaca ?? "-"} lpm
                    </p>
                    <p className="text-xs text-slate-700">
                        <span className="font-semibold">Frec. respiratoria:</span>{" "}
                        {ingreso.frecuenciaRespiratoria ?? "-"} rpm
                    </p>
                    <p className="text-xs text-slate-700">
                        <span className="font-semibold">Tensión arterial:</span>{" "}
                        {ingreso.sistolica != null &&
                        ingreso.diastolica != null
                            ? `${ingreso.sistolica}/${ingreso.diastolica} mmHg`
                            : "-"}
                    </p>
                </div>

                {/* Informe */}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Motivo / informe
                    </p>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap bg-white border border-slate-200 rounded-md px-2 py-1.5">
                        {ingreso.informe || "-"}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ========== FICHA ATENCIÓN (AtencionLogDTO) ========== */

function FichaAtencion({ atencion }) {
    if (!atencion) return null;

    return (
        <div className="border rounded-xl bg-slate-50 p-4 shadow-sm text-sm space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Atención
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        {atencion.id}
                    </p>
                    <p className="text-xs text-slate-600">
                        Ingreso asociado:{" "}
                        <span className="font-mono">
                            {atencion.ingresoId || "-"}
                        </span>
                    </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                    <p>
                        Fecha atención:{" "}
                        <span className="font-medium">
                            {formatFecha(atencion.fechaAtencion)}
                        </span>
                    </p>
                    <p>
                        Fecha ingreso:{" "}
                        <span className="font-medium">
                            {formatFecha(atencion.fechaIngreso)}
                        </span>
                    </p>
                    <p className="mt-1">
                        Nivel:{" "}
                        <span className="font-semibold">
                            {atencion.nivel ?? "-"}
                        </span>
                    </p>
                    <p>
                        Estado ingreso:{" "}
                        <span className="font-semibold">
                            {atencion.estadoIngreso || "-"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
                {/* Doctor */}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Doctor
                    </p>
                    <p className="text-xs text-slate-700">
                        CUIL:{" "}
                        <span className="font-mono">
                            {atencion.cuilDoctor || "-"}
                        </span>
                    </p>
                </div>

                {/* Paciente */}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Paciente
                    </p>
                    <p className="text-xs text-slate-700">
                        CUIL:{" "}
                        <span className="font-mono">
                            {atencion.cuilPaciente || "-"}
                        </span>
                    </p>
                </div>

                {/* Enfermera */}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                        Enfermera
                    </p>
                    <p className="text-xs text-slate-700">
                        CUIL:{" "}
                        <span className="font-mono">
                            {atencion.cuilEnfermera || "-"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-2">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                    Informe
                </p>
                <p className="text-xs text-slate-700 whitespace-pre-wrap bg-white border border-slate-200 rounded-md px-2 py-1.5">
                    {atencion.informe || "-"}
                </p>
            </div>
        </div>
    );
}
