import React, { createRef } from 'react';
import { createBrowserRouter, Navigate, useRouteError } from 'react-router-dom';

import { AvatarSettings } from './components/AvatarSettings/AvatarSettings';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ExchangePage } from './components/Exchange/ExchangePage';
import { Layout } from './components/Layout/Layout';
import { Momento } from './components/Momento/Momento';
import { MyVesting } from './components/MyVeting/MyVesting';
import { RafflePage } from './components/Raffle/RafflePage';
import { StakingPage } from './components/Staking/StakingPage';
import { TeamsPage } from './components/Teams/TeamsPage';

const Landing = React.lazy(() => import('@/components/Landing/Landing'));
const AvatarLanding = React.lazy(() => import('@/components/AvatarLanding/AvatarLanding'));
const AdminPanel = React.lazy(() => import('@/components/AdminPanel/AdminPanel'));

export const LANDING_URL = 'https://isaver.io';
export const APP_URL = 'https://dashboard.isaver.io';
export const WHITEPAPER_URL = 'https://isaver.gitbook.io/isaver';
export const AVATARS_URL = 'https://avatars.isaver.io';
export const MOMENTO_URL = 'https://dashboard.isaver.io/momento';
export const isLanding = Boolean(process.env.REACT_APP_IS_LANDING);
export const isAvatarsLanding = Boolean(process.env.REACT_APP_IS_AVATARS_LANDING);
export const isDashboard = !isLanding && !isAvatarsLanding;
export const isDevelopment = process.env.NODE_ENV === 'development';

// Common links
export const AVATAR_LANDING_POWERS_INFO_URL = `${AVATARS_URL}/#powers`;
export const DASHBOARD_PLAY_EVERYDAY_URL = `${APP_URL}/#claim-ticket`;

export const LANDING_PATH = '/';
export const AVATARS_LANDING_PATH = '/';
const landingRoute = {
  path: LANDING_PATH,
  name: 'Landing',
  element: <Landing />,
  nodeRef: createRef(),
};
const avatarsLandingRoute = {
  path: AVATARS_LANDING_PATH,
  name: 'Avatars Landing',
  element: <AvatarLanding />,
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
  { path: '/momento', name: 'Momento', element: <Momento />, nodeRef: createRef() },
  {
    path: '/avatar-settings',
    name: 'Avatar settings',
    element: <AvatarSettings />,
    nodeRef: createRef(),
  },
];

export const routes = isLanding
  ? [landingRoute]
  : isAvatarsLanding
  ? [avatarsLandingRoute]
  : isDevelopment
  ? [
      ...appRoutes,
      { ...landingRoute, path: '/landing' },
      { ...avatarsLandingRoute, path: '/avatars' },
    ]
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
