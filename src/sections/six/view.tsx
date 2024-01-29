// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import ClassroomTable from 'src/components/ClassroomTable';
import CourseTable from 'src/components/CourseTable';

// ----------------------------------------------------------------------

export default function SixView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page Six </Typography>
      <CourseTable />
    </Container>
  );
}
