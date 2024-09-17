import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/loginSetup/Login';
import Register from './pages/loginSetup/Register';
import ConversationPage from './pages/conversationSetep/ConversationPage';
import DirectMessagePage from './pages/conversationSetep/DirectMessagePage';
import OAuthCallback from './pages/loginSetup/OAuthCallback';

const ProtectedRoute = ({ children, requireAuth }) => {
  const user = useSelector((state) => state.user.user);

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'conversations',
        element: (
          <ProtectedRoute requireAuth={true}>
            <ConversationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'conversation/direct/message/:chatId',
        element: (
          <ProtectedRoute requireAuth={true}>
            <DirectMessagePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallback />,
  },
]);

