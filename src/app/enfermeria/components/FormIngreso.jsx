"use client";

import { useState } from "react";
import { Stack, TextField, MenuItem, Button, Typography } from "@mui/material";
import { NIVEL_EMERGENCIA } from "@/lib/enums";

export default function FormIngreso({ paciente, onCreate, onCancel }) {

  const [informe, setInforme] = useState("");
  const [nivelEmergencia, setNivelEmergencia] = useState(4);
  const [temperatura, setTemperatura] = useState("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("");
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("");
  const [frecuenciaSistolica, setFrecuenciaSistolica] = useState("");
  const [frecuenciaDiastolica, setFrecuenciaDiastolica] = useState("");


  const resetForm = () => {
    setInforme("");
    setNivelEmergencia("URGENCIA_MENOR");
    setTemperatura("");
    setFrecuenciaCardiaca("");
    setFrecuenciaRespiratoria("");
    setFrecuenciaSistolica("");
    setFrecuenciaDiastolica("");
  };


  // =============================
  // Envío del formulario
  // =============================
  function submit(e) {
    e.preventDefault();

    const dto = {
      cuil: paciente.cuil,   // identificador real del paciente
      informe: informe.trim(),
      nivel: nivelEmergencia,

      signosVitales: {
        temperatura: temperatura ? parseFloat(temperatura.replace(",", ".")) : null,
        frecuenciaCardiaca: frecuenciaCardiaca ? Number(frecuenciaCardiaca) : null,
        frecuenciaRespiratoria: frecuenciaRespiratoria ? Number(frecuenciaRespiratoria) : null,
        frecuenciaSistolica: frecuenciaSistolica ? Number(frecuenciaSistolica) : null,
        frecuenciaDiastolica: frecuenciaDiastolica ? Number(frecuenciaDiastolica) : null,
      }
    };
    console.log("DTO ENVIADO AL BACK:", dto);

    onCreate?.(dto, resetForm);
  }


  return (
    <form onSubmit={submit}>
      <Stack spacing={2}>

        {/* =============================
            Identificación del paciente
        ============================== */}
        <Typography variant="subtitle2">
          CUIL del paciente: <strong>{paciente.cuil}</strong>
        </Typography>

        {/* =============================
            Inputs
        ============================== */}
        <TextField
          label="Informe"
          value={informe}
          onChange={(e) => setInforme(e.target.value)}
          multiline
          minRows={2}
          fullWidth
        />

        <TextField
          select
          label="Nivel de Emergencia"
          value={nivelEmergencia}
          onChange={(e) => setNivelEmergencia(Number(e.target.value))}
          fullWidth
        >
          {NIVEL_EMERGENCIA.map(n => (
            <MenuItem key={n.numero} value={n.numero}>
              {n.label}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Temperatura (°C)"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value.replace(/[^0-9.,]/g, ""))}
            fullWidth
          />

          <TextField
            label="Frecuencia Cardíaca (lpm)"
            value={frecuenciaCardiaca}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) =>
              setFrecuenciaCardiaca(e.target.value.replace(/\D/g, ""))
            }
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Frecuencia Respiratoria (rpm)"
            value={frecuenciaRespiratoria}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) =>
              setFrecuenciaRespiratoria(e.target.value.replace(/\D/g, ""))
            }
            fullWidth
          />

          <TextField
            label="Sistólica (mmHg)"
            value={frecuenciaSistolica}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) =>
              setFrecuenciaSistolica(e.target.value.replace(/\D/g, ""))
            }
            fullWidth
          />

          <TextField
            label="Diastólica (mmHg)"
            value={frecuenciaDiastolica}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) =>
              setFrecuenciaDiastolica(e.target.value.replace(/\D/g, ""))
            }
            fullWidth
          />
        </Stack>

        {/* =============================
            Botones
        ============================== */}
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            Registrar ingreso
          </Button>

          <Button 
            variant="outlined" 
            color="error" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </Stack>

      </Stack>
    </form>
  );
}
