// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import UserTable from 'src/components/UserTable';

// ----------------------------------------------------------------------

export default function SevenView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <UserTable />
    </Container>
  );
}
