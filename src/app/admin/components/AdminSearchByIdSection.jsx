// src/app/admin/components/AdminSearchByIdSection.jsx
"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    Box,
    Divider,
    Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { buscarIngresoPorId } from "@/services/ingresoService";
import { buscarAtencionPorId } from "@/services/atencionService";

function formatFecha(fecha) {
    if (!fecha) return "-";
    try {
        return new Date(fecha).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "medium",
        });
    } catch {
        return fecha;
    }
}

export default function AdminSearchByIdSection() {
    const [tipo, setTipo] = useState("INGRESO"); // INGRESO | ATENCION
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultado, setResultado] = useState(null);

    async function handleBuscar(e) {
        e?.preventDefault?.();
        setLoading(true);
        setError("");
        setResultado(null);

        try {
            let data;
            if (tipo === "INGRESO") {
                data = await buscarIngresoPorId(id);
            } else {
                data = await buscarAtencionPorId(id);
            }
            setResultado({ tipo, data });
        } catch (e) {
            console.error(e);
            setError(e.message || "No se encontró el registro.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card
            elevation={1}
            sx={{
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
            }}
        >
            <CardHeader
                avatar={<SearchIcon color="primary" />}
                title={
                    <Typography variant="subtitle1" fontWeight={600}>
                        Buscar ingreso o atención por ID
                    </Typography>
                }
                subheader={
                    <Typography variant="body2" color="text.secondary">
                        Ingresá el UUID exacto para ver la ficha completa.
                    </Typography>
                }
                sx={{ pb: 1.5 }}
            />

            <CardContent sx={{ pt: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Formulario de búsqueda */}
                <Box
                    component="form"
                    onSubmit={handleBuscar}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={12} sm={3} md={2.5}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <MenuItem value="INGRESO">Ingreso</MenuItem>
                                <MenuItem value="ATENCION">Atención</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="ID (UUID)"
                                placeholder="c5f9e3f3-7878-4452-8725-61a41479d2e5"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3} md={3.5}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="success"
                                startIcon={<SearchIcon />}
                                disabled={loading || !id}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    height: 40,
                                }}
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </Button>
                        </Grid>
                    </Grid>

                    {error && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.5,
                                fontSize: 12,
                                color: "#b91c1c",
                                bgcolor: "#fef2f2",
                                border: "1px solid #fee2e2",
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.75,
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                </Box>

                {/* Resultado */}
                {resultado && resultado.tipo === "INGRESO" && (
                    <>
                        <Divider sx={{ my: 1.5 }} />
                        <FichaIngreso ingreso={resultado.data} />
                    </>
                )}

                {resultado && resultado.tipo === "ATENCION" && (
                    <>
                        <Divider sx={{ my: 1.5 }} />
                        <FichaAtencion atencion={resultado.data} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

/* ================= FICHA INGRESO ================= */

function FichaIngreso({ ingreso }) {
    if (!ingreso) return null;

    const nombrePaciente = [ingreso.nombrePaciente, ingreso.apellidoPaciente]
        .filter(Boolean)
        .join(" ");

    const nombreEnfermera = [ingreso.nombreEnfermera, ingreso.apellidoEnfermera]
        .filter(Boolean)
        .join(" ");

    return (
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                bgcolor: "#f8fafc",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                fontSize: 13,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    borderBottom: "1px solid #e5e7eb",
                    pb: 1,
                }}
            >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <DescriptionIcon fontSize="small" color="primary" />
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                        >
                            Ingreso
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontSize: 12, color: "#111827" }}
                        >
                            {ingreso.idIngreso}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <Chip
                        size="small"
                        label={`Nivel ${ingreso.nivel} · ${ingreso.nombreNivel || "-"}`}
                        sx={{ mb: 0.5, fontSize: 11 }}
                        color="primary"
                        variant="outlined"
                    />
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Estado:{" "}
                        <Box component="span" sx={{ fontWeight: 600, color: "#111827" }}>
                            {ingreso.estado || "-"}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Fecha ingreso:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            {formatFecha(ingreso.fechaIngreso)}
                        </Box>
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Paciente
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
                        {nombrePaciente || "-"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        CUIL:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                            {ingreso.cuilPaciente || "-"}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Obra social:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            {ingreso.obraSocial || "-"}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Nº afiliado:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            {ingreso.numeroAfiliado || "-"}
                        </Box>
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Enfermera responsable
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>
                        {nombreEnfermera || "-"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        CUIL:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                            {ingreso.cuilEnfermera || "-"}
                        </Box>
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ borderTop: "1px solid #e5e7eb", pt: 1.5 }}>
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Signos vitales
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#374151" }}>
                        <strong>Temperatura:</strong> {ingreso.temperatura ?? "-"} °C
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#374151" }}>
                        <strong>Frec. cardíaca:</strong> {ingreso.frecuenciaCardiaca ?? "-"} lpm
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#374151" }}>
                        <strong>Frec. respiratoria:</strong>{" "}
                        {ingreso.frecuenciaRespiratoria ?? "-"} rpm
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#374151" }}>
                        <strong>Tensión arterial:</strong>{" "}
                        {ingreso.sistolica != null && ingreso.diastolica != null
                            ? `${ingreso.sistolica}/${ingreso.diastolica} mmHg`
                            : "-"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Motivo / informe
                    </Typography>
                    <Box
                        sx={{
                            mt: 0.5,
                            bgcolor: "#ffffff",
                            borderRadius: 1.5,
                            border: "1px solid #e5e7eb",
                            px: 1.5,
                            py: 1,
                            fontSize: 12,
                            color: "#374151",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {ingreso.informe || "-"}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

/* ================= FICHA ATENCIÓN ================= */

function FichaAtencion({ atencion }) {
    if (!atencion) return null;

    return (
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                bgcolor: "#f8fafc",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                fontSize: 13,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    borderBottom: "1px solid #e5e7eb",
                    pb: 1,
                }}
            >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <AssignmentIcon fontSize="small" color="primary" />
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                        >
                            Atención
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontSize: 12, color: "#111827" }}
                        >
                            {atencion.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            Ingreso:{" "}
                            <Box component="span" sx={{ fontFamily: "monospace" }}>
                                {atencion.ingresoId || "-"}
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Fecha atención:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            {formatFecha(atencion.fechaAtencion)}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Fecha ingreso:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            {formatFecha(atencion.fechaIngreso)}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280", mt: 0.5 }}>
                        Nivel:{" "}
                        <Box component="span" sx={{ fontWeight: 600 }}>
                            {atencion.nivel ?? "-"}
                        </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280" }}>
                        Estado ingreso:{" "}
                        <Box component="span" sx={{ fontWeight: 600 }}>
                            {atencion.estadoIngreso || "-"}
                        </Box>
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Doctor
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#374151" }}>
                        CUIL:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                            {atencion.cuilDoctor || "-"}
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Paciente
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#374151" }}>
                        CUIL:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                            {atencion.cuilPaciente || "-"}
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                    >
                        Enfermera
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#374151" }}>
                        CUIL:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                            {atencion.cuilEnfermera || "-"}
                        </Box>
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 1.5 }}>
                <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, textTransform: "uppercase", color: "#6b7280" }}
                >
                    Informe
                </Typography>
                <Box
                    sx={{
                        mt: 0.5,
                        bgcolor: "#ffffff",
                        borderRadius: 1.5,
                        border: "1px solid #e5e7eb",
                        px: 1.5,
                        py: 1,
                        fontSize: 12,
                        color: "#374151",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {atencion.informe || "-"}
                </Box>
            </Box>
        </Box>
    );
}
