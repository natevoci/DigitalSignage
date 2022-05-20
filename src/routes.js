import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';

const Home = lazy(() => import('./scenes/Home'));

export const ROUTES = {
  ROOT: {
    url:'/',
    element: <Navigate to="/home" />,
  },
  HOME: {
    url: '/home',
    handleAnchor: true,
    Icon: HomeIcon,
    title: 'Home',
    element: <Home />,
  },
};
