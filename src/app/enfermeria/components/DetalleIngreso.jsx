"use client";

import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Grid,
    Chip,
    Stack,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DetalleIngreso({ open, ingreso, onClose }) {
    if (!open || !ingreso) return null;

    const nombrePaciente = `${ingreso.nombrePaciente || "-"} ${
        ingreso.apellidoPaciente || ""
    }`.trim();

    const nombreEnfermera = `${ingreso.nombreEnfermera || "-"} ${
        ingreso.apellidoEnfermera || ""
    }`.trim();

    const fechaIngreso = ingreso.fechaIngreso
        ? new Date(ingreso.fechaIngreso).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
        })
        : "-";

    const estado = ingreso.estado || "";

    const getEstadoColor = () => {
        const e = estado.toLowerCase();
        if (e.includes("curso") || e.includes("atención")) return "success";
        if (e.includes("espera") || e.includes("cola")) return "warning";
        if (e.includes("final")) return "default";
        return "info";
    };

    const cellLabelSx = {
        width: 150,
        fontWeight: 600,
        py: 0.75,
        px: 1.5,
        whiteSpace: "nowrap",
    };

    const cellValueSx = { py: 0.75, px: 1.5 };

    const withUnit = (value, unit) =>
        value === null || value === undefined || value === ""
            ? "-"
            : `${value} ${unit}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "grey.50",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Detalle del ingreso
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Información clínica del ingreso seleccionado
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {estado && (
                            <Chip
                                size="small"
                                label={estado}
                                color={getEstadoColor()}
                                variant="outlined"
                            />
                        )}
                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    bgcolor: "grey.50",
                    px: 3,
                    py: 2.5,
                }}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: "100%",
                        margin: 0,
                    }}
                >
                    {/* PACIENTE */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 1.75,
                                    py: 0.9,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "grey.100",
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Paciente
                                </Typography>
                            </Box>

                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>Nombre</TableCell>
                                        <TableCell sx={cellValueSx}>{nombrePaciente}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>CUIL</TableCell>
                                        <TableCell sx={cellValueSx}>{ingreso.cuilPaciente || "-"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>Obra social</TableCell>
                                        <TableCell sx={cellValueSx}>
                                            {ingreso.obraSocial || "-"}{" "}
                                            {ingreso.numeroAfiliado && `(${ingreso.numeroAfiliado})`}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>

                    {/* DATOS DEL INGRESO */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 1.75,
                                    py: 0.9,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "grey.100",
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Datos del ingreso
                                </Typography>
                            </Box>

                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>Nivel</TableCell>
                                        <TableCell sx={cellValueSx}>
                                            {ingreso.nivel} · {ingreso.nombreNivel}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>Fecha ingreso</TableCell>
                                        <TableCell sx={cellValueSx}>{fechaIngreso}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={cellLabelSx}>Estado</TableCell>
                                        <TableCell sx={cellValueSx}>{ingreso.estado || "-"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>

                {/* separador visual */}
                <Box sx={{ my: 2 }}>
                    <Divider />
                </Box>

                {/* FICHA CARGADO POR */}
                <Paper
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
                >
                    <Box
                        sx={{
                            px: 1.75,
                            py: 0.9,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "grey.100",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                        >
                            Cargado por
                        </Typography>
                    </Box>

                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>
                                    Enfermera
                                </TableCell>
                                <TableCell sx={cellValueSx}>
                                    {nombreEnfermera}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>CUIL</TableCell>
                                <TableCell sx={cellValueSx}>
                                    {ingreso.cuilEnfermera || "-"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>

                {/* FICHA SIGNOS VITALES */}
                <Paper
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
                >
                    <Box
                        sx={{
                            px: 1.75,
                            py: 0.9,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "grey.100",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                        >
                            Signos vitales
                        </Typography>
                    </Box>

                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>
                                    Temperatura
                                </TableCell>
                                <TableCell sx={cellValueSx}>
                                    {withUnit(ingreso.temperatura, "°C")}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>
                                    Frec. cardíaca
                                </TableCell>
                                <TableCell sx={cellValueSx}>
                                    {withUnit(
                                        ingreso.frecuenciaCardiaca,
                                        "lpm"
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>
                                    Frec. respiratoria
                                </TableCell>
                                <TableCell sx={cellValueSx}>
                                    {withUnit(
                                        ingreso.frecuenciaRespiratoria,
                                        "rpm"
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={cellLabelSx}>
                                    Tensión arterial
                                </TableCell>
                                <TableCell sx={cellValueSx}>
                                    {ingreso.sistolica &&
                                    ingreso.diastolica
                                        ? `${ingreso.sistolica}/${ingreso.diastolica} mmHg`
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>

                {/* MOTIVO / INFORME */}
                <Paper
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                    <Box
                        sx={{
                            px: 1.75,
                            py: 0.9,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "grey.100",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                        >
                            Motivo / informe
                        </Typography>
                    </Box>

                    <Box sx={{ px: 1.75, py: 1.25 }}>
                        <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-line" }}
                        >
                            {ingreso.informe || "-"}
                        </Typography>
                    </Box>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}
