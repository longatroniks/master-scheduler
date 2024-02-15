// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import CourseTable from 'src/components/CourseTable';

// ----------------------------------------------------------------------

export default function SixView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CourseTable />
    </Container>
  );
}
