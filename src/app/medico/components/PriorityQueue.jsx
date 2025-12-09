"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import { NIVEL_EMERGENCIA_INFO } from "@/lib/enums";

export function PriorityQueue({ cola, onAtender, loading }) {
  return (
    <Box
      component="section"
      sx={{
        borderRadius: 2,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Cola de espera por prioridad
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          {loading ? "Cargando..." : `${cola.length} pacientes en espera`}
        </Typography>
      </Box>

      {/* TABLA */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          width: "100%",
          overflowX: "auto",
          maxHeight: "70vh"
        }}
      >
        <Table 
            size="small"
            sx={{
                "& th, & td": {
                    fontSize: "0.75rem",
                    whiteSpace: { xs: "normal", md: "nowrap" },
                }
            }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f8fafc",
                "& th": {
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  borderBottomColor: "#e5e7eb",
                },
              }}
            >
              <TableCell>Paciente</TableCell>
              <TableCell>CUIL</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Ingreso</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && cola.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    py: 2,
                  }}
                >
                  No hay pacientes en la cola.
                </TableCell>
              </TableRow>
            )}

            {cola.map((item, index) => {
              const nombreBase =
                (item.apellido || "") + ", " + (item.nombre || "");
              const nombreMostrado = `${index + 1}. ${nombreBase}`;

              const cuil = item.cuilPaciente ?? item.cuil ?? "-";

              const nivelNumero = Number(item.nivel ?? item.prioridad);
              const nivelInfo = NIVEL_EMERGENCIA_INFO[nivelNumero] || null;

              const fecha = item.fechaIngreso
                ? new Date(item.fechaIngreso).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "-";

              return (
                <TableRow
                  key={item.idIngreso ?? item.id}
                  sx={{
                    "& td": { borderBottomColor: "#f1f5f9", fontSize: "0.85rem" },
                  }}
                >
                  {/* PACIENTE */}
                  <TableCell sx={{ color: "#0f172a" }}>
                    {nombreMostrado}
                  </TableCell>

                  {/* CUIL */}
                  <TableCell sx={{ color: "#4b5563" }}>
                    {cuil !== "-" ? cuil : "-"}
                  </TableCell>

                  {/* NIVEL */}
                  <TableCell>
                    {nivelInfo ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px]"
                        style={{
                          backgroundColor: nivelInfo.bg,
                          borderColor: nivelInfo.border,
                          color: "#0f172a",
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "999px",
                            backgroundColor: nivelInfo.color,
                          }}
                        />
                        {`Nivel ${nivelNumero} · ${nivelInfo.label}`}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </TableCell>

                  {/* FECHA INGRESO */}
                  <TableCell sx={{ color: "#6b7280" }}>{fecha}</TableCell>

                  {/* ACCIÓN */}
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onAtender(item)}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.7rem",
                        py: 0.4,
                        px: 1.4,
                      }}
                    >
                      Atender
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}