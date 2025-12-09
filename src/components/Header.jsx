"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
  obtenerUsuarioActualService,
  logoutService,
} from "@/services/authService";
import { fetchPacienteEnAtencion } from "@/services/colaService";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const showLogout = pathname !== "/login";

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (!showLogout) return;

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

  async function confirmarLogout() {
    try {
      setShowConfirmLogout(false); // cerramos el diálogo
      await logoutService();
      router.push("/login");
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
  }

  async function handleLogout() {
    try {
        if (usuario?.rol === "DOCTOR") {
            try {
                const pacienteEnAtencion = await fetchPacienteEnAtencion();

                if (pacienteEnAtencion) {
                    setShowConfirmLogout(true);
                    return;
                }
            } catch (e) {
                console.error("Error verificando paciente:", e);
                // si falla el check, igual permitimos el logout
        }
      }

      await logoutService();
      router.push("/login");
    } catch (e) {
      console.error("Logout error:", e);
    }
  }

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar className="mx-auto w-full max-w-7xl flex justify-between">
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
              <Chip label={usuario.cuil} variant="outlined" size="small" />
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

      {/* DIALOGO DE CONFIRMACIÓN PARA MÉDICO CON PACIENTE EN ATENCIÓN */}
      <Dialog
        open={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
      >
        <DialogTitle>Cerrar sesión</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Tenés un paciente en atención en este momento.
            <br />
            Si cerrás sesión ahora, la atención quedará inconclusa.
            <br />
            ¿Querés cerrar sesión de todas formas?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setShowConfirmLogout(false)}
            color="inherit"
          >
            Seguir en el sistema
          </Button>

          <Button
            onClick={confirmarLogout}
            color="error"
            variant="contained"
          >
            Cerrar sesión de todas formas
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}