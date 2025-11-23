"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // No muestres el botón en /login
    const showLogout = pathname !== "/login";

    async function handleLogout() {
        try {
            await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Error al hacer logout", e);
        } finally {
            // Siempre te vas al login
            router.push("/login");
        }
    }

    return (
        <AppBar position="sticky" color="primary">
            <Toolbar className="mx-auto w-full max-w-6xl">
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Hospital Virgen del Valle
                </Typography>

                {showLogout && (
                    <Button color="inherit" onClick={handleLogout}>
                        Cerrar sesión
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
