// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// hooks

// routes
import { paths } from 'src/routes/paths';
// locales
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  return (
    <Box
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      Made by Team 1
    </Box>
  );
}
