"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    loginService,
    obtenerUsuarioActualService,
} from "@/services/authService";

import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    InputAdornment,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginService(username, password);
            const usuario = await obtenerUsuarioActualService();

            if (!usuario?.rol) throw new Error();

            if (usuario.rol === "DOCTOR") router.push("/medico");
            else if (usuario.rol === "ENFERMERA") router.push("/enfermeria");
            else router.push("/");
        } catch (err) {
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f1f5f9",
                padding: 2,
                alignItems: "center",
                transform: "translateY(-5%)"
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 3,
                    boxShadow: 5,
                }}
            >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h5" fontWeight={600} align="center">
                        Iniciar sesión
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                        <TextField
                            label="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                paddingY: 1.2,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
