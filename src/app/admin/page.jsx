"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper
} from "@mui/material";

import { RegistroPersonalSection } from "./components/RegistroPersonalSection";
import ExportLogsSection from "./components/ExportLogsSection";
import AdminSearchByIdSection from "./components/AdminSearchByIdSection";

export default function AdminPage() {
    const [tab, setTab] = useState("registro");

    const handleChange = (_e, value) => setTab(value);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 4 }}>
            <Container maxWidth="md">
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 3 }}
                >
                    Panel de administración
                </Typography>

                {/* -------------------- PESTAÑAS -------------------- */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        mb: 4
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        centered
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ borderBottom: "1px solid #e2e8f0" }}
                    >
                        <Tab label="Registrar personal" value="registro" />
                        <Tab label="Exportar logs" value="logs" />
                        <Tab label="Buscar por ID" value="busqueda" />
                    </Tabs>
                </Paper>

                {/* -------------------- CONTENIDO -------------------- */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    {tab === "registro" && (
                        <Box sx={{ width: "100%", maxWidth: 650 }}>
                            <RegistroPersonalSection />
                        </Box>
                    )}

                    {tab === "logs" && (
                        <Box sx={{ width: "100%", maxWidth: 650 }}>
                            <ExportLogsSection />
                        </Box>
                    )}

                    {tab === "busqueda" && (
                        <Box sx={{ width: "100%", maxWidth: 650 }}>
                            <AdminSearchByIdSection />
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
