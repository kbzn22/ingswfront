'use client';
import { useState } from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { NIVEL_EMERGENCIA } from '@/lib/enums';

export default function IngresoForm({ onCreate }) {
  const [cuit, setCuit] = useState('');
  const [informe, setInforme] = useState('');
  const [nivelEmergencia, setNivelEmergencia] = useState('URGENCIA_MENOR');
  const [temperatura, setTemperatura] = useState('');
  const [fc, setFc] = useState('');
  const [fr, setFr] = useState('');
  const [ta, setTa] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!cuit.trim() || !nivelEmergencia) return;
    const t = parseFloat(temperatura.replace(',', '.'));
    const dto = {
      cuit: cuit.trim(),
      informe: informe.trim(),
      nivelEmergencia,
      signos: {
        temperatura: isNaN(t) ? undefined : t,
        fc: fc ? Number(fc) : undefined,
        fr: fr ? Number(fr) : undefined,
        ta: ta.trim() || undefined
      }
    };
    onCreate?.(dto);
    setCuit(''); setInforme(''); setNivelEmergencia('URGENCIA_MENOR'); setTemperatura(''); setFc(''); setFr(''); setTa('');
  }

  return (
    <form onSubmit={submit}>
      <Stack spacing={2}>
        <TextField label="CUIT" value={cuit} onChange={e=>setCuit(e.target.value.replace(/\D/g, ''))} required fullWidth inputProps={{ inputMode: 'numeric', maxLength: 11 }} />
        <TextField label="Informe" value={informe} onChange={e=>setInforme(e.target.value)} multiline minRows={2} fullWidth />
        <TextField select label="Nivel de Emergencia" value={nivelEmergencia} onChange={e=>setNivelEmergencia(e.target.value)} fullWidth>
          {NIVEL_EMERGENCIA.map(n => <MenuItem key={n.value} value={n.value}>{n.label}</MenuItem>)}
        </TextField>
        <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
          <TextField label="Temperatura (°C)" value={temperatura} onChange={e=>setTemperatura(e.target.value.replace(/[^0-9.,]/g, ''))} fullWidth />
          <TextField label="Frecuencia Cardíaca (lpm)" value={fc} onChange={e=>setFc(e.target.value.replace(/\D/g, ''))} fullWidth inputProps={{ inputMode: 'numeric' }} />
        </Stack>
        <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
          <TextField label="Frecuencia Respiratoria (rpm)" value={fr} onChange={e=>setFr(e.target.value.replace(/\D/g, ''))} fullWidth inputProps={{ inputMode: 'numeric' }} />
          <TextField label="Tensión Arterial (mmHg)" placeholder="120/80" value={ta} onChange={e=>setTa(e.target.value.replace(/[^0-9/]/g, ''))} fullWidth />
        </Stack>
        <Button type="submit" variant="contained">Dar de alta</Button>
      </Stack>
    </form>
  );
}
