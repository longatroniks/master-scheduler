// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import LectureTable from 'src/components/LectureTable';

// ----------------------------------------------------------------------

export default function FourView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <LectureTable />
    </Container>
  );
}
