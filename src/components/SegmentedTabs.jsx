'use client';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';

export default function SegmentedTabs({ value, onChange }) {
  return (
    <div className="w-full rounded-full bg-neutral-100 p-1">
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v)}
        className="w-full"
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            border: 0,
            borderRadius: '9999px',
            px: 2,
            mx: 0.2,
            flex: 1,
            gap: 0.5
          },
          '& .Mui-selected': {
            bgcolor: 'background.paper !important',
            boxShadow: 1
          }
        }}
      >
        <ToggleButton value="cola">
          <PeopleAltOutlinedIcon fontSize="small" />
          Cola de Prioridad
        </ToggleButton>
        <ToggleButton value="nuevo">
          <PersonAddAlt1OutlinedIcon fontSize="small" />
          Nuevo Ingreso
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
