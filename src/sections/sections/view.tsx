// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import SectionTable from 'src/components/SectionTable';

// ----------------------------------------------------------------------

export default function EightView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <SectionTable />
    </Container>
  );
}
