import { Helmet } from 'react-helmet-async';
import UsersView from 'src/sections/users/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Users</title>
      </Helmet>

      <UsersView />
    </>
  );
}
