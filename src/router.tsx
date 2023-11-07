import React, { createRef } from 'react';
import { createBrowserRouter, Navigate, useRouteError } from 'react-router-dom';

import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ExchangePage } from './components/Exchange/ExchangePage';
import { Layout } from './components/Layout/Layout';
import { MyVesting } from './components/MyVeting/MyVesting';
import { RafflePage } from './components/Raffle/RafflePage';
import { StakingPage } from './components/Staking/StakingPage';
import { TeamsPage } from './components/Teams/TeamsPage';

const Landing = React.lazy(() => import('@/components/Landing/Landing'));
const AvatarLanding = React.lazy(() => import('@/components/AvatarLanding/AvatarLanding'));

export const LANDING_URL = 'https://isaver.io';
export const APP_URL = 'https://dashboard.isaver.io';
export const WHITEPAPER_URL = 'https://isaver.gitbook.io/isaver';
export const isLanding = process.env.REACT_APP_IS_LANDING;
export const isDevelopment = process.env.NODE_ENV === 'development';

export const LANDING_PATH = '/';
const landingRoute = {
  path: LANDING_PATH,
  name: 'Landing',
  element: <Landing />,
  nodeRef: createRef(),
};
const appRoutes = [
  { path: '/', name: 'Dashboard', element: <Dashboard />, nodeRef: createRef() },
  { path: '/staking', name: 'Staking', element: <StakingPage />, nodeRef: createRef() },
  { path: '/team', name: 'Teams', element: <TeamsPage />, nodeRef: createRef() },
  { path: '/exchange', name: 'Exchange', element: <ExchangePage />, nodeRef: createRef() },
  { path: '/vesting', name: 'Vesting', element: <MyVesting />, nodeRef: createRef() },
  { path: '/raffles/:id', name: 'Raffle', element: <RafflePage />, nodeRef: createRef() },
  { path: '/admin-panel', name: 'Admin panel', element: <AdminPanel />, nodeRef: createRef() },
  {
    path: '/avatars',
    name: 'Avatars landing',
    element: <AvatarLanding />,
    nodeRef: createRef(),
  },
];

export const routes = isLanding
  ? [landingRoute]
  : isDevelopment
  ? [...appRoutes, { ...landingRoute, path: '/landing' }]
  : appRoutes;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Error has been occured. Please reload the page.</div>;
}
