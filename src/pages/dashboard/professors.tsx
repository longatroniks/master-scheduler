import { Helmet } from 'react-helmet-async';
// sections
import ProfessorsView from 'src/sections/professors/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Professors</title>
      </Helmet>

      <ProfessorsView />
    </>
  );
}
