"use client";

import React, { useState, useMemo, useEffect } from "react";
import BuscarPaciente from "@/components/inputs/BuscarPaciente";
import FormPaciente from "@/components/inputs/FormPaciente";
import FormIngreso from "@/components/inputs/FormIngreso";
import ColaIngresos from "@/components/ColaIngreso";

import { crearIngresoDTO } from "@/models/IngresoDTO";
import { NIVEL_BY_VALUE } from "@/lib/enums";
import { useRouter } from "next/navigation";

import { buscarPacientePorCuil, registrarPacienteService } from "@/services/pacienteService";
import { registrarIngresoService, cargarObrasSocialesService, obtenerColaIngresoService} from "@/services/ingresoService";
import { verificarSesionService } from "@/services/authService";
import { limpiarCuil, formatearCuil11 } from "@/lib/cuil";

export default function Page() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cuil, setCuil] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mostrarFormPaciente, setMostrarFormPaciente] = useState(false);
  const [ingresos, setIngresos] = useState([]); // por ahora no lo tocamos
  const [obrasSociales, setObrasSociales] = useState([]);
  const [formPaciente, setFormPaciente] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    email: "",
    calle: "",
    numero: "",
    localidad: "",
    obraSocial: "",
    codigo: "",
    numeroAfiliado: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function verificar() {
      try {
        const ok = await verificarSesionService();
        if (!ok) {
          router.push("/login");
          return;
        }
        setCheckingAuth(false);
      } catch {
        router.push("/login");
      }
    }

    verificar();
  }, [router]);

  useEffect(() => {
  async function cargarCola() {
    try {
      const cola = await obtenerColaIngresosService();
      setIngresos(cola);
    } catch (e) {
      console.error("Error cargando cola de ingresos:", e);
    }
  }

  cargarCola();
}, []);


  function handleCuilChange(e) {
    let v = limpiarCuil(e.target.value);

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length <= 2) {
      setCuil(v);
    } else if (v.length <= 10) {
      setCuil(`${v.slice(0, 2)}-${v.slice(2)}`);
    } else {
      setCuil(`${v.slice(0, 2)}-${v.slice(2, 10)}-${v.slice(10)}`);
    }
  }

  async function buscarPaciente() {
    setError("");
    setMensaje("");
    setMostrarFormPaciente(false);
    setPaciente(null);

    const limpio = limpiarCuil(cuil);
    if (limpio.length !== 11) {
      setError("El CUIL debe tener 11 dígitos.");
      return;
    }

    const cuilFormateado = formatearCuil11(limpio);

    try {
      const data = await buscarPacientePorCuil(cuilFormateado);

      if (data) {
        setPaciente(data);
        setMensaje(`Paciente encontrado: ${data.nombre} ${data.apellido}`);
        return;
      }

      setFormPaciente((prev) => ({ ...prev, cuil }));

      if (obrasSociales.length === 0) {
        try {
          const osData = await cargarObrasSocialesService();
          setObrasSociales(osData);
        } catch (e) {
          console.error("No se pudieron cargar las obras sociales", e);
          setError("No se pudieron cargar las obras sociales.");
        }
      }

      setMostrarFormPaciente(true);
      setMensaje(
        "Paciente no encontrado. Ingrese los datos para registrarlo."
      );
    } catch (e) {
      setError(e.message);
    }
  }

  async function registrarPaciente() {
    setError("");
    setMensaje("");

    try {
      const data = await registrarPacienteService(formPaciente);

      setPaciente(data);
      setMostrarFormPaciente(false);
      setMensaje("Paciente registrado correctamente.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateIngreso(dto, resetForm) {
    try {
      const ingresoDTO = crearIngresoDTO({
        cuilPaciente: dto.cuil,
        informe: dto.informe,
        temperatura: dto.signosVitales.temperatura,
        frecuenciaCardiaca: dto.signosVitales.frecuenciaCardiaca,
        frecuenciaRespiratoria: dto.signosVitales.frecuenciaRespiratoria,
        frecuenciaSistolica: dto.signosVitales.frecuenciaSistolica,
        frecuenciaDiastolica: dto.signosVitales.frecuenciaDiastolica,
        nivel: NIVEL_BY_VALUE[dto.nivelEmergencia]?.score,
      });

      await registrarIngresoService(ingresoDTO);
      const nuevaCola = await obtenerColaIngresosService(); 
      setIngresos(nuevaCola);
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  }

  function cancelarIngreso() {
    setPaciente(null);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return (
  <main className="min-h-screen flex flex-col md:flex-row gap-6">
    {/* IZQUIERDA */}
    <section className="basis-1/2 bg-white rounded-lg shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-semibold">Registrar Nuevo Ingreso</h2>

      {/* 1. BUSCAR PACIENTE */}
      <BuscarPaciente
        cuil={cuil}
        onCuilChange={handleCuilChange}
        onBuscar={buscarPaciente}
      />

      {/* 2. FORM PACIENTE (si no existe) */}
      {mostrarFormPaciente && (
        <FormPaciente
          formPaciente={formPaciente}
          setFormPaciente={setFormPaciente}
          obrasSociales={obrasSociales}
          onSubmit={registrarPaciente}
          onCancel={() => {
            setMostrarFormPaciente(false);
            setFormPaciente({
              cuil: "",
              nombre: "",
              apellido: "",
              email: "",
              calle: "",
              numero: "",
              localidad: "",
              codigo: "",
              numeroAfiliado: "",
            });
            setError("");
            setMensaje("");
          }}
        />
      )}

      {/* 3. FORM INGRESO (si existe paciente) */}
      {paciente && (
        <FormIngreso
          paciente={paciente}
          onCreate={handleCreateIngreso}
          onCancel={cancelarIngreso}
        />
      )}

      {/* 4. ERRORES Y MENSAJES */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
    </section>

    {/* DERECHA */}
    <section className="basis-1/2 bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Cola de ingresos</h2>
      <div className="flex-1 flex items-start">
        <ColaIngresos ingresos={ingresos} />
      </div>
    </section>
  </main>
);

}