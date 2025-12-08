// src/app/admin/components/ExportLogsSection.jsx
"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Grid,
    Alert,
    Box,
    Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { exportIngresosLog, exportAtencionesLog } from "@/services/adminService";

export default function ExportLogsSection() {
    const [tipo, setTipo] = useState("ingresos");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [cuilPaciente, setCuilPaciente] = useState("");
    const [cuilEnfermera, setCuilEnfermera] = useState("");
    const [cuilDoctor, setCuilDoctor] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleExport(e) {
        e.preventDefault();
        setError("");

        setLoading(true);
        try {
            if (tipo === "ingresos") {
                await exportIngresosLog({ desde, hasta, cuilPaciente, cuilEnfermera });
            } else {
                await exportAtencionesLog({ desde, hasta, cuilDoctor, cuilPaciente });
            }
        } catch (e) {
            console.error(e);
            setError(e.message || "No se pudo descargar el archivo.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardHeader
                avatar={
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "999px",
                            bgcolor: "#dcfce7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DescriptionIcon fontSize="small" sx={{ color: "#16a34a" }} />
                    </Box>
                }
                title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Exportar logs
                    </Typography>
                }
                subheader={
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Generar archivos Excel de ingresos o atenciones
                    </Typography>
                }
            />

            <Box
                component="form"
                onSubmit={handleExport}
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                        <ToggleButtonGroup
                            exclusive
                            value={tipo}
                            onChange={(_, value) => value && setTipo(value)}
                            size="small"
                        >
                            <ToggleButton value="ingresos">Ingresos</ToggleButton>
                            <ToggleButton value="atenciones">Atenciones</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Desde"
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                size="small"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Hasta"
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                size="small"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    {tipo === "ingresos" ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CUIL paciente (opcional)"
                                    value={cuilPaciente}
                                    onChange={(e) => setCuilPaciente(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CUIL enfermera (opcional)"
                                    value={cuilEnfermera}
                                    onChange={(e) => setCuilEnfermera(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CUIL doctor (opcional)"
                                    value={cuilDoctor}
                                    onChange={(e) => setCuilDoctor(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="CUIL paciente (opcional)"
                                    value={cuilPaciente}
                                    onChange={(e) => setCuilPaciente(e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        startIcon={<DescriptionIcon />}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 999,
                            px: 3,
                        }}
                    >
                        {loading ? "Exportando..." : "Exportar a Excel"}
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );
}
