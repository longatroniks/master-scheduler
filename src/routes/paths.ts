// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    generator: `${ROOTS.DASHBOARD}/generator`,
    two: `${ROOTS.DASHBOARD}/two`,
    classrooms: `${ROOTS.DASHBOARD}/classrooms`,
    lectures: `${ROOTS.DASHBOARD}/lectures`,
    lecturers: `${ROOTS.DASHBOARD}/lecturers`,
    courses: `${ROOTS.DASHBOARD}/courses`,
    users: `${ROOTS.DASHBOARD}/users`,
    sections: `${ROOTS.DASHBOARD}/sections`,
    schedules: `${ROOTS.DASHBOARD}/schedules`,
  },
};
