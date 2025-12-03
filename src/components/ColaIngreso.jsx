"use client";

import { Card, CardContent, Typography } from "@mui/material";

export default function ColaIngresos({ ingresos, onSelect }) {
    return (
        <div className="w-full space-y-3 overflow-y-auto max-h-[80vh] pr-2">
            {ingresos.map((ing) => (
                <Card
                    key={ing.idIngreso}
                    variant="outlined"
                    sx={{
                        bgcolor: "#fff",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                        "&:hover": { backgroundColor: "#f8fafc" },
                    }}
                    onClick={() => onSelect && onSelect(ing)}
                >
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {ing.nombre || ing.nombrePaciente || "Paciente sin nombre"}
                        </Typography>
                        {ing.apellido || ing.apellidoPaciente ? (
                            <Typography variant="subtitle1" fontWeight={600}>
                                {ing.apellido || ing.apellidoPaciente}
                            </Typography>
                        ) : null}

                        <Typography variant="body2">
                            Nivel: {ing.nivel}{" "}
                            {ing.nombreNivel ? `· ${ing.nombreNivel}` : ""}
                        </Typography>
                        <Typography variant="body2">
                            Estado: {ing.estado || "PENDIENTE"}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
