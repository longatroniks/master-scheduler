import { Helmet } from 'react-helmet-async';
// sections
import LecturesView from 'src/sections/lectures/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Lectures</title>
      </Helmet>

      <LecturesView />
    </>
  );
}
