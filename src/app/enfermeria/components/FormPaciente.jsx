"use client";

import { Stack, TextField, MenuItem, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function FormPaciente({
  formPaciente,
  setFormPaciente,
  obrasSociales,
  onSubmit,
  onCancel, 
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormPaciente({ ...formPaciente, [field]: e.target.value });
  };

  const handleClear = () => {
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
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit?.();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        spacing={2}
        sx={{
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Registrar nuevo paciente
        </Typography>

        {/* CUIL */}
        <TextField
          label="CUIL"
          value={formPaciente.cuil}
          onChange={handleChange("cuil")}
          placeholder="##-########-#"
          fullWidth
        />

        {/* Nombre y Apellido */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Nombre"
            value={formPaciente.nombre}
            onChange={handleChange("nombre")}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={formPaciente.apellido}
            onChange={handleChange("apellido")}
            fullWidth
          />
        </Stack>

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={formPaciente.email}
          onChange={handleChange("email")}
          fullWidth
        />

        {/* Calle y Número */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Calle"
            value={formPaciente.calle}
            onChange={handleChange("calle")}
            fullWidth
          />
          <TextField
            label="Número"
            type="number"
            value={formPaciente.numero}
            onChange={handleChange("numero")}
            fullWidth
          />
        </Stack>

        {/* Localidad */}
        <TextField
          label="Localidad"
          value={formPaciente.localidad}
          onChange={handleChange("localidad")}
          fullWidth
        />

        {/* Obra Social */}
        <TextField
          select
          label="Obra Social (opcional)"
          value={formPaciente.codigo}
          onChange={(e) => {
            const id = e.target.value;
            setFormPaciente((prev) => ({
              ...prev,
              codigo: id || "",
              ...(id === "" ? { numeroAfiliado: "" } : {}),
            }));
          }}
          fullWidth
        >
          <MenuItem value="">Sin obra social</MenuItem>
          {obrasSociales.map((os) => (
            <MenuItem key={os.id} value={os.id}>
              {os.nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Número Afiliado */}
        <TextField
          label="Número de Afiliado"
          value={formPaciente.numeroAfiliado}
          onChange={handleChange("numeroAfiliado")}
          fullWidth
          disabled={!formPaciente.codigo}
        />

        {/* Botones */}
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            Registrar Paciente
          </Button>

          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClear}
            disabled={loading}
          >
            Limpiar
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
