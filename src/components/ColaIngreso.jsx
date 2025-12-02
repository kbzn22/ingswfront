"use client";

import { Card, CardContent, Typography, Divider } from "@mui/material";

export default function ColaIngreso({ ingresos }) {
  if (!ingresos || ingresos.length === 0) {
    return <p className="text-gray-500">No hay ingresos pendientes.</p>;
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[80vh] pr-2">
      {ingresos.map((ing) => (
        <Card key={ing.id} variant="outlined" sx={{ bgcolor: "#fff" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600}>
              {ing.paciente?.nombre} {ing.paciente?.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nivel: {ing.nivelEmergencia}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estado: {ing.estado}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">{ing.informe}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
