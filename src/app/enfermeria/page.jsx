"use client";
import React, {useState, useMemo, useEffect} from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {router} from "next/client";
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
  const [formIngreso, setFormIngreso] = useState({
    informe: "",
    nivelEmergencia: "",
    temperatura: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    sistolica: "",
    diastolica: "",

  });
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

  async function registrarIngreso() {
    setError("");
    setMensaje("");

    const nivelMap = {
        "CRITICA": 5,
        "EMERGENCIA": 4,
        "URGENCIA": 3,
        "URGENCIA_MENOR": 2,
        "SIN_URGENCIA": 1,
    };
    const nivelInt = nivelMap[formIngreso.nivelEmergencia];

    try {
      const body = {
        cuilPaciente: paciente.cuil,
        informe: formIngreso.informe,
        temperatura: parseFloat(formIngreso.temperatura),
        frecuenciaCardiaca: parseFloat(formIngreso.frecuenciaCardiaca),
        frecuenciaRespiratoria: parseFloat(formIngreso.frecuenciaRespiratoria),
        frecuenciaSistolica: parseFloat(formIngreso.sistolica), 
        frecuenciaDiastolica: parseFloat(formIngreso.diastolica),
        nivel: nivelInt,
      };

      const res = await fetch(`${BASE_URL}/ingresos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials:"include"
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar ingreso.");
      }

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

      });

      setPaciente(null);
      setCuil("");
    } catch (e) {
      setError(e.message);
    }
  }



  return (
    <main className="space-y-6">
      <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold">Registrar Nuevo Ingreso</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ingrese CUIL sin guiones"
            className="border rounded px-2 py-1 flex-1"
            value={cuil}
            onChange={handleCuilChange}
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

                {/* Campo de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar obra social..."
                    className="border rounded px-2 py-1 w-full"
                    value={busquedaOS}
                    onChange={(e) => setBusquedaOS(e.target.value)}
                />

                {/* Select de obras sociales */}
                <select
                    className="border rounded px-2 py-1 w-full"
                    value={formPaciente.codigo}
                    onChange={(e) => {
                      const idSeleccionado = e.target.value;
                      const os = obrasSociales.find((o) => o.id === idSeleccionado) || null;

                      setFormPaciente((prev) => ({
                        ...prev,
                        codigo: idSeleccionado,              // UUID → para idObraSocial
                        obraSocial: os ? os.nombre : "",     // Nombre → por si lo querés mostrar
                      }));
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

              {/* Número de afiliado (solo tiene sentido si eligió OS) */}
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