// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import LecturerTable from 'src/components/LecturerTable';

// ----------------------------------------------------------------------

export default function LecturersView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <LecturerTable/>
    </Container>
  );
}
