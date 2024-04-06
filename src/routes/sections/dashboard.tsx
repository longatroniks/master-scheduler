import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const ClassroomsPage = lazy(() => import('src/pages/dashboard/classrooms'));
const LecturersPage = lazy(() => import('src/pages/dashboard/lecturers'));
const CoursesPage = lazy(() => import('src/pages/dashboard/courses'));
const SectionsPage = lazy(() => import('src/pages/dashboard/sections'));
const SchedulePage = lazy(() => import('src/pages/dashboard/schedules'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'classrooms', element: <ClassroomsPage /> },
      { path: 'lecturers', element: <LecturersPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'sections', element: <SectionsPage /> },
      { path: 'schedules', element: <SchedulePage /> },
    ],
  },
];
