"use client";

import { AppBar, Toolbar, Typography, Button, Chip, Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    obtenerUsuarioActualService,
    logoutService,
} from "@/services/authService";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const showLogout = pathname !== "/login";

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        async function cargarUsuario() {
            try {
                const data = await obtenerUsuarioActualService();
                setUsuario(data);
            } catch (e) {
                console.error("No se pudo obtener usuario:", e);
            }
        }

        // solo ejecuta la llamada si NO estás en /login
        if (pathname !== "/login") {
            cargarUsuario();
        }
    }, [pathname]);

    async function handleLogout() {
        try {
            await logoutService();
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

                {/* CENTRO — SOLO fuera de /login */}
                {showLogout && usuario && (
                    <Box className="hidden md:flex gap-2 items-center">
                        <Chip
                            label={`${usuario.nombre} ${usuario.apellido}`}
                            color="default"
                            variant="filled"
                            size="small"
                        />
                        <Chip
                            label={usuario.rol}
                            color="secondary"
                            size="small"
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
