'use client';
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import IngresoForm from './inputs/FormIngreso';

export default function NuevoIngresoButton({ onCreate }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddAlt1OutlinedIcon />}
        onClick={() => setOpen(true)}
        className="rounded-full"
      >
        Nuevo Ingreso
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Ingreso</DialogTitle>
        <DialogContent dividers>
          <IngresoForm onCreate={(dto) => { onCreate?.(dto); setOpen(false); }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
