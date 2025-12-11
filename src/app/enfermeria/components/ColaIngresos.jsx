"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { NIVEL_EMERGENCIA_INFO } from "@/lib/enums";

function parseFechaUtc(fechaIngresoStr) {
    if (!fechaIngresoStr) return null;

    // "2025-12-11T00:23:11.787533"
    const [datePart, timePart] = fechaIngresoStr.split("T");
    if (!timePart) return new Date(fechaIngresoStr);

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, secondFrac] = timePart.split(":");
    const seconds = parseFloat(secondFrac); // incluye fracción

    // Creamos la fecha asumiendo que es UTC
    return new Date(Date.UTC(year, month - 1, day, Number(hour), Number(minute), seconds));
}

function formatElapsed(fechaIngresoStr) {
    const ingresoDate = parseFechaUtc(fechaIngresoStr);
    if (!ingresoDate || isNaN(ingresoDate.getTime())) return "-";

    const now = new Date();
    const diffMs = now.getTime() - ingresoDate.getTime();
    const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (totalMinutes < 1) return "Espera: < 1 min";
    if (totalMinutes < 60) return `Espera: ${totalMinutes} min`;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) return `Espera: ${hours} h`;
    return `Espera: ${hours} h ${minutes} min`;
}


export default function ColaIngresos({ ingresos, onSelect }) {
    return (
        <div className="w-full space-y-3 overflow-y-auto max-h-[80vh] pr-2">
            {ingresos.map((ing, index) => {
                const nivelNumber = ing.nivel;
                const info = NIVEL_EMERGENCIA_INFO[nivelNumber] || null;
                const espera = formatElapsed(ing.fechaIngreso);

                return (
                    <Card
                        key={ing.idIngreso}
                        variant="outlined"
                        sx={{
                            bgcolor: "#fff",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease, transform 0.1s ease",
                            borderLeft: info
                                ? `4px solid ${info.color}`
                                : "4px solid #e5e7eb",
                            "&:hover": {
                                backgroundColor: "#f8fafc",
                                transform: "translateY(-1px)",
                            },
                        }}
                        onClick={() => onSelect && onSelect(ing)}
                    >
                        <CardContent sx={{ pb: 1.5 }}>
                            {/* Nombre + posición */}
                            <Typography variant="subtitle1" fontWeight={600}>
                                {index + 1}. {(ing.apellido || "") + ", " + (ing.nombre || "")}
                            </Typography>

                            {/* CUIL */}
                            {ing.cuil && (
                                <Typography variant="body2" color="text.secondary">
                                    CUIL: {ing.cuil}
                                </Typography>
                            )}

                            {/* FILA INFERIOR: Nivel (izq) + tiempo de espera (der) */}
                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                {/* Nivel con color */}
                                <Box>
                                    {info ? (
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px]"
                                            style={{
                                                backgroundColor: info.bg,
                                                borderColor: info.border,
                                                color: "#0f172a",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "999px",
                                                    backgroundColor: info.color,
                                                }}
                                            />
                                            {`Nivel ${nivelNumber} · ${info.label}`}
                                            </span>
                                    ) : (
                                        <span className="text-slate-500 text-xs">Nivel sin info</span>
                                    )}
                                </Box>

                                {/* Tiempo de espera (derecha abajo) */}
                                <Typography
                                    variant="caption"
                                    sx={{ color: "#64748b", textAlign: "right", whiteSpace: "nowrap" }}
                                >
                                    {espera}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
