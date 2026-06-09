// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Home from "./pages/home/home";
import History from "./pages/history/history";
import Inventory from "./pages/inventory/inventory";
import Order from "./pages/order/order";
import Profile from "./pages/profile/profile";
import Reciept from "./pages/reciept/reciept";
import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import Statistics from "./pages/statistics/statistics";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Popups from "./pages/popups/popups";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "reciept",
        element: <Reciept />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
  path: "forgot-password",
  element: <ForgotPassword />, 
},
{
  path: "reset-password/:resettoken", 
  element: <ResetPassword />, 
},
      // {
      //   path: "popups",
      //   element: <Popups/>
      // },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      containerStyle={{
        top: 80,
      }}
    />
  </Provider>,
  // </StrictMode>,
);
