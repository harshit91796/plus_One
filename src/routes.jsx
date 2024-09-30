import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import NickName from "./pages/initialSetup/NickName";
import UploadAvatar from "./pages/initialSetup/UploadAvatar";
import Gender from "./pages/initialSetup/Gender";
import AskSetup from "./pages/initialSetup/AskSetup";
import Birthday from "./pages/initialSetup/Birthday";
import Interests from "./pages/profileSetup/Interests";
import Launguage from "./pages/profileSetup/Launguage";
import LifeStyle from "./pages/profileSetup/LifeStyle";
import MoviePrefrence from "./pages/profileSetup/MoviePrefrence";
import MusicPrefrence from "./pages/profileSetup/MusicPrefrence";
import Religion from "./pages/profileSetup/Religion";
import TrevelPrefrence from "./pages/profileSetup/TrevelPrefrence";
import SportsPrefrence from "./pages/profileSetup/SportsPrefrence";
import Feed from "./pages/homepage/Feed";
import ErrDefault from "./components/ErrDefault"
import Profile from "./pages/user/profile";
import Login from "./pages/loginSetup/Login";
import OathCallback from "./pages/loginSetup/OAuthCallback";
import ConversationPage from "./pages/conversationSetep/ConversationPage";
import DirectMessagePage from "./pages/conversationSetep/DirectMessagePage";
import ConvoPage from "./pages/conversationSetep/dummy page/ConvoPage";
import ChatPage from "./pages/conversationSetep/dummy page/Chat";
import Register from "./pages/loginSetup/Register";




const ProtectedRoute = ({ children, requireAuth }) => {
  const user = useSelector((state) => state.user.user);

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute requireAuth={false} />,
    children: [
      {
        path: '',
        element: <Feed />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        ),
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
      
      
      // Initial setup routes
      {
        path: 'setup',
        element: <ProtectedRoute requireAuth={true} />,
        children: [
          { path: 'nickname', element: <NickName /> },
          { path: 'avatar', element: <UploadAvatar /> },
          { path: 'gender', element: <Gender /> },
          { path: 'ask', element: <AskSetup /> },
          { path: 'birthday', element: <Birthday /> },
        ],
      },
      // Profile setup routes
      {
        path: 'profile-setup',
        element: <ProtectedRoute requireAuth={true} />,
        children: [
          { path: 'interests', element: <Interests /> },
          { path: 'language', element: <Launguage /> },
          { path: 'lifestyle', element: <LifeStyle /> },
          { path: 'movie', element: <MoviePrefrence /> },
          { path: 'music', element: <MusicPrefrence /> },
          { path: 'religion', element: <Religion /> },
          { path: 'travel', element: <TrevelPrefrence /> },
          { path: 'sports', element: <SportsPrefrence /> },
        ],
      },
    ],
  },
  {
    path: 'dummy',
    element: <ProtectedRoute requireAuth={true}>
      <ConvoPage/>
    </ProtectedRoute>
  },
  {
    path: 'dummy2',
    element: <ProtectedRoute requireAuth={true}>
      <ChatPage/>
    </ProtectedRoute>
  },
  // {
  //   path: '*',
  //   element: <ErrDefault />,
  // },
  {
    path: '/oauth-callback',
    element: <OathCallback />,
  }
]);

