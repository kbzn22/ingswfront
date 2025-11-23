"use client";
import React, {useState, useMemo, useEffect} from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BuscarPaciente from "@/components/inputs/BuscarPaciente";
import FormPaciente from "@/components/inputs/FormPaciente";
import FormIngreso from "@/components/inputs/FormIngreso";
import { crearIngresoDTO } from "@/models/IngresoDTO";
import { NIVEL_BY_VALUE } from "@/lib/enums";
import {useRouter} from "next/navigation";

const BASE_URL = "http://localhost:8080/api";


export default function Page() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cuil, setCuil] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [mostrarFormPaciente, setMostrarFormPaciente] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [busquedaOS, setBusquedaOS] = useState("");
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
  const obrasFiltradas = useMemo(() => {
    const term = busquedaOS.toLowerCase().trim();
    if (!term) return obrasSociales;
    return obrasSociales.filter((os) =>
        os.nombre.toLowerCase().includes(term)
    );
  }, [obrasSociales, busquedaOS]);
  const metrics = useMemo(() => {
    const activos = ingresos.filter((i) => i.estadoIngreso !== "FINALIZADO");
    const total = activos.length;
    const criticos = activos.filter((i) => i.nivelEmergencia === "CRITICA").length;
    const emergencias = activos.filter((i) => i.nivelEmergencia === "EMERGENCIA").length;
    return { total, criticos, emergencias };
  }, [ingresos]);


  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          method: "GET",
          credentials: "include",
        });
        console.log(res);
        if (!res.ok) {
          router.push("/login");
          return;
        }


        setCheckingAuth(false);
      } catch (e) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);
  useEffect(() => {
    if (checkingAuth) return;

    async function cargarObrasSociales() {
      try {
        const res = await fetch(`${BASE_URL}/obras-sociales`);
        if (!res.ok) {
          console.error("Error al cargar obras sociales");
          return;
        }
        const data = await res.json();
        setObrasSociales(data);
      } catch (e) {
        console.error("No se pudieron cargar las obras sociales", e);
      }
    }

    cargarObrasSociales();
  }, [checkingAuth]);

  if (checkingAuth) {
    return (
        <main className="min-h-screen flex items-center justify-center">
          <p>Verificando sesión...</p>
        </main>
    );
  }
  function handleCuilChange(e) {
    let v = e.target.value.replace(/\D/g, ""); // solo números, ignores hyphens

    if (v.length > 11) v = v.slice(0, 11);

    // Formato XX-XXXXXXXX-X
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
    const limpio = cuil.replace(/\D/g, "");

    if (limpio.length !== 11) {
      setError("El CUIL debe tener 11 dígitos.");
      return;
    }
    const cuilFormateado =
        `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
    try {
      const res = await fetch(`${BASE_URL}/pacientes/${cuilFormateado}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setFormPaciente((prev) => ({ ...prev, cuil: cuil }));
          setMostrarFormPaciente(true);
          setMensaje("Paciente no encontrado. Ingrese los datos para registrarlo.");
          return;
        }
        
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status} al buscar paciente.`);
      }

      const data = await res.json();
      setPaciente(data);
      setMensaje(`Paciente encontrado: ${data.nombre} ${data.apellido}`);

    } catch (e) {
      setError(e.message);
    }
  }

  async function registrarPaciente() {
    setError("");
    setMensaje("");

    try {
      const body = {
        cuilPaciente: formPaciente.cuil,
        nombre: formPaciente.nombre,
        apellido: formPaciente.apellido,
        email: formPaciente.email,
        calle: formPaciente.calle,
        numero: parseInt(formPaciente.numero),
        localidad: formPaciente.localidad,
        ...(formPaciente.codigo && { idObraSocial: formPaciente.codigo }), 
        ...(formPaciente.codigo && { numeroAfiliado: formPaciente.numeroAfiliado }),
      };

      const res = await fetch(`${BASE_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar paciente.");
      }

      const data = await res.json();
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

      await registrarIngresoDTO(ingresoDTO);

      resetForm();
    } catch (error) {
      setError(error.message);
    }
  }


  async function registrarIngresoDTO(dto) {
  setError("");
  setMensaje("");

    try {
      const res = await fetch(`${BASE_URL}/ingresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al registrar ingreso.");
      }

      const ingreso = await res.json();
      setIngresos((prev) => [...prev, ingreso]);
      setMensaje("Ingreso registrado correctamente.");

      setPaciente(null);
      setCuil("");

    } catch (e) {
      setError(e.message);
      throw e;  
    }
  } 

  function cancelarIngreso() {
    setPaciente(null);
  }

  return (
  <main className="space-y-6">

    <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-semibold">Registrar Nuevo Ingreso</h2>

      {/** ---------------------------
       *  1. BUSCAR PACIENTE
       * --------------------------- */}
      <BuscarPaciente
        cuil={cuil}
        onCuilChange={handleCuilChange}
        onBuscar={buscarPaciente}
      />

      {/** ---------------------------
       *  2. FORMULARIO DE REGISTRO DE PACIENTE (si no existe)
       * --------------------------- */}
      {mostrarFormPaciente && (
        <FormPaciente
          formPaciente={formPaciente}
          setFormPaciente={setFormPaciente}
          obrasFiltradas={obrasFiltradas}
          busquedaOS={busquedaOS}
          setBusquedaOS={setBusquedaOS}
          onSubmit={registrarPaciente}
        />
      )}

      {/** ---------------------------
       *  3. FORMULARIO DE INGRESO (si el paciente existe)
       * --------------------------- */}
      {paciente && (
        <FormIngreso 
          paciente={paciente} 
          onCreate={handleCreateIngreso}
          onCancel={cancelarIngreso}
        />
      )}


      {/** ---------------------------
       *  4. MENSAJES DE ERROR / OK
       * --------------------------- */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
    </section>

  </main>
  );
}