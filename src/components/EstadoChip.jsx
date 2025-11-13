'use client';
import { Chip } from '@mui/material';
import { ESTADO_BY_VALUE } from '@/lib/enums';

export default function EstadoChip({ value }) {
  const e = ESTADO_BY_VALUE[value] || {};
  return <Chip label={e.label || '—'} color={e.color || 'default'} size="small" variant="outlined" />;
}
