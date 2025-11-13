'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar className="mx-auto w-full max-w-6xl">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Urgencias</Typography>
      </Toolbar>
    </AppBar>
  );
}
