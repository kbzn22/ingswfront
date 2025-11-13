'use client';
import { Chip } from '@mui/material';
import { NIVEL_BY_VALUE } from '@/lib/enums';

export default function NivelChip({ value }) {
  const n = NIVEL_BY_VALUE[value] || {};
  return <Chip label={n.label || '—'} color={n.color || 'default'} size="small" />;
}
