import * as ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";

import NickName from "./pages/initialSetup/NickName";
import Username from "./pages/initialSetup/Username";
import Interests from "./pages/profileSetup/Interests";
import ProtectedRoute from "./utils/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/x",
    element: <NickName/>,
  },
  {
    path:'/name',
    element:<Username/>
  } ,{
    path:'/',
    element:<Interests/>
  }
]);

 
