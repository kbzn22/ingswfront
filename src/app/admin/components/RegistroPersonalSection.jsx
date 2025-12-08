"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    TextField,
    Button,
    Grid,
    Alert,
    MenuItem,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { registrarPersonalAdmin } from "@/services/adminService";
import { logoutService } from "@/services/authService";

export function RegistroPersonalSection() {
    const [form, setForm] = useState({
        cuil: "",
        nombre: "",
        apellido: "",
        email: "",
        matricula: "",
        rol: "DOCTOR",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "cuil") {
            setForm(prev => ({ ...prev, cuil: formatCuil(value) }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await registrarPersonalAdmin(form);
            setSuccess("Personal registrado correctamente.");

            // logout y redirigir
            await logoutService();
            window.location.href = "/login";
        } catch (e) {
            setError(e.message || "No se pudo registrar el personal.");
        } finally {
            setLoading(false);
        }
    }
    function formatCuil(value) {
        // Solo números
        const digits = value.replace(/\D/g, "").slice(0, 11); // Máximo 11 números

        // Aplicar formato XX-XXXXXXXX-X
        let formatted = digits;

        if (digits.length > 2) {
            formatted = digits.slice(0, 2) + "-" + digits.slice(2);
        }
        if (digits.length > 10) {
            formatted = formatted.slice(0, 11) + "-" + formatted.slice(11);
        }

        return formatted;
    }

    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardHeader
                avatar={<PersonAddAltIcon color="primary" />}
                title="Registrar nuevo personal"
                subheader="Alta de médicos y enfermeras"
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <form id="registro-personal-form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="CUIL"
                                name="cuil"
                                value={form.cuil}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Apellido"
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Matrícula"
                                name="matricula"
                                value={form.matricula}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Rol"
                                name="rol"
                                select
                                value={form.rol}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="DOCTOR">Doctor</MenuItem>
                                <MenuItem value="ENFERMERA">Enfermera</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}

                        {success && (
                            <Grid item xs={12}>
                                <Alert severity="success">{success}</Alert>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    type="submit"
                    form="registro-personal-form"
                >
                    {loading ? "Registrando…" : "Registrar personal"}
                </Button>
            </CardActions>
        </Card>
    );
}
