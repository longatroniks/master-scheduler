import { Helmet } from 'react-helmet-async';
// sections
import SixView from 'src/sections/courses/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Six</title>
      </Helmet>

      <SixView />
    </>
  );
}
