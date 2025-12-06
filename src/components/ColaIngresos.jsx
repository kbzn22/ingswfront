"use client";

import { Card, CardContent, Typography } from "@mui/material";

export default function ColaIngresos({ ingresos, onSelect }) {
    return (
        <div className="w-full space-y-3 overflow-y-auto max-h-[80vh] pr-2">
            {ingresos.map((ing, index) => (
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
                        {/* --- Apellido + Nombre en una sola línea --- */}
                        <Typography variant="subtitle1" fontWeight={600}>
                            {index + 1}.{" "}
                            {(ing.apellido || "") +
                                ", " +
                                (ing.nombre || "")}
                        </Typography>

                        {/* --- CUIL --- */}
                        {ing.cuil && (
                            <Typography variant="body2" color="text.secondary">
                                CUIL: {ing.cuil}
                            </Typography>
                        )}

                        {/* --- Nivel + nombreNivel --- */}
                        <Typography variant="body2">
                            Nivel: {ing.nivel}{" "}
                            {ing.nombreNivel ? `· ${ing.nombreNivel}` : ""}
                        </Typography>

                        {/* Estado eliminado */}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
