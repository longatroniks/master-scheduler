// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import ClassroomTable from 'src/components/ClassroomTable';

// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ClassroomTable />
    </Container>
  );
}
