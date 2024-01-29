import { Helmet } from 'react-helmet-async';
import EightView from 'src/sections/eight/view';
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
