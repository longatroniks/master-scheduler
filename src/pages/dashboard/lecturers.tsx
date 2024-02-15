import { Helmet } from 'react-helmet-async';
// sections
import LecturersView from 'src/sections/lecturers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Lecturers</title>
      </Helmet>

      <LecturersView />
    </>
  );
}
