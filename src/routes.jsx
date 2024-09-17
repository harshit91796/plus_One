import * as ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";

import NickName from "./pages/initialSetup/NickName";
import Username from "./pages/initialSetup/Username";
import UploadAvatar from "./pages/initialSetup/UploadAvatar";
import ImageUpload from "./pages/initialSetup/ImageUpload";
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
import Login from "./pages/signing/Login";
import Phone from "./pages/signing/Phone";
import Otp from "./pages/signing/Otp";
import ProtectedRoute from "./utils/ProtectedRoute";
import Chat from "./pages/chat/Chat"
import AllChats from "./pages/chat/AllChats"
import ErrDefault from "./components/ErrDefault"
import Profile from "./pages/user/profile";
export const router = createBrowserRouter([
  {
    path:'/login',
    element:<Login/>
  }, {
    path:'/phone',
    element:<Phone/>
  },
  {
    path:'/otp',
    element:<Otp/>
  },
  {
    path: "/name",
    element: <NickName/>,
  },
  
  {
    path:'/username',
    element:<Username/>
  } ,{
    path:'/birthday',
    element:<Birthday/>
  },
  {
    path:'/gender',
    element:<Gender/>
  },
  {
    path: "/avatar",
    element: <UploadAvatar/>,
  },{
    path:'/setup',
    element:<AskSetup/>
  },
  {
    path:'/interst',
    element:<Interests/>
  },
  {
    path:'/launguage',
    element:<Launguage/>
  },
  {
    path:'/religion',
    element:<Religion/>
  },
  {
    path:'/lifestyle',
    element:<LifeStyle/>
  },
  {
    path:'/music',
    element:<MusicPrefrence/>
  },
  {
    path:'/movie',
    element:<MoviePrefrence/>
  },
  {
    path:'/trevel',
    element:<TrevelPrefrence/>
  },
  {
    path:'/sports',
    element:<SportsPrefrence/>
  },
  {
    path:'/',
    element:  <ProtectedRoute to={<Feed/>}/>
  },
 
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path:'/chat',
    element:<Chat/>
  },
  {
    path:'/chats',
    element:<AllChats/>
  },
  {
    path:'/upload',
    element:<ImageUpload/>
  },
  {
    path:'*',
    element:<ErrDefault/>
  },

]);

