import { Helmet } from 'react-helmet-async';
import SevenView from 'src/sections/users/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Three</title>
      </Helmet>

      <SevenView />
    </>
  );
}
