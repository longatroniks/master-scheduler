import { Helmet } from 'react-helmet-async';
import EightView from 'src/sections/sections/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Three</title>
      </Helmet>

      <EightView />
    </>
  );
}
