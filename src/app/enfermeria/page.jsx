"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function EnfermeriaPage() {
  const [cuil, setCuil] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mostrarFormPaciente, setMostrarFormPaciente] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [formIngreso, setFormIngreso] = useState({
    informe: "",
    nivelEmergencia: "",
    temperatura: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    sistolica: "",
    diastolica: "",
    enfermera: "sofia.ramos",
  });
  const [formPaciente, setFormPaciente] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    calle: "",
    numero: "",
    localidad: "",
    obraSocial: "",
    codigo: "",
    numeroAfiliado: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function buscarPaciente() {
    setError("");
    setMensaje("");
    setMostrarFormPaciente(false);
    setPaciente(null);
    try {
      const res = await fetch(`/api/pacientes/${cuil}`);
      if (!res.ok) {
        if (res.status === 404) {
          setMostrarFormPaciente(true);
          throw new Error("Paciente no encontrado. Debe registrarse.");
        }
        throw new Error("Error al buscar paciente.");
      }
      const data = await res.json();
      setPaciente(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function registrarPaciente() {
    try {
      const body = {
        cuil: formPaciente.cuil,
        nombre: formPaciente.nombre,
        apellido: formPaciente.apellido,
        domicilio: {
          calle: formPaciente.calle,
          numero: parseInt(formPaciente.numero),
          localidad: formPaciente.localidad,
        },
        afiliado: {
          obraSocial: {
            nombre: formPaciente.obraSocial,
            codigo: formPaciente.codigo,
          },
          numeroAfiliado: formPaciente.numeroAfiliado,
        },
      };

      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al registrar paciente.");
      const data = await res.json();
      setPaciente(data);
      setMostrarFormPaciente(false);
      setMensaje("Paciente registrado correctamente.");
    } catch {
      setError("Hubo un error al registrar el paciente.");
    }
  }

  async function registrarIngreso() {
    setError("");
    setMensaje("");
    try {
      const body = {
        cuil: paciente.cuil,
        informe: formIngreso.informe,
        nivelEmergencia: formIngreso.nivelEmergencia,
        temperatura: parseFloat(formIngreso.temperatura),
        frecuenciaCardiaca: parseFloat(formIngreso.frecuenciaCardiaca),
        frecuenciaRespiratoria: parseFloat(formIngreso.frecuenciaRespiratoria),
        tensionArterial: {
          sistolica: parseFloat(formIngreso.sistolica),
          diastolica: parseFloat(formIngreso.diastolica),
        },
        enfermera: formIngreso.enfermera,
      };

      const res = await fetch("/api/ingresos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al registrar ingreso.");
      const data = await res.json();
      setIngresos((prev) => [...prev, data]);
      setMensaje("Ingreso registrado correctamente.");
      setFormIngreso({
        informe: "",
        nivelEmergencia: "",
        temperatura: "",
        frecuenciaCardiaca: "",
        frecuenciaRespiratoria: "",
        sistolica: "",
        diastolica: "",
        enfermera: "sofia.ramos",
      });
      setPaciente(null);
      setCuil("");
    } catch {
      setError("Hubo un error al registrar el ingreso.");
    }
  }

  const metrics = useMemo(() => {
    const activos = ingresos.filter((i) => i.estadoIngreso !== "FINALIZADO");
    const total = activos.length;
    const criticos = activos.filter((i) => i.nivelEmergencia === "CRITICA").length;
    const emergencias = activos.filter((i) => i.nivelEmergencia === "EMERGENCIA").length;
    return { total, criticos, emergencias };
  }, [ingresos]);

  return (
    <main className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat title="Pacientes en Espera" value={metrics.total} subtitle="En cola de prioridad" />
        <Stat title="Casos Críticos" value={metrics.criticos} subtitle="Requieren atención inmediata" />
        <Stat title="Emergencias" value={metrics.emergencias} subtitle="Casos de emergencia" />
      </section>

      <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold">Registrar Nuevo Ingreso</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="CUIL (##-########-#)"
            className="border rounded px-2 py-1 flex-1"
            value={cuil}
            onChange={(e) => setCuil(e.target.value)}
          />
          <button
            onClick={buscarPaciente}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

        {mostrarFormPaciente && (
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
              <input
                type="text"
                placeholder="Obra Social"
                className="border rounded px-2 py-1"
                value={formPaciente.obraSocial}
                onChange={(e) => setFormPaciente({ ...formPaciente, obraSocial: e.target.value })}
              />
              <input
                type="text"
                placeholder="Código OS"
                className="border rounded px-2 py-1"
                value={formPaciente.codigo}
                onChange={(e) => setFormPaciente({ ...formPaciente, codigo: e.target.value })}
              />
              <input
                type="text"
                placeholder="Número Afiliado"
                className="border rounded px-2 py-1 col-span-2"
                value={formPaciente.numeroAfiliado}
                onChange={(e) => setFormPaciente({ ...formPaciente, numeroAfiliado: e.target.value })}
              />
            </div>
            <button
              onClick={registrarPaciente}
              className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Registrar Paciente
            </button>
          </div>
        )}

        {paciente && (
          <FormularioIngreso
            paciente={paciente}
            formIngreso={formIngreso}
            setFormIngreso={setFormIngreso}
            registrarIngreso={registrarIngreso}
          />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Cola de Prioridad</h2>
        <p className="text-sm text-neutral-600 mb-3">Pacientes ordenados por nivel de emergencia.</p>
        <div className="space-y-2">
          {ingresos.map((i) => (
            <Card key={i.id} className="shadow-sm">
              <CardContent>
                <Typography variant="subtitle1" className="font-medium">
                  {i.paciente.nombre} {i.paciente.apellido} — {i.nivelEmergencia}
                </Typography>
                <Typography variant="body2" className="text-neutral-600">
                  {i.informe}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function FormularioIngreso({ paciente, formIngreso, setFormIngreso, registrarIngreso }) {
  return (
    <div className="border rounded p-3 bg-neutral-50 space-y-2">
      <p className="font-medium">
        {paciente.nombre} {paciente.apellido}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Informe"
          className="border rounded px-2 py-1 col-span-2"
          value={formIngreso.informe}
          onChange={(e) => setFormIngreso({ ...formIngreso, informe: e.target.value })}
        />
        <select
          className="border rounded px-2 py-1"
          value={formIngreso.nivelEmergencia}
          onChange={(e) => setFormIngreso({ ...formIngreso, nivelEmergencia: e.target.value })}
        >
          <option value="">Nivel de Emergencia</option>
          <option value="CRITICA">Crítica</option>
          <option value="EMERGENCIA">Emergencia</option>
          <option value="URGENCIA">Urgencia</option>
          <option value="URGENCIA_MENOR">Urgencia Menor</option>
          <option value="SIN_URGENCIA">Sin Urgencia</option>
        </select>
        <input
          type="number"
          placeholder="Temperatura (°C)"
          className="border rounded px-2 py-1"
          value={formIngreso.temperatura}
          onChange={(e) => setFormIngreso({ ...formIngreso, temperatura: e.target.value })}
        />
        <input
          type="number"
          placeholder="Frecuencia Cardiaca (lpm)"
          className="border rounded px-2 py-1"
          value={formIngreso.frecuenciaCardiaca}
          onChange={(e) => setFormIngreso({ ...formIngreso, frecuenciaCardiaca: e.target.value })}
        />
        <input
          type="number"
          placeholder="Frecuencia Respiratoria (rpm)"
          className="border rounded px-2 py-1"
          value={formIngreso.frecuenciaRespiratoria}
          onChange={(e) => setFormIngreso({ ...formIngreso, frecuenciaRespiratoria: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Sistólica"
            className="border rounded px-2 py-1 flex-1"
            value={formIngreso.sistolica}
            onChange={(e) => setFormIngreso({ ...formIngreso, sistolica: e.target.value })}
          />
          <input
            type="number"
            placeholder="Diastólica"
            className="border rounded px-2 py-1 flex-1"
            value={formIngreso.diastolica}
            onChange={(e) => setFormIngreso({ ...formIngreso, diastolica: e.target.value })}
          />
        </div>
      </div>
      <button
        onClick={registrarIngreso}
        className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Registrar Ingreso
      </button>
    </div>
  );
}

function Stat({ title, value, subtitle }) {
  return (
    <Card className="shadow-sm">
      <CardContent>
        <Typography variant="subtitle2" className="text-neutral-600">
          {title}
        </Typography>
        <Typography variant="h4" className="font-bold mt-1">
          {value}
        </Typography>
        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
