"use client";

import { Stack, TextField, Button, Typography } from "@mui/material";

export default function BuscarPaciente({ cuil, onCuilChange, onBuscar, error }) {
  return (
    <Stack spacing={1.5}>
      {/* Título / etiqueta de sección */}
      <Typography variant="subtitle1" fontWeight={600}>
        Buscar paciente
      </Typography>

      {/* Input + botón en línea (responsivo) */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          label="CUIL del paciente"
          placeholder="##-########-#"
          value={cuil}
          onChange={onCuilChange}
          fullWidth
          size="small"
        />

        <Button
          variant="contained"
          onClick={onBuscar}
          size="medium"
          sx={{ whiteSpace: "nowrap" }}
        >
          Buscar
        </Button>
      </Stack>

      {/* Error debajo, igual estilo que los formularios */}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
}