import { Helmet } from 'react-helmet-async';
import SevenView from 'src/sections/seven/view';
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
