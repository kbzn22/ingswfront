'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', contrastText: '#ffffff' },
    secondary: { main: '#10b981', contrastText: '#081c15' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    info: { main: '#0ea5e9' },
    success: { main: '#22c55e' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' }
  },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Helvetica','Arial','sans-serif'].join(',')
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } }
  }
});
