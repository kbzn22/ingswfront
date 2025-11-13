'use client';
import { Card, CardContent, Typography, Stack, Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NivelChip from './NivelChip';
import EstadoChip from './EstadoChip';
import { ordenarIngresos, timeAgo } from '@/lib/enums';

export default function IngresoList({ ingresos, onRemove, onSetEstado }) {
  const ordered = [...ingresos].sort(ordenarIngresos);

  return (
    <div className="space-y-3">
      {ordered.map((ing, idx) => (
        <Card key={ing.id} className="shadow-sm">
          <CardContent className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Typography variant="subtitle1" className="font-semibold">
                #{idx + 1} CUIT: {ing.cuit}
              </Typography>
              <p className="text-xs text-neutral-500 mt-1">{timeAgo(ing.fechaIngreso)}</p>
              {ing.informe && <p className="mt-2 text-sm text-neutral-800">{ing.informe}</p>}
              <div className="mt-2 text-sm text-neutral-700">
                <span className="mr-3">T: {ing.signos?.temperatura ?? '—'}°C</span>
                <span className="mr-3">FC: {ing.signos?.fc ?? '—'} lpm</span>
                <span className="mr-3">FR: {ing.signos?.fr ?? '—'} rpm</span>
                <span>TA: {ing.signos?.ta ?? '—'} mmHg</span>
              </div>
            </div>
            <Stack direction="row" spacing={1} alignItems="center">
              <NivelChip value={ing.nivelEmergencia} />
              <EstadoChip value={ing.estadoIngreso} />
              <IconButton aria-label="Eliminar" onClick={() => onRemove(ing.id)}>
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          </CardContent>
          <div className="px-4 pb-3 flex gap-2">
            {ing.estadoIngreso !== 'EN_PROCESO' && ing.estadoIngreso !== 'FINALIZADO' && (
              <Button size="small" variant="outlined" onClick={() => onSetEstado(ing.id, 'EN_PROCESO')}>Marcar En Proceso</Button>
            )}
            {ing.estadoIngreso !== 'FINALIZADO' && (
              <Button size="small" variant="contained" color="success" onClick={() => onSetEstado(ing.id, 'FINALIZADO')}>Finalizar</Button>
            )}
          </div>
        </Card>
      ))}
      {ordered.length === 0 && <p className="text-sm text-neutral-500">Sin ingresos en espera.</p>}
    </div>
  );
}
