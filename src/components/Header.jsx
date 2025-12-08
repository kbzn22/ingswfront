"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Chip, Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
    obtenerUsuarioActualService,
    logoutService,
} from "@/services/authService";
import { fetchPacienteEnAtencion } from "@/services/colaService"; // 👈 IMPORTANTE

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // no mostrar nada de usuario ni botón en /login
    const showLogout = pathname !== "/login";

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        if (!showLogout) return; // evita ejecutar en /login

        async function cargar() {
            try {
                const data = await obtenerUsuarioActualService();
                setUsuario(data);
            } catch (e) {
                console.error("No se pudo obtener usuario actual:", e);
            }
        }

        cargar();
    }, [showLogout]);

    async function handleLogout() {
        try {
            // 🔎 Si es DOCTOR, chequeamos si tiene paciente en atención
            if (usuario?.rol === "DOCTOR") {
                try {
                    const pacienteEnAtencion = await fetchPacienteEnAtencion();

                    if (pacienteEnAtencion) {
                        const confirmar = window.confirm(
                            "Tenés un paciente en atención en este momento.\n\n" +
                            "¿Seguro que querés cerrar sesión?"
                        );

                        if (!confirmar) {

                            return;
                        }
                    }
                } catch (e) {
                    console.error("Error verificando paciente en atención:", e);
                    // En caso de error en el check, podés decidir:
                    // - bloquear el logout
                    // - o permitirlo igual. Yo lo dejo pasar.
                }
            }

            await logoutService();
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            router.push("/login");
        }
    }

    return (
        <AppBar position="sticky" color="primary" elevation={2}>
            <Toolbar className="mx-auto w-full max-w-6xl flex justify-between">

                {/* IZQUIERDA */}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Hospital Virgen del Valle
                </Typography>

                {/* CENTRO — SOLO si NO estamos en /login */}
                {showLogout && usuario && (
                    <Box className="hidden md:flex gap-2 items-center">
                        <Chip
                            label={`${usuario.nombre} ${usuario.apellido}`}
                            color="default"
                            variant="filled"
                            size="small"
                            sx={{ fontWeight: 500 }}
                        />
                        <Chip
                            label={usuario.rol}
                            color="secondary"
                            variant="filled"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            label={usuario.cuil}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                )}

                {/* DERECHA — botón logout SOLO fuera de /login */}
                {showLogout && (
                    <Button color="inherit" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
