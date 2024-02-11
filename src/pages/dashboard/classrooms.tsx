import { Helmet } from 'react-helmet-async';
// sections
import ThreeView from 'src/sections/classrooms/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Three</title>
      </Helmet>

      <ThreeView />
    </>
  );
}
