import { Helmet } from 'react-helmet-async';
// sections
import ClassroomsView from 'src/sections/classrooms/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Classrooms</title>
      </Helmet>

      <ClassroomsView />
    </>
  );
}
