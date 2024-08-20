
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import './Index.css'
import './assets/styles/initialSetup.scss'
import './assets/styles/setTupPage.scss'
import { RouterProvider,
} from "react-router-dom";
import {router} from './routes';
import { store } from './redux/store'
import { Provider } from 'react-redux'



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
   
  </React.StrictMode>
);